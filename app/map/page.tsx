"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Recycle, Loader2, Navigation, Search, Target, X, Filter, Layers } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"

const RecyclingMap = dynamic(
    () => import("@/components/recycling-map").then((mod) => ({ default: mod.RecyclingMap })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[700px] bg-gradient-to-br from-muted to-secondary/30 rounded-3xl flex items-center justify-center">
                <div className="text-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                        <Recycle className="w-16 h-16 text-primary mx-auto" />
                    </motion.div>
                    <p className="text-base font-medium text-muted-foreground">Loading interactive map...</p>
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
    plastic: "from-amber-500 to-orange-500",
    glass: "from-emerald-500 to-teal-500",
    paper: "from-blue-500 to-cyan-500",
    metal: "from-slate-500 to-gray-600",
    ewaste: "from-rose-500 to-pink-600",
    textile: "from-violet-500 to-purple-600",
}

const binTypeLabels: Record<string, string> = {
    plastic: "Plastic",
    glass: "Glass",
    paper: "Paper",
    metal: "Metal",
    ewaste: "E-Waste",
    textile: "Textile",
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

export default function MapPage() {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [selectedBin, setSelectedBin] = useState<RecyclingBin | null>(null)
    const [filter, setFilter] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")

    const { data: allBinsData } = useSWR(
        userLocation ? `/api/recycling-bins?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=3000&type=all` : null,
        fetcher,
        { refreshInterval: 30000 },
    )

    const { data, error, isLoading } = useSWR(
        userLocation
            ? `/api/recycling-bins?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=3000&type=${filter}`
            : null,
        fetcher,
        { refreshInterval: 30000 },
    )

    const recyclingBins: RecyclingBin[] = data?.bins || []
    const allBins: RecyclingBin[] = allBinsData?.bins || []

    const binsWithDistance = recyclingBins
        .map((bin) => ({
            ...bin,
            distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, bin.lat, bin.lng) : 0,
        }))
        .sort((a, b) => a.distance - b.distance)

    const filteredBins = binsWithDistance.filter(
        (bin) =>
            bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bin.address.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const typeCounts = Object.keys(binTypeLabels).reduce(
        (acc, type) => {
            acc[type] = allBins.filter((b) => b.type === type).length
            return acc
        },
        {} as Record<string, number>,
    )

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                },
                (error) => {
                    setUserLocation({ lat: 40.7589, lng: -73.9851 })
                },
            )
        } else {
            setUserLocation({ lat: 40.7589, lng: -73.9851 })
        }
    }, [])

    const handleRecenter = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
            <AppHeader />

            <main className="container mx-auto px-4 lg:px-8 py-12">
                <motion.div className="mb-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
                            >
                                <Layers className="h-4 w-4 text-primary" />
                                <span className="text-sm font-semibold text-primary">Interactive Map</span>
                            </motion.div>
                            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-3">
                                Find Recycling Locations
                            </h1>
                            <p className="text-xl text-muted-foreground">{data?.count || 0} locations within 3km radius</p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative w-full lg:w-96"
                        >
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 text-base rounded-2xl border-2 focus:border-primary shadow-sm"
                            />
                        </motion.div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { label: "Total Locations", value: data?.count || 0, icon: MapPin, color: "from-primary to-accent" },
                            {
                                label: "Nearest Location",
                                value: filteredBins.length > 0 ? `${filteredBins[0].distance.toFixed(1)}km` : "-",
                                icon: Target,
                                color: "from-accent to-chart-2",
                            },
                            {
                                label: "Waste Types",
                                value: Object.keys(binTypeLabels).length,
                                icon: Recycle,
                                color: "from-success to-chart-3",
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -4 }}
                            >
                                <Card className="border-2 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-card to-secondary/20">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {stat.label}
                      </span>
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}
                                            >
                                                <stat.icon className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-4xl font-bold text-foreground">{stat.value}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="border-2 shadow-2xl overflow-hidden">
                                <CardContent className="p-0 relative">
                                    {isLoading ? (
                                        <div className="w-full h-[700px] bg-gradient-to-br from-muted to-secondary/30 rounded-3xl flex items-center justify-center">
                                            <div className="text-center">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                >
                                                    <Recycle className="w-16 h-16 text-primary mx-auto mb-6" />
                                                </motion.div>
                                                <p className="text-muted-foreground text-lg font-medium">Loading locations...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <RecyclingMap bins={filteredBins} userLocation={userLocation} onBinSelect={setSelectedBin} />
                                    )}

                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleRecenter}
                                            size="icon"
                                            className="absolute bottom-8 right-8 h-16 w-16 rounded-2xl shadow-2xl z-[1000] bg-gradient-to-br from-primary to-accent hover:shadow-primary/50"
                                        >
                                            <Target className="h-7 w-7" />
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="border-2 shadow-lg bg-gradient-to-br from-card to-secondary/20">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-xl">Filter Types</CardTitle>
                                        </div>
                                        {filter !== "all" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setFilter("all")}
                                                className="text-primary hover:text-primary"
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                    <CardDescription className="text-base">Showing {filteredBins.length} locations</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        variant={filter === "all" ? "default" : "outline"}
                                        className="w-full justify-start text-base h-12 rounded-xl"
                                        onClick={() => setFilter("all")}
                                    >
                                        All Types ({allBinsData?.count || 0})
                                    </Button>
                                    {Object.entries(binTypeLabels).map(([type, label]) => {
                                        const count = typeCounts[type] || 0
                                        return (
                                            <motion.div key={type} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                                                <Button
                                                    variant={filter === type ? "default" : "outline"}
                                                    className="w-full justify-start text-base h-12 rounded-xl"
                                                    onClick={() => setFilter(type)}
                                                >
                                                    <div
                                                        className={`w-3 h-3 rounded-full bg-gradient-to-br ${binTypeColors[type]} mr-3 shadow-sm`}
                                                    />
                                                    {label}
                                                    <span className="ml-auto text-sm opacity-70 font-semibold">({count})</span>
                                                </Button>
                                            </motion.div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {selectedBin ? (
                                <motion.div
                                    key="selected"
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                >
                                    <Card className="border-2 shadow-xl bg-gradient-to-br from-card to-secondary/20">
                                        <CardHeader className="border-b bg-card/50 backdrop-blur-sm">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-2xl mb-3">{selectedBin.name}</CardTitle>
                                                    <CardDescription className="text-base">{selectedBin.address}</CardDescription>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => setSelectedBin(null)} className="rounded-xl">
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-5 pt-6">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <Badge
                                                    className={`bg-gradient-to-r ${binTypeColors[selectedBin.type]} text-white text-sm px-3 py-1.5 shadow-md`}
                                                >
                                                    {binTypeLabels[selectedBin.type]}
                                                </Badge>
                                                {userLocation && (
                                                    <Badge variant="outline" className="text-sm px-3 py-1.5">
                                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                                        {calculateDistance(
                                                            userLocation.lat,
                                                            userLocation.lng,
                                                            selectedBin.lat,
                                                            selectedBin.lng,
                                                        ).toFixed(2)}{" "}
                                                        km away
                                                    </Badge>
                                                )}
                                            </div>

                                            {selectedBin.description && (
                                                <div className="p-4 rounded-xl bg-muted/50 border">
                                                    <p className="text-sm font-semibold mb-2 text-foreground">Accepts:</p>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedBin.description}</p>
                                                </div>
                                            )}

                                            {selectedBin.hours && (
                                                <div className="p-4 rounded-xl bg-muted/50 border">
                                                    <p className="text-sm font-semibold mb-2 text-foreground">Operating Hours:</p>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedBin.hours}</p>
                                                </div>
                                            )}

                                            <Button
                                                className="w-full h-14 text-base rounded-xl shadow-lg bg-gradient-to-r from-primary to-accent hover:shadow-xl"
                                                onClick={() => {
                                                    window.open(
                                                        `https://www.google.com/maps/dir/?api=1&destination=${selectedBin.lat},${selectedBin.lng}`,
                                                        "_blank",
                                                    )
                                                }}
                                            >
                                                <Navigation className="w-5 h-5 mr-2" />
                                                Get Directions
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Card className="border-2 shadow-lg bg-gradient-to-br from-card to-secondary/20">
                                        <CardContent className="pt-6">
                                            <div className="text-center py-16">
                                                <motion.div
                                                    animate={{ y: [0, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                    className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6"
                                                >
                                                    <MapPin className="h-10 w-10 text-muted-foreground" />
                                                </motion.div>
                                                <p className="font-semibold text-foreground mb-2 text-lg">Select a Location</p>
                                                <p className="text-sm text-muted-foreground">Click any pin on the map to view details</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Nearby Locations */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                            <Card className="border-2 shadow-lg bg-gradient-to-br from-card to-secondary/20">
                                <CardHeader>
                                    <CardTitle className="text-xl">Nearby Locations</CardTitle>
                                    <CardDescription className="text-base">
                                        {isLoading ? "Loading..." : `${filteredBins.length} locations found`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {isLoading ? (
                                        <div className="text-center py-8">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                                        </div>
                                    ) : filteredBins.length > 0 ? (
                                        filteredBins.map((bin) => (
                                            <button
                                                key={bin.id}
                                                onClick={() => setSelectedBin(bin)}
                                                className={`w-full p-3 rounded-lg border-2 text-left transition-all hover:border-primary ${
                                                    selectedBin?.id === bin.id ? "border-primary bg-secondary" : "border-border"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg ${binTypeColors[bin.type]} flex items-center justify-center flex-shrink-0`}
                                                    >
                                                        <Recycle className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-medium text-sm truncate">{bin.name}</p>
                                                            <Badge variant="outline" className="text-xs">
                                                                {bin.distance.toFixed(1)}km
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground truncate">{bin.address}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-muted-foreground">No locations found</p>
                                        </div>
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
