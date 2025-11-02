import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch only this user's videos
    const videos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Error fetching videos" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as {
      title: string;
      description?: string;
      publicId: string;
      originalSize: string;
      compressedSize: string;
      duration?: number;
    };

    const video = await prisma.video.create({
      data: {
        title: body.title,
        description: body.description,
        publicId: body.publicId,
        originalSize: body.originalSize,
        compressedSize: body.compressedSize,
        duration: body.duration ?? 0,
        userId, // ✅ attach to logged-in user
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json({ error: "Error creating video" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
