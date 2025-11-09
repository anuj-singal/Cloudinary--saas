export const runtime = "nodejs"; // force Node runtime

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: Request) {
  try {
    const { public_id, effect } = await req.json();

    if (!public_id || !effect) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    console.log("Applying filter:", effect, "to public_id:", public_id);

    // Generate transformed URL
    const transformedUrl = cloudinary.url(public_id, {
      transformation: [{ effect }],
      secure: true,
    });

    // Add cache-buster to force React to re-render
    const urlWithCacheBuster = `${transformedUrl}&cb=${Date.now()}`;

    return NextResponse.json({ url: urlWithCacheBuster });
  } catch (error) {
    console.error("Image filter error:", error);
    return NextResponse.json({ error: "Transformation failed" }, { status: 500 });
  }
}
