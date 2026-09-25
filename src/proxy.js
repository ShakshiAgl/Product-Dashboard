import { NextResponse } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname, search } = req.nextUrl;
  const onLogin = pathname.startsWith("/login");

  if (!token && !onLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname + search); // come back here after login
    return NextResponse.redirect(url);
  }

  if (token && onLogin) {
    return NextResponse.redirect(new URL("/products", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};