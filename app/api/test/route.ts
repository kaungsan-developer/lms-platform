import { NextResponse } from "next/server";

import {
  BotOptions,
  detectBot,
  slidingWindow,
  SlidingWindowRateLimitOptions,
} from "@arcjet/next";
import aj from "@/lib/arcjet";
import { findIp } from "@arcjet/ip";

const botOptions = {
  mode: "LIVE",

  allow: [],
} satisfies BotOptions;

const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 1,
  interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;

export async function GET(request: Request) {
  const userId = findIp(request) || "127.0.0.1";

  const decision = await aj
    // .withRule(detectBot(botOptions))
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

  return NextResponse.json({ message: "pass" });
}
