"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";

export default function UploadForm() {
    const { user } = useUser();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [points, setPoints] = useState<number | null>(null);

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first!");
        if (!user) return alert("You need to sign in first!");

        setUploading(true);
        setSuccess(false);

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setUploading(false);

        if (res.ok) {
            setSuccess(true);
            setPoints(data.newPoints);
            setFile(null);
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6">
            <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-lg flex flex-col items-center text-center text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 mb-6 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                >
                    {success ? (
                        <CheckCircle className="w-10 h-10 text-white" />
                    ) : uploading ? (
                        <Loader2 className="w-10 h-10 animate-spin text-white" />
                    ) : (
                        <UploadCloud className="w-10 h-10 text-white" />
                    )}
                </motion.div>

                <h1 className="text-2xl font-bold mb-2">Upload Your File</h1>
                <p className="text-white/70 mb-6 text-sm">
                    Earn <span className="text-purple-400 font-semibold">+10 points</span> each time you upload!
                </p>

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg px-4 py-3 mb-4 text-sm transition"
                >
                    {file ? file.name : "Choose a file"}
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                </label>

                <button
                    onClick={handleUpload}
                    disabled={uploading || !file}
                    className={`px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 ${
                        uploading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                    }`}
                >
                    {uploading ? "Uploading..." : success ? "Uploaded!" : "Upload File"}
                </button>

                {success && (
                    <motion.div
                        className="mt-6 text-sm text-green-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        🎉 Upload successful! You now have{" "}
                        <span className="font-semibold text-white">{points}</span> points.
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
