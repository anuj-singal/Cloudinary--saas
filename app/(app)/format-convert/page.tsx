"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import {
  UploadIcon,
  DownloadIcon,
  Zap,
  FileIcon,
  RefreshCcw,
  ImageIcon,
} from "lucide-react";

const formats = ["jpg", "png", "webp", "avif", "heic"];

export default function FormatConvertPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("webp");
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // ---- Upload Function ----
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // ✅ Correct API route (you created app/api/upload/route.ts)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUploadedImage(data.publicId); // use publicId from upload route
      setConvertedImage(null);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // ---- Convert Function ----
  const handleConvert = async () => {
    if (!uploadedImage) return;
    setIsConverting(true);

    try {
      const res = await axios.post("/api/format-convert", {
        public_id: uploadedImage,
        resource_type: "image",
        targetFormat: selectedFormat,
      });

      if (res.data?.url) {
        setConvertedImage(res.data.url);
      } else {
        throw new Error("No converted image URL received.");
      }
    } catch (error) {
      console.error(error);
      alert("Conversion failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  // ---- Download ----
  const handleDownload = () => {
      if(!imageRef.current) return;

      fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
        .replace(/\s+/g, "_")
        .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 py-16 relative overflow-hidden">
      {/* Floating Blurs */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
              <RefreshCcw className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Format Converter
          </h1>
          <p className="text-lg text-base-content/70 mt-3">
            Convert your images between popular formats instantly with Cloudinary
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Upload Panel */}
          <div className="bg-base-100/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-base-300/20">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <UploadIcon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Upload an Image</h2>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleFileUpload}
              />
              <div
                className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isUploading
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-primary hover:bg-primary/5"
                }`}
              >
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-spin">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-semibold text-primary">
                      Uploading...
                    </p>
                    <progress className="progress progress-primary w-full"></progress>
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 mx-auto bg-base-300/50 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-base-content/70" />
                    </div>
                    <p className="font-semibold text-base-content">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-sm text-base-content/60">
                      JPG, PNG, WebP, AVIF (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {uploadedImage && (
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  Select Format:
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {formats.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        selectedFormat === fmt
                          ? "bg-primary text-white shadow-md"
                          : "bg-base-200 hover:bg-base-300"
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConvert}
                  className="w-full mt-6 btn btn-primary text-lg flex items-center justify-center gap-2"
                  disabled={isConverting}
                >
                  <FileIcon className="w-5 h-5" />
                  {isConverting ? "Converting..." : "Convert Format"}
                </button>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="bg-base-100/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-base-300/20">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mr-3">
                <DownloadIcon className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">Preview & Download</h2>
            </div>

            {convertedImage ? (
              <div className="space-y-6 text-center">
                <img
                  src={convertedImage}
                  alt="Converted Image"
                  ref={imageRef}
                  className="rounded-2xl shadow-lg mx-auto"
                  width={400}
                  height={400}
                />
                <button
                  className="btn btn-accent btn-lg w-full flex items-center justify-center gap-2"
                  onClick={handleDownload}
                >
                  <DownloadIcon className="w-5 h-5" /> Download{" "}
                  {selectedFormat.toUpperCase()}
                </button>
              </div>
            ) : uploadedImage ? (
              <div className="text-center py-20 opacity-70">
                {isConverting ? (
                  <div className="animate-pulse text-primary font-semibold text-lg">
                    Converting to {selectedFormat.toUpperCase()}...
                  </div>
                ) : (
                  <p>Click “Convert Format” to see result here</p>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-base-content/60">
                No image uploaded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
