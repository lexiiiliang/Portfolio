import { NextResponse } from "next/server";
import { ACCESS_COOKIE, accessToken } from "@/lib/access";

export async function POST(request: Request) {
  const expected = process.env.PORTFOLIO_PASSWORD;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  let submitted = "";
  try {
    const body = await request.json() as { password?: string };
    submitted = body.password || "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (submitted !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, await accessToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
