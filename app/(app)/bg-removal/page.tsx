"use client";

import React, { useState, useRef } from "react";
import { UploadIcon, ImageIcon, DownloadIcon, SparklesIcon, PaintBucket } from "lucide-react";

export default function BgRemovalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isTransparent, setIsTransparent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const colorPalette = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
    "#facc15", "#ec4899", "#14b8a6", "#9333ea", "#94a3b8"
  ];

  // Upload & process
  const handleUpload = async () => {
    if (!file) return alert("Please select an image first.");
    setLoading(true);
    setProcessedUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bgColor", bgColor);
    formData.append("isTransparent", isTransparent.toString());

    try {
      const res = await fetch("/api/bg-removal", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process image");
      setUploadedImage(data.public_id);
      setProcessedUrl(data.secure_url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Download function (like Social Creator)
  const handleDownload = () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `background-${isTransparent ? "transparent" : bgColor}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-200 via-base-300 to-base-200">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.05),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.03),transparent_40%)]"></div>

      <div className="relative container mx-auto px-6 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-4 shadow-2xl">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Background Customizer
            </h1>
          </div>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Instantly remove or replace your image background with color or keep it transparent.
          </p>
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload + Controls */}
          <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <UploadIcon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">Upload & Customize</h2>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full mb-6"
            />

            {/* Color Picker */}
            <div className="mb-6">
              <label className="block font-semibold text-base-content mb-2">
                Choose Background
              </label>
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  disabled={isTransparent}
                  className="w-12 h-12 rounded-full border border-base-300 cursor-pointer"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTransparent}
                    onChange={(e) => setIsTransparent(e.target.checked)}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm">No background (transparent)</span>
                </label>
              </div>

              {/* Color Palette */}
              <div className="flex flex-wrap gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      bgColor === color && !isTransparent
                        ? "border-primary scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setBgColor(color);
                      setIsTransparent(false);
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn btn-primary w-full text-lg font-semibold flex items-center justify-center gap-2"
            >
              <PaintBucket className="w-5 h-5" />
              {loading ? "Processing..." : "Apply Background"}
            </button>
          </div>

          {/* Preview + Download */}
          <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-3">
                <ImageIcon className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">Preview & Download</h2>
            </div>

            {processedUrl ? (
              <div className="space-y-6">
                <div className="bg-base-300/20 p-4 rounded-2xl flex justify-center">
                  <img
                    ref={imageRef}
                    src={processedUrl}
                    alt="Processed"
                    className="rounded-xl shadow-lg max-h-[400px] object-contain"
                  />
                </div>

                <button
                  onClick={handleDownload}
                  className="btn btn-primary w-full text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Download Image
                </button>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto bg-base-300/40 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-10 h-10 text-base-content/50" />
                </div>
                <p className="text-base-content/70">Upload an image to preview and download</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
