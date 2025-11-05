"use client";

import React, { useState, useRef } from "react";
import { UploadIcon, DownloadIcon, Crop, Zap } from "lucide-react";

interface TrimCropSettings {
  start: number;
  end: number;
  width: number;
  height: number;
}

const aspectRatios = {
  "Square (1:1)": { width: 720, height: 720 },
  "16:9": { width: 1280, height: 720 },
  "4:5": { width: 1080, height: 1350 },
  "9:16": { width: 720, height: 1280 },
};

type AspectKey = keyof typeof aspectRatios;

export default function VideoTrimCrop() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [settings, setSettings] = useState<TrimCropSettings>({
    start: 0,
    end: 10,
    width: 720,
    height: 720,
  });
  const [selectedAspect, setSelectedAspect] = useState<AspectKey>("Square (1:1)");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Upload Video
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/video-upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadedVideoId(data.publicId); // Cloudinary public ID
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Generate Cloudinary URL with trim & crop
  const getTransformedVideoUrl = () => {
    if (!uploadedVideoId) return "";
    const { start, end, width, height } = settings;
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/c_crop,g_auto,w_${width},h_${height},so_${start},eo_${end}/${uploadedVideoId}.mp4`;
  };

  const handleDownload = () => {
    if (!videoRef.current) return;
    fetch(videoRef.current.src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedAspect.replace(/\s+/g, "_").toLowerCase()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Upload Section */}
        <div className="bg-base-100/80 p-8 rounded-3xl shadow-xl border border-base-300/30">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <UploadIcon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-base-content">Upload Video</h2>
          </div>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
                  <p className="text-lg font-semibold text-primary">Uploading...</p>
                  <progress className="progress progress-primary w-full"></progress>
                </div>
              ) : (
                <p className="text-lg text-base-content">
                  Drop your video here or click to browse
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trim / Crop Settings */}
        {uploadedVideoId && (
          <div className="bg-base-100/80 p-8 rounded-3xl shadow-xl border border-base-300/30 space-y-6">
            <h2 className="text-2xl font-bold text-base-content flex items-center mb-4">
              <Crop className="w-6 h-6 mr-2 text-secondary" /> Trim & Crop Video
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Aspect Ratio */}
              <div>
                <label className="label">Aspect Ratio</label>
                <select
                  className="select select-primary w-full"
                  value={selectedAspect}
                  onChange={(e) => {
                    const aspect = e.target.value as AspectKey;
                    setSelectedAspect(aspect);
                    setSettings((prev) => ({
                      ...prev,
                      width: aspectRatios[aspect].width,
                      height: aspectRatios[aspect].height,
                    }));
                  }}
                >
                  {Object.keys(aspectRatios).map((key) => (
                    <option key={key}>{key}</option>
                  ))}
                </select>
              </div>

              {/* Start / End Times */}
              <div>
                <label className="label">Start Time (s)</label>
                <input
                  type="number"
                  className="input input-primary w-full"
                  value={settings.start}
                  onChange={(e) => setSettings((prev) => ({ ...prev, start: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="label">End Time (s)</label>
                <input
                  type="number"
                  className="input input-primary w-full"
                  value={settings.end}
                  onChange={(e) => setSettings((prev) => ({ ...prev, end: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* Video Preview */}
            <div className="mt-6">
              <video
                ref={videoRef}
                controls
                className="w-full max-h-[500px] rounded-xl shadow-lg"
                src={getTransformedVideoUrl()}
              />
            </div>

            {/* Download Button */}
            <button
              className="w-full btn btn-primary btn-lg mt-4 flex items-center justify-center"
              onClick={handleDownload}
            >
              <DownloadIcon className="w-6 h-6 mr-2" />
              Download Trimmed Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
