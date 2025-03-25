import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { WaitlistEntry } from "@/lib/models"
import { z } from "zod"

const waitlistSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json()
    const result = waitlistSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { email } = result.data

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("merchspy")
    const collection = db.collection<WaitlistEntry>("waitlist")

    // Check if email already exists
    const existingEntry = await collection.findOne({ email })
    if (existingEntry) {
      return NextResponse.json({ message: "You're already on our waitlist!" }, { status: 200 })
    }

    // Create new waitlist entry
    const entry: WaitlistEntry = {
      email,
      createdAt: new Date(),
      userAgent: request.headers.get("user-agent") || undefined,
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
    }

    await collection.insertOne(entry)

    // Get total count for response
    const totalCount = await collection.countDocuments()

    return NextResponse.json({
      success: true,
      message: "You've been added to our waitlist!",
      count: totalCount,
    })
  } catch (error) {
    console.error("Waitlist submission error:", error)
    return NextResponse.json({ error: "Failed to add to waitlist" }, { status: 500 })
  }
}

// Optional: Add a GET endpoint to get the current count (protected by an admin key)
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("merchspy")
    const collection = db.collection("waitlist")

    const count = await collection.countDocuments()

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching waitlist count:", error)
    return NextResponse.json({ error: "Failed to fetch waitlist count" }, { status: 500 })
  }
}

