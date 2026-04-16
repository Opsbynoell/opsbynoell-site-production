import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin/* but not /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = await verifyToken(token);
    if (!payload) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Inject user metadata as request headers so API routes can read them
    // without another DB round-trip.
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-admin-user-id", payload.userId);
    requestHeaders.set("x-admin-email", payload.email);
    requestHeaders.set("x-admin-is-super", payload.isSuperAdmin ? "1" : "0");
    requestHeaders.set(
      "x-admin-clients",
      payload.accessibleClients.join(",")
    );

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
