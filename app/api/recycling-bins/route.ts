import { NextResponse } from "next/server"

// Simulated recycling bin data - in production, this would come from OpenRecycleMap API or database
const recyclingBins = [
    {
        id: 1,
        name: "Central Park Recycling Station",
        lat: 40.7829,
        lng: -73.9654,
        type: "plastic",
        address: "Central Park West, New York, NY",
        description: "Accepts all types of plastic bottles and containers",
        hours: "24/7",
    },
    {
        id: 2,
        name: "Downtown Glass Collection Point",
        lat: 40.7589,
        lng: -73.9851,
        type: "glass",
        address: "5th Avenue, New York, NY",
        description: "Glass bottles and jars recycling center",
        hours: "Mon-Fri: 8AM-6PM",
    },
    {
        id: 3,
        name: "East Side Paper & Cardboard",
        lat: 40.7614,
        lng: -73.9776,
        type: "paper",
        address: "Madison Avenue, New York, NY",
        description: "Paper, cardboard, and newspaper recycling",
        hours: "24/7",
    },
    {
        id: 4,
        name: "West Village E-Waste Drop-off",
        lat: 40.7358,
        lng: -74.0036,
        type: "ewaste",
        address: "Bleecker Street, New York, NY",
        description: "Electronics, batteries, and e-waste disposal",
        hours: "Tue-Sat: 10AM-5PM",
    },
    {
        id: 5,
        name: "Midtown Metal Recycling Center",
        lat: 40.7549,
        lng: -73.984,
        type: "metal",
        address: "Broadway, New York, NY",
        description: "Aluminum cans, steel, and metal scrap",
        hours: "Mon-Fri: 7AM-7PM",
    },
    {
        id: 6,
        name: "Battery Park Textile Drop",
        lat: 40.7033,
        lng: -74.017,
        type: "textile",
        address: "Battery Place, New York, NY",
        description: "Clothing, fabrics, and textile recycling",
        hours: "24/7",
    },
    {
        id: 7,
        name: "Upper East Side Multi-Material",
        lat: 40.7736,
        lng: -73.9566,
        type: "plastic",
        address: "Lexington Avenue, New York, NY",
        description: "Mixed recyclables including plastic and paper",
        hours: "24/7",
    },
    {
        id: 8,
        name: "Chelsea Glass & Bottle Center",
        lat: 40.7465,
        lng: -74.0014,
        type: "glass",
        address: "8th Avenue, New York, NY",
        description: "Glass bottles and containers",
        hours: "Mon-Sun: 6AM-10PM",
    },
    {
        id: 9,
        name: "Financial District Paper Hub",
        lat: 40.7074,
        lng: -74.0113,
        type: "paper",
        address: "Wall Street, New York, NY",
        description: "Office paper and cardboard recycling",
        hours: "Mon-Fri: 7AM-8PM",
    },
    {
        id: 10,
        name: "Harlem Community Recycling",
        lat: 40.8116,
        lng: -73.9465,
        type: "metal",
        address: "125th Street, New York, NY",
        description: "Metal cans and aluminum recycling",
        hours: "24/7",
    },
]

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type")

        // Filter by type if specified
        let filteredBins = recyclingBins
        if (type && type !== "all") {
            filteredBins = recyclingBins.filter((bin) => bin.type === type)
        }

        // Simulate API delay for realism
        await new Promise((resolve) => setTimeout(resolve, 300))

        return NextResponse.json({
            success: true,
            bins: filteredBins,
            count: filteredBins.length,
        })
    } catch (error) {
        console.error("[v0] Error fetching recycling bins:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch recycling bins" }, { status: 500 })
    }
}
