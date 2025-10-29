import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient()

//similer to image uploads, just little changes...
//Uploaded and storing video info to database using prisma 

// Configuration
cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string
    bytes: number
    duration?: number
    [key: string]: unknown
}

export async function POST(request: NextRequest) {
    const {userId} = await auth()

    if(!userId) {
        return NextResponse.json({error: "User is not logged in"}, {status: 401})
    }

    if(
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    ) {
        return NextResponse.json({error: "Cloudinary credentials not found"}, {status: 500})
    }

    try {
        const formData = await request.formData()       //grab the form data from the frontend(social-share/page.tsx)

        const file = formData.get("file") as File | null    //get the file from the formdata uploded by user 
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const originalSize = formData.get("originalSize") as string

        if(!file) {
            return NextResponse.json({error: "No file uploaded"}, {status: 400})
        }

        //file has a property known as array buffer that give us bytes.
        //create the array buffer of the file, then create a new buffer and then upload it to cloudinary
        //these 2 important lines help to upload anything anywhere....
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)       //create a buffer from the bytes  to stream it on cloudinary.

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(     //responsible for uploading (uploader)
                    {
                        resource_type: "video",
                        folder: "video-uploads",
                        transformation: [
                            {quality: "auto", fetch_format: "mp4"}
                        ]
                    },
                    (error, result) => {
                        if(error) reject(error)
                        else resolve(result as CloudinaryUploadResult)
                    }
                )
                uploadStream.end(buffer)
            }
        )

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0
            }
        })

        return NextResponse.json(video)
    } catch (error) {
        console.log("Upload video failed", error);
        return NextResponse.json({error: "Upload video failed"}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}