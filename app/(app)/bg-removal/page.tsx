"use client";

import React, { useState, useRef } from "react";
import {
  UploadIcon,
  TypeIcon,
  PaletteIcon,
  DownloadIcon,
  Zap,
  LayersIcon,
  SparklesIcon,
  ImageIcon,
} from "lucide-react";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("MyBrand");
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(40);
  const [position, setPosition] = useState("bottom-right");
  const [result, setResult] = useState<{ original: string; watermarked: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setIsUploading(true);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setTimeout(() => setIsUploading(false), 800);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    formData.append("color", color);
    formData.append("fontSize", fontSize.toString());
    formData.append("position", position);

    setIsProcessing(true);
    setResult(null);

    try {
      const res = await fetch("/api/watermark", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "watermarked_image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="w-full min-h-screen bg-base-200 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Text Watermark Creator
          </h1>
          <p className="text-base text-base-content/70 mt-3">
            Upload your image, customize your watermark, and download instantly.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload + Settings */}
          <div className="bg-base-100/90 backdrop-blur-md rounded-2xl shadow-lg border border-base-300/30 p-6 flex flex-col">
            <div className="flex items-center mb-3">
              <UploadIcon className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-base-content">Upload Image</h2>
            </div>

            <div className="relative mb-4">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
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
                ) : preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-xl max-h-56 mx-auto object-contain shadow-md"
                  />
                ) : (
                  <div className="space-y-1">
                    <LayersIcon className="w-8 h-8 text-base-content/50 mx-auto" />
                    <p className="text-sm text-base-content">Click or drop an image</p>
                    <p className="text-xs text-base-content/60">JPG, PNG, WebP up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {file && (
              <>
                <div className="mb-3">
                  <label className="mb-1 font-medium flex items-center">
                    <TypeIcon className="w-4 h-4 mr-2 text-secondary" /> Watermark Text
                  </label>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Enter text..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="mb-1 font-medium flex items-center">
                      <PaletteIcon className="w-4 h-4 mr-2 text-accent" /> Color
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-10 rounded cursor-pointer border border-base-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Font Size</label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Position</label>
                  <select
                    className="select select-bordered w-full"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="center">Center</option>
                  </select>
                </div>

                <button
                  onClick={handleUpload}
                  className="btn btn-primary w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Apply Watermark"}
                </button>
              </>
            )}
          </div>

          {/* Preview & Download */}
          <div className="bg-base-100/90 backdrop-blur-md rounded-2xl shadow-lg border border-base-300/30 p-6 flex flex-col">
            <div className="flex items-center mb-3">
              <SparklesIcon className="w-5 h-5 text-accent mr-2" />
              <h2 className="text-lg font-semibold text-base-content">Preview & Download</h2>
            </div>

            {result ? (
              <div className="flex flex-col space-y-4">
                <div className="relative bg-base-200/50 rounded-xl p-1 flex items-center justify-center min-h-[240px] border border-base-300/30 transition-all duration-300 hover:border-primary/40 hover:shadow-md">
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-sm z-10 rounded-xl space-y-2">
                      <Zap className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-sm font-medium text-primary">Processing...</span>
                    </div>
                  )}

                  <img
                    src={result.watermarked}
                    alt="Watermarked"
                    ref={imageRef}
                    className="rounded-xl max-h-80 mx-auto border object-contain shadow-md"
                  />
                </div>

                <button
                  onClick={handleDownload}
                  className="relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                  disabled={isProcessing}
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download
                </button>
              </div>
            ) : preview ? (
              <div className="text-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-xl max-h-80 mx-auto border object-contain shadow-md"
                />
                <p className="mt-2 text-base-content/60 text-sm">Preview before applying watermark</p>
              </div>
            ) : (
              <div className="text-center py-14 text-base-content/60">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium text-sm">No image uploaded</p>
                <p className="text-xs">Upload an image to preview & download</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
