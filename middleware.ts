import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
    "/docs"
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()
    const currentUrl = new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")

    //if logged in (means user is logged in already and try to click on sign-in or sign-up again)
    if (userId && (currentUrl.pathname === "/sign-in" || currentUrl.pathname === "/sign-up")) {
        return NextResponse.redirect(new URL("/home", req.url)) //return to home no sign-in again needed..
    }

    //not logged in 
    if (!userId) {
        if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
            //means user is not loggedin and trying to access a secured route (/social-share etc.)
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }

        if (isApiRequest && !isPublicApiRoute(req)) {
            //means user is not logged in and trying to access a secured api route (/api/image-upload)
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }
    }

    return NextResponse.next()
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
