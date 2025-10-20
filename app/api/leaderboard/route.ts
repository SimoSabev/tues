import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser, clerkClient } from "@clerk/nextjs/server"
import type { User } from "@clerk/nextjs/server"

export async function GET() {
    try {
        const clerkUser = await currentUser()

        const topUsers = await prisma.user.findMany({
            orderBy: { points: "desc" },
            take: 50,
            include: {
                _count: {
                    select: { uploads: true },
                },
            },
        })

        // Get Clerk profiles by IDs
        const clerkIds = topUsers.map((u) => u.id).filter(Boolean)
        const client = await clerkClient()
        const clerkProfilesResponse =
            clerkIds.length > 0
                ? await client.users.getUserList({ userId: clerkIds })
                : null

        const clerkProfiles: User[] = clerkProfilesResponse?.data ?? []

        const profileMap = Object.fromEntries(
            clerkProfiles.map((u: User) => [
                u.id,
                { name: u.fullName, imageUrl: u.imageUrl },
            ])
        )

        const leaderboard = topUsers.map((user, index) => ({
            id: user.id,
            name: profileMap[user.id]?.name || user.name || "Unknown User",
            imageUrl: profileMap[user.id]?.imageUrl || null,
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