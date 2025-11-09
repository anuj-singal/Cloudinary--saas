"use client"

import React, {useState, useEffect, useRef} from 'react'
import { CldImage } from 'next-cloudinary';
import { UploadIcon, ImageIcon, DownloadIcon, SparklesIcon, Zap, Crop, Share2 } from 'lucide-react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const socialFormats = {
    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
    "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
    "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
    const [isUploading, setIsUploading] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if(uploadedImage){
            setIsTransforming(true);
        }
    }, [selectedFormat, uploadedImage])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/image-upload", {
                method: "POST",
                body: formData
            })

            if(!response.ok) throw new Error("Failed to upload image");

            const data = await response.json();
            setUploadedImage(data.publicId);

        } catch (error) {
            console.log(error)
            alert("Failed to upload image");
        } finally{
            setIsUploading(false);
        }
    };

    const handleDownload = () => {
      if(!imageRef.current) return;

      fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
        .replace(/\s+/g, "_")
        .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
    }

    const formatPlatformIcon = (format: string) => {
        if (format.includes('Instagram')) return <FaInstagram className="inline-block mr-2 text-pink-500" />;
        if (format.includes('Twitter')) return <FaTwitter className="inline-block mr-2 text-blue-400" />;
        if (format.includes('Facebook')) return <FaFacebook className="inline-block mr-2 text-blue-600" />;
        return null;
    };

    return (
        <div className="w-full min-h-screen bg-base-200 flex flex-col items-center justify-start py-8 px-0">
            <div className="w-full max-w-6xl px-4">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Social Media Image Creator
                    </h1>
                    <p className="text-lg text-base-content/70 mt-4">
                        Upload an image and transform it into perfect formats for Instagram, Twitter, and Facebook.
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Upload Section */}
                    <div className="bg-base-100/90 backdrop-blur-md rounded-2xl shadow-xl border border-base-300/30 p-6 flex flex-col">
                        <div className="flex items-center mb-4">
                            <UploadIcon className="w-6 h-6 text-primary mr-2" />
                            <h2 className="text-xl font-semibold text-base-content">Upload Image</h2>
                        </div>

                        <div className="relative mb-4">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept="image/*"
                            />
                            <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                                isUploading 
                                    ? 'border-primary bg-primary/5 animate-pulse' 
                                    : 'border-base-300 hover:border-primary hover:bg-primary/5'
                            }`}>
                                {isUploading ? (
                                    <div className="space-y-2">
                                        <Zap className="w-8 h-8 text-primary mx-auto animate-spin" />
                                        <p className="text-base font-medium text-primary">Uploading...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <ImageIcon className="w-10 h-10 text-base-content/50 mx-auto" />
                                        <p className="text-base text-base-content">Drop your image here or click to browse</p>
                                        <p className="text-sm text-base-content/60">Supports JPG, PNG, WebP up to 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Format Selection */}
                        {uploadedImage && (
                            <div className="mt-4">
                                <div className="flex items-center mb-2">
                                    <Crop className="w-5 h-5 text-secondary mr-2" />
                                    <h3 className="text-lg font-semibold text-base-content">Select Format</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(socialFormats).map(([format, specs]) => (
                                        <label 
                                            key={format} 
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                                                selectedFormat === format 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-transparent hover:border-base-content/20 hover:bg-base-200/50'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                {formatPlatformIcon(format)}
                                                <div>
                                                    <p className="font-medium text-base-content">{format}</p>
                                                    <p className="text-xs text-base-content/60">{specs.width} × {specs.height}</p>
                                                </div>
                                            </div>
                                            <input
                                                type="radio"
                                                name="format"
                                                value={format}
                                                checked={selectedFormat === format}
                                                onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                                                className="radio radio-primary"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div className="bg-base-100/90 backdrop-blur-md rounded-2xl shadow-xl border border-base-300/30 p-6 flex flex-col">
                        <div className="flex items-center mb-4">
                            <SparklesIcon className="w-6 h-6 text-accent mr-2" />
                            <h2 className="text-xl font-semibold text-base-content">Preview & Download</h2>
                        </div>

                        {uploadedImage ? (
                            <div className="flex flex-col space-y-4">
                                <div className="relative bg-base-200/50 rounded-xl p-2 flex items-center justify-center min-h-[300px]">
                                    {isTransforming && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm rounded-xl z-10">
                                            <Zap className="w-10 h-10 text-primary animate-spin" />
                                            <span className="ml-2 text-base font-medium text-primary">Transforming...</span>
                                        </div>
                                    )}
                                    <CldImage
                                        width={socialFormats[selectedFormat].width}
                                        height={socialFormats[selectedFormat].height}
                                        src={uploadedImage}
                                        sizes="100vw"
                                        alt="transformed image"
                                        crop="fill"
                                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                                        gravity='auto'
                                        ref={imageRef}
                                        onLoad={() => setIsTransforming(false)}
                                        className="max-w-full max-h-[300px] object-contain rounded-lg shadow-md"
                                    />
                                </div>

                                <button
                                    className="btn btn-primary w-full hover:btn-primary-focus transition-all duration-300"
                                    onClick={handleDownload}
                                    disabled={isTransforming}
                                >
                                    <DownloadIcon className="w-5 h-5 mr-2" />
                                    Download
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-16 text-base-content/60">
                                <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                                <p className="font-medium">No image uploaded</p>
                                <p className="text-sm">Upload an image to see the preview and download options</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
