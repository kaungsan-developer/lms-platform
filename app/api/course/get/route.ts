import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(
    {
      data: courses,
      message: "Course List",
      error: null,
      success: true,
    },
    { status: 200 },
  );
}
