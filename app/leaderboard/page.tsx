"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp, Recycle } from "lucide-react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { motion } from "framer-motion"
import useSWR from "swr"
import {AppHeader} from "@/components/app-header";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface LeaderboardUser {
    id: string
    name: string
    imageUrl?: string | null
    points: number
    rank: number
    recycled: number
    isCurrentUser: boolean
}

interface LeaderboardData {
    leaderboard: LeaderboardUser[]
}

export default function LeaderboardPage() {
    const { data, isLoading } = useSWR<LeaderboardData>("/api/leaderboard", fetcher, {
        refreshInterval: 10000,
    })

    const leaderboardData = data?.leaderboard ?? []
    const currentUser = leaderboardData.find((user) => user.isCurrentUser)

    const getInitials = (name?: string | null) => {
        if (!name || typeof name !== "string") return "?"
        return name
            .trim()
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
            {/* Background blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-emerald-200 blur-3xl opacity-40 animate-pulse" />
                <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] rounded-full bg-teal-200 blur-3xl opacity-40 animate-pulse" />
            </div>

            {/* Header */}
            <AppHeader/>

            <main className="container mx-auto px-4 py-10">
                {/* Title */}
                <motion.div
                    className="mb-10 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
                        Community Leaderboard
                    </h2>
                    <p className="text-emerald-700 mt-2 text-lg">
                        See who’s leading the way toward a cleaner tomorrow 🌍
                    </p>
                </motion.div>

                {/* Current User */}
                {currentUser && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-10"
                    >
                        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 border-0 text-foregrund shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
                            <CardContent className="pt-6 relative">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-16 h-16 border-2 border-emerald-500 shadow-lg">
                                            {currentUser.imageUrl ? (
                                                <img
                                                    src={currentUser.imageUrl}
                                                    alt={currentUser.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <AvatarFallback className="bg-emerald-800 text-foreground text-xl">
                                                    {getInitials(currentUser.name)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div>
                                            <p className="text-sm text-emerald-100">Your Rank</p>
                                            <p className="text-3xl font-bold text-emerald-100">
                                                #{currentUser.rank}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-emerald-100">Total Points</p>
                                        <p className="text-3xl font-bold text-emerald-50">
                                            {currentUser.points}
                                        </p>
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

                {/* Podium */}
                {leaderboardData.length >= 3 && (
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {leaderboardData.slice(0, 3).map((user, index) => {
                            const icons = [Trophy, Medal, Award]
                            const Icon = icons[index]
                            const gradients = [
                                "from-yellow-400 to-yellow-600",
                                "from-gray-300 to-gray-500",
                                "from-orange-400 to-orange-600",
                            ]

                            return (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-2 hover:shadow-2xl transition-all">
                                        <CardHeader className="text-center">
                                            <motion.div
                                                className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradients[index]} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                                whileHover={{ scale: 1.1, rotate: 3 }}
                                            >
                                                <Icon className="w-10 h-10 text-emerald-50" />
                                            </motion.div>
                                            <Avatar className="w-16 h-16 mx-auto border border-emerald-200 mb-3">
                                                {user.imageUrl ? (
                                                    <img
                                                        src={user.imageUrl}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <AvatarFallback className="bg-emerald-600 text-foreground">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <CardTitle className="text-emerald-900 text-xl font-semibold">
                                                {user.name}
                                            </CardTitle>
                                            <CardDescription className="text-lg font-bold text-emerald-700">
                                                {user.points} points
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {/* Full Leaderboard */}
                <Card className="bg-background shadow-xl border ">
                    <CardHeader>
                        <CardTitle className="text-emerald-900 text-2xl">Full Rankings</CardTitle>
                        <CardDescription className="text-emerald-600">
                            All members ranked by eco points
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-emerald-600 animate-pulse">
                                Loading leaderboard...
                            </div>
                        ) : leaderboardData.length === 0 ? (
                            <div className="text-center py-8 text-emerald-600">
                                No users yet. Be the first to start recycling!
                            </div>
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
                                                ? "bg-background border-2 border-emerald-500 shadow-md"
                                                : "bg-background border border-background hover:bg-background/60 hover:shadow-sm"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <span
                                                className={`text-2xl font-bold ${
                                                    user.rank <= 3
                                                        ? "text-emerald-600"
                                                        : "text-emerald-400"
                                                }`}
                                            >
                                                #{user.rank}
                                            </span>
                                            <Avatar className="w-12 h-12 border border-emerald-200">
                                                {user.imageUrl ? (
                                                    <img
                                                        src={user.imageUrl}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <AvatarFallback className="bg-emerald-600 text-foreground">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-semibold text-emerald-900">
                                                    {user.name}
                                                    {user.isCurrentUser && (
                                                        <Badge className="ml-2 bg-emerald-600 text-emerald-100">
                                                            You
                                                        </Badge>
                                                    )}
                                                </p>
                                                <p className="text-sm text-emerald-600">
                                                    {user.recycled} items recycled
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-emerald-900">
                                            {user.points}
                                        </p>
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
