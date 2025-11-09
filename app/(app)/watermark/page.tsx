"use client";

import React, { useState, useRef } from "react";
import { UploadIcon, TypeIcon, PaletteIcon, DownloadIcon, Zap, LayersIcon } from "lucide-react";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("MyBrand");
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(40);
  const [position, setPosition] = useState("bottom-right");
  const [result, setResult] = useState<{ original: string; watermarked: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    formData.append("color", color);
    formData.append("fontSize", fontSize.toString());
    formData.append("position", position);

    setLoading(true);
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
      setLoading(false);
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Text Watermark Creator
          </h1>
          <p className="text-lg text-base-content/70 mt-4">
            Upload your image and instantly apply a text watermark with custom style, color, and position.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload + Settings */}
          <div className="bg-base-100/90 backdrop-blur-md rounded-2xl shadow-xl border border-base-300/30 p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <UploadIcon className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-base-content">Upload Image</h2>
            </div>

            {/* Upload box */}
            <div className="relative mb-6">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
              />
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  loading
                    ? "border-primary bg-primary/5 animate-pulse"
                    : "border-base-300 hover:border-primary hover:bg-primary/5"
                }`}
              >
                {loading ? (
                  <div className="space-y-2">
                    <Zap className="w-8 h-8 text-primary mx-auto animate-spin" />
                    <p className="text-base font-medium text-primary">Processing...</p>
                  </div>
                ) : preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-xl max-h-56 mx-auto object-contain shadow-md"
                  />
                ) : (
                  <div className="space-y-2">
                    <LayersIcon className="w-10 h-10 text-base-content/50 mx-auto" />
                    <p className="text-base text-base-content">
                      Drop your image here or click to upload
                    </p>
                    <p className="text-sm text-base-content/60">Supports JPG, PNG, WebP up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            {file && (
              <>
                <div className="mb-3">
                  <label className="block mb-1 font-medium flex items-center">
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
                    <label className="block mb-1 font-medium flex items-center">
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
                  disabled={loading}
                >
                  {loading ? "Applying..." : "Apply Watermark"}
                </button>
              </>
            )}
          </div>

          {/* Preview + Download */}
          <div className="bg-base-100/90 backdrop-blur-md rounded-2xl shadow-xl border border-base-300/30 p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <DownloadIcon className="w-6 h-6 text-accent mr-2" />
              <h2 className="text-xl font-semibold text-base-content">Preview & Download</h2>
            </div>

            {result ? (
              <div className="flex flex-col space-y-6 text-center">
                <div>
                  <h3 className="font-semibold mb-2">Watermarked Image</h3>
                  <img
                    src={result.watermarked}
                    alt="Watermarked"
                    ref={imageRef}
                    className="rounded-xl max-h-80 mx-auto border object-contain shadow-md"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="btn btn-accent w-full"
                  disabled={loading}
                >
                  Download Watermarked Image
                </button>
              </div>
            ) : preview ? (
              <div className="text-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-xl max-h-80 mx-auto border object-contain shadow-md"
                />
                <p className="mt-2 text-base-content/60 text-sm">
                  Preview before applying watermark
                </p>
              </div>
            ) : (
              <div className="text-center py-16 text-base-content/60">
                <LayersIcon className="w-16 h-16 mx-auto mb-4" />
                <p className="font-medium">No image uploaded yet</p>
                <p className="text-sm">Upload an image to preview and apply watermark</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
