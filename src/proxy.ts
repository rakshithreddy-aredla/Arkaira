import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect the entire admin area.
  // Optimistic check: look for Supabase auth-token cookies. Full
  // verification happens server-side in the admin layout, so a forged
  // cookie only wastes a request, never leaks data.
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const hasSession = [...request.cookies.getAll()].some(
      (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
    );

    if (!hasSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
