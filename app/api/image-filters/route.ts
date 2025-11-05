export const runtime = "nodejs"; // ✅ force Node runtime

import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary"; // ✅ use your configured wrapper

export async function POST(req: Request) {
  try {
    const { public_id, effect } = await req.json();

    if (!public_id || !effect) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Generate transformed URL using the configured instance
    const transformedUrl = cloudinary.url(public_id, {
      transformation: [{ effect }],
      secure: true, // ensures https
    });

    return NextResponse.json({ url: transformedUrl });
  } catch (error) {
    console.error("Image filter error:", error);
    return NextResponse.json(
      { error: "Transformation failed" },
      { status: 500 }
    );
  }
}
