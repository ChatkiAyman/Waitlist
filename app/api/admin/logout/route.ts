import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear the admin auth cookie
  response.cookies.set("admin_auth", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  })

  return response
}

