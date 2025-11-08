import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

// POST, PATCH, DELETE handlers go here as needed
