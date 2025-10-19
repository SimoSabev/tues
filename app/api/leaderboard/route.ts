export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

// GET: Fetch leaderboard data
export async function GET() {
    try {
        const clerkUser = await currentUser()

        // Get top users
        const topUsers = await prisma.user.findMany({
            orderBy: { points: "desc" },
            take: 50,
            select: {
                id: true,
                name: true,
                points: true,
                _count: {
                    select: { uploads: true },
                },
            },
        })

        // Format leaderboard data
        const leaderboard = topUsers.map((user, index) => ({
            id: user.id,
            name: user.name,
            points: user.points,
            rank: index + 1,
            recycled: user._count.uploads,
            isCurrentUser: clerkUser ? user.id === clerkUser.id : false,
        }))

        return NextResponse.json({ leaderboard })
    } catch (error: any) {
        console.error("Leaderboard fetch error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
