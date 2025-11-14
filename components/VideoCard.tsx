import React, { useState, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Download, Clock, FileDown, FileUp, Play } from "lucide-react";
import { filesize } from "filesize";
import { Video } from "@/types";
import Image from "next/image";
import axios from "axios";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  currentUserId: string;
  onDownload: (url: string, title: string) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string, visibility: "public" | "private") => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  currentUserId,
  onDownload,
  onDelete,
  onToggleVisibility,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">(video.visibility);

  const getThumbnailUrl = useCallback(
    (publicId: string) =>
      getCldImageUrl({
        src: publicId,
        width: 320,
        height: 180,
        crop: "fill",
        gravity: "auto",
        format: "jpg",
        quality: "auto",
        assetType: "video",
      }),
    []
  );

  const getFullVideoUrl = useCallback((publicId: string) => getCldVideoUrl({ src: publicId }), []);
  const getPreviewVideoUrl = useCallback(
    (publicId: string) =>
      getCldVideoUrl({
        src: publicId,
        width: 320,
        height: 180,
        rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
      }),
    []
  );

  const formatSize = useCallback((size: number) => filesize(size), []);
  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  const toggleVisibility = async () => {
    const newVisibility = visibility === "public" ? "private" : "public";
    try {
      await axios.patch(`/api/videos/${video.id}`, { visibility: newVisibility });
      setVisibility(newVisibility);
      onToggleVisibility?.(video.id, newVisibility);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(`/api/videos/${video.id}`);
      onDelete?.(video.id);
    } catch (err) {
      console.error(err);
    }
  };

  const isOwner = currentUserId === video.userId;
  const allowDownload = isOwner || video.visibility === "public";

  return (
    <div
      className="group relative rounded-2xl shadow-md overflow-hidden border-[1.5px]
      transition-transform duration-300 hover:-translate-y-1
      bg-base-100 dark:bg-base-900 
      border-gray-300 dark:border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Preview */}
      <div className="relative aspect-video rounded-t-xl overflow-hidden">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/30">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-1 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-red-500 dark:text-red-300 font-medium text-sm">Preview not available</p>
              </div>
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover transition-transform duration-300 scale-100 group-hover:scale-105"
              onError={() => setPreviewError(true)}
            />
          )
        ) : (
          <Image
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            fill
            sizes="320px"
            className="object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 dark:bg-white/20 text-white dark:text-black px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
          <Clock size={10} />
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3
            className="text-sm md:text-base font-semibold line-clamp-2 text-accent-content
            transition-all duration-300 ease-in-out 
            group-hover:text-primary group-hover:translate-x-[2px] group-hover:opacity-90"
          >
            {video.title}
          </h3>

          <div className="text-xs font-bold text-white bg-black/70 dark:bg-white/20 dark:text-black px-2 py-0.5 rounded">
            -{compressionPercentage}%
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{video.description}</p>
        <p className="text-[11px] text-gray-400 dark:text-gray-400">{dayjs(video.createdAt).fromNow()}</p>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div
            className="flex items-center justify-between 
            bg-gray-100 dark:bg-gray-800/60 
            rounded px-2 py-1 text-xs 
            border border-gray-300 dark:border-gray-600 
            transition-colors duration-300"
          >
            <div className="flex items-center gap-1">
              <FileUp size={12} className="text-primary" />
              Original
            </div>
            <span className="font-semibold">{formatSize(Number(video.originalSize))}</span>
          </div>

          <div
            className="flex items-center justify-between 
            bg-gray-100 dark:bg-gray-800/60 
            rounded  px-2 py-1 text-xs 
            border border-gray-300 dark:border-gray-600 
            transition-colors duration-300"
          >
            <div className="flex items-center gap-1">
              <FileDown size={12} className="text-secondary" />
              Compressed
            </div>
            <span className="font-semibold">{formatSize(Number(video.compressedSize))}</span>
          </div>
        </div>

        {(isOwner || video.visibility === "public") && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {allowDownload && (
              <button
                className={`btn btn-primary flex-1 ${!isOwner ? "w-auto" : ""} dark:btn-primary-dark`}
                onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
              >
                <Download size={18} /> Download
              </button>
            )}

            {isOwner && (
              <>
                <button
                  className={`btn flex-1 ${visibility === "public" ? "btn-outline" : "btn-accent"} 
                  dark:btn-outline-dark dark:btn-accent-dark`}
                  onClick={toggleVisibility}
                >
                  {visibility === "public" ? "Make Private" : "Make Public"}
                </button>

                <button className="btn btn-error flex-1 dark:btn-error-dark" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
