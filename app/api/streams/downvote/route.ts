import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/src";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const upvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = upvoteSchema.parse(body);

    const session = await getServerSession(auth);

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email || "",
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

    const downVoted = await prisma.upvote.delete({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.streamId,
        },
      },
    });

    return NextResponse.json(
      {
        message: "down voted done",
        downVoted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "error while upvoting",
      },
      { status: 404 }
    );
  }
}
