"use client";

import React, { useState, useRef } from "react";
import {
  UploadIcon,
  ImageIcon,
  DownloadIcon,
  SparklesIcon,
  PaintBucket,
  Zap,
} from "lucide-react";

export default function BgRemovalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isTransparent, setIsTransparent] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const colorPalette = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
    "#facc15", "#ec4899", "#14b8a6", "#9333ea", "#94a3b8"
  ];

  // When user selects or drops image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setFile(selectedFile);
      setIsUploading(false);
      setProcessedUrl(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Apply background (processing phase)
  const handleApply = async () => {
    if (!file) return alert("Please select an image first.");
    setIsProcessing(true);
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
      setProcessedUrl(data.secure_url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download
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
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Background Customizer
          </h1>
          <p className="text-base text-base-content/70 mt-2">
            Instantly remove or replace your image background with color or keep it transparent.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Card */}
          <div className="bg-base-100/90 backdrop-blur-md rounded-xl shadow-md border border-base-300/20 p-4 flex flex-col">
            <div className="flex items-center mb-3">
              <UploadIcon className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-base-content">Upload & Customize</h2>
            </div>

            {/* File Input */}
            <div className="relative mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  isUploading
                    ? "border-primary bg-primary/5 animate-pulse"
                    : "border-base-300 hover:border-primary hover:bg-primary/5"
                }`}
              >
                {isUploading ? (
                  <div className="space-y-1">
                    <Zap className="w-6 h-6 text-primary mx-auto animate-spin" />
                    <p className="text-sm font-medium text-primary">Uploading...</p>
                  </div>
                ) : uploadedImage ? (
                  <div className="space-y-2">
                    <img
                      src={uploadedImage}
                      alt="preview"
                      className="w-32 h-32 object-cover rounded-md mx-auto"
                    />
                    <p className="text-xs text-base-content/60">Ready to process</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <ImageIcon className="w-8 h-8 text-base-content/50 mx-auto" />
                    <p className="text-sm text-base-content">Click or drop an image</p>
                    <p className="text-xs text-base-content/60">JPG, PNG, WebP max 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Color Picker */}
            <div className="mt-4">
              <label className="block font-semibold text-base-content mb-2">
                Choose Background
              </label>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setIsTransparent(false);
                  }}
                  disabled={isTransparent}
                  className="w-10 h-10 rounded-full border border-base-300 cursor-pointer"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTransparent}
                    onChange={(e) => {
                      setIsTransparent(e.target.checked);
                      if (e.target.checked) setBgColor("transparent");
                      else setBgColor("#ffffff");
                    }}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm">No background (transparent)</span>
                </label>
              </div>

              {/* Color Palette */}
              <div className="grid grid-cols-5 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      bgColor === color && !isTransparent
                        ? "border-primary scale-110"
                        : "border-base-300"
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
              onClick={handleApply}
              disabled={!uploadedImage || isProcessing}
              className="btn btn-primary mt-6 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <PaintBucket className="w-4 h-4" />
              Apply Background
            </button>
          </div>

          {/* Preview Card */}
          <div className="bg-base-100/90 backdrop-blur-md rounded-xl shadow-md border border-base-300/20 p-4 flex flex-col">
            <div className="flex items-center mb-3">
              <SparklesIcon className="w-5 h-5 text-accent mr-2" />
              <h2 className="text-lg font-semibold text-base-content">Preview & Download</h2>
            </div>

            {processedUrl ? (
              <div className="flex flex-col space-y-3">
                <div
                  className={`relative rounded-lg p-1 flex items-center justify-center min-h-[200px] ${
                    isTransparent
                      ? "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><rect width=%2210%22 height=%2210%22 fill=%22%23ccc%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23ccc%22/></svg>')] bg-[length:20px_20px]"
                      : "bg-base-200/50"
                  }`}
                >
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm rounded-lg z-10">
                      <Zap className="w-8 h-8 text-primary animate-spin" />
                      <span className="ml-2 text-sm font-medium text-primary">Processing...</span>
                    </div>
                  )}
                  <img
                    ref={imageRef}
                    src={processedUrl}
                    alt="Processed"
                    className="rounded-lg object-contain shadow-sm max-h-[350px]"
                  />
                </div>

                <button
                  onClick={handleDownload}
                  className="btn btn-primary w-full text-sm flex items-center justify-center gap-1"
                  disabled={isProcessing}
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-base-content/60">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium text-sm">No processed image</p>
                <p className="text-xs">Upload and apply to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
