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
  const MAX_FILE_SIZE = 70 * 1024 * 1024

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setSuccess(false)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile)
      setError(null)
      setSuccess(false)
    }
  }, [])

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

      await axios.post("/api/video-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: progressEvent => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        }
      })

      setUploadProgress(100)
      setSuccess(true)
      
      setTimeout(() => {
        setFile(null)
        setTitle("")
        setDescription("")
        setSuccess(false)
        router.push('/home')
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
    <div className="min-h-screen bg-base-200 p-6">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-2">
          
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600">
            Compress Your Video
          </h1>
        </div>
        <p className="text-lg text-base-content/80 max-w-3xl mx-auto">
          Upload your videos and reduce their size with <span className="font-bold text-primary">AI-powered compression</span> while keeping the quality intact.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Video Details */}
        <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
          <div className="flex items-center mb-6">
            <FileTextIcon className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-base-content">Video Details</h2>
          </div>
          <div className="space-y-4">
            <div>
              <TypeIcon className="w-5 h-5 text-primary mr-2 inline" />
              <label className="text-base font-semibold text-base-content">Title <span className="text-error">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-4 py-3 text-base-content border-2 border-base-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter video title"
                required
              />
            </div>
            <div>
              <FileTextIcon className="w-5 h-5 text-secondary mr-2 inline" />
              <label className="text-base font-semibold text-base-content">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 px-4 py-3 text-base-content border-2 border-base-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 resize-none"
                placeholder="Describe your video (optional)"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-8">
          <div className="flex items-center mb-4">
            <UploadIcon className="w-6 h-6 text-secondary mr-2" />
            <h2 className="text-xl font-semibold text-base-content">Upload File</h2>
          </div>

          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
              file ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary hover:bg-primary/5'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {file ? (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <FileVideoIcon className="w-10 h-10 text-primary" />
                </div>
                <p className="font-semibold text-primary">{file.name}</p>
                <p className="text-base-content/60">{formatFileSize(file.size)}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <VideoIcon className="w-16 h-16 mx-auto text-base-content/50" />
                <p className="text-base-content">Drop your video here or click to select (max 70MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-base-100/80 backdrop-blur-md rounded-3xl shadow-xl border border-base-300/30 p-6">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary animate-spin mr-2" />
              <span className="font-semibold text-base-content">Compressing...</span>
              <span className="ml-auto font-bold text-primary">{Math.round(uploadProgress)}%</span>
            </div>
            <progress className="progress progress-primary w-full h-3" value={uploadProgress} max={100}></progress>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-success/10 border border-success/20 rounded-3xl p-6 flex items-center justify-center gap-4">
            <CheckCircleIcon className="w-8 h-8 text-success" />
            <span className="font-semibold text-success">Video compressed successfully! Redirecting...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-3xl p-6 flex items-center gap-4">
            <AlertCircleIcon className="w-6 h-6 text-error" />
            <span className="text-error font-medium">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isUploading || !file || file.size > MAX_FILE_SIZE || !title.trim()}
            className="btn btn-primary text-base-content btn-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Zap className="w-5 h-5 mr-2 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5 mr-2" />
                Compress Video
              </>
            )}
          </button>
          {!title.trim() && <p className="text-error mt-2">Please enter a title</p>}
        </div>
      </div>
    </div>
  )
}

export default VideoUpload
