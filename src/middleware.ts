import { NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, publicRoutes } from "./routes";

export default auth((req) => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const isPatientRoute = nextUrl.pathname.startsWith('/portal')
    const isDoctorRoute = nextUrl.pathname.startsWith('/doctor-portal')
    
    const isDoctor = req.auth?.user.role === 'DOCTOR';
    const isPatient = req.auth?.user.role === 'PATIENT';    

    if (isPublicRoute) {
        return NextResponse.next()
    }

    if (isAuthRoute) {
        if(isLoggedIn) {
            if(isDoctor) return NextResponse.redirect(new URL('/doctor-portal', nextUrl))
            if(isPatient) return NextResponse.redirect(new URL('/portal', nextUrl))            
        }
        return NextResponse.next()
    }

    if (isDoctorRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/doctor-login', nextUrl))
    }

    if (isPatientRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl))
    }

    if ((isDoctorRoute && !isDoctor) || (isPatientRoute && !isPatient)) {
        return NextResponse.redirect(new URL('/', nextUrl));
    }

    return NextResponse.next();
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}