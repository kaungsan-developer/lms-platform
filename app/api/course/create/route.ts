import { NextResponse } from "next/server";
import { CreateCourseSchema } from "@/zodSchema/schema";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
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
