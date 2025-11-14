import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await context.params;

    // Ensure user is logged in
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      visibility: "private" | "public";
    };

    // Only allow updating if the video belongs to the user
    const updated = await prisma.video.updateMany({
      where: { id: videoId, userId },
      data: { visibility: body.visibility },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: videoId,
      visibility: body.visibility,
    });
  } catch (err) {
    console.error("PATCH video failed", err);
    return NextResponse.json(
      { error: "Failed to update visibility" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await context.params;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await prisma.video.deleteMany({
      where: { id: videoId, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: videoId, deleted: true });
  } catch (err) {
    console.error("DELETE video failed", err);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
