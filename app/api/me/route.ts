import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/src";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  if (!creatorId) {
    return NextResponse.json(
      {
        message: "creatorId not found",
      },
      { status: 404 }
    );
  }
  try {
    const session = await getServerSession(auth);

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized",
        },
        { status: 401 }
      );
    }

    const email = session?.user?.email;

    const user = await prisma.user.findUnique({
      where: {
        email: email || "",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "user not found",
        },
        { status: 404 }
      );
    }

    const allStreams = await prisma.streams.findMany({
      where: {
        userId: creatorId,
      },
      include: {
        _count: {
          select: {
            upvote: true,
          },
        },
        upvote: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "all streams found",
        allStreams,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET handler:", error);

    // Ensure payload is always a valid object
    return NextResponse.json(
      {
        message: "error",
        error:
          error instanceof Error
            ? error.message
            : String(error) || "Unknown error",
      },
      { status: 500 }
    );
  }
}
