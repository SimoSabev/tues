"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, MapPin, Trophy, Upload, TrendingUp, Recycle, Award, Target, Sparkles } from "lucide-react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function DashboardPage() {
    const [userPoints, setUserPoints] = useState(1250)
    const [userRank, setUserRank] = useState(12)

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Header */}
            <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                <Recycle className="w-7 h-7 text-white animate-spin-slow" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                                    Sortex
                                </h1>
                                <p className="text-xs text-emerald-600">Recycle Smarter</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-2">
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-900 font-medium transition-all"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/map"
                                className="px-4 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all"
                            >
                                Map
                            </Link>
                            <Link
                                href="/upload"
                                className="px-4 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all"
                            >
                                Upload
                            </Link>
                            <Link
                                href="/leaderboard"
                                className="px-4 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all"
                            >
                                Leaderboard
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonPopoverCard:
                                            "bg-gray-900/95 backdrop-blur-sm border border-gray-700 text-white shadow-2xl",
                                        userButtonPopoverActionButton:
                                            "text-foreground hover:text-white hover:bg-gray-800 transition-colors",
                                        userButtonPopoverActionButtonText: "text-foreground",
                                        userButtonPopoverFooter: "hidden",
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Card className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 border-0 text-white overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl -ml-32 -mb-32" />
                        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

                        <CardHeader className="relative z-10 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                                <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-300/30 hover:bg-yellow-400/30">
                                    Eco Warrior
                                </Badge>
                            </div>
                            <CardTitle className="text-4xl font-bold text-white mb-2">Welcome back, John!</CardTitle>
                            <CardDescription className="text-emerald-50 text-lg">
                                You're making a real difference for our planet 🌍
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all hover:scale-105 shadow-lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                            <Leaf className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-400/30 border border-green-300/50">
                                            <TrendingUp className="w-3 h-3 text-green-100" />
                                            <span className="text-xs font-semibold text-green-100">+12%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-emerald-100 mb-1">Eco Points</p>
                                    <p className="text-5xl font-bold text-white mb-2">{userPoints}</p>
                                    <p className="text-sm text-emerald-100">+150 this week</p>
                                </div>

                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all hover:scale-105 shadow-lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                                            <Trophy className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-400/30 border border-purple-300/50">
                                            <Award className="w-3 h-3 text-purple-100" />
                                            <span className="text-xs font-semibold text-purple-100">Top 5%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-emerald-100 mb-1">Your Rank</p>
                                    <p className="text-5xl font-bold text-white mb-2">#{userRank}</p>
                                    <p className="text-sm text-emerald-100">in your city</p>
                                </div>

                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all hover:scale-105 shadow-lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg">
                                            <Recycle className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-400/30 border border-blue-300/50">
                                            <Target className="w-3 h-3 text-blue-100" />
                                            <span className="text-xs font-semibold text-blue-100">94%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-emerald-100 mb-1">Items Recycled</p>
                                    <p className="text-5xl font-bold text-white mb-2">47</p>
                                    <p className="text-sm text-emerald-100">This month</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Link href="/map" className="group">
                        <Card className="hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-emerald-400 bg-white overflow-hidden relative h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                    <MapPin className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-emerald-900 text-xl mb-2">Find Recycling Points</CardTitle>
                                <CardDescription className="text-emerald-700">
                                    Discover nearby bins and recycling centers on the interactive map
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/upload" className="group">
                        <Card className="hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-teal-400 bg-white overflow-hidden relative h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                    <Upload className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-emerald-900 text-xl mb-2">Upload & Earn</CardTitle>
                                <CardDescription className="text-emerald-700">
                                    Scan your recycling and earn points for verified contributions
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/leaderboard" className="group">
                        <Card className="hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-cyan-400 bg-white overflow-hidden relative h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                    <Trophy className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-emerald-900 text-xl mb-2">Leaderboard</CardTitle>
                                <CardDescription className="text-emerald-700">
                                    See how you rank against other eco-warriors in your community
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>

                <Card className="bg-white shadow-lg border-2 border-emerald-100">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-emerald-900 text-2xl">Recent Activity</CardTitle>
                                <CardDescription className="text-emerald-600">Your latest recycling contributions</CardDescription>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2">
                                4 items this week
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                {
                                    item: "Plastic bottles",
                                    points: 50,
                                    time: "2 hours ago",
                                    type: "plastic",
                                    color: "from-yellow-400 to-orange-500",
                                },
                                {
                                    item: "Cardboard boxes",
                                    points: 30,
                                    time: "1 day ago",
                                    type: "paper",
                                    color: "from-blue-400 to-indigo-500",
                                },
                                {
                                    item: "Glass jars",
                                    points: 40,
                                    time: "2 days ago",
                                    type: "glass",
                                    color: "from-green-400 to-emerald-500",
                                },
                                {
                                    item: "Aluminum cans",
                                    points: 35,
                                    time: "3 days ago",
                                    type: "metal",
                                    color: "from-gray-400 to-slate-500",
                                },
                            ].map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                                        >
                                            <Recycle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-emerald-900 text-lg">{activity.item}</p>
                                            <p className="text-sm text-emerald-600">{activity.time}</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 px-4 py-2 text-base shadow-md">
                                        +{activity.points} pts
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>

            <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
        </div>
    )
}
//
// "use client"
//
// import { useEffect, useState } from "react"
// import { useUser } from "@clerk/nextjs"
// import { createClient } from "@supabase/supabase-js"
// import { Recycle, Badge } from "lucide-react"
//
// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )
//
// type Activity = {
//     id: string
//     recycle_type: string
//     points: number
//     file_url: string
//     created_at: string
// }
//
// export default function DashboardPage() {
//     const { user } = useUser()
//     const [activities, setActivities] = useState<Activity[]>([])
//     const [totalPoints, setTotalPoints] = useState(0)
//
//     useEffect(() => {
//         if (!user) return
//         const fetchData = async () => {
//             const { data, error } = await supabase
//                 .from("recycling_uploads")
//                 .select("*")
//                 .eq("user_id", user.id)
//                 .order("created_at", { ascending: false })
//
//             if (!error && data) {
//                 setActivities(data)
//                 const sum = data.reduce((acc, item) => acc + item.points, 0)
//                 setTotalPoints(sum)
//             }
//         }
//
//         fetchData()
//     }, [user])
//
//     return (
//         <main className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-4 text-emerald-900">Your Dashboard</h1>
//
//             <div className="mb-6 p-4 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl text-white">
//                 <h2 className="text-2xl font-semibold">Total Points: {totalPoints}</h2>
//                 <p className="text-emerald-100">Keep recycling to earn more 🌱</p>
//             </div>
//
//             <h2 className="text-xl font-bold mb-3 text-emerald-800">Recent Activities</h2>
//             <div className="space-y-3">
//                 {activities.map((a) => (
//                     <div
//                         key={a.id}
//                         className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200"
//                     >
//                         <div className="flex items-center gap-4">
//                             <Recycle className="text-emerald-600" />
//                             <div>
//                                 <p className="font-semibold text-emerald-900 capitalize">{a.recycle_type}</p>
//                                 <p className="text-sm text-emerald-600">
//                                     {new Date(a.created_at).toLocaleString()}
//                                 </p>
//                             </div>
//                         </div>
//                         <Badge className="bg-emerald-600 text-white px-3 py-1">+{a.points} pts</Badge>
//                     </div>
//                 ))}
//             </div>
//         </main>
//     )
// }
