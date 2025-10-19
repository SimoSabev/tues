"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp, Recycle } from "lucide-react"
import Link from "next/link"

// Simulated leaderboard data
const leaderboardData = [
  { id: 1, name: "Sarah Chen", points: 3450, rank: 1, avatar: "SC", trend: "+250", recycled: 127 },
  { id: 2, name: "Michael Rodriguez", points: 3120, rank: 2, avatar: "MR", trend: "+180", recycled: 115 },
  { id: 3, name: "Emma Thompson", points: 2890, rank: 3, avatar: "ET", trend: "+220", recycled: 98 },
  { id: 4, name: "James Wilson", points: 2650, rank: 4, avatar: "JW", trend: "+150", recycled: 89 },
  { id: 5, name: "Olivia Martinez", points: 2420, rank: 5, avatar: "OM", trend: "+190", recycled: 82 },
  { id: 6, name: "David Kim", points: 2180, rank: 6, avatar: "DK", trend: "+120", recycled: 76 },
  { id: 7, name: "Sophia Patel", points: 1950, rank: 7, avatar: "SP", trend: "+160", recycled: 71 },
  { id: 8, name: "Daniel Brown", points: 1720, rank: 8, avatar: "DB", trend: "+140", recycled: 65 },
  { id: 9, name: "Ava Johnson", points: 1580, rank: 9, avatar: "AJ", trend: "+110", recycled: 58 },
  { id: 10, name: "Lucas Garcia", points: 1420, rank: 10, avatar: "LG", trend: "+95", recycled: 52 },
  { id: 11, name: "Mia Anderson", points: 1310, rank: 11, avatar: "MA", trend: "+85", recycled: 48 },
  { id: 12, name: "John Doe", points: 1250, rank: 12, avatar: "JD", trend: "+150", recycled: 47, isCurrentUser: true },
]

export default function LeaderboardPage() {
  const currentUser = leaderboardData.find((user) => user.isCurrentUser)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-emerald-900">Sortify</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/map" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                Map
              </Link>
              <Link href="/upload" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                Upload
              </Link>
              <Link href="/leaderboard" className="text-emerald-900 font-medium">
                Leaderboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-2">Community Leaderboard</h2>
          <p className="text-emerald-700">See who's leading the charge in sustainable recycling</p>
        </div>

        {/* Current User Stats */}
        {currentUser && (
          <Card className="mb-8 bg-gradient-to-br from-emerald-600 to-teal-700 border-0 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-4 border-white">
                    <AvatarFallback className="bg-emerald-800 text-white text-xl">{currentUser.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-emerald-100">Your Rank</p>
                    <p className="text-3xl font-bold text-white">#{currentUser.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-emerald-100">Total Points</p>
                  <p className="text-3xl font-bold text-white">{currentUser.points}</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-200" />
                    <span className="text-sm text-emerald-100">{currentUser.trend} this week</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {leaderboardData.slice(0, 3).map((user, index) => {
            const icons = [Trophy, Medal, Award]
            const Icon = icons[index]
            const colors = [
              "from-yellow-400 to-yellow-600",
              "from-gray-300 to-gray-500",
              "from-orange-400 to-orange-600",
            ]
            const bgColors = ["bg-yellow-50", "bg-gray-50", "bg-orange-50"]
            const borderColors = ["border-yellow-200", "border-gray-200", "border-orange-200"]

            return (
              <Card key={user.id} className={`${bgColors[index]} ${borderColors[index]} border-2`}>
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[index]} flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-emerald-900">{user.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-emerald-700">
                    {user.points} points
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                    <Recycle className="w-4 h-4" />
                    <span>{user.recycled} items recycled</span>
                  </div>
                  <Badge className="mt-3 bg-emerald-600 text-white">{user.trend} this week</Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Full Leaderboard */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-emerald-900">Full Rankings</CardTitle>
            <CardDescription>All community members ranked by eco points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboardData.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    user.isCurrentUser
                      ? "bg-emerald-100 border-2 border-emerald-500"
                      : "bg-emerald-50 border border-emerald-100 hover:bg-emerald-100"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 text-center">
                      <span
                        className={`text-2xl font-bold ${user.rank <= 3 ? "text-emerald-600" : "text-emerald-400"}`}
                      >
                        #{user.rank}
                      </span>
                    </div>
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-emerald-600 text-white">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-emerald-900">
                        {user.name}
                        {user.isCurrentUser && <Badge className="ml-2 bg-emerald-600 text-white">You</Badge>}
                      </p>
                      <p className="text-sm text-emerald-600">{user.recycled} items recycled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-900">{user.points}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span className="text-sm text-emerald-600">{user.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
