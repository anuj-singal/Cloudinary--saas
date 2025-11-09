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
    const file = formData.get("file") as File;
    const text = formData.get("text") as string;
    const color = (formData.get("color") as string)?.replace("#", "");
    const fontSize = formData.get("fontSize") as string;
    const position = formData.get("position") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload image to Cloudinary
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "watermark" }, (err, result) => {
          if (err || !result) return reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    // Position mapping
    let gravity = "south_east";
    if (position === "top-left") gravity = "north_west";
    if (position === "top-right") gravity = "north_east";
    if (position === "bottom-left") gravity = "south_west";
    if (position === "center") gravity = "center";

    // Encode text for Cloudinary overlay
    const encodedText = encodeURIComponent(text);

    // Build watermark transformation
    const transformation = [
      {
        overlay: `text:Arial_${fontSize}_bold:${encodedText}`,
        color: `#${color}`,
        gravity,
        opacity: 80,
      },
    ];

    const watermarkedUrl = cloudinary.url(uploadResponse.public_id, {
      transformation,
      secure: true,
    });

    return NextResponse.json({
      original: uploadResponse.secure_url,
      watermarked: watermarkedUrl,
    });
  } catch (err) {
    console.error("Error applying watermark:", err);
    return NextResponse.json({ error: "Failed to apply watermark" }, { status: 500 });
  }
}
