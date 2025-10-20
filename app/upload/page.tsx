"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, CheckCircle2, Loader2, Recycle, Video, AlertCircle, Sparkles, Zap, Star } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface UploadData {
    uploads: Array<{
        id: string
        fileName: string
        fileUrl: string
        uploadedAt: string
        recyclingType: string
        pointsEarned: number
    }>
    points: number
}

type UploadStatus = "idle" | "uploading" | "scanning" | "approved" | "rejected"

const RECYCLING_TYPES = [
    { id: "plastic", label: "Plastic bottles", points: 25, color: "from-amber-500 to-orange-500" },
    { id: "glass", label: "Glass containers", points: 35, color: "from-emerald-500 to-teal-500" },
    { id: "paper", label: "Paper/Cardboard", points: 20, color: "from-blue-500 to-cyan-500" },
    { id: "metal", label: "Metal cans", points: 30, color: "from-slate-500 to-zinc-500" },
    { id: "ewaste", label: "E-waste", points: 50, color: "from-rose-500 to-pink-500" },
    { id: "textile", label: "Textiles", points: 40, color: "from-violet-500 to-purple-500" },
]

export default function UploadPage() {
    const { data, error, mutate } = useSWR<UploadData>("/api/upload", fetcher)

    const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [pointsEarned, setPointsEarned] = useState(0)
    const [selectedType, setSelectedType] = useState<string>("plastic")

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
        formData.append("recyclingType", selectedType)

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
                setPointsEarned(result.pointsEarned)
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

    const selectedTypeDetails = RECYCLING_TYPES.find((t) => t.id === selectedType)

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
            <AppHeader />

            <main className="container mx-auto px-4 lg:px-8 py-12">
                <motion.div className="mb-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4"
                    >
                        <Camera className="h-4 w-4 text-accent" />
                        <span className="text-sm font-semibold text-accent">Scan & Earn</span>
                    </motion.div>
                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-3 text-balance">
                        Upload & Earn Points
                    </h1>
                    <p className="text-xl text-muted-foreground text-pretty">
                        Scan your recycling to verify and earn eco points instantly
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="border-2 shadow-xl bg-gradient-to-br from-card to-secondary/20 overflow-hidden">
                            <CardHeader className="border-b bg-card/50 backdrop-blur-sm">
                                <CardTitle className="text-2xl">Upload Photo or Video</CardTitle>
                                <CardDescription className="text-base">
                                    Take a photo or video of your recycling items for verification
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-lg font-semibold">Select Recycling Type</Label>
                                        {selectedTypeDetails && (
                                            <Badge className={`bg-gradient-to-r ${selectedTypeDetails.color} text-white px-3 py-1 shadow-md`}>
                                                {selectedTypeDetails.points} pts
                                            </Badge>
                                        )}
                                    </div>
                                    <RadioGroup value={selectedType} onValueChange={setSelectedType} className="grid grid-cols-2 gap-3">
                                        {RECYCLING_TYPES.map((type) => (
                                            <motion.div
                                                key={type.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="relative"
                                            >
                                                <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                                                <Label
                                                    htmlFor={type.id}
                                                    className="flex flex-col items-center justify-center rounded-xl border-2 border-border bg-card p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                                >
                                                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${type.color} mb-2 shadow-sm`} />
                                                    <span className="text-sm font-medium text-center leading-tight">{type.label}</span>
                                                    <span className="text-xs text-muted-foreground mt-1">{type.points} pts</span>
                                                </Label>
                                            </motion.div>
                                        ))}
                                    </RadioGroup>
                                </div>

                                {!previewUrl ? (
                                    <label className="block">
                                        <input type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
                                        <motion.div
                                            whileHover={{ scale: 1.02, borderColor: "var(--color-primary)" }}
                                            whileTap={{ scale: 0.98 }}
                                            className="border-2 border-dashed border-border rounded-2xl p-16 text-center cursor-pointer hover:bg-secondary/50 transition-all group"
                                        >
                                            <motion.div
                                                animate={{ y: [0, -10, 0] }}
                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-chart-2 mx-auto mb-6 shadow-lg group-hover:shadow-xl"
                                            >
                                                <Upload className="h-10 w-10 text-accent-foreground" />
                                            </motion.div>
                                            <p className="text-xl font-semibold text-foreground mb-2">Click to upload or drag and drop</p>
                                            <p className="text-base text-muted-foreground">PNG, JPG, MP4 up to 10MB</p>
                                        </motion.div>
                                    </label>
                                ) : (
                                    <div className="space-y-6">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative rounded-2xl overflow-hidden bg-muted border-2 border-border shadow-lg"
                                        >
                                            {selectedFile?.type.startsWith("video/") ? (
                                                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                                                    <div className="text-center">
                                                        <Video className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                                                        <p className="text-sm text-muted-foreground">Video selected</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-auto" />
                                            )}
                                        </motion.div>

                                        <AnimatePresence mode="wait">
                                            {uploadStatus === "uploading" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-4 p-5 bg-gradient-to-r from-chart-2/10 to-accent/10 border-2 border-chart-2/30 rounded-2xl"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    >
                                                        <Loader2 className="w-6 h-6 text-chart-2" />
                                                    </motion.div>
                                                    <div>
                                                        <p className="font-semibold text-foreground text-lg">Uploading...</p>
                                                        <p className="text-sm text-muted-foreground">Please wait while we process your file</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {uploadStatus === "scanning" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-4 p-5 bg-gradient-to-r from-warning/10 to-chart-4/10 border-2 border-warning/30 rounded-2xl"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    >
                                                        <Sparkles className="w-6 h-6 text-warning" />
                                                    </motion.div>
                                                    <div>
                                                        <p className="font-semibold text-foreground text-lg">Scanning & Analyzing...</p>
                                                        <p className="text-sm text-muted-foreground">AI is verifying your recycling items</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {uploadStatus === "approved" && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="flex items-center gap-4 p-5 bg-gradient-to-r from-success/10 to-chart-3/10 border-2 border-success/30 rounded-2xl"
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1, rotate: 360 }}
                                                        transition={{ type: "spring", stiffness: 200 }}
                                                    >
                                                        <CheckCircle2 className="w-6 h-6 text-success" />
                                                    </motion.div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-foreground text-lg">Approved!</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Your recycling has been verified successfully
                                                        </p>
                                                    </div>
                                                    <Badge className="bg-gradient-to-r from-success to-chart-3 text-success-foreground text-base px-4 py-2 shadow-lg">
                                                        <Star className="h-4 w-4 mr-1" />+{pointsEarned} pts
                                                    </Badge>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="flex gap-3">
                                            {uploadStatus === "idle" && (
                                                <>
                                                    <Button onClick={handleUpload} className="flex-1 h-14 text-base shadow-lg" size="lg">
                                                        <Camera className="w-5 h-5 mr-2" />
                                                        Scan & Verify
                                                    </Button>
                                                    <Button
                                                        onClick={handleReset}
                                                        variant="outline"
                                                        size="lg"
                                                        className="h-14 text-base bg-transparent"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            {uploadStatus === "approved" && (
                                                <Button onClick={handleReset} className="w-full h-14 text-base shadow-lg" size="lg">
                                                    <Upload className="w-5 h-5 mr-2" />
                                                    Upload Another
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-2 shadow-lg bg-gradient-to-br from-card to-secondary/20">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-2xl">How It Works</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    {
                                        step: "1",
                                        title: "Select Type",
                                        desc: "Choose what type of recycling you're uploading",
                                        color: "from-primary to-accent",
                                    },
                                    {
                                        step: "2",
                                        title: "Take a Photo",
                                        desc: "Capture a clear image of your recycling items",
                                        color: "from-accent to-chart-2",
                                    },
                                    {
                                        step: "3",
                                        title: "Earn Points",
                                        desc: "Get eco points based on the item type",
                                        color: "from-success to-chart-3",
                                    },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        whileHover={{ x: 8 }}
                                        className="flex gap-4 p-4 rounded-xl bg-card border hover:border-primary/40 transition-all"
                                    >
                                        <div
                                            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} flex-shrink-0 shadow-lg`}
                                        >
                                            <span className="text-white font-bold text-xl">{item.step}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground text-lg mb-1">{item.title}</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-2 shadow-lg bg-gradient-to-br from-primary to-accent text-primary-foreground overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <CardHeader className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-5 w-5" />
                                    <CardTitle className="text-2xl">Tips for Best Results</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 relative">
                                {[
                                    "Ensure good lighting for clear photos",
                                    "Show the full item and any recycling symbols",
                                    "Clean items before photographing",
                                    "Multiple items in one photo earn more points",
                                ].map((tip, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm"
                                    >
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm leading-relaxed">{tip}</p>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-2 shadow-lg bg-gradient-to-br from-card to-secondary/20">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="h-5 w-5 text-accent" />
                                    <CardTitle className="text-2xl">Point Values</CardTitle>
                                </div>
                                <CardDescription className="text-base">Earn points based on item type</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {RECYCLING_TYPES.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + index * 0.05 }}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        className="flex items-center justify-between p-4 rounded-xl bg-card border-2 hover:border-primary/40 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.color} shadow-md`} />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        <Badge variant="outline" className="text-sm px-3 py-1">
                                            {item.points} pts
                                        </Badge>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {data && data.uploads.length > 0 && (
                        <Card className="mt-6 bg-gradient-to-br from-muted/50 to-background border-2 border-border/40 shadow-xl rounded-2xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary">
                                    <Recycle className="h-5 w-5 text-accent" /> Your Uploads
                                </CardTitle>
                                <CardDescription>Check your recent recycling contributions</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.uploads.map((upload) => {
                                        const typeInfo = RECYCLING_TYPES.find((t) => t.id === upload.recyclingType)
                                        const pointsToShow = upload.pointsEarned ?? typeInfo?.points ?? 0


                                        return (
                                            <Card
                                                key={upload.id}
                                                className="overflow-hidden border border-border/40 bg-card/60 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                            >
                                                <CardHeader className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {typeInfo && (
                                                                <Badge
                                                                    className="text-sm px-3 py-1 bg-gradient-to-r text-white"
                                                                    style={{
                                                                        backgroundImage: `linear-gradient(to right, var(--${typeInfo?.color?.replace('from-', '').replace(' to-', ', var(--') || 'primary, accent'})`,
                                                                    }}
                                                                >
                                                                    {typeInfo?.label}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-base px-4 py-2 shadow-md">
                                                            <Sparkles className="h-4 w-4 mr-1" />
                                                            +{pointsToShow} pts
                                                        </Badge>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="p-4 space-y-3">
                                                    {upload.fileUrl && (
                                                        <img
                                                            src={upload.fileUrl}
                                                            alt={upload.fileName}
                                                            className="w-full h-40 object-cover rounded-lg shadow-md border border-border/30"
                                                        />
                                                    )}
                                                    <div className="flex justify-between text-sm text-muted-foreground">
                                                        <span>{upload.fileName}</span>
                                                        <span>
                                                            {new Date(upload.uploadedAt).toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "2-digit",
                                                            })}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </main>
        </div>
    )
}
