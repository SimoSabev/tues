"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Recycle, Navigation, Clock, Info } from "lucide-react"

const createCustomIcon = (color: string) => {
    return new L.DivIcon({
        className: "custom-marker",
        html: `
      <div style="
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background-color: ${color};
        border: 4px solid white;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 0 0 2px ${color}40;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 19H6.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
          <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
          <path d="m14 16-3 3 3 3"/>
          <path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
          <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/>
          <path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>
        </svg>
      </div>
    `,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -44],
    })
}

const userLocationIcon = new L.DivIcon({
    className: "user-location-marker",
    html: `
    <div style="position: relative;">
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        border: 4px solid white;
        box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3), 0 0 0 2px rgba(37, 99, 235, 0.2);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        z-index: 10;
        position: relative;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background-color: rgba(37, 99, 235, 0.2);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
})

const binTypeColors: Record<string, string> = {
    plastic: "#eab308",
    glass: "#22c55e",
    paper: "#3b82f6",
    metal: "#6b7280",
    ewaste: "#ef4444",
    textile: "#a855f7",
}

const binTypeLabels: Record<string, string> = {
    plastic: "Plastic",
    glass: "Glass",
    paper: "Paper",
    metal: "Metal",
    ewaste: "E-Waste",
    textile: "Textile",
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
}

interface RecyclingMapProps {
    bins: RecyclingBin[]
    userLocation: { lat: number; lng: number } | null
    onBinSelect: (bin: RecyclingBin) => void
}

function MapController({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center, 13)
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
            <div className="w-full h-[600px] bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Recycle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-emerald-900 font-medium">Loading map...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-emerald-200">
            <MapContainer
                key={`${userLocation.lat}-${userLocation.lng}`}
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController center={[userLocation.lat, userLocation.lng]} />

                {/* User location marker */}
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                    <Popup>
                        <div className="text-center p-2">
                            <p className="font-semibold text-emerald-900 text-base mb-1">Your Location</p>
                            <p className="text-sm text-emerald-600">You are here</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Recycling bin markers */}
                {bins.map((bin) => (
                    <Marker
                        key={bin.id}
                        position={[bin.lat, bin.lng]}
                        icon={createCustomIcon(binTypeColors[bin.type])}
                        eventHandlers={{
                            click: () => onBinSelect(bin),
                        }}
                    >
                        <Popup className="custom-popup" maxWidth={280}>
                            <div className="p-2">
                                <h3 className="font-bold text-emerald-900 mb-2 text-base">{bin.name}</h3>
                                <p className="text-sm text-emerald-700 mb-3 flex items-start gap-2">
                                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {bin.address}
                                </p>
                                <Badge
                                    style={{
                                        backgroundColor: binTypeColors[bin.type],
                                        color: "white",
                                    }}
                                    className="mb-3"
                                >
                                    {binTypeLabels[bin.type]}
                                </Badge>
                                {bin.description && (
                                    <p className="text-sm text-emerald-600 mb-2 bg-emerald-50 p-2 rounded">
                                        <strong>Accepts:</strong> {bin.description}
                                    </p>
                                )}
                                {bin.hours && (
                                    <p className="text-sm text-emerald-600 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {bin.hours}
                                    </p>
                                )}
                                <Button
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md"
                                    onClick={() => {
                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`, "_blank")
                                    }}
                                >
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Get Directions
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style jsx global>{`
                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.6;
                    }
                }
                @keyframes ping {
                    75%,
                    100% {
                        transform: translate(-50%, -50%) scale(2);
                        opacity: 0;
                    }
                }
                .custom-marker:hover > div {
                    transform: scale(1.15);
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                }
                .leaflet-popup-tip {
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    )
}
