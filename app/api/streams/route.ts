import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/src";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { z } from "zod";

const createStreamSchema = z.object({
  url: z
    .string()
    .url("Invalid URL format") // Ensures it's a valid URL
    .refine((url) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
      return youtubeRegex.test(url);
    }, "The URL must be a valid YouTube URL"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized",
        },
        { status: 404 }
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

    const body = await req.json();

    const data = createStreamSchema.parse(body);
    const extractedId = data.url.split("?v=")[1];

    const res: any = await youtubesearchapi?.GetVideoDetails(extractedId);
    const thumbnails = res?.thumbnail?.thumbnails;
    thumbnails?.sort((a: any, b: any) => (a.width < b.width ? -1 : 1));

    const newStream = await prisma.streams.create({
      data: {
        userId: user.id,
        url: data?.url,
        extractedId,
        type: "Youtube",
        title: res?.title || "Title not found",
        smallImg:
          thumbnails?.length > 1
            ? thumbnails[thumbnails?.length - 2].url
            : thumbnails[thumbnails?.length - 1].url ??
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt9Jyw-WZ69tZum3Kh5GQeyZ3vQZKoHdQkfA&s",
        bigImg:
          thumbnails[thumbnails?.length - 1].url ??
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt9Jyw-WZ69tZum3Kh5GQeyZ3vQZKoHdQkfA&s",
      },
    });

    return NextResponse.json(
      {
        message: "stream created",
        newStream,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: " erro occured while crating a stream",
      },
      { status: 404 }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");

  if (!creatorId) {
    return NextResponse.json(
      {
        message: "invalid creator id",
      },
      { status: 404 }
    );
  }

  const [streams, currentStream] = await Promise.all([
    prisma.streams.findMany({
      where: {
        userId: creatorId,
      },
    }),
    prisma.currentStream.findFirst({
      where: {
        userId: creatorId,
      },
    }),
  ]);

  return NextResponse.json(
    {
      message: "all streams",
      streams,
      currentStream,
    },
    { status: 200 }
  );
}
