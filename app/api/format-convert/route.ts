import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { public_id, resource_type, targetFormat } = await req.json();

    if (!public_id || !targetFormat) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Example: image → webp, or video → mp4/gif
    const url = cloudinary.url(public_id, {
      resource_type: resource_type || "image",
      format: targetFormat,
      secure: true,
    });

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("Error converting format:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
