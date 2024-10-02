import { NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, doctorRoutes, publicRoutes } from "./routes";

export default auth((req) => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;

    const isPublic = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    const isDoctor = req.auth?.user.role === 'DOCTOR';
    const isDoctorRoute = doctorRoutes.includes(nextUrl.pathname)

    if (isPublic) {
        return NextResponse.next()
    }

    if (isDoctorRoute && !isDoctor) {
        return NextResponse.redirect(new URL('/', nextUrl));
    }

    if (isAuthRoute) {
        if(isLoggedIn) {
            return NextResponse.redirect(new URL('/doctors', nextUrl))
        }
        return NextResponse.next()
    }

    if (!isDoctorRoute && !isPublic && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl))
    }

    return NextResponse.next();
})

// 配置哪些路径不会被中间件影响
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}