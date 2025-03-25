import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import type { WaitlistEntry } from "@/lib/models"

export async function GET(request: NextRequest) {
  // Check admin authentication
  const cookieStore = cookies()
  const isAdmin = cookieStore.get("admin_auth")?.value === "true"

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db("merchspy")
    const collection = db.collection<WaitlistEntry>("waitlist")

    const entries = await collection.find({}).sort({ createdAt: -1 }).toArray()

    // Convert to CSV
    const headers = ["Email", "Date", "Source", "IP Address", "User Agent"]
    const rows = entries.map((entry) => [
      entry.email,
      new Date(entry.createdAt).toISOString(),
      entry.source || "Direct",
      entry.ipAddress || "",
      entry.userAgent || "",
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Set headers for file download
    const headers_obj = new Headers()
    headers_obj.set("Content-Type", "text/csv")
    headers_obj.set(
      "Content-Disposition",
      `attachment; filename="merchspy-waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
    )

    return new NextResponse(csv, {
      status: 200,
      headers: headers_obj,
    })
  } catch (error) {
    console.error("Error exporting waitlist:", error)
    return NextResponse.json({ error: "Failed to export waitlist" }, { status: 500 })
  }
}

