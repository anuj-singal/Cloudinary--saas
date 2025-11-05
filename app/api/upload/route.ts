import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

// Initialize Prisma
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper: convert buffer to readable stream
function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(req: Request) {
  // Get authenticated user
  const session = auth();
  const userId = (await session).userId as string;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // Convert File -> Buffer -> Stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = bufferToStream(buffer);

    // Upload to Cloudinary using upload_stream
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "videos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        }
      );
      stream.pipe(uploadStream);
    });

    // Save to Prisma
    const video = await prisma.video.create({
      data: {
        title: file.name,
        description: null,
        publicId: result.public_id,
        originalSize: String(file.size),
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
        userId,
      },
    });

    return NextResponse.json(video);
  } catch (err) {
    console.error("Video upload error:", err);
    return NextResponse.json({ error: "Video upload failed" }, { status: 500 });
  }
}
