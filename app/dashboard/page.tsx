"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Leaf, MapPin, Trophy, Upload, TrendingUp, Recycle } from "lucide-react"
import Link from "next/link"
import {UserButton} from "@clerk/nextjs";

export default function DashboardPage() {
    const [userPoints, setUserPoints] = useState(1250)
    const [userRank, setUserRank] = useState(12)

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
                            <Link href="/" className="text-emerald-900 font-medium">
                                Dashboard
                            </Link>
                            <Link href="/map" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                                Map
                            </Link>
                            <Link href="/upload" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                                Upload
                            </Link>
                            <Link href="/leaderboard" className="text-emerald-700 hover:text-emerald-900 transition-colors">
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
                {/* Hero Section with Points */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 border-0 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

                        <CardHeader className="relative z-10">
                            <CardTitle className="text-3xl font-bold text-white">Welcome back, John!</CardTitle>
                            <CardDescription className="text-emerald-100">
                                You're making a real difference for our planet
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                                            <Leaf className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-emerald-100">Eco Points</p>
                                            <p className="text-4xl font-bold text-white">{userPoints}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <TrendingUp className="w-4 h-4 text-emerald-200" />
                                        <span className="text-sm text-emerald-100">+150 this week</span>
                                    </div>
                                </div>

                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-emerald-100">Your Rank</p>
                                            <p className="text-4xl font-bold text-white">#{userRank}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-emerald-100 mt-4">Top 5% in your city</p>
                                </div>

                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                                            <Recycle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-emerald-100">Items Recycled</p>
                                            <p className="text-4xl font-bold text-white">47</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-emerald-100 mt-4">This month</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Link href="/map">
                        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-emerald-500 bg-white">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-emerald-600" />
                                </div>
                                <CardTitle className="text-emerald-900">Find Recycling Points</CardTitle>
                                <CardDescription>Discover nearby bins and recycling centers on the interactive map</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/upload">
                        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-teal-500 bg-white">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                                    <Upload className="w-6 h-6 text-teal-600" />
                                </div>
                                <CardTitle className="text-emerald-900">Upload & Earn</CardTitle>
                                <CardDescription>Scan your recycling and earn points for verified contributions</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/leaderboard">
                        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-cyan-500 bg-white">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                                    <Trophy className="w-6 h-6 text-cyan-600" />
                                </div>
                                <CardTitle className="text-emerald-900">Leaderboard</CardTitle>
                                <CardDescription>See how you rank against other eco-warriors in your community</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>

                {/* Recent Activity */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-emerald-900">Recent Activity</CardTitle>
                        <CardDescription>Your latest recycling contributions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { item: "Plastic bottles", points: 50, time: "2 hours ago", type: "plastic" },
                                { item: "Cardboard boxes", points: 30, time: "1 day ago", type: "paper" },
                                { item: "Glass jars", points: 40, time: "2 days ago", type: "glass" },
                                { item: "Aluminum cans", points: 35, time: "3 days ago", type: "metal" },
                            ].map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                                            <Recycle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-emerald-900">{activity.item}</p>
                                            <p className="text-sm text-emerald-600">{activity.time}</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">+{activity.points} pts</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
