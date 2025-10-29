"use client"
import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'
import { PlayCircleIcon, UploadIcon, SparklesIcon, TrendingUpIcon } from 'lucide-react'

function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos")
      if(Array.isArray(response.data)) {
        setVideos(response.data)
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      console.log(error)
      setError("Failed to fetch videos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Loading Component
  const LoadingState = () => (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-200 via-base-300 to-base-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.03),transparent_50%)]"></div>
      
      <div className="relative container mx-auto px-6 py-16">
        {/* Header Skeleton */}
        <div className="mb-16">
          <div className="h-16 bg-base-300/70 rounded-2xl w-80 mx-auto mb-6 animate-pulse"></div>
          <div className="h-8 bg-base-300/50 rounded-xl w-96 mx-auto animate-pulse"></div>
        </div>
        
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-base-100/60 backdrop-blur-sm rounded-3xl p-8 animate-pulse border border-base-300/30 shadow-xl">
              <div className="aspect-[16/10] bg-base-300/50 rounded-2xl mb-6"></div>
              <div className="h-8 bg-base-300/50 rounded-xl w-3/4 mb-4"></div>
              <div className="h-6 bg-base-300/40 rounded-lg w-full mb-3"></div>
              <div className="h-6 bg-base-300/40 rounded-lg w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-200 via-base-300 to-base-200 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.1),transparent_50%)]"></div>
      
      <div className="relative text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-error/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 border border-error/30 shadow-2xl">
          <PlayCircleIcon className="w-12 h-12 text-error" />
        </div>
        <h2 className="text-3xl font-bold text-base-content mb-6">Something went wrong</h2>
        <p className="text-base-content/70 mb-8 text-lg">{error}</p>
        <button 
          onClick={fetchVideos}
          className="btn btn-primary btn-lg hover:btn-primary-focus transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center max-w-lg mx-auto mt-20">
      <div className="relative">
        <div className="w-40 h-40 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-10 border border-primary/30 shadow-2xl">
          <UploadIcon className="w-20 h-20 text-primary" />
        </div>
        <div className="absolute top-4 right-1/2 translate-x-12 w-6 h-6 bg-primary/60 rounded-full animate-bounce"></div>
        <div className="absolute top-12 left-1/2 -translate-x-16 w-4 h-4 bg-secondary/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
      
      <h2 className="text-4xl font-bold text-base-content mb-6">
        No videos yet
      </h2>
      <p className="text-base-content/70 mb-10 text-xl leading-relaxed">
        Upload your first video to experience our powerful compression technology
      </p>
      <button 
        onClick={() => window.location.href = '/video-upload'}
        className="btn btn-primary btn-lg hover:btn-primary-focus transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
      >
        <UploadIcon className="mr-3 w-6 h-6" />
        Upload Your First Video
      </button>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-200 via-base-300 to-base-200">
      {/* Subtle Background Pattern Matching Layout */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.05),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.03),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(0,0,0,0.02),transparent_40%)]"></div>
      
      {/* Minimal floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-base-content/5 rounded-full blur-xl animate-pulse opacity-50"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-base-content/3 rounded-full blur-xl animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-base-content/4 rounded-full blur-xl animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
      
      <div className="relative container mx-auto px-6 py-16">
        {/* Header Section */}
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
          <p className="text-2xl text-base-content/80 max-w-3xl mx-auto mb-12 leading-relaxed">
            Your compressed videos are ready for download. Experience up to <span className="font-bold text-primary">90% file size reduction</span> with zero quality loss.
          </p>
          
          {/* Stats Section */}
          <div className="flex flex-wrap justify-center gap-10 mb-12">
            <div className="bg-base-100/80 backdrop-blur-md rounded-2xl p-6 border border-base-300/50 shadow-xl min-w-[180px] hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center mb-3">
                <PlayCircleIcon className="w-8 h-8 text-primary mr-3" />
                <span className="text-3xl font-bold text-primary">{videos.length}</span>
              </div>
              <p className="text-sm font-semibold text-base-content/70">Total Videos</p>
            </div>
            
            <div className="bg-base-100/80 backdrop-blur-md rounded-2xl p-6 border border-base-300/50 shadow-xl min-w-[180px] hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center mb-3">
                <TrendingUpIcon className="w-8 h-8 text-secondary mr-3" />
                <span className="text-3xl font-bold text-secondary">
                  {videos.length > 0 ? Math.round(videos.reduce((acc, video) => 
                    acc + (1 - Number(video.compressedSize) / Number(video.originalSize)), 0
                  ) / videos.length * 100) : 0}%
                </span>
              </div>
              <p className="text-sm font-semibold text-base-content/70">Avg. Compression</p>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {videos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-base-content">
                Recent Uploads
              </h2>
              <button 
                onClick={() => window.location.href = '/video-upload'}
                className="btn btn-primary btn-lg hover:btn-primary-focus transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
              >
                <UploadIcon className="mr-3 w-5 h-5" />
                Upload New
              </button>
            </div>
            
            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 animate-fade-in">
              {videos.map((video, index) => (
                <div 
                  key={video.id}
                  className="animate-slide-up"
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <VideoCard //*************** defined in components folder *******************
                    video={video}
                    onDownload={handleDownload}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Home