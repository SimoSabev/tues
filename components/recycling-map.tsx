"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Recycle, Navigation, Clock, Info, MapPin as MapPinIcon, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

const createCustomIcon = (color: string, type: string) => {
    // Enhanced marker with better shadow and animation
    return new L.DivIcon({
        className: "custom-marker",
        html: `
      <div class="marker-container" style="
        position: relative;
        width: 50px;
        height: 50px;
      ">
        <div class="marker-pulse" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: ${color}30;
          animation: pulse-marker 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        <div class="marker-main" style="
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
          border: 4px solid white;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(${color}, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 19H6.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
            <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
            <path d="m14 16-3 3 3 3"/>
            <path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
            <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/>
            <path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>
          </svg>
        </div>
      </div>
    `,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
    })
}

const userLocationIcon = new L.DivIcon({
    className: "user-location-marker",
    html: `
    <div style="position: relative; width: 40px; height: 40px;">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: rgba(59, 130, 246, 0.15);
        animation: ping-marker 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        border: 5px solid white;
        box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4), 0 0 0 3px rgba(59, 130, 246, 0.2);
        animation: pulse-user 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        z-index: 10;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
        "></div>
      </div>
    </div>
  `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
})

const binTypeColors: Record<string, string> = {
    plastic: "#f59e0b",
    glass: "#10b981",
    paper: "#3b82f6",
    metal: "#64748b",
    ewaste: "#ef4444",
    textile: "#8b5cf6",
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

const binTypeIcons: Record<string, string> = {
    plastic: "🔶",
    glass: "🟢",
    paper: "🔵",
    metal: "⚫",
    ewaste: "🔴",
    textile: "🟣",
}

interface RecyclingBin {
    id: number
    name: string
    lat: number
    lng: number
    type: string
    address: string
    description?: string
    hours?: string
    distance?: number
}

interface RecyclingMapProps {
    bins: RecyclingBin[]
    userLocation: { lat: number; lng: number } | null
    onBinSelect: (bin: RecyclingBin) => void
}

function MapController({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center, 13, { animate: true, duration: 1 })
    }, [center, map])
    return null
}

export function RecyclingMap({ bins, userLocation, onBinSelect }: RecyclingMapProps) {
    useEffect(() => {
        const existingMap = document.querySelector(".leaflet-container")
        if (existingMap && (existingMap as any)._leaflet_id) {
            try {
                ;(existingMap as any)._leaflet_id = null
            } catch (e) {
                console.warn("Failed to reset map ID", e)
            }
        }
    }, [])

    useEffect(() => {
        return () => {
            const container = document.querySelector(".leaflet-container")
            if (container && (container as any)._leaflet_id) {
                ;(container as any)._leaflet_id = null
            }
        }
    }, [])

    if (!userLocation) {
        return (
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
                        <p className="text-emerald-600 text-sm mt-1">Preparing your recycling locations...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-[700px] rounded-2xl border-2 border-emerald-100/50 overflow-hidden shadow-2xl">
            <MapContainer
                key={`${userLocation.lat}-${userLocation.lng}-${bins.length}`}
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
                zoomControl={false}
                className="z-0"
            >
                {/* Enhanced tile layer with better colors */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles"
                />

                <MapController center={[userLocation.lat, userLocation.lng]} />

                {/* User location with radius circle */}
                <Circle
                    center={[userLocation.lat, userLocation.lng]}
                    radius={3000}
                    pathOptions={{
                        fillColor: "#3b82f6",
                        fillOpacity: 0.05,
                        color: "#3b82f6",
                        weight: 2,
                        opacity: 0.3,
                        dashArray: "10, 10",
                    }}
                />

                {/* User location marker */}
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon} zIndexOffset={1000}>
                    <Popup className="user-popup" maxWidth={300}>
                        <div className="p-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                                    <MapPinIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-blue-900 text-base">Your Location</p>
                                    <p className="text-xs text-blue-600">You are here</p>
                                </div>
                            </div>
                            <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-700">
                                    <strong>{bins.length}</strong> recycling locations within 3km radius
                                </p>
                            </div>
                        </div>
                    </Popup>
                </Marker>

                {/* Recycling bin markers */}
                {bins.map((bin) => (
                    <Marker
                        key={bin.id}
                        position={[bin.lat, bin.lng]}
                        icon={createCustomIcon(binTypeColors[bin.type], bin.type)}
                        eventHandlers={{
                            click: () => onBinSelect(bin),
                        }}
                    >
                        <Popup className="custom-popup" maxWidth={320}>
                            <div className="p-1">
                                {/* Header with icon and type badge */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${binTypeGradients[bin.type]} flex items-center justify-center shadow-lg flex-shrink-0`}
                                        >
                                            <Recycle className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-emerald-900 text-base mb-1 leading-tight">
                                                {bin.name}
                                            </h3>
                                            <Badge
                                                className={`bg-gradient-to-r ${binTypeGradients[bin.type]} text-white border-0 text-xs px-2 py-0.5`}
                                            >
                                                {binTypeIcons[bin.type]} {binTypeLabels[bin.type]}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Distance badge if available */}
                                {bin.distance !== undefined && (
                                    <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-xs font-semibold text-emerald-700">
                                            {bin.distance.toFixed(2)} km away
                                        </span>
                                    </div>
                                )}

                                {/* Address */}
                                <div className="mb-3 flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" />
                                    <p className="text-sm text-slate-700 leading-relaxed">{bin.address}</p>
                                </div>

                                {/* Description */}
                                {bin.description && (
                                    <div className="mb-3 p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                                        <p className="text-xs font-semibold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                                            <Recycle className="w-3.5 h-3.5" />
                                            Accepts:
                                        </p>
                                        <p className="text-sm text-emerald-700 leading-relaxed">{bin.description}</p>
                                    </div>
                                )}

                                {/* Hours */}
                                {bin.hours && (
                                    <div className="mb-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                                        <p className="text-xs font-semibold text-amber-900 mb-1.5 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            Operating Hours:
                                        </p>
                                        <p className="text-sm text-amber-700 leading-relaxed">{bin.hours}</p>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="space-y-2">
                                    <Button
                                        size="sm"
                                        className={`w-full bg-gradient-to-r ${binTypeGradients[bin.type]} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all py-5 text-sm font-semibold rounded-xl`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(
                                                `https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`,
                                                "_blank"
                                            )
                                        }}
                                    >
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Get Directions
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-medium rounded-xl"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onBinSelect(bin)
                                        }}
                                    >
                                        <Info className="w-4 h-4 mr-2" />
                                        View Full Details
                                    </Button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style jsx global>{`
                @keyframes pulse-marker {
                    0%,
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.3);
                        opacity: 0.5;
                    }
                }

                @keyframes ping-marker {
                    75%,
                    100% {
                        transform: translate(-50%, -50%) scale(2.5);
                        opacity: 0;
                    }
                }

                @keyframes pulse-user {
                    0%,
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.85;
                        transform: scale(1.05);
                    }
                }

                .custom-marker .marker-main:hover {
                    transform: scale(1.2) translateY(-3px);
                }

                .leaflet-popup-content-wrapper {
                    border-radius: 16px !important;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                    padding: 0 !important;
                    overflow: hidden;
                }

                .leaflet-popup-content {
                    margin: 0 !important;
                    width: 100% !important;
                }

                .leaflet-popup-tip {
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1) !important;
                }

                .custom-popup .leaflet-popup-close-button {
                    width: 32px !important;
                    height: 32px !important;
                    font-size: 24px !important;
                    padding: 0 !important;
                    color: #059669 !important;
                    background: white !important;
                    border-radius: 8px !important;
                    margin: 8px !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: all 0.2s !important;
                }

                .custom-popup .leaflet-popup-close-button:hover {
                    background: #f0fdf4 !important;
                    color: #047857 !important;
                    transform: scale(1.1) !important;
                }

                .user-popup .leaflet-popup-content-wrapper {
                    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
                    border: 2px solid #bfdbfe !important;
                }

                .map-tiles {
                    filter: brightness(1.02) contrast(1.05) saturate(1.1);
                }

                .leaflet-container {
                    background: #f0fdfa !important;
                }

                /* Zoom control positioning */
                .leaflet-top.leaflet-right {
                    top: 16px !important;
                    right: 16px !important;
                }

                /* Custom zoom controls styling */
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                    border-radius: 12px !important;
                    overflow: hidden;
                }

                .leaflet-control-zoom a {
                    width: 36px !important;
                    height: 36px !important;
                    line-height: 36px !important;
                    font-size: 20px !important;
                    background: white !important;
                    color: #059669 !important;
                    border: none !important;
                    transition: all 0.2s !important;
                }

                .leaflet-control-zoom a:hover {
                    background: #f0fdf4 !important;
                    color: #047857 !important;
                }

                /* Attribution styling */
                .leaflet-control-attribution {
                    background: rgba(255, 255, 255, 0.9) !important;
                    backdrop-filter: blur(8px) !important;
                    border-radius: 8px 0 0 0 !important;
                    padding: 4px 8px !important;
                    font-size: 10px !important;
                }
            `}</style>
        </div>
    )
}