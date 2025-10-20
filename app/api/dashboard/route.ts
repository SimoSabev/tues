export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

// GET: Fetch dashboard data for the current user
export async function GET() {
    try {
        console.log("[v0] Dashboard API called")
        const clerkUser = await currentUser()
        if (!clerkUser) {
            console.log("[v0] No authenticated user")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = clerkUser.id
        console.log("[v0] Fetching dashboard data for user:", userId)

        // Ensure user exists in database
        let user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            console.log("[v0] User not found in database, creating...")
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
                    points: 0,
                },
            })
        }

        const recentUploads = await prisma.upload.findMany({
            where: { userId },
            orderBy: { uploadedAt: "desc" },
            take: 4,
            select: {
                id: true,
                fileName: true,
                uploadedAt: true,
                pointsEarned: true,
                recyclingType: true,
            },
        })
        console.log("[v0] Recent uploads:", recentUploads)

        // Get user rank (count users with more points)
        const usersWithMorePoints = await prisma.user.count({
            where: { points: { gt: user.points } },
        })
        const rank = usersWithMorePoints + 1
        console.log("[v0] User rank:", rank)

        // Get total items recycled
        const totalItems = await prisma.upload.count({ where: { userId } })
        console.log("[v0] Total items:", totalItems)

        return NextResponse.json({
            points: user.points,
            rank,
            totalItems,
            recentUploads,
        })
    } catch (error: any) {
        console.error("[v0] Dashboard fetch error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
