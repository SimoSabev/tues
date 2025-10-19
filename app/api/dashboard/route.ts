export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

// GET: Fetch dashboard data for the current user
export async function GET() {
    try {
        const clerkUser = await currentUser()
        if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const userId = clerkUser.id

        // Get user data
        const user = await prisma.user.findUnique({ where: { id: userId } })

        // Get recent uploads
        const recentUploads = await prisma.upload.findMany({
            where: { userId },
            orderBy: { uploadedAt: "desc" },
            take: 4,
        })

        // Get user rank (count users with more points)
        const usersWithMorePoints = await prisma.user.count({
            where: { points: { gt: user?.points ?? 0 } },
        })
        const rank = usersWithMorePoints + 1

        // Get total items recycled
        const totalItems = await prisma.upload.count({ where: { userId } })

        return NextResponse.json({
            points: user?.points ?? 0,
            rank,
            totalItems,
            recentUploads,
        })
    } catch (error: any) {
        console.error("Dashboard fetch error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
