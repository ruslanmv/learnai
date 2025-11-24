/**
 * Next.js Middleware for Authentication and Route Protection
 *
 * This middleware runs before every request to protect routes that require authentication.
 * It checks the user's session and redirects unauthenticated users to the login page.
 *
 * @module middleware
 * @author Ruslan Magana (ruslanmv.com)
 * @license MIT
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protected routes that require authentication
 */
const protectedRoutes = ["/dashboard", "/classroom", "/bookings", "/profile"];

/**
 * Admin-only routes
 */
const adminRoutes = ["/admin"];

/**
 * Teacher-only routes
 */
const teacherRoutes = ["/teacher"];

/**
 * Middleware function to protect routes
 *
 * @see https://next-auth.js.org/configuration/nextjs#middleware
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check if user is accessing admin routes
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Check if user is accessing teacher routes
    if (teacherRoutes.some((route) => pathname.startsWith(route))) {
      if (token?.role !== "TEACHER" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      /**
       * Determine if user is authorized to access the route
       */
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Allow access to public routes
        if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

/**
 * Configure which routes the middleware should run on
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - API routes (handled separately)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
