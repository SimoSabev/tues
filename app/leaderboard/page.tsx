"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp, Recycle } from "lucide-react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { motion } from "framer-motion"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface LeaderboardUser {
    id: string
    name: string
    points: number
    rank: number
    recycled: number
    isCurrentUser: boolean
}

interface LeaderboardData {
    leaderboard: LeaderboardUser[]
}

export default function LeaderboardPage() {
    const { data, error, isLoading } = useSWR<LeaderboardData>("/api/leaderboard", fetcher, {
        refreshInterval: 10000, // Refresh every 10 seconds
    })

    const leaderboardData = data?.leaderboard ?? []
    const currentUser = leaderboardData.find((user) => user.isCurrentUser)

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Header */}
            <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Recycle className="w-7 h-7 text-white" />
                            </motion.div>
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
                                className="px-4 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all"
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
                                className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-900 font-medium transition-all"
                            >
                                Leaderboard
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <UserButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-3xl font-bold text-emerald-900 mb-2">Community Leaderboard</h2>
                    <p className="text-emerald-700">See who's leading the charge in sustainable recycling</p>
                </motion.div>

                {/* Current User Stats */}
                {currentUser && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
                        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 border-0 text-white shadow-2xl">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-16 h-16 border-4 border-white">
                                            <AvatarFallback className="bg-emerald-800 text-white text-xl">
                                                {getInitials(currentUser.name)}
                                            </AvatarFallback>
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
                                            <span className="text-sm text-emerald-100">Keep going!</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Top 3 Podium */}
                {leaderboardData.length >= 3 && (
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
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={`${bgColors[index]} ${borderColors[index]} border-2 shadow-xl`}>
                                        <CardHeader className="text-center">
                                            <motion.div
                                                className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[index]} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                            >
                                                <Icon className="w-8 h-8 text-white" />
                                            </motion.div>
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
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {/* Full Leaderboard */}
                <Card className="bg-white shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-emerald-900 text-2xl">Full Rankings</CardTitle>
                        <CardDescription className="text-emerald-600">All community members ranked by eco points</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-emerald-600">Loading leaderboard...</div>
                        ) : leaderboardData.length === 0 ? (
                            <div className="text-center py-8 text-emerald-600">No users yet. Be the first to start recycling!</div>
                        ) : (
                            <div className="space-y-2">
                                {leaderboardData.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                                            user.isCurrentUser
                                                ? "bg-emerald-100 border-2 border-emerald-500 shadow-md"
                                                : "bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 hover:shadow-sm"
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
                                                <AvatarFallback className="bg-emerald-600 text-white">{getInitials(user.name)}</AvatarFallback>
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
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
