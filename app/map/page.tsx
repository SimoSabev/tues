"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Recycle, Filter } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

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

// Simulated recycling bin locations
const recyclingBins = [
    { id: 1, name: "Central Park Recycling", lat: 40.7829, lng: -73.9654, type: "plastic", address: "Central Park West" },
    { id: 2, name: "Downtown Glass Collection", lat: 40.7589, lng: -73.9851, type: "glass", address: "5th Avenue" },
    { id: 3, name: "East Side Paper Bins", lat: 40.7614, lng: -73.9776, type: "paper", address: "Madison Ave" },
    { id: 4, name: "West Village E-Waste", lat: 40.7358, lng: -74.0036, type: "ewaste", address: "Bleecker St" },
    { id: 5, name: "Midtown Metal Recycling", lat: 40.7549, lng: -73.984, type: "metal", address: "Broadway" },
    { id: 6, name: "Battery Park Textile Drop", lat: 40.7033, lng: -74.017, type: "textile", address: "Battery Pl" },
]

const binTypeColors = {
    plastic: "bg-yellow-500",
    glass: "bg-green-500",
    paper: "bg-blue-500",
    metal: "bg-gray-500",
    ewaste: "bg-red-500",
    textile: "bg-purple-500",
}

export default function MapPage() {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [selectedBin, setSelectedBin] = useState<(typeof recyclingBins)[0] | null>(null)
    const [filter, setFilter] = useState<string>("all")

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
                    console.log("Location access denied, using default location")
                    // Default to NYC coordinates
                    setUserLocation({ lat: 40.7589, lng: -73.9851 })
                },
            )
        } else {
            // Fallback to default location
            setUserLocation({ lat: 40.7589, lng: -73.9851 })
        }
    }, [])

    const filteredBins = filter === "all" ? recyclingBins : recyclingBins.filter((bin) => bin.type === filter)

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
                            <h1 className="text-2xl font-bold text-emerald-900">Sortex</h1>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/map" className="text-emerald-900 font-medium">
                                Map
                            </Link>
                            <Link href="/upload" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                                Upload
                            </Link>
                            <Link href="/leaderboard" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                                Leaderboard
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-emerald-900 mb-2">Recycling Map</h2>
                    <p className="text-emerald-700">Find nearby recycling points and track your location</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map Area */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white overflow-hidden">
                            <CardContent className="p-0">
                                <RecyclingMap bins={filteredBins} userLocation={userLocation} onBinSelect={setSelectedBin} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Filters */}
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle className="text-emerald-900 flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filter by Type
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant={filter === "all" ? "default" : "outline"}
                                    className="w-full justify-start"
                                    onClick={() => setFilter("all")}
                                >
                                    All Types
                                </Button>
                                {Object.keys(binTypeColors).map((type) => (
                                    <Button
                                        key={type}
                                        variant={filter === type ? "default" : "outline"}
                                        className="w-full justify-start"
                                        onClick={() => setFilter(type)}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${binTypeColors[type as keyof typeof binTypeColors]} mr-2`} />
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Selected bin info */}
                        {selectedBin ? (
                            <Card className="bg-white">
                                <CardHeader>
                                    <CardTitle className="text-emerald-900">{selectedBin.name}</CardTitle>
                                    <CardDescription>{selectedBin.address}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${binTypeColors[selectedBin.type as keyof typeof binTypeColors]} text-white`}>
                                            {selectedBin.type}
                                        </Badge>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-emerald-700">
                                        <MapPin className="w-4 h-4 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Location</p>
                                            <p className="text-emerald-600">
                                                {selectedBin.lat.toFixed(4)}, {selectedBin.lng.toFixed(4)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => {
                                            window.open(
                                                `https://www.google.com/maps/dir/?api=1&destination=${selectedBin.lat},${selectedBin.lng}`,
                                                "_blank",
                                            )
                                        }}
                                    >
                                        Get Directions
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="bg-white">
                                <CardContent className="pt-6">
                                    <div className="text-center text-emerald-600">
                                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Select a marker on the map to see details</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Nearby bins list */}
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle className="text-emerald-900">Nearby Points</CardTitle>
                                <CardDescription>{filteredBins.length} locations found</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {filteredBins.slice(0, 4).map((bin) => (
                                    <div
                                        key={bin.id}
                                        className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-colors"
                                        onClick={() => setSelectedBin(bin)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-full ${binTypeColors[bin.type as keyof typeof binTypeColors]} flex items-center justify-center`}
                                            >
                                                <Recycle className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-emerald-900">{bin.name}</p>
                                                <p className="text-xs text-emerald-600">{bin.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
