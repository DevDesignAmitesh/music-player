import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/src";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
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
      email: session.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "user not found",
      },
      {
        status: 404,
      }
    );
  }

  const streams = await prisma.streams.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      upvote: {
        _count: "desc",
      },
    },
  });

  if (!streams) {
    return NextResponse.json(
      {
        message: "streams not found",
      },
      { status: 404 }
    );
  }

  await Promise.all([
    prisma.currentStream.upsert({
      where: {
        userId: user.id,
      },
      update: {
        streamId: streams.id,
      },
      create: {
        userId: user.id,
        streamId: streams.id,
      },
    }),
    prisma.streams.delete({
      where: {
        id: streams.id,
      },
    }),
  ]);

  return NextResponse.json(
    {
      message: "done..",
      streams,
    },
    { status: 200 }
  );
}
