"use client";

import React, { useState, useRef, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import {
  UploadIcon,
  ImageIcon,
  DownloadIcon,
  SparklesIcon,
  Zap,
  Crop,
  Play,
} from "lucide-react";

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

  const [selectedFilter, setSelectedFilter] = useState(FILTERS[1].id); // default grayscale
  const [transformedUrl, setTransformedUrl] = useState<string | null>(null);

  // before/after slider state
  const [sliderValue, setSliderValue] = useState(50);
  const beforeRef = useRef<HTMLDivElement | null>(null);
  const afterRef = useRef<HTMLDivElement | null>(null);

  // for file input reset
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Upload handler
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

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Upload failed:", data);
        alert(data?.error || "Upload failed");
        return;
      }

      setUploadedPublicId(data.publicId);
      setUploadedUrl(data.url || null);
      // reset slider
      setSliderValue(50);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. See console.");
    } finally {
      setIsUploading(false);
    }
  };

  // Apply filter (calls your /api/image-filters route)
  const applyFilter = async (filterId?: string) => {
    const picked = FILTERS.find((f) => f.id === (filterId ?? selectedFilter));
    if (!uploadedPublicId || !picked) return;

    // If 'none', show original url instead of transformed
    if (picked.id === "none") {
      setTransformedUrl(uploadedUrl);
      return;
    }

    setIsTransforming(true);
    try {
      const res = await fetch("/api/image-filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: uploadedPublicId,
          effect: picked.effect,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("Filter apply failed:", json);
        alert(json?.error || "Filter failed");
        setTransformedUrl(null);
        return;
      }
      setTransformedUrl(json.url || null);
    } catch (err) {
      console.error("Filter error:", err);
      alert("Filter failed. See console.");
      setTransformedUrl(null);
    } finally {
      setIsTransforming(false);
    }
  };

  // Apply filter whenever selectedFilter changes (and when an image is uploaded)
  useEffect(() => {
    if (!uploadedPublicId) return;
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, uploadedPublicId]);

  // download active image (transformed if available)
  const handleDownload = async () => {
    const url = transformedUrl || uploadedUrl;
    if (!url) return alert("No image to download");

    try {
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
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed");
    }
  };

  // simple before/after drag behavior using input range
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setSliderValue(v);
  };

  // helper to render CldImage, fallbacks to plain <img> if no CldImage usage needed
  const RenderCloudinaryImage = ({ src, alt }: { src: string; alt?: string }) => {
    // use CldImage for nicer handling if you want
    return (
      // CldImage can accept a Cloudinary URL too via src prop; but it also accepts public id when using `publicId`.
      // We receive a full URL from the upload/transform endpoints, so use native img tag for simplicity and
      // to avoid pitfalls with next-cloudinary expecting public id.
      // However to keep image optimization benefits, use next/image when you want — here we keep it simple.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? "image"}
        className="max-w-full max-h-[520px] object-contain rounded-xl shadow-lg"
        style={{ display: "block" }}
      />
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-200 via-base-300 to-base-200">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.05),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.03),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(0,0,0,0.02),transparent_40%)]"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-base-content/5 rounded-full blur-xl animate-pulse opacity-50"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-base-content/3 rounded-full blur-xl animate-pulse opacity-50" style={{ animationDelay: "1s" }}></div>

      <div className="relative container mx-auto px-6 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-6 shadow-2xl">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full animate-ping opacity-60"></div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Image Studio
            </h1>
          </div>
          <p className="text-lg text-base-content/80 max-w-3xl mx-auto leading-relaxed">
            Upload an image, apply fancy filters, and compare before/after with a draggable slider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload + Filters */}
          <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <UploadIcon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">Upload & Filters</h2>
            </div>

            {/* Upload Area */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="image/*"
              />
              <div
                className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isUploading ? "border-primary bg-primary/5" : "border-base-300 hover:border-primary hover:bg-primary/5"
                }`}
              >
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-spin">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-semibold text-primary">Uploading...</p>
                    <progress className="progress progress-primary w-full"></progress>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-base-300/50 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-base-content/70" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-base-content mb-2">Drop your image here or click to browse</p>
                      <p className="text-base-content/60">Supports JPG, PNG, WebP up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filters gallery */}
            {uploadedPublicId && (
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                    <Crop className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content">Filters</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {FILTERS.map((f) => {
                    const active = selectedFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFilter(f.id)}
                        className={`p-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
                          active ? "bg-primary/20 border-2 border-primary" : "bg-base-200/50 hover:bg-base-200"
                        }`}
                      >
                        <div className="w-10 h-10 bg-base-300/30 rounded-md flex items-center justify-center text-base-content/80">
                          <Play className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{f.label}</div>
                          <div className="text-xs text-base-content/60">{f.effect || "original"}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => applyFilter("none")}
                    className="btn btn-ghost"
                    disabled={isTransforming}
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => applyFilter()}
                    className="btn btn-primary ml-auto"
                    disabled={isTransforming}
                  >
                    {isTransforming ? "Applying..." : "Apply Selected"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview + Before/After */}
          <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4">
                  <SparklesIcon className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-base-content">Preview & Download</h2>
              </div>
            </div>

            {uploadedUrl ? (
              <div className="space-y-6">
                <div className="relative bg-gradient-to-br from-base-200/50 to-base-300/50 rounded-2xl p-6 min-h-[420px] flex items-center justify-center overflow-hidden">
                  {/* Loading overlay while transforming */}
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm z-20 rounded-2xl">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-spin">
                          <Zap className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-lg font-semibold text-primary">Transforming...</p>
                      </div>
                    </div>
                  )}

                  {/* BEFORE: original image */}
                  <div
                    ref={beforeRef}
                    className="absolute inset-0 flex items-center justify-center z-10"
                    aria-hidden
                    style={{ width: "100%" }}
                  >
                    <div className="max-w-full max-h-[520px]">
                      <RenderCloudinaryImage src={uploadedUrl} alt="original" />
                    </div>
                  </div>

                  {/* AFTER: transformed image clipped by slider */}
                  <div
                    ref={afterRef}
                    className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden"
                    style={{ width: `${sliderValue}%` }}
                  >
                    <div className="max-w-full max-h-[520px]">
                      <RenderCloudinaryImage src={transformedUrl || uploadedUrl} alt="transformed" />
                    </div>
                  </div>

                  {/* slider handle text */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-11/12">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sliderValue}
                      onChange={handleSliderChange}
                      className="range range-primary"
                    />
                    <div className="flex justify-between text-xs mt-2 text-base-content/60">
                      <span>Before</span>
                      <span>After</span>
                    </div>
                  </div>
                </div>

                {/* Download button */}
                <button
                  className="w-full btn btn-primary btn-lg hover:btn-primary-focus transition-all duration-300 shadow-xl text-lg font-semibold"
                  onClick={handleDownload}
                  disabled={isTransforming}
                >
                  <DownloadIcon className="w-6 h-6 mr-3" />
                  Download Image
                </button>

                {/* small info */}
                <div className="bg-gradient-to-r from-base-200/50 to-base-300/50 rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-base-content/60 mb-1">Selected Filter</p>
                      <p className="font-semibold text-base-content">{FILTERS.find((f) => f.id === selectedFilter)?.label}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/60 mb-1">Status</p>
                      <p className="font-semibold text-base-content">{isTransforming ? "Transforming..." : "Ready"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/60 mb-1">Image</p>
                      <p className="font-semibold text-base-content">{uploadedPublicId ? uploadedPublicId.split("/").pop() : "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto bg-base-300/30 rounded-full flex items-center justify-center mb-6">
                  <ImageIcon className="w-12 h-12 text-base-content/50" />
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-4">No image uploaded</h3>
                <p className="text-base-content/60">Upload an image to see the preview and before/after slider</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .range {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(59,130,246,0.9) 0%, rgba(59,130,246,0.9) ${sliderValue}%, rgba(0,0,0,0.08) ${sliderValue}%);
        }
        .range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: white;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.14);
          border: 2px solid rgba(59,130,246,0.8);
        }
      `}</style>
    </div>
  );
}
