"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
import { UploadIcon, SparklesIcon } from "lucide-react";
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

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading videos...</div>;

  if (!isSignedIn)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-base-200 via-base-300 to-base-200">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Welcome to Streamify
        </h1>
        <p className="text-gray-500 mb-8 text-lg">
          Please log in to view and manage your uploaded videos.
        </p>
        <SignInButton mode="modal">
          <button className="btn btn-primary">Sign In</button>
        </SignInButton>
      </div>
    );

  if (error) return <div className="flex items-center justify-center min-h-screen">{error}</div>;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-200 via-base-300 to-base-200">
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-6 shadow-2xl">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              My Videos
            </h1>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="text-center text-gray-500">No videos yet. Upload one!</div>
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
