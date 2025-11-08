"use client"

import React, {useState, useCallback} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { UploadIcon, VideoIcon, FileVideoIcon, Zap, CheckCircleIcon, AlertCircleIcon, TypeIcon, FileTextIcon } from 'lucide-react'

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  // Max file size of 70 mb
  const MAX_FILE_SIZE = 70 * 1024 * 1024

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // handle file select from input
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setSuccess(false)
    }
  }, [])

  // handle drag over event
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  // handle drop event
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile)
      setError(null)
      setSuccess(false)
    }
  }, [])

  // handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!file) return

    if(file.size > MAX_FILE_SIZE) {
      setError("File size too large. Maximum allowed size is 70MB.")
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    // Simulate progress for better UX while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("description", description)
      formData.append("originalSize", file.size.toString())

      // ✅ Upload to new /api/videos route (type-safe)
      await axios.post("/api/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: progressEvent => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        }
      })

      setUploadProgress(100)
      setSuccess(true)
      
      // Reset form after successful upload
      setTimeout(() => {
        setFile(null)
        setTitle("")
        setDescription("")
        setSuccess(false)
        router.push('/home') // redirect to home after upload
      }, 2000)

    } catch (err) {
      console.log(err)
      setError("Upload failed. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setIsUploading(false)
    }
  } 

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-6 shadow-2xl">
              <VideoIcon className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-ping opacity-60"></div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Upload Video
          </h1>
        </div>
        <p className="text-2xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
          Share your videos and compress them with <span className="font-bold text-primary">AI-powered optimization</span> for better performance.
        </p>
      </div>

      {/* Main Upload Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Video Details Section */}
          <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <FileTextIcon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">Video Details</h2>
            </div>

            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <div className="flex items-center mb-4">
                  <TypeIcon className="w-5 h-5 text-primary mr-2" />
                  <label className="text-lg font-semibold text-base-content">Video Title</label>
                  <span className="text-error ml-2">*</span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-6 py-4 text-lg font-medium text-base-content bg-base-100 border-2 border-base-300 rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder:text-base-content/50"
                  placeholder="Enter a descriptive title for your video"
                  required
                />
              </div>

              {/* Description Field */}
              <div>
                <div className="flex items-center mb-4">
                  <FileTextIcon className="w-5 h-5 text-secondary mr-2" />
                  <label className="text-lg font-semibold text-base-content">Description</label>
                  <span className="text-base-content/50 ml-2 text-sm">(optional)</span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-6 py-4 text-lg font-medium text-base-content bg-base-100 border-2 border-base-300 rounded-2xl focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all duration-300 resize-none placeholder:text-base-content/50"
                  placeholder="Describe your video content (optional)"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mr-4">
                <UploadIcon className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">Upload Video File</h2>
            </div>

            {/* Upload Area */}
            <div className="relative mb-6">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div 
                className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  file 
                    ? 'border-primary bg-primary/10' 
                    : 'border-base-300 hover:border-primary hover:bg-primary/5'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                      <FileVideoIcon className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-primary mb-2">{file.name}</p>
                      <p className="text-base-content/60 mb-2">Size: {formatFileSize(file.size)}</p>
                      <div className="flex justify-center">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          file.size > MAX_FILE_SIZE 
                            ? 'bg-error/20 text-error border border-error/30' 
                            : 'bg-success/20 text-success border border-success/30'
                        }`}>
                          {file.size > MAX_FILE_SIZE ? 'File too large!' : 'Valid file size'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-base-300/50 rounded-full flex items-center justify-center">
                      <VideoIcon className="w-10 h-10 text-base-content/70" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-base-content mb-2">
                        Drop your video here or click to browse
                      </p>
                      <p className="text-base-content/60">
                        Supports MP4, MOV, AVI, WebM up to 70MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* File Size Info */}
            <div className="bg-gradient-to-r from-base-200/50 to-base-300/50 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-base-100/50 rounded-xl p-4">
                  <p className="text-sm text-base-content/60 mb-2">Max File Size</p>
                  <p className="font-bold text-base-content text-lg">{formatFileSize(MAX_FILE_SIZE)}</p>
                </div>
                <div className="bg-base-100/50 rounded-xl p-4">
                  <p className="text-sm text-base-content/60 mb-2">Current File</p>
                  <p className="font-bold text-base-content text-lg">
                    {file ? formatFileSize(file.size) : 'No file selected'}
                  </p>
                </div>
                <div className="bg-base-100/50 rounded-xl p-4">
                  <p className="text-sm text-base-content/60 mb-2">Status</p>
                  <p className={`font-bold text-lg ${
                    !file ? 'text-base-content/50' :
                    file.size > MAX_FILE_SIZE ? 'text-error' : 'text-success'
                  }`}>
                    {!file ? 'Waiting' :
                     file.size > MAX_FILE_SIZE ? 'Too Large' : 'Ready'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 animate-spin">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xl font-semibold text-base-content">Uploading Video...</span>
                <span className="ml-auto text-primary font-bold text-xl">{Math.round(uploadProgress)}%</span>
              </div>
              <progress 
                className="progress progress-primary w-full h-3" 
                value={uploadProgress}
                max="100"
              ></progress>
              <p className="text-center text-base-content/70 mt-4">
                Please don&#39;t close this page while uploading
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-3xl p-8">
              <div className="flex items-center justify-center">
                <CheckCircleIcon className="w-12 h-12 text-success mr-4" />
                <div className="text-center">
                  <p className="font-bold text-success text-2xl mb-2">Upload Successful!</p>
                  <p className="text-base-content/70">Your video is being processed. Redirecting to home page...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-error/10 to-error/5 border border-error/20 rounded-3xl p-8">
              <div className="flex items-center">
                <AlertCircleIcon className="w-8 h-8 text-error mr-4" />
                <div>
                  <p className="font-bold text-error text-lg">Upload Failed</p>
                  <p className="text-base-content/70">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isUploading || !file || file.size > MAX_FILE_SIZE || !title.trim()}
              className="btn btn-primary btn-lg hover:btn-primary-focus transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-semibold px-12 py-4"
            >
              {isUploading ? (
                <>
                  <Zap className="w-6 h-6 mr-3 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="w-6 h-6 mr-3" />
                  Upload Video
                </>
              )}
            </button>
            
            {!title.trim() && (
              <p className="text-error text-sm mt-4 font-medium">Please enter a title for your video</p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default VideoUpload
