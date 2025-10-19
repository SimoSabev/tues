"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, CheckCircle2, Loader2, Recycle, Video } from "lucide-react"
import Link from "next/link"

type UploadStatus = "idle" | "uploading" | "scanning" | "approved" | "rejected"

export default function UploadPage() {
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

    // Simulate upload process
    setUploadStatus("uploading")
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate scanning
    setUploadStatus("scanning")
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Simulate approval and points
    setUploadStatus("approved")
    const points = Math.floor(Math.random() * 50) + 20
    setPointsEarned(points)
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
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-emerald-900">Sortify</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/map" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                Map
              </Link>
              <Link href="/upload" className="text-emerald-900 font-medium">
                Upload
              </Link>
              <Link href="/leaderboard" className="text-emerald-700 hover:text-emerald-900 transition-colors">
                Leaderboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-2">Upload & Earn Points</h2>
          <p className="text-emerald-700">Scan your recycling to verify and earn eco points</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-emerald-900">Upload Photo or Video</CardTitle>
                <CardDescription>Take a photo or video of your recycling items for verification</CardDescription>
              </CardHeader>
              <CardContent>
                {!previewUrl ? (
                  <label className="block">
                    <input type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
                    <div className="border-2 border-dashed border-emerald-300 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-emerald-600" />
                      </div>
                      <p className="text-lg font-medium text-emerald-900 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-emerald-600">PNG, JPG, MP4 up to 10MB</p>
                    </div>
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
                    {uploadStatus === "uploading" && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <div>
                          <p className="font-medium text-blue-900">Uploading...</p>
                          <p className="text-sm text-blue-600">Please wait</p>
                        </div>
                      </div>
                    )}

                    {uploadStatus === "scanning" && (
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                        <div>
                          <p className="font-medium text-yellow-900">Scanning & Analyzing...</p>
                          <p className="text-sm text-yellow-600">AI is verifying your recycling</p>
                        </div>
                      </div>
                    )}

                    {uploadStatus === "approved" && (
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <div className="flex-1">
                          <p className="font-medium text-emerald-900">Approved!</p>
                          <p className="text-sm text-emerald-600">Your recycling has been verified</p>
                        </div>
                        <Badge className="bg-emerald-600 text-white text-lg px-4 py-2">+{pointsEarned} pts</Badge>
                      </div>
                    )}

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
          </div>

          {/* Info & Tips */}
          <div className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-emerald-900">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-900">Take a Photo</p>
                    <p className="text-sm text-emerald-600">Capture a clear image of your recycling items</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-900">AI Verification</p>
                    <p className="text-sm text-emerald-600">Our system analyzes and verifies your recycling</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-900">Earn Points</p>
                    <p className="text-sm text-emerald-600">Get eco points added to your account instantly</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-600 to-emerald-700 border-0 text-white">
              <CardHeader>
                <CardTitle className="text-white">Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-200 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-teal-50">Ensure good lighting for clear photos</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-200 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-teal-50">Show the full item and any recycling symbols</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-200 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-teal-50">Clean items before photographing</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-200 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-teal-50">Multiple items in one photo earn more points</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
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
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
                    <span className="text-sm font-medium text-emerald-900">{item.type}</span>
                    <Badge className="bg-emerald-600 text-white">{item.points} pts</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
