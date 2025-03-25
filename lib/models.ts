import type { ObjectId } from "mongodb"

export interface WaitlistEntry {
  _id?: ObjectId
  email: string
  createdAt: Date
  source?: string
  ipAddress?: string
  userAgent?: string
}

