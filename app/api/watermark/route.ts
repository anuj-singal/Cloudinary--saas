import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const text = formData.get("text") as string;
    const color = formData.get("color") as string;
    const fontSize = parseInt(formData.get("fontSize") as string);
    const position = formData.get("position") as string;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload original image
    const uploaded: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "uploads" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      uploadStream.end(buffer);
    });

    // Map position to Cloudinary gravity
    const gravityMap: Record<string, string> = {
      "top-left": "north_west",
      "top-right": "north_east",
      "bottom-left": "south_west",
      "bottom-right": "south_east",
      center: "center",
    };

    const watermarkedUrl = cloudinary.url(uploaded.public_id, {
      transformation: [
        {
          overlay: {
            font_family: "Arial",
            font_size: fontSize,
            font_weight: "bold",
            text,
            color,
          },
          gravity: gravityMap[position] || "south_east",
          x: 20,
          y: 20,
        },
      ],
    });

    return NextResponse.json({
      original: uploaded.secure_url,
      watermarked: watermarkedUrl,
    });
  } catch (error) {
    console.error("Watermark failed:", error);
    return NextResponse.json({ error: "Watermark failed" }, { status: 500 });
  }
}
