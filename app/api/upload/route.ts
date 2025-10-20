import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// POINT MAP
const POINTS = {
    plastic: 25,
    glass: 35,
    paper: 20,
    metal: 30,
    ewaste: 50,
    textile: 40,
}

// ✅ GET uploads for current user
export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const uploads = await prisma.upload.findMany({
        where: { userId },
        orderBy: { uploadedAt: "desc" },
        select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileType: true,
            fileSize: true,
            recyclingType: true,
            pointsEarned: true,
            uploadedAt: true,
        },
    })

    const totalPoints = uploads.reduce((acc, cur) => acc + (cur.pointsEarned || 0), 0)

    return NextResponse.json({ uploads, points: totalPoints })
}

// ✅ POST new upload
export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File
    const recyclingType = formData.get("recyclingType") as string

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `user_${userId}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("recycling_uploads")
        .upload(filePath, buffer, { contentType: file.type })

    if (uploadError) {
        console.error(uploadError)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage.from("recycling_uploads").getPublicUrl(filePath)

    const pointsEarned = POINTS[recyclingType as keyof typeof POINTS] || 10

    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: "", // You may want to get this from Clerk
            points: 0,
        },
    })

    const newUpload = await prisma.upload.create({
        data: {
            userId,
            fileName,
            fileUrl: publicUrlData.publicUrl,
            fileType: file.type,
            fileSize: file.size,
            recyclingType,
            pointsEarned: pointsEarned, // Explicitly set the points
        },
    })

    await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: pointsEarned } },
    })

    return NextResponse.json({ success: true, ...newUpload })
}
