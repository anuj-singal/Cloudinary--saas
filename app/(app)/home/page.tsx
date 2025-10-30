"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
import {
  PlayCircleIcon,
  UploadIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // 👇 Navbar (added "Go to Welcome" button)
  const Navbar = () => (
    <nav className="fixed top-0 left-0 w-full bg-base-100/80 dark:bg-gray-900/70 backdrop-blur-md border-b border-base-300/40 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => router.push("/home")}
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          Streamify
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="btn btn-sm border border-primary/30 hover:bg-primary/10 text-primary transition"
          >
            Welcome
          </button>
          <button
            onClick={() => router.push("/video-upload")}
            className="btn btn-sm btn-primary flex items-center gap-2 hover:btn-primary-focus shadow-md transition"
          >
            <UploadIcon className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>
    </nav>
  );

  // Loading Component
  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center text-lg">
      Loading videos...
    </div>
  );

  if (loading) return <LoadingState />;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-200 via-base-300 to-base-200">
      {/* ✅ Navbar always visible */}
      <Navbar />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.05),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.03),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(0,0,0,0.02),transparent_40%)]"></div>

      <div className="relative container mx-auto px-6 py-24">
        {/* Keep your original header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-6 shadow-2xl">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-ping opacity-60"></div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Video Library
            </h1>
          </div>
        </div>

        {/* Videos Grid */}
        {videos.length === 0 ? (
          <div className="text-center">No videos yet. Upload one!</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 animate-fade-in">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="animate-slide-up"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "both",
                }}
              >
                <VideoCard video={video} onDownload={handleDownload} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
