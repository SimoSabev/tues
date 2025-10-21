"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Leaf,
    MapPin,
    Trophy,
    Upload,
    TrendingUp,
    Recycle,
    Award,
    Target,
    ArrowRight,
    Sparkles,
    Zap,
    Star,
} from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { motion } from "framer-motion"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface DashboardData {
    points: number
    rank: number
    totalItems: number
    recentUploads: Array<{
        id: string
        fileName: string
        uploadedAt: string
        pointsEarned: number
        recyclingType: string // Updated from 'type' to 'recyclingType'
    }>
}

export default function DashboardPage() {
    const { data, error, isLoading } = useSWR<DashboardData>("/api/dashboard", fetcher, {
        refreshInterval: 5000,
    })

    const userPoints = data?.points
    const userRank = data?.rank
    const totalItems = data?.totalItems

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
            <AppHeader />

            <main className="container mx-auto px-4 lg:px-8 py-12 space-y-12">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="mb-8 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">Welcome back to your eco journey</span>
                        </motion.div>
                        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-3 text-balance">
                            Your Impact Dashboard
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl text-pretty">
                            Track your environmental contributions and see the difference you're making
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        >
                            <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg hover:shadow-2xl transition-all group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                                <CardHeader className="flex flex-row items-center justify-between pb-3">
                                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                        Eco Points
                                    </CardTitle>
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg"
                                    >
                                        <Leaf className="h-7 w-7 text-primary-foreground" />
                                    </motion.div>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-14 bg-neutral-400 dark:bg-background w-32 mb-2" />
                                    ) : (
                                        <div className="text-5xl font-bold text-foreground mb-2">
                                            {userPoints !== undefined ? userPoints.toLocaleString() : "—"}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10">
                                            <TrendingUp className="h-3.5 w-3.5 text-success" />
                                            <span className="text-xs font-semibold text-success">+12%</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        >
                            <Card className="relative overflow-hidden border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5 shadow-lg hover:shadow-2xl transition-all group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
                                <CardHeader className="flex flex-row items-center justify-between pb-3">
                                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                        Your Rank
                                    </CardTitle>
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-chart-2 shadow-lg"
                                    >
                                        <Trophy className="h-7 w-7 text-accent-foreground" />
                                    </motion.div>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-14 bg-neutral-400 dark:bg-background w-24 mb-2" />
                                    ) : (
                                        <div className="text-5xl font-bold text-foreground mb-2">
                                            {userRank !== undefined ? `#${userRank}` : "—"}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10">
                                            <Award className="h-3.5 w-3.5 text-accent" />
                                            <span className="text-xs font-semibold text-accent">Top 5%</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">in your city</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        >
                            <Card className="relative overflow-hidden border-2 border-success/20 bg-gradient-to-br from-card to-success/5 shadow-lg hover:shadow-2xl transition-all group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl group-hover:bg-success/20 transition-all" />
                                <CardHeader className="flex flex-row items-center justify-between pb-3">
                                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                        Items Recycled
                                    </CardTitle>
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-chart-3 shadow-lg"
                                    >
                                        <Recycle className="h-7 w-7 text-success-foreground" />
                                    </motion.div>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-14 bg-neutral-400 dark:bg-background w-20 mb-2" />
                                    ) : (
                                        <div className="text-5xl font-bold text-foreground mb-2">
                                            {totalItems !== undefined ? totalItems : "—"}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10">
                                            <Target className="h-3.5 w-3.5 text-success" />
                                            <span className="text-xs font-semibold text-success">This month</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Quick Actions</h2>
                        <Badge variant="outline" className="text-sm px-3 py-1.5">
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            Get started
                        </Badge>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            {
                                href: "/map",
                                icon: MapPin,
                                title: "Find Locations",
                                description: "Discover nearby recycling centers and drop-off points in your area",
                                color: "from-primary to-accent",
                                bgColor: "bg-primary/10",
                                delay: 0.1,
                            },
                            {
                                href: "/upload",
                                icon: Upload,
                                title: "Upload & Earn",
                                description: "Scan items and earn points for verified recycling contributions",
                                color: "from-accent to-chart-2",
                                bgColor: "bg-accent/10",
                                delay: 0.2,
                            },
                            {
                                href: "/leaderboard",
                                icon: Trophy,
                                title: "Leaderboard",
                                description: "Compare your impact with the community and climb the ranks",
                                color: "from-success to-chart-3",
                                bgColor: "bg-success/10",
                                delay: 0.3,
                            },
                        ].map((action) => (
                            <motion.div
                                key={action.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: action.delay }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <Link href={action.href} className="group block h-full">
                                    <Card className="relative overflow-hidden border-2 hover:border-primary/40 transition-all h-full shadow-md hover:shadow-2xl bg-gradient-to-br from-card to-secondary/30">
                                        <div
                                            className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-all"
                                            style={{
                                                backgroundImage: `linear-gradient(to bottom right, var(--color-primary), var(--color-accent))`,
                                            }}
                                        />
                                        <CardHeader className="pb-4">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} shadow-lg mb-4`}
                                            >
                                                <action.icon className="h-8 w-8 text-white" />
                                            </motion.div>
                                            <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                                                {action.title}
                                            </CardTitle>
                                            <CardDescription className="text-base leading-relaxed text-pretty">
                                                {action.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all text-base py-6"
                                            >
                                                Get Started
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Card className="border-2 shadow-xl bg-gradient-to-br from-card to-secondary/20">
                        <CardHeader className="border-b bg-card/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-3xl mb-2">Recent Activity</CardTitle>
                                    <CardDescription className="text-base">Your latest recycling contributions</CardDescription>
                                </div>
                                <Badge variant="secondary" className="text-base px-4 py-2 shadow-sm">
                                    <Star className="h-4 w-4 mr-1.5" />
                                    {data?.recentUploads?.length ?? 0} items
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isLoading ? (
                                <div className="text-center py-16">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="inline-block"
                                    >
                                        <Recycle className="h-12 w-12 text-primary" />
                                    </motion.div>
                                    <p className="text-muted-foreground mt-4 text-lg">Loading your activity...</p>
                                </div>
                            ) : data?.recentUploads && data.recentUploads.length > 0 ? (
                                <div className="space-y-4">
                                    {data.recentUploads.map((upload, index) => (
                                        <motion.div
                                            key={upload.id}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02, x: 8 }}
                                            className="flex items-center justify-between p-5 rounded-2xl border-2 bg-card hover:border-primary/40 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-center gap-5">
                                                <motion.div
                                                    whileHover={{ rotate: 180 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-md"
                                                >
                                                    <Recycle className="h-7 w-7 text-primary-foreground" />
                                                </motion.div>
                                                <div>
                                                    <p className="font-semibold text-foreground text-lg mb-1">{upload.fileName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(upload.uploadedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-base px-4 py-2 shadow-md">
                                                <Sparkles className="h-4 w-4 mr-1" />+{upload.pointsEarned ?? 0} pts
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6"
                                    >
                                        <Recycle className="h-10 w-10 text-muted-foreground" />
                                    </motion.div>
                                    <p className="text-muted-foreground mb-6 text-lg">
                                        No recent activity. Start uploading to earn points!
                                    </p>
                                    <Button asChild size="lg" className="shadow-lg">
                                        <Link href="/upload">
                                            <Upload className="h-5 w-5 mr-2" />
                                            Upload Now
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    )
}
