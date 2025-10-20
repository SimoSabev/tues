"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Recycle, Filter, Loader2, Navigation, Search, Target, TrendingUp, AlertCircle, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"

const RecyclingMap = dynamic(
    () => import("@/components/recycling-map").then((mod) => ({ default: mod.RecyclingMap })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[700px] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-emerald-100/50">
                <div className="text-center space-y-6">
                    <motion.div
                        className="relative w-24 h-24 mx-auto"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 blur-xl" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                            <Recycle className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>
                    <div>
                        <p className="text-emerald-900 font-semibold text-lg">Loading Interactive Map</p>
                        <p className="text-emerald-600 text-sm mt-1">Finding recycling locations near you...</p>
                    </div>
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
    plastic: "bg-amber-500",
    glass: "bg-emerald-500",
    paper: "bg-blue-500",
    metal: "bg-slate-500",
    ewaste: "bg-rose-500",
    textile: "bg-violet-500",
}

const binTypeGradients: Record<string, string> = {
    plastic: "from-amber-500 to-orange-500",
    glass: "from-emerald-500 to-teal-500",
    paper: "from-blue-500 to-cyan-500",
    metal: "from-slate-500 to-zinc-500",
    ewaste: "from-rose-500 to-pink-500",
    textile: "from-violet-500 to-purple-500",
}

const binTypeLabels: Record<string, string> = {
    plastic: "Plastic",
    glass: "Glass",
    paper: "Paper",
    metal: "Metal",
    ewaste: "E-Waste",
    textile: "Textile",
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radius of the Earth in km
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
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Fetch all bins for accurate counts
    const { data: allBinsData } = useSWR(
        userLocation
            ? `/api/recycling-bins?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=3000&type=all`
            : null,
        fetcher,
        { refreshInterval: 30000 }
    )

    const { data, error, isLoading } = useSWR(
        userLocation
            ? `/api/recycling-bins?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=3000&type=${filter}`
            : null,
        fetcher,
        { refreshInterval: 30000 }
    )

    const recyclingBins: RecyclingBin[] = data?.bins || []
    const allBins: RecyclingBin[] = allBinsData?.bins || []

    // Add distance to bins
    const binsWithDistance = recyclingBins
        .map((bin) => ({
            ...bin,
            distance: userLocation
                ? calculateDistance(userLocation.lat, userLocation.lng, bin.lat, bin.lng)
                : 0,
        }))
        .sort((a, b) => a.distance - b.distance)

    const filteredBins = binsWithDistance.filter(
        (bin) =>
            bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bin.address.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Calculate counts for each type from all bins
    const typeCounts = Object.keys(binTypeLabels).reduce((acc, type) => {
        acc[type] = allBins.filter((b) => b.type === type).length
        return acc
    }, {} as Record<string, number>)

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
                    console.log("Location access denied, using default location")
                    setUserLocation({ lat: 40.7589, lng: -73.9851 })
                },
            )
        } else {
            setUserLocation({ lat: 40.7589, lng: -73.9851 })
        }
    }, [])

    const handleRecenter = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                },
            )
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Enhanced Header */}
            <header className="border-b border-emerald-100/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <motion.div
                                className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Recycle className="w-6 h-6 text-white" />
                                <motion.div
                                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20"
                                    initial={{ scale: 0 }}
                                    whileHover={{ scale: 1 }}
                                />
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                                    Sortify
                                </h1>
                                <p className="text-[10px] text-emerald-600 -mt-0.5">Recycle Smarter</p>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            {[
                                { href: "/", label: "Dashboard" },
                                { href: "/map", label: "Map", active: true },
                                { href: "/upload", label: "Upload" },
                                { href: "/leaderboard", label: "Leaderboard" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        item.active
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                                            : "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-10 h-10 border-2 border-emerald-200",
                                    userButtonPopoverCard:
                                        "bg-white/95 backdrop-blur-xl border border-emerald-100 shadow-2xl",
                                },
                            }}
                        />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 md:py-10">
                {/* Enhanced Hero Section */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl md:text-5xl font-bold text-emerald-900">
                                    Recycling Map
                                </h2>
                                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Live
                                </Badge>
                            </div>
                            <p className="text-emerald-700 text-base md:text-lg">
                                Discover {data?.count || 0} recycling points within 3km radius
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                            <input
                                type="text"
                                placeholder="Search locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white/80 backdrop-blur-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Map Area - 8 columns */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="relative"
                        >
                            {/* Map Card */}
                            <Card className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-2xl border-2 border-emerald-100/50 rounded-2xl">
                                <CardContent className="p-0 relative">
                                    {isLoading ? (
                                        <div className="w-full h-[700px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center">
                                            <div className="text-center">
                                                <Loader2 className="w-14 h-14 text-emerald-600 animate-spin mx-auto mb-4" />
                                                <p className="text-emerald-900 font-semibold text-lg">Loading locations...</p>
                                                <p className="text-emerald-600 text-sm mt-1">This won't take long</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <RecyclingMap
                                            bins={filteredBins}
                                            userLocation={userLocation}
                                            onBinSelect={setSelectedBin}
                                        />
                                    )}

                                    {/* Floating Recenter Button */}
                                    <motion.button
                                        onClick={handleRecenter}
                                        className="absolute bottom-6 right-6 w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border-2 border-emerald-200 flex items-center justify-center hover:bg-emerald-50 transition-all group z-[1000]"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Target className="w-6 h-6 text-emerald-600 group-hover:rotate-90 transition-transform" />
                                    </motion.button>
                                </CardContent>
                            </Card>

                            {/* Stats Bar */}
                            <motion.div
                                className="mt-4 grid grid-cols-3 gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card className="bg-white/80 backdrop-blur-sm border border-emerald-100">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-emerald-600">
                                            {data?.count || 0}
                                        </div>
                                        <div className="text-xs text-emerald-700 mt-1">Total Locations</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-teal-600">
                                            {filteredBins.length > 0
                                                ? filteredBins[0].distance.toFixed(1)
                                                : "-"}
                                            km
                                        </div>
                                        <div className="text-xs text-teal-700 mt-1">Nearest Bin</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white/80 backdrop-blur-sm border border-cyan-100">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-cyan-600">
                                            {Object.keys(binTypeLabels).length}
                                        </div>
                                        <div className="text-xs text-cyan-700 mt-1">Waste Types</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Sidebar - 4 columns */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Filters Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-emerald-100/50 rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-emerald-900 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                                <Filter className="w-4 h-4 text-white" />
                                            </div>
                                            Filter Types
                                        </CardTitle>
                                        {filter !== "all" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setFilter("all")}
                                                className="text-xs"
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                    <CardDescription>Showing {filteredBins.length} locations</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    <Button
                                        variant={filter === "all" ? "default" : "outline"}
                                        className={`w-full justify-start text-sm font-medium transition-all ${
                                            filter === "all"
                                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                                                : "hover:bg-emerald-50"
                                        }`}
                                        onClick={() => setFilter("all")}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                                        All Types ({allBinsData?.count || 0})
                                    </Button>
                                    {Object.entries(binTypeLabels).map(([type, label]) => {
                                        const count = typeCounts[type] || 0
                                        return (
                                            <Button
                                                key={type}
                                                variant={filter === type ? "default" : "outline"}
                                                className={`w-full justify-start text-sm font-medium transition-all ${
                                                    filter === type
                                                        ? `bg-gradient-to-r ${binTypeGradients[type]} hover:opacity-90 shadow-lg text-white`
                                                        : "hover:bg-emerald-50"
                                                }`}
                                                onClick={() => setFilter(type)}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${binTypeColors[type]} mr-2`} />
                                                {label}
                                                <span className="ml-auto text-xs opacity-70">({count})</span>
                                            </Button>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Selected Bin Info */}
                        <AnimatePresence mode="wait">
                            {selectedBin ? (
                                <motion.div
                                    key="selected"
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-emerald-200 rounded-2xl overflow-hidden">
                                        <div
                                            className={`h-2 bg-gradient-to-r ${binTypeGradients[selectedBin.type]}`}
                                        />
                                        <CardHeader className="relative">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-4 top-4"
                                                onClick={() => setSelectedBin(null)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                            <CardTitle className="text-emerald-900 text-xl pr-8">
                                                {selectedBin.name}
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                {selectedBin.address}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge
                                                    className={`bg-gradient-to-r ${binTypeGradients[selectedBin.type]} text-white border-0 px-3 py-1`}
                                                >
                                                    {binTypeLabels[selectedBin.type]}
                                                </Badge>
                                                {userLocation && (
                                                    <Badge variant="outline" className="border-emerald-200">
                                                        <TrendingUp className="w-3 h-3 mr-1" />
                                                        {calculateDistance(
                                                            userLocation.lat,
                                                            userLocation.lng,
                                                            selectedBin.lat,
                                                            selectedBin.lng
                                                        ).toFixed(2)}{" "}
                                                        km away
                                                    </Badge>
                                                )}
                                            </div>

                                            {selectedBin.description && (
                                                <div className="text-sm text-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                                                    <p className="font-semibold mb-2 flex items-center gap-2">
                                                        <Recycle className="w-4 h-4" />
                                                        Accepts:
                                                    </p>
                                                    <p className="text-emerald-700">{selectedBin.description}</p>
                                                </div>
                                            )}

                                            {selectedBin.hours && (
                                                <div className="text-sm text-teal-800 bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100">
                                                    <p className="font-semibold mb-2 flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4" />
                                                        Operating Hours:
                                                    </p>
                                                    <p className="text-teal-700">{selectedBin.hours}</p>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-2 text-sm text-cyan-800 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-100">
                                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="font-semibold">Coordinates</p>
                                                    <p className="text-cyan-700 text-xs mt-1">
                                                        {selectedBin.lat.toFixed(6)}, {selectedBin.lng.toFixed(6)}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all py-6 text-base font-semibold rounded-xl"
                                                onClick={() => {
                                                    window.open(
                                                        `https://www.google.com/maps/dir/?api=1&destination=${selectedBin.lat},${selectedBin.lng}`,
                                                        "_blank"
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
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg border-2 border-emerald-100/50 rounded-2xl">
                                        <CardContent className="pt-6">
                                            <div className="text-center text-emerald-700 py-12">
                                                <motion.div
                                                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center"
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <MapPin className="w-10 h-10 text-emerald-500" />
                                                </motion.div>
                                                <p className="text-lg font-semibold text-emerald-900 mb-2">
                                                    Select a Location
                                                </p>
                                                <p className="text-sm text-emerald-600">
                                                    Click any pin on the map to view details
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Nearby Bins List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-emerald-100/50 rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                                    <CardTitle className="text-emerald-900 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        Nearby Locations
                                    </CardTitle>
                                    <CardDescription>
                                        {isLoading ? "Loading..." : `${filteredBins.length} locations found`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-3 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {isLoading ? (
                                        <div className="text-center py-8">
                                            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
                                        </div>
                                    ) : filteredBins.length > 0 ? (
                                        filteredBins.map((bin, index) => (
                                            <motion.div
                                                key={bin.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className={`p-4 rounded-xl bg-gradient-to-br from-white to-emerald-50/50 border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 group ${
                                                    selectedBin?.id === bin.id
                                                        ? "border-emerald-400 shadow-lg"
                                                        : "border-emerald-100 hover:border-emerald-300"
                                                }`}
                                                onClick={() => setSelectedBin(bin)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${binTypeGradients[bin.type]} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md`}
                                                    >
                                                        <Recycle className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-semibold text-sm text-emerald-900 truncate">
                                                                {bin.name}
                                                            </p>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] px-1.5 py-0 border-emerald-200"
                                                            >
                                                                {bin.distance.toFixed(1)}km
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-emerald-600 truncate">{bin.address}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <AlertCircle className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <p className="text-emerald-900 font-medium mb-1">No locations found</p>
                                            <p className="text-sm text-emerald-600">Try adjusting your filters</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f0fdf4;
                    border-radius: 100px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #10b981;
                    border-radius: 100px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #059669;
                }
            `}</style>
        </div>
    )
}