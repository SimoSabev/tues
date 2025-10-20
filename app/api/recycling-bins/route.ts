// app/api/recycling-bins/route.ts
import { NextResponse } from "next/server"

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get("lat") || "42.698334") // Default: Sofia, Bulgaria
    const lng = parseFloat(searchParams.get("lng") || "23.319941")
    const radius = parseInt(searchParams.get("radius") || "2000") // meters
    const type = searchParams.get("type") || "all"

    // Overpass query for recycling containers
    const query = `
    [out:json][timeout:25];
    (
      node["amenity"="recycling"](around:${radius},${lat},${lng});
    );
    out body;
  `

    try {
        const res = await fetch(OVERPASS_API_URL, {
            method: "POST",
            body: query,
        })
        const data = await res.json()

        // Parse nodes into your format
        const bins = data.elements.map((el: any, index: number) => {
            const materials = Object.entries(el.tags)
                .filter(([key, val]) => key.startsWith("recycling:") && val === "yes")
                .map(([key]) => key.replace("recycling:", ""))

            const mainType =
                materials.find((m) => ["glass", "plastic", "paper", "metal", "textile", "electronics"].includes(m)) ||
                "mixed"

            return {
                id: el.id || index,
                name: el.tags.name || `Recycling Point #${index + 1}`,
                lat: el.lat,
                lng: el.lon,
                type: mainType,
                address: el.tags["addr:street"]
                    ? `${el.tags["addr:street"]} ${el.tags["addr:housenumber"] || ""}`
                    : "Unknown address",
                description: materials.join(", "),
                hours: el.tags["opening_hours"] || "24/7",
            }
        })

        // Filter by type if specified
        const filteredBins =
            type === "all" ? bins : bins.filter((b: any) => b.type === type)

        return NextResponse.json({
            count: filteredBins.length,
            bins: filteredBins,
        })
    } catch (error) {
        console.error("Error fetching recycling bins:", error)
        return NextResponse.json({ bins: [] }, { status: 500 })
    }
}
