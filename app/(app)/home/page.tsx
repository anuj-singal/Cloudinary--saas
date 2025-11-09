"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";

function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const res = await axios.get("/api/videos");
      setVideos(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) fetchVideos();
    else if (isLoaded) setLoading(false);
  }, [fetchVideos, isSignedIn, isLoaded]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleDelete = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  const handleVisibilityToggle = (id: string, visibility: "public" | "private") => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, visibility } : v)));
  };

  // 🌀 Loading State
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        
        <p className="text-lg text-gray-700 font-semibold">Loading videos...</p>
      </div>
    );

  // 🚪 Not Signed In
  if (!isSignedIn)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-50">
        
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          Welcome to Cloudinary Studio
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Please sign in to upload, view and manage your videos.
        </p>
        <SignInButton>
          <button className="btn btn-primary px-6 py-2 text-lg rounded-lg">
            Sign In
          </button>
        </SignInButton>
      </div>
    );

  // ⚠️ Error State
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {error}
      </div>
    );

  // 🎥 Main Video Grid
  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Videos</h1>
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10 text-blue-600">
            <p className="text-lg">No videos yet. Upload one to get started!</p>
            {/* Upload Button */}
            <button
              onClick={() => router.push("/video-upload")}
              className="btn btn-sm mt-6 btn-accent rounded-full shadow-sm hover:scale-105 transition-transform flex items-center gap-2"
              title="Go to Video Upload">
              <span>Upload</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="flex justify-center">
                <VideoCard
                  video={video}
                  currentUserId={user?.id ?? ""}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onToggleVisibility={handleVisibilityToggle}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
