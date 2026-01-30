import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: {
      id: id,
    },
  });

  if (!course) {
    return NextResponse.json({
      data: null,
      message: "Course Not Found.",
      error: true,
      success: false,
    });
  }

  return NextResponse.json({
    data: course,
    message: "Course",
    error: false,
    success: true,
  });
}
