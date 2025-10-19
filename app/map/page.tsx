"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Recycle, Filter, Loader2, Navigation } from "lucide-react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import useSWR from "swr"

const RecyclingMap = dynamic(
    () => import("@/components/recycling-map").then((mod) => ({ default: mod.RecyclingMap })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[600px] bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Recycle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-emerald-900 font-medium">Loading map...</p>
                </div>
            </div>
        ),
    },
)

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface RecyclingBin {
    id: number
    name: string
    lat: number
    lng: number
    type: string
    address: string
    description?: string
    hours?: string
}

const binTypeColors: Record<string, string> = {
    plastic: "bg-yellow-500",
    glass: "bg-green-500",
    paper: "bg-blue-500",
    metal: "bg-gray-500",
    ewaste: "bg-red-500",
    textile: "bg-purple-500",
}

const binTypeLabels: Record<string, string> = {
    plastic: "Plastic",
    glass: "Glass",
    paper: "Paper",
    metal: "Metal",
    ewaste: "E-Waste",
    textile: "Textile",
}

export default function MapPage() {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [selectedBin, setSelectedBin] = useState<RecyclingBin | null>(null)
    const [filter, setFilter] = useState<string>("all")

    const { data, error, isLoading } = useSWR(`/api/recycling-bins?type=${filter}`, fetcher, {
        refreshInterval: 30000, // Refresh every 30 seconds
    })

    const recyclingBins: RecyclingBin[] = data?.bins || []

    useEffect(() => {
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                },
                (error) => {
                    console.log("[v0] Location access denied, using default location")
                    // Default to NYC coordinates
                    setUserLocation({ lat: 40.7589, lng: -73.9851 })
                },
            )
        } else {
            // Fallback to default location
            setUserLocation({ lat: 40.7589, lng: -73.9851 })
        }
    }, [])

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
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Recycle className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                                    Sortify
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
                                className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-900 font-medium transition-all"
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

            <main className="container mx-auto px-4 py-8">
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold text-emerald-900 mb-2">Recycling Map</h2>
                    <p className="text-emerald-700 text-lg">Find nearby recycling points and get directions to the nearest bin</p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map Area */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="bg-white overflow-hidden shadow-xl border-2 border-emerald-100">
                                <CardContent className="p-0">
                                    {isLoading ? (
                                        <div className="w-full h-[600px] bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                                                <p className="text-emerald-900 font-medium">Loading recycling locations...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <RecyclingMap bins={recyclingBins} userLocation={userLocation} onBinSelect={setSelectedBin} />
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Filters */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="bg-white shadow-lg border-2 border-emerald-100">
                                <CardHeader>
                                    <CardTitle className="text-emerald-900 flex items-center gap-2">
                                        <Filter className="w-5 h-5" />
                                        Filter by Type
                                    </CardTitle>
                                    <CardDescription>Show specific recycling bin types</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        variant={filter === "all" ? "default" : "outline"}
                                        className={`w-full justify-start ${filter === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                                        onClick={() => setFilter("all")}
                                    >
                                        All Types ({data?.count || 0})
                                    </Button>
                                    {Object.entries(binTypeLabels).map(([type, label]) => (
                                        <Button
                                            key={type}
                                            variant={filter === type ? "default" : "outline"}
                                            className={`w-full justify-start ${filter === type ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                                            onClick={() => setFilter(type)}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${binTypeColors[type]} mr-2`} />
                                            {label}
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Selected bin info */}
                        {selectedBin ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <Card className="bg-white shadow-lg border-2 border-emerald-200">
                                    <CardHeader>
                                        <CardTitle className="text-emerald-900 text-xl">{selectedBin.name}</CardTitle>
                                        <CardDescription className="text-base">{selectedBin.address}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={`${binTypeColors[selectedBin.type]} text-white hover:opacity-90 px-3 py-1 text-sm`}
                                            >
                                                {binTypeLabels[selectedBin.type]}
                                            </Badge>
                                        </div>
                                        {selectedBin.description && (
                                            <div className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                                                <p className="font-medium mb-1">Accepts:</p>
                                                <p>{selectedBin.description}</p>
                                            </div>
                                        )}
                                        {selectedBin.hours && (
                                            <div className="text-sm text-emerald-700 bg-teal-50 p-3 rounded-lg">
                                                <p className="font-medium mb-1">Hours:</p>
                                                <p>{selectedBin.hours}</p>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-2 text-sm text-emerald-700 bg-cyan-50 p-3 rounded-lg">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Coordinates</p>
                                                <p className="text-emerald-600">
                                                    {selectedBin.lat.toFixed(4)}, {selectedBin.lng.toFixed(4)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                                            onClick={() => {
                                                window.open(
                                                    `https://www.google.com/maps/dir/?api=1&destination=${selectedBin.lat},${selectedBin.lng}`,
                                                    "_blank",
                                                )
                                            }}
                                        >
                                            <Navigation className="w-4 h-4 mr-2" />
                                            Get Directions
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <Card className="bg-white shadow-lg border-2 border-emerald-100">
                                    <CardContent className="pt-6">
                                        <div className="text-center text-emerald-600 py-8">
                                            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                            <p className="text-base font-medium">Select a marker on the map</p>
                                            <p className="text-sm mt-2">Click any pin to see recycling bin details</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Nearby bins list */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card className="bg-white shadow-lg border-2 border-emerald-100">
                                <CardHeader>
                                    <CardTitle className="text-emerald-900">Nearby Points</CardTitle>
                                    <CardDescription>
                                        {isLoading ? "Loading..." : `${recyclingBins.length} locations found`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {isLoading ? (
                                        <div className="text-center py-4">
                                            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                                        </div>
                                    ) : recyclingBins.length > 0 ? (
                                        recyclingBins.slice(0, 6).map((bin, index) => (
                                            <motion.div
                                                key={bin.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-100 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
                                                onClick={() => setSelectedBin(bin)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-full ${binTypeColors[bin.type]} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md`}
                                                    >
                                                        <Recycle className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm text-emerald-900 truncate">{bin.name}</p>
                                                        <p className="text-xs text-emerald-600 truncate">{bin.address}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-emerald-600">No locations found</div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}
