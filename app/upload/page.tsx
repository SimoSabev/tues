"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, CheckCircle2, Loader2, Recycle, Video } from "lucide-react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface UploadData {
    uploads: Array<{
        id: string
        fileName: string
        fileUrl: string
        uploadedAt: string
    }>
    points: number
}

type UploadStatus = "idle" | "uploading" | "scanning" | "approved" | "rejected"

export default function UploadPage() {
    const { data, error, mutate } = useSWR<UploadData>("/api/upload", fetcher)

    const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [pointsEarned, setPointsEarned] = useState(0)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            setUploadStatus("idle")
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        setUploadStatus("uploading")

        const formData = new FormData()
        formData.append("file", selectedFile)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const result = await res.json()

            if (res.ok) {
                setUploadStatus("scanning")
                await new Promise((resolve) => setTimeout(resolve, 2000))

                setUploadStatus("approved")
                setPointsEarned(10)

                // Refresh the upload list
                mutate()
            } else {
                alert(`Error: ${result.error}`)
                setUploadStatus("idle")
            }
        } catch (error) {
            console.error("Upload failed:", error)
            alert("Upload failed. Please try again.")
            setUploadStatus("idle")
        }
    }

    const handleReset = () => {
        setUploadStatus("idle")
        setSelectedFile(null)
        setPreviewUrl(null)
        setPointsEarned(0)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Header */}
            <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Recycle className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                                    Sortex
                                </h1>
                                <p className="text-xs text-emerald-600">Recycle Smarter</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-2">
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/map"
                                className="px-4 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all"
                            >
                                Map
                            </Link>
                            <Link
                                href="/upload"
                                className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-900 font-medium transition-all"
                            >
                                Upload
                            </Link>
                            <Link
                                href="/leaderboard"
                                className="px-4 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all"
                            >
                                Leaderboard
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <UserButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-3xl font-bold text-emerald-900 mb-2">Upload & Earn Points</h2>
                    <p className="text-emerald-700">Scan your recycling to verify and earn eco points</p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Upload Area */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Card className="bg-white shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-emerald-900">Upload Photo or Video</CardTitle>
                                <CardDescription>Take a photo or video of your recycling items for verification</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!previewUrl ? (
                                    <label className="block">
                                        <input type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
                                        <motion.div
                                            className="border-2 border-dashed border-emerald-300 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                                <Upload className="w-8 h-8 text-emerald-600" />
                                            </div>
                                            <p className="text-lg font-medium text-emerald-900 mb-2">Click to upload or drag and drop</p>
                                            <p className="text-sm text-emerald-600">PNG, JPG, MP4 up to 10MB</p>
                                        </motion.div>
                                    </label>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Preview */}
                                        <div className="relative rounded-xl overflow-hidden bg-emerald-50 border-2 border-emerald-200">
                                            {selectedFile?.type.startsWith("video/") ? (
                                                <div className="aspect-video flex items-center justify-center">
                                                    <Video className="w-16 h-16 text-emerald-600" />
                                                </div>
                                            ) : (
                                                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-auto" />
                                            )}
                                        </div>

                                        {/* Status Display */}
                                        <AnimatePresence mode="wait">
                                            {uploadStatus === "uploading" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                                                >
                                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                                    <div>
                                                        <p className="font-medium text-blue-900">Uploading...</p>
                                                        <p className="text-sm text-blue-600">Please wait</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {uploadStatus === "scanning" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                                                >
                                                    <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                                                    <div>
                                                        <p className="font-medium text-yellow-900">Scanning & Analyzing...</p>
                                                        <p className="text-sm text-yellow-600">AI is verifying your recycling</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {uploadStatus === "approved" && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-emerald-900">Approved!</p>
                                                        <p className="text-sm text-emerald-600">Your recycling has been verified</p>
                                                    </div>
                                                    <Badge className="bg-emerald-600 text-white text-lg px-4 py-2">+{pointsEarned} pts</Badge>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            {uploadStatus === "idle" && (
                                                <>
                                                    <Button onClick={handleUpload} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                                        <Camera className="w-4 h-4 mr-2" />
                                                        Scan & Verify
                                                    </Button>
                                                    <Button
                                                        onClick={handleReset}
                                                        variant="outline"
                                                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            {uploadStatus === "approved" && (
                                                <Button onClick={handleReset} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                    Upload Another
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Info & Tips */}
                    <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Card className="bg-white shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-emerald-900">How It Works</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    {
                                        step: "1",
                                        title: "Take a Photo",
                                        desc: "Capture a clear image of your recycling items",
                                    },
                                    {
                                        step: "2",
                                        title: "AI Verification",
                                        desc: "Our system analyzes and verifies your recycling",
                                    },
                                    {
                                        step: "3",
                                        title: "Earn Points",
                                        desc: "Get eco points added to your account instantly",
                                    },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex gap-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-emerald-600 font-bold">{item.step}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-emerald-900">{item.title}</p>
                                            <p className="text-sm text-emerald-600">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-teal-600 to-emerald-700 border-0 text-white shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-white">Tips for Best Results</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    "Ensure good lighting for clear photos",
                                    "Show the full item and any recycling symbols",
                                    "Clean items before photographing",
                                    "Multiple items in one photo earn more points",
                                ].map((tip, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start gap-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-teal-200 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-teal-50">{tip}</p>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-emerald-900">Point Values</CardTitle>
                                <CardDescription>Earn points based on item type</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    { type: "Plastic bottles", points: "20-30" },
                                    { type: "Glass containers", points: "30-40" },
                                    { type: "Paper/Cardboard", points: "15-25" },
                                    { type: "Metal cans", points: "25-35" },
                                    { type: "E-waste", points: "40-60" },
                                    { type: "Textiles", points: "30-50" },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg bg-emerald-50"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <span className="text-sm font-medium text-emerald-900">{item.type}</span>
                                        <Badge className="bg-emerald-600 text-white">{item.points} pts</Badge>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-white shadow-xl">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-emerald-900 text-2xl">Your Uploads</CardTitle>
                                    <CardDescription className="text-emerald-600">
                                        History of your recycling contributions
                                    </CardDescription>
                                </div>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2">
                                    {data?.uploads?.length ?? 0} total uploads
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!data ? (
                                <div className="text-center py-8 text-emerald-600">Loading your uploads...</div>
                            ) : data.uploads.length === 0 ? (
                                <div className="text-center py-8 text-emerald-600">No uploads yet. Start uploading to earn points!</div>
                            ) : (
                                <div className="space-y-3">
                                    {data.uploads.map((upload, index) => (
                                        <motion.div
                                            key={upload.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                                                    <Recycle className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-emerald-900">{upload.fileName}</p>
                                                    <p className="text-sm text-emerald-600">{new Date(upload.uploadedAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2">
                                                +10 pts
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    )
}
