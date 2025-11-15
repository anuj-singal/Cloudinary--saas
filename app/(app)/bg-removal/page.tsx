"use client";

import React, { useState, useRef } from "react";
import {
  UploadIcon,
  SparklesIcon,
  Zap,
  ImageIcon,
  DownloadIcon,
  PaintBucket,
  Palette,
} from "lucide-react";

function hexToRgb(hex: string) {
  if (!hex || hex === "transparent") return null;
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return null;
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return { r, g, b };
}

export default function BgRemovalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [isTransparent, setIsTransparent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorPalette = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#facc15",
    "#ec4899",
    "#14b8a6",
    "#9333ea",
    "#94a3b8",
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);
    setFile(selectedFile);
    setProcessedUrl(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleApply = async () => {
    if (!file) return alert("Please select an image first.");
    setIsProcessing(true);
    setProcessedUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    // send "transparent" literal when transparent is requested
    formData.append("bgColor", isTransparent ? "transparent" : bgColor);

    try {
      const res = await fetch("/api/bg-removal", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process image");
      // server should return PNG (with alpha if transparent was requested)
      setProcessedUrl(data.secure_url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

    const handleDownload = () => {
      if (!processedUrl) return;

      fetch(processedUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `processed-image.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        });
    };

  const selectedRgb = hexToRgb(isTransparent ? "transparent" : bgColor);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Title + description */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Background Customizer
        </h1>
        <p className="mt-2 text-md text-base-content/70 max-w-3xl mx-auto">
          Remove or replace image backgrounds instantly. Upload an image, choose a background color
          (or make it transparent), then apply and download the result as a PNG.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload + Background Options */}
        <div className="bg-base-100/90 backdrop-blur-md rounded-xl shadow-md border border-base-300/20 p-4 flex flex-col">
          <div className="flex items-center mb-3">
            <UploadIcon className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-semibold text-base-content">Upload & Background</h2>
          </div>

          <div className="relative mb-3">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept="image/*"
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
              ) : uploadedUrl ? (
                <div className="space-y-1">
                  <img
                    src={uploadedUrl}
                    alt="preview"
                    className="w-28 h-28 mx-auto object-cover rounded-lg shadow"
                  />
                  <p className="text-xs text-base-content/60">Ready to customize</p>
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

          {uploadedUrl && (
            <div>
              <div className="flex items-center mb-2">
                <Palette className="w-4 h-4 text-secondary mr-2" />
                <h3 className="text-base font-semibold text-base-content">Background Options</h3>
              </div>

              {/* Transparent Toggle */}
              <label className="flex items-center gap-2 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTransparent}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsTransparent(checked);
                    if (checked) {
                      setBgColor("transparent");
                    } else {
                      setBgColor("#ffffff");
                    }
                  }}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm text-base-content">Transparent Background</span>
              </label>

              {/* Color Picker + RGB */}
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="color"
                  value={isTransparent ? "#ffffff" : bgColor}
                  onChange={(e) => {
                    setIsTransparent(false);
                    setBgColor(e.target.value);
                  }}
                  disabled={isTransparent}
                  className="w-10 h-10 rounded-full border border-base-300 cursor-pointer"
                />
                <div className="flex flex-col">
                  <div className="text-sm text-base-content">Selected color</div>
                  <div className="text-xs text-base-content/70">
                    {isTransparent ? "transparent" : `${bgColor.toUpperCase()}`}
                    {selectedRgb && (
                      <span className="ml-2">— RGB: {selectedRgb.r}, {selectedRgb.g}, {selectedRgb.b}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      bgColor === color && !isTransparent ? "border-primary scale-110" : "border-base-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setBgColor(color);
                      setIsTransparent(false);
                    }}
                  />
                ))}
              </div>

              <button
                onClick={async () => {
                  // Keep UI responsibility local: click triggers processing
                  if (!file) return alert("Please select an image first.");
                  setIsProcessing(true);
                  setProcessedUrl(null);

                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("bgColor", isTransparent ? "transparent" : bgColor);

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
                }}
                disabled={isProcessing}
                className="btn btn-primary w-full mt-2 flex items-center justify-center gap-2"
              >
                <PaintBucket className="w-4 h-4" />
                {isProcessing ? "Processing..." : "Apply"}
              </button>
            </div>
          )}
        </div>

        {/* Preview & Download */}
        <div className="bg-base-100/90 backdrop-blur-md rounded-xl shadow-md border border-base-300/20 p-4 flex flex-col">
          <div className="flex items-center mb-3">
            <SparklesIcon className="w-5 h-5 text-accent mr-2" />
            <h2 className="text-lg font-semibold text-base-content">Preview & Download</h2>
          </div>

          {uploadedUrl ? (
            <div className="flex flex-col space-y-2">
              <div
                className={`relative rounded-lg p-1 flex items-center justify-center min-h-[200px] ${
                  isTransparent
                    ? "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><rect width=%2210%22 height=%2210%22 fill=%22%23e6e6e6%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23ffffff%22/></svg>')] bg-[length:20px_20px]"
                    : "bg-base-200/50"
                }`}
              >
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm rounded-lg z-10">
                    <Zap className="w-8 h-8 text-primary animate-spin" />
                    <span className="ml-2 text-sm font-medium text-primary">Processing...</span>
                  </div>
                )}

                {/* show processed image when available; otherwise show uploaded image */}
                <img
                  src={processedUrl ?? uploadedUrl}
                  alt="preview"
                  className="rounded-lg object-contain shadow-sm max-h-[350px]"
                  ref={null}
                />
              </div>

              <button
                onClick={handleDownload}
                className="btn btn-primary w-full text-sm flex items-center justify-center gap-1"
                disabled={isProcessing || !processedUrl}
              >
                <DownloadIcon className="w-4 h-4" />
                Download
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-base-content/60">
              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="font-medium text-sm">No image uploaded</p>
              <p className="text-xs">Upload an image to preview and download the result</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
