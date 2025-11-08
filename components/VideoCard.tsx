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
  onDownload: (url: string, title: string) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string, visibility: "public" | "private") => void;
  isOwner: boolean; // ✅ New
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onDownload,
  onDelete,
  onToggleVisibility,
  isOwner,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">(video.visibility as "public" | "private");

  const getThumbnailUrl = useCallback(
    (publicId: string) =>
      getCldImageUrl({
        src: publicId,
        width: 400,
        height: 225,
        crop: "fill",
        gravity: "auto",
        format: "jpg",
        quality: "auto",
        assetType: "video",
      }),
    []
  );

  const getFullVideoUrl = useCallback(
    (publicId: string) =>
      getCldVideoUrl({
        src: publicId,
        width: 1920,
        height: 1080,
      }),
    []
  );

  const getPreviewVideoUrl = useCallback(
    (publicId: string) =>
      getCldVideoUrl({
        src: publicId,
        width: 400,
        height: 225,
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

  const compressionPercentage = Math.round((1 - Number(video.compressedSize) / Number(video.originalSize)) * 100);

  const toggleVisibility = async () => {
    const newVisibility = visibility === "public" ? "private" : "public";
    try {
      await axios.patch(`/api/videos/${video.id}/visibility`, { visibility: newVisibility });
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

  return (
    <div
      className="group relative bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300/20 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Preview */}
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
              onError={() => setPreviewError(true)}
            />
          )
        ) : (
          <Image
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <Clock size={14} className="mr-1.5" />
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-base-content line-clamp-2">{video.title}</h3>
          <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-content px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{compressionPercentage}%
          </div>
        </div>

        <p className="text-sm text-base-content/70 line-clamp-2 mb-3">{video.description}</p>
        <p className="text-xs text-base-content/50 font-medium">Uploaded {dayjs(video.createdAt).fromNow()}</p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 border border-primary/20">
            <div className="flex items-center mb-2">
              <FileUp size={16} className="mr-2 text-primary" />
              <span className="text-sm font-semibold text-base-content">Original</span>
            </div>
            <div className="text-lg font-bold text-primary">{formatSize(Number(video.originalSize))}</div>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-3 border border-secondary/20">
            <div className="flex items-center mb-2">
              <FileDown size={16} className="mr-2 text-secondary" />
              <span className="text-sm font-semibold text-base-content">Compressed</span>
            </div>
            <div className="text-lg font-bold text-secondary">{formatSize(Number(video.compressedSize))}</div>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <button
            className="btn btn-primary flex-1"
            onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
          >
            <Download size={18} className="mr-2" />
            Download
          </button>

          {isOwner && (
            <>
              <button className="btn btn-outline flex-1" onClick={toggleVisibility}>
                {visibility === "public" ? "Make Private" : "Make Public"}
              </button>
              <button className="btn btn-error flex-1" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
