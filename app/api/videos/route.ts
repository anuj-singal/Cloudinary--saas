import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth(); // current user

    const videos = await prisma.video.findMany({
      where: userId
        ? {
            OR: [
              { userId },           // owner sees all
              { visibility: "public" } // others see public
            ],
          }
        : { visibility: "public" }, // not logged in users
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
