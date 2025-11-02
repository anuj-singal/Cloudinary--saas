export interface Video {
    id: string
    publicId: string
    title: string
    description: string
    originalSize: string
    compressedSize: string
    duration: number
    createdAt: Date
    updatedAt: Date
    userId: string
}