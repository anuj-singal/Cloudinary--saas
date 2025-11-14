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
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-12 px-4">
      {/* Header / Title Section */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Format Converter
        </h1>
        <p className="mt-3 text-base md:text-lg text-base-content/70">
          Upload your images and convert them to popular formats instantly with Cloudinary. 
          Supports JPG, PNG, WebP, AVIF, and HEIC formats.
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload + Convert Card */}
        <div className="bg-base-100/90 backdrop-blur-md rounded-2xl shadow-md border border-base-300/20 p-6 flex flex-col">
          <div className="flex items-center mb-4">
            <UploadIcon className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-semibold text-base-content">Upload Image</h2>
          </div>

          <div className="relative mb-4">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileUpload}
            />
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
                isUploading
                  ? "border-primary bg-primary/5 animate-pulse"
                  : "border-base-300 hover:border-primary hover:bg-primary/5"
              }`}
            >
              {isUploading ? (
                <div className="space-y-2">
                  <Zap className="w-6 h-6 text-primary mx-auto animate-spin" />
                  <p className="text-sm font-medium text-primary">Uploading...</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <ImageIcon className="w-8 h-8 text-base-content/50 mx-auto" />
                  <p className="text-sm text-base-content">Click or drop an image</p>
                  <p className="text-xs text-base-content/60">JPG, PNG, WebP, AVIF, HEIC max 10MB</p>
                </div>
              )}
            </div>
          </div>

          {uploadedImage && (
            <div className="mt-4">
              <h3 className="text-base font-semibold text-base-content mb-2">Select Format:</h3>
              <div className="flex flex-wrap gap-2 mb-4 text-base-content">
                {formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm"
                disabled={isConverting}
              >
                <FileIcon className="w-5 h-5" />
                {isConverting ? "Converting..." : "Convert Format"}
              </button>
            </div>
          )}
        </div>

        {/* Preview + Download Card */}
        <div className="bg-base-100/90 backdrop-blur-md rounded-2xl shadow-md border border-base-300/20 p-6 flex flex-col items-center">
          <div className="flex items-center mb-4">
            <DownloadIcon className="w-5 h-5 text-accent mr-2" />
            <h2 className="text-lg font-semibold text-base-content">Preview & Download</h2>
          </div>

          {convertedImage ? (
            <div className="space-y-4 text-center">
              <img
                src={convertedImage}
                ref={imageRef}
                alt="Converted"
                className="rounded-xl shadow-md mx-auto max-h-[400px] object-contain"
              />
              <button
                className="btn btn-accent w-full flex items-center justify-center gap-2"
                onClick={handleDownload}
              >
                <DownloadIcon className="w-5 h-5" /> Download {selectedFormat.toUpperCase()}
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
  );
}
