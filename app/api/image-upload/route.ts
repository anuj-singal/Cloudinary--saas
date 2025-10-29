import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

// *** uploaded directly, we are not using prisma database (means not storing image info to db)

// Configuration
cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string
    [key: string]: unknown
}

export async function POST(request: NextRequest) {
    const {userId} = await auth()

    if(!userId) {
        return NextResponse.json({error: "User is not logged in"}, {status: 401})
    }

    try {
        const formData = await request.formData()       //grab the form data from the frontend(social-share/page.tsx)
        const file = formData.get("file") as File | null    //get the file from the formdata uploded by user

        if(!file) {
            return NextResponse.json({error: "No file uploaded"}, {status: 400})
        }

        //file has a property known as array buffer that give us bytes.
        //create the array buffer of the file, then create a new buffer and then upload it to cloudinary
        //these 2 important lines help to upload anything anywhere....
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)    //create a buffer from the bytes  to stream it on cloudinary.

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(    //responsible for uploading (uploader)
                    {folder: "next-cloudinary-uploads"},
                    (error, result) => {
                        if(error) reject(error)
                        else resolve(result as CloudinaryUploadResult)
                    }
                )
                uploadStream.end(buffer)
            }
        )

        return NextResponse.json({publicId: result.public_id}, {status: 200})
    } catch (error) {
        console.log("Upload image failed", error);
        return NextResponse.json({error: "Upload image failed"}, {status: 500})
    }
}