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
import { isAdmin } from "@/lib/dal";

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
  const session = await isAdmin();

  if (!session) {
    return NextResponse.json(
      { data: null, message: "Forbidden", error: true, success: false },
      { status: 403 },
    );
  }

  const userId = session?.user.id;

  try {
    const decision = await aj
      .withRule(detectBot(botOptions))
      .withRule(slidingWindow(restrictiveRateLimitSettings))
      .protect(request, { userId });

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return NextResponse.json(
          {
            data: null,
            message: "No bots allowed",
            success: false,
            error: decision.reason,
          },
          { status: 403 },
        );
      } else {
        return NextResponse.json(
          {
            data: null,
            message: "Forbidden",
            error: decision.reason,
            success: false,
          },
          { status: 403 },
        );
      }
    }
    const payLoad = await request.json();
    const validated = CreateCourseSchema.safeParse(payLoad);
    if (!validated.success) {
      return NextResponse.json(
        {
          data: null,
          message: "Validation Failed.",
          error: validated.error,
          success: false,
        },
        { status: 400 },
      );
    }

    const newCourse = await prisma.course.create({
      data: {
        ...validated.data,
        userId,
      },
    });
    return NextResponse.json(
      {
        data: newCourse,
        message: "New Course Created",
        error: null,
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Internal Server Error",
        error: error,
        success: false,
      },
      { status: 500 },
    );
  }
}
