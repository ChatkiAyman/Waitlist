import { type NextRequest, NextResponse } from "next/server"

// This is a very basic admin auth - in production use a proper auth solution
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "merchspy-admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })

    // Set a cookie to authenticate the admin
    response.cookies.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

