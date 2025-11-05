import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "User is not logged in" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "next-cloudinary-uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(
      { publicId: result.public_id, url: result.secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload image failed:", error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}
