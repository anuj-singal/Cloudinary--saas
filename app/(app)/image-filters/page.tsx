"use client";

import React, { useState, useEffect, useRef } from "react";
import { UploadIcon, ImageIcon, DownloadIcon, SparklesIcon, Zap, Crop, Play } from "lucide-react";

const FILTERS = [
  { id: "none", label: "None", effect: "" },
  { id: "grayscale", label: "Grayscale", effect: "grayscale" },
  { id: "blur", label: "Blur", effect: "blur:200" },
  { id: "sepia", label: "Sepia", effect: "sepia" },
  { id: "cartoonify", label: "Cartoonify", effect: "cartoonify" },
  { id: "sharpen", label: "Sharpen", effect: "sharpen" },
  { id: "brightness", label: "Bright +30", effect: "brightness:30" },
];

export default function ImageFiltersPage() {
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0].id);
  const [transformedUrl, setTransformedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTransformedUrl(null);
    setUploadedPublicId(null);
    setUploadedUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) return alert(data?.error || "Upload failed");

      setUploadedPublicId(data.publicId);
      setUploadedUrl(`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/${data.publicId}`);
      setTransformedUrl(null);
      setSelectedFilter("none");
    } catch (err) {
      console.error(err);
      alert("Upload failed. See console.");
    } finally {
      setIsUploading(false);
    }
  };

  const applyFilter = async (filterId?: string) => {
    const picked = FILTERS.find((f) => f.id === (filterId ?? selectedFilter));
    if (!uploadedPublicId || !picked) return;

    if (picked.id === "none") {
      // Reset to unfiltered
      setTransformedUrl(null);
      setSelectedFilter("none");
      return;
    }

    setIsTransforming(true);
    try {
      const res = await fetch("/api/image-filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: uploadedPublicId, effect: picked.effect }),
      });
      const json = await res.json();
      setTransformedUrl(json.url || null);
      setSelectedFilter(picked.id);
    } catch (err) {
      console.error(err);
      alert("Filter failed. See console.");
      setTransformedUrl(null);
    } finally {
      setIsTransforming(false);
    }
  };

  useEffect(() => {
    if (uploadedPublicId && selectedFilter !== "none") {
      applyFilter();
    }
  }, [selectedFilter, uploadedPublicId]);

  const handleDownload = async () => {
    const url = transformedUrl || uploadedUrl;
    if (!url) return alert("No image to download");

    const resp = await fetch(url);
    const blob = await resp.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `image-filtered.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Image Filter Studio
          </h1>
          <p className="text-base text-base-content/70 mt-2">
            Upload an image, apply filters, and download quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload + Filters */}
          <div className="bg-base-100/90 backdrop-blur-md rounded-xl shadow-md border border-base-300/20 p-4 flex flex-col">
            <div className="flex items-center mb-3">
              <UploadIcon className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-base-content">Upload Image</h2>
            </div>

            <div className="relative mb-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  isUploading ? "border-primary bg-primary/5 animate-pulse" : "border-base-300 hover:border-primary hover:bg-primary/5"
                }`}
              >
                {isUploading ? (
                  <div className="space-y-1">
                    <Zap className="w-6 h-6 text-primary mx-auto animate-spin" />
                    <p className="text-sm font-medium text-primary">Uploading...</p>
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

            {uploadedPublicId && (
              <div>
                <div className="flex items-center mb-2">
                  <Crop className="w-4 h-4 text-secondary mr-2" />
                  <h3 className="text-base font-semibold text-base-content">Filters</h3>
                </div>
                <div className="grid grid-cols-2 gap-1 text-base-content">
                  {FILTERS.map((f) => {
                    const active = selectedFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => applyFilter(f.id)}
                        className={`flex justify-between items-center p-2 rounded-lg transition-all duration-200 border text-xs ${
                          active ? "border-primary bg-primary/10" : "border-transparent hover:border-base-content/20 hover:bg-base-200/50"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Play className="w-4 h-4 text-base-content/70" />
                          <p>{f.label}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
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
                <div className="relative bg-base-200/50 rounded-lg p-1 flex items-center justify-center min-h-[200px]">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm rounded-lg z-10">
                      <Zap className="w-8 h-8 text-primary animate-spin" />
                      <span className="ml-2 text-sm font-medium text-primary">Transforming...</span>
                    </div>
                  )}

                  {/* Original Image */}
                  <img
                    src={uploadedUrl}
                    alt="original"
                    className="w-full h-full object-contain rounded-lg shadow-sm"
                  />

                  {/* Transformed Image */}
                  {transformedUrl && (
                    <img
                      src={transformedUrl}
                      alt="transformed"
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-sm"
                    />
                  )}
                </div>

                <button
                  onClick={handleDownload}
                  className="btn btn-primary w-full hover:btn-primary-focus transition-all duration-300 text-sm flex items-center justify-center gap-1"
                  disabled={isTransforming}
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-base-content/60">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium text-sm">No image uploaded</p>
                <p className="text-xs">Upload an image to preview and download</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
