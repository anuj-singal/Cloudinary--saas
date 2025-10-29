import React, {useState, useEffect, useCallback} from 'react'
import {getCldImageUrl, getCldVideoUrl} from "next-cloudinary"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {Download, Clock, FileDown, FileUp, Play} from "lucide-react"
import { filesize } from 'filesize'
import { Video } from '@/app/generated/prisma'
import Image from 'next/image'

dayjs.extend(relativeTime)

interface VideoCardProps {
  video: Video,
  onDownload: (url: string, title: string) => void
} 

const VideoCard: React.FC<VideoCardProps> = ({video, onDownload}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [previewError, setPreviewError] = useState(false)

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({   // grab video thumbnail url to be displayed on the card
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video" 
    })
  }, [])

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({      // grab video url 
      src: publicId,
      width: 1920,
      height: 1080, 
    })
  }, [])

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]  // used in video preview
    })
  }, [])

  const formatSize = useCallback((size: number) => {
    return filesize(size)    // format file size
  }, [])


  // tell the duration of video on the card 
  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);


  //This line is calculating how much the video was compressed
  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300/20 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Preview Section */}
      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-error/10 to-error/20 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-error/20 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-error" />
                </div>
                <p className="text-error font-medium">Preview not available</p>
              </div>
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handlePreviewError}
            />
          )
        ) : (
          <>
            <Image
              src={getThumbnailUrl(video.publicId)}
              alt={video.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
            {/* Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-primary ml-1" />
              </div>
            </div>
          </>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <Clock size={14} className="mr-1.5" />
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Compression Badge */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-base-content line-clamp-2 group-hover:text-primary transition-colors duration-200 flex-1 mr-3">
            {video.title}
          </h3>
          <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-content px-3 py-1 rounded-full text-sm font-bold shadow-lg shrink-0">
            -{compressionPercentage}%
          </div>
        </div>

        {/* Description and Upload Time */}
        <div className="mb-4">
          <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
            {video.description}
          </p>
          <p className="text-xs text-base-content/50 font-medium">
            Uploaded {dayjs(video.createdAt).fromNow()}
          </p>
        </div>

        {/* File Size Stats */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 border border-primary/20">
            <div className="flex items-center mb-2">
              <FileUp size={16} className="mr-2 text-primary" />
              <span className="text-sm font-semibold text-base-content">Original</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {formatSize(Number(video.originalSize))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-3 border border-secondary/20">
            <div className="flex items-center mb-2">
              <FileDown size={16} className="mr-2 text-secondary" />
              <span className="text-sm font-semibold text-base-content">Compressed</span>
            </div>
            <div className="text-lg font-bold text-secondary">
              {formatSize(Number(video.compressedSize))}
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          className="w-full btn btn-primary hover:btn-primary-focus transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
          onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
        >
          <Download size={18} className="mr-2" />
          <span className="font-semibold">Download Video</span>
        </button>
      </div>

      {/* Subtle Border Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}

export default VideoCard