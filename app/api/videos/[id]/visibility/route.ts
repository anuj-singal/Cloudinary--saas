// app/api/videos/[id]/visibility/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    const body = (await request.json()) as { visibility: "private" | "public" };

    // ✅ Only allow the owner to update visibility
    const updated = await prisma.video.updateMany({
      where: { id, userId },
      data: { visibility: body.visibility },
    });

    if (updated.count === 0)
      return NextResponse.json({ error: "Video not found or not yours" }, { status: 404 });

    return NextResponse.json({ message: "Visibility updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update visibility" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
