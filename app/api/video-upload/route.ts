import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  // ✅ Get user ID from Clerk auth
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "User is not logged in" }, { status: 401 });
  }

  // ✅ Check Cloudinary credentials
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 });
  }

  try {
    // ✅ Grab the form data from the frontend
    const formData = await request.formData();

    const file = formData.get("file") as File | null; // get the uploaded file
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Create a buffer from file bytes to stream to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "video-uploads",
          transformation: [{ quality: "auto", fetch_format: "mp4" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    // ✅ Store video info in the database using Prisma
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
        userId, // associate video with the uploading user
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.log("Upload video failed", error);
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
