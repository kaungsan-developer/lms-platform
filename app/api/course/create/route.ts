import { NextResponse } from "next/server";
import { CreateCourseSchema } from "@/zodSchema/schema";
import prisma from "@/lib/prisma";
import {
  BotOptions,
  detectBot,
  slidingWindow,
  SlidingWindowRateLimitOptions,
} from "@arcjet/next";
import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const botOptions = {
  mode: "LIVE",
  allow: [],
} satisfies BotOptions;

const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 5,
  interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const userId = session?.user.id;
  const decision = await aj
    .withRule(detectBot(botOptions))
    .withRule(slidingWindow(restrictiveRateLimitSettings))
    .protect(request, { userId });

  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      return NextResponse.json(
        { error: "No bots allowed", reason: decision.reason },
        { status: 403 },
      );
    } else {
      return NextResponse.json(
        { error: "Forbidden", reason: decision.reason },
        { status: 403 },
      );
    }
  }
  try {
    const payLoad = await request.json();
    const validated = CreateCourseSchema.safeParse(payLoad);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Invalid Input",
        },
        { status: 400 },
      );
    }
    console.log(validated.data);

    const newCourse = await prisma.course.create({
      data: {
        ...validated.data,
        userId: "IngQn5hVbkWLPVikHpnzSk62ndAoCoE4",
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: newCourse,
        message: "New Course Created",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
