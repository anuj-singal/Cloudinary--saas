// app/api/videos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;

    // ✅ Only owner can delete their video
    const deleted = await prisma.video.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0)
      return NextResponse.json({ error: "Video not found or not yours" }, { status: 404 });

    return NextResponse.json({ message: "Video deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
