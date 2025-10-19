"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Recycle, NavigationIcon } from "lucide-react"

const binTypeColors: Record<string, string> = {
    plastic: "#f59e0b",
    glass: "#10b981",
    paper: "#3b82f6",
    metal: "#6b7280",
    ewaste: "#ef4444",
    textile: "#a855f7",
    organic: "#84cc16",
    hazardous: "#dc2626",
}

const createCustomIcon = (color: string) =>
    new L.DivIcon({
        className: "custom-marker",
        html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: ${color};
        border: 4px solid white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 19H6.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
          <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
          <path d="m14 16-3 3 3 3"/>
          <path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
          <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/>
          <path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>
        </svg>
      </div>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    })

const userLocationIcon = new L.DivIcon({
    className: "user-location-marker",
    html: `
    <div style="position: relative;">
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #2563eb;
        border: 4px solid white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: rgba(37, 99, 235, 0.3);
        animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
})

interface RecyclingBin {
    id: number
    name: string
    lat: number
    lng: number
    type: string
    address: string
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

    useEffect(() => {
        const existingMap = document.querySelector(".leaflet-container")
        if (existingMap && (existingMap as any)._leaflet_id) {
            try {
                (existingMap as any)._leaflet_id = null
            } catch (e) {
                console.warn("Failed to reset map ID", e)
            }
        }
    }, [])

    useEffect(() => {
        return () => {
            const container = document.querySelector(".leaflet-container")
            if (container && (container as any)._leaflet_id) {
                (container as any)._leaflet_id = null
            }
        }
    }, [])


    return (
        <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-emerald-200">
            <MapContainer
                key={`${userLocation.lat}-${userLocation.lng}`}  // ✅ important
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom
            >
            <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController center={[userLocation.lat, userLocation.lng]} />

                {/* User location marker */}
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                    <Popup>
                        <div className="text-center">
                            <p className="font-semibold text-emerald-900">Your Location</p>
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
                        <Popup>
                            <div className="min-w-[200px]">
                                <h3 className="font-semibold text-emerald-900 mb-2">{bin.name}</h3>
                                <p className="text-sm text-emerald-600 mb-2">{bin.address}</p>
                                <Badge
                                    style={{
                                        backgroundColor: binTypeColors[bin.type],
                                        color: "white",
                                    }}
                                >
                                    {bin.type.charAt(0).toUpperCase() + bin.type.slice(1)}
                                </Badge>
                                <Button
                                    size="sm"
                                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => {
                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`, "_blank")
                                    }}
                                >
                                    <NavigationIcon className="w-3 h-3 mr-2" />
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
                        opacity: 0.5;
                    }
                }
                @keyframes ping {
                    75%,
                    100% {
                        transform: translate(-50%, -50%) scale(2);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    )
}
