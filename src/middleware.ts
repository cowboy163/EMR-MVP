import { NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, publicRoutes } from "./routes";

export default auth((req) => {
    const { nextUrl, auth } = req;
    const isLoggedIn = !!auth;

    // route prefix check
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const routePrefix = nextUrl.pathname.split('/')[1];

    // role check
    const userRole = auth?.user.role;
    const isRoleRoute = {
        DOCTOR: routePrefix === 'doctor-portal',
        PATIENT: routePrefix === 'portal',
        ADMIN: routePrefix === 'admin-portal',
        CLINIC: routePrefix === 'clinic-portal'
    };

    const isProfileComplete = req.auth?.user.profileComplete;

    // public route
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // auth route
    // redirect to user's own role's portal after login
    if (isAuthRoute) {
        if (isLoggedIn && userRole) {
            const redirectUrl = {
                DOCTOR: '/doctor-portal',
                PATIENT: '/portal',
                ADMIN: '/admin-portal',
                CLINIC: '/clinic-portal'
            }[userRole];
            if (redirectUrl) return NextResponse.redirect(new URL(redirectUrl, nextUrl));
        }
        return NextResponse.next()
    }

    // Access control for role-specific routes
    // not login, and use role routes will redirect to login
    if (!isLoggedIn) {
        const loginUrl = {
            'doctor-portal': '/doctor-login',
            'portal': '/login',
            'admin-portal': '/admin-login',
            'clinic-portal': '/clinic-login'
        }[routePrefix];
        return loginUrl ? NextResponse.redirect(new URL(loginUrl, nextUrl)) : NextResponse.next();
    }

    // Accessing routes of other roles will redirect homepage 
    if (isLoggedIn && !isRoleRoute[userRole!]) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    // if profile is unfinished, redirect to finish profile page
    if (isLoggedIn && !isProfileComplete && nextUrl.pathname !== '/complete-profile') {
        return NextResponse.redirect(new URL('/complete-profile', nextUrl));
    }

    return NextResponse.next();
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}