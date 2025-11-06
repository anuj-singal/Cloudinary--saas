import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const bgColor = formData.get("bgColor") as string;
    const bgImage = formData.get("bgImage") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary with background removal
    const uploadResponse = await cloudinary.uploader.upload_stream(
      {
        folder: "bg-removal",
        transformation: [
          { effect: "background_removal" }, // AI background removal
          bgImage
            ? { overlay: bgImage, width: "1.0", crop: "fill" }
            : { background: bgColor },
        ],
        format: "png",
      },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    // Need to handle the stream properly
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "bg-removal",
          transformation: [
            { effect: "background_removal" },
            bgImage
              ? { overlay: bgImage, width: "1.0", crop: "fill" }
              : { background: bgColor },
          ],
          format: "png",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ secure_url: result.secure_url });
  } catch (err: any) {
    console.error("Error removing background:", err);
    return NextResponse.json(
      { error: "Failed to remove or replace background" },
      { status: 500 }
    );
  }
}
