export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// POST: Upload file + save to Prisma + add points
export async function POST(req: Request) {
    try {
        const clerkUser = await currentUser()
        if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const userId = clerkUser.id
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || "no-email@example.com"
        const name = clerkUser.fullName || clerkUser.username || "Anonymous"

        // Ensure user exists
        let user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) user = await prisma.user.create({ data: { id: userId, email, name } })

        const formData = await req.formData()
        const file = formData.get("file") as File
        if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 })

        const fileExt = file.name.split(".").pop()
        const filePath = `${userId}/${Date.now()}.${fileExt}`

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const { error: uploadError } = await supabase.storage
            .from("recycling_uploads")
            .upload(filePath, buffer, { contentType: file.type })

        if (uploadError) throw uploadError

        const { data: publicData } = supabase.storage.from("recycling_uploads").getPublicUrl(filePath)

        const fileUrl = publicData.publicUrl

        // Save upload in DB
        const upload = await prisma.upload.create({
            data: {
                userId,
                fileName: file.name,
                fileUrl,
                fileType: file.type,
                fileSize: file.size,
            },
        })

        // Add points
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { points: { increment: 10 } },
        })

        return NextResponse.json({ success: true, upload, newPoints: updatedUser.points })
    } catch (error: any) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// GET: Fetch uploads for the current user
export async function GET() {
    try {
        const clerkUser = await currentUser()
        if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const uploads = await prisma.upload.findMany({
            where: { userId: clerkUser.id },
            orderBy: { uploadedAt: "desc" },
        })

        const user = await prisma.user.findUnique({ where: { id: clerkUser.id } })

        return NextResponse.json({ uploads, points: user?.points ?? 0 })
    } catch (error: any) {
        console.error("Fetch uploads error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
