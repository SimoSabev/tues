import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    // Redirect signed-in users from home to dashboard
    if (userId && req.nextUrl.pathname === "/") {
        return Response.redirect(new URL("/dashboard", req.url));
    }
});

export const config = {
    matcher: ["/((?!_next|.*\\..*).*)"],
};
