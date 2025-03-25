import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Download, Users, LogOut } from "lucide-react"
import clientPromise from "@/lib/mongodb"
import type { WaitlistEntry } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getWaitlistData() {
  const client = await clientPromise
  const db = client.db("merchspy")
  const collection = db.collection<WaitlistEntry>("waitlist")

  const entries = await collection.find({}).sort({ createdAt: -1 }).limit(100).toArray()

  const totalCount = await collection.countDocuments()

  // Get signups by day for the last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const dailySignups = await collection
    .aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray()

  return {
    entries: JSON.parse(JSON.stringify(entries)),
    totalCount,
    dailySignups: JSON.parse(JSON.stringify(dailySignups)),
  }
}

export default async function AdminPage() {
  // Simple auth check - in production, use a proper auth solution
  const cookieStore = cookies()
  const isAdmin = cookieStore.get("admin_auth")?.value === "true"

  if (!isAdmin) {
    redirect("/admin/login")
  }

  const { entries, totalCount, dailySignups } = await getWaitlistData()

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Waitlist Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor your MerchSpy waitlist</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href="/api/admin/export" download>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
          <form action="/api/admin/logout" method="post">
            <Button variant="outline" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{totalCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySignups.reduce((acc, day) => acc + day.count, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailySignups.find((day) => day._id === new Date().toISOString().split("T")[0])?.count || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscribers</CardTitle>
          <CardDescription>The most recent people who joined your waitlist</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left font-medium">Email</th>
                  <th className="p-2 text-left font-medium">Date</th>
                  <th className="p-2 text-left font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <tr key={entry._id} className="border-b">
                      <td className="p-2">{entry.email}</td>
                      <td className="p-2">{formatDate(entry.createdAt)}</td>
                      <td className="p-2">{entry.source || "Direct"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-muted-foreground">
                      No subscribers yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

