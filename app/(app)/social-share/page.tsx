"use client"

import React, {useState, useEffect, useRef} from 'react'
import { CldImage } from 'next-cloudinary';
import { UploadIcon, ImageIcon, DownloadIcon, SparklesIcon, Zap, Crop, Share2 } from 'lucide-react';

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
        if (format.includes('Instagram')) return '📷';
        if (format.includes('Twitter')) return '🐦';
        if (format.includes('Facebook')) return '📘';
        return '🖼️';
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-200 via-base-300 to-base-200">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.05),transparent_40%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.03),transparent_40%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(0,0,0,0.02),transparent_40%)]"></div>
            
            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-base-content/5 rounded-full blur-xl animate-pulse opacity-50"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-base-content/3 rounded-full blur-xl animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>

            <div className="relative container mx-auto px-6 py-16 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-8">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-6 shadow-2xl">
                                <Share2 className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-ping opacity-60"></div>
                        </div>
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Social Creator
                        </h1>
                    </div>
                    <p className="text-2xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
                        Transform your images into perfect social media formats with <span className="font-bold text-primary">AI-powered cropping</span> and intelligent resizing.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Upload Section */}
                    <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                                <UploadIcon className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-base-content">Upload Your Image</h2>
                        </div>

                        {/* Upload Area */}
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept="image/*"
                            />
                            <div className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                                isUploading 
                                    ? 'border-primary bg-primary/5' 
                                    : 'border-base-300 hover:border-primary hover:bg-primary/5'
                            }`}>
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
                                            <p className="text-lg font-semibold text-base-content mb-2">
                                                Drop your image here or click to browse
                                            </p>
                                            <p className="text-base-content/60">
                                                Supports JPG, PNG, WebP up to 10MB
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Format Selection */}
                        {uploadedImage && (
                            <div className="mt-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                                        <Crop className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-base-content">Choose Format</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-3">
                                    {Object.entries(socialFormats).map(([format, specs]) => (
                                        <label 
                                            key={format} 
                                            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                                selectedFormat === format 
                                                    ? 'bg-primary/20 border-2 border-primary' 
                                                    : 'bg-base-200/50 border-2 border-transparent hover:bg-base-200'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="format"
                                                value={format}
                                                checked={selectedFormat === format}
                                                onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                                                className="radio radio-primary mr-4"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-3">{formatPlatformIcon(format)}</span>
                                                    <div>
                                                        <p className="font-semibold text-base-content">{format}</p>
                                                        <p className="text-sm text-base-content/60">{specs.width} × {specs.height}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs bg-base-300/50 px-2 py-1 rounded-full">
                                                {specs.aspectRatio}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4">
                                    <SparklesIcon className="w-6 h-6 text-accent" />
                                </div>
                                <h2 className="text-2xl font-bold text-base-content">Preview & Download</h2>
                            </div>
                        </div>

                        {uploadedImage ? (
                            <div className="space-y-6">
                                {/* Preview Container */}
                                <div className="relative bg-gradient-to-br from-base-200/50 to-base-300/50 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
                                    {isTransforming && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm z-10 rounded-2xl">
                                            <div className="text-center space-y-4">
                                                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-spin">
                                                    <Zap className="w-8 h-8 text-primary" />
                                                </div>
                                                <p className="text-lg font-semibold text-primary">Transforming...</p>
                                            </div>
                                        </div>
                                    )}
                                    <CldImage    //*******responsible for image size change******
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
                                        className="max-w-full max-h-[400px] object-contain rounded-xl shadow-lg"
                                    />
                                </div>

                                {/* Download Button */}
                                <button 
                                    className="w-full btn btn-primary btn-lg hover:btn-primary-focus transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105 text-lg font-semibold"
                                    onClick={handleDownload}
                                    disabled={isTransforming}
                                >
                                    <DownloadIcon className="w-6 h-6 mr-3" />
                                    Download for {selectedFormat}
                                </button>

                                {/* Format Info */}
                                <div className="bg-gradient-to-r from-base-200/50 to-base-300/50 rounded-xl p-4">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-xs text-base-content/60 mb-1">Dimensions</p>
                                            <p className="font-semibold text-base-content">
                                                {socialFormats[selectedFormat].width} × {socialFormats[selectedFormat].height}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-base-content/60 mb-1">Aspect Ratio</p>
                                            <p className="font-semibold text-base-content">
                                                {socialFormats[selectedFormat].aspectRatio}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-base-content/60 mb-1">Platform</p>
                                            <p className="font-semibold text-base-content">
                                                {formatPlatformIcon(selectedFormat)} {selectedFormat.split(' ')[0]}
                                            </p>
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
                                <p className="text-base-content/60">
                                    Upload an image to see the preview and download options
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}