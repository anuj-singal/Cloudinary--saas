import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "User is not logged in" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const watermarkType = formData.get("type") as "text" | "logo" | null;
    const text = formData.get("text") as string | null;
    const logoId = formData.get("logoId") as string | null;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Step 1: Upload original image to Cloudinary
    const uploaded = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "uploads" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(buffer);
    });

    // Step 2: Prepare watermark transformation
    let transformation: any[] = [];
    if (watermarkType === "logo" && logoId) {
      transformation.push({
        overlay: logoId,
        width: 150,
        gravity: "south_east",
        x: 20,
        y: 20,
      });
    } else if (watermarkType === "text" && text) {
      transformation.push({
        overlay: { text, font_family: "Arial", font_size: 40, font_weight: "bold", color: "white" },
        gravity: "south_east",
        x: 20,
        y: 20,
      });
    }

    // Step 3: Apply watermark and save as new Cloudinary asset
    let watermarked: any = uploaded;
    if (transformation.length) {
      const publicId = `watermarked/${uploaded.public_id}`;
      watermarked = await cloudinary.uploader.upload(uploaded.secure_url, {
        public_id: publicId,
        transformation,
      });
    }

    return NextResponse.json({
      original: { publicId: uploaded.public_id, url: uploaded.secure_url },
      watermarked: { publicId: watermarked.public_id, url: watermarked.secure_url },
    });
  } catch (error: any) {
    console.error("Upload + Watermark failed:", error);
    return NextResponse.json({ error: "Upload + Watermark failed" }, { status: 500 });
  }
}
