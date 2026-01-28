import supabase from "@/lib/supabase-client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const FileUploadSchema = z.object({
  fileName: z.string().min(1, "File Name is required"),
  contentType: z.string().min(1, "Content Type is required"),
});

export async function POST(request: Request) {
  try {
    const payLoad = await request.json();
    const validation = FileUploadSchema.safeParse(payLoad);

    if (validation.error) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    const { fileName, contentType } = validation.data;
    const uniqueFileName = `${uuidv4()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from("next-js-lms")
      .createSignedUploadUrl(`course-thumbnails/${uniqueFileName}`);

    const { data: publicUrlResponse } = supabase.storage
      .from("next-js-lms")
      .getPublicUrl(`course-thumbnails/${uniqueFileName}`);

    const response = {
      signedUrl: data?.signedUrl,
      publicUrl: publicUrlResponse.publicUrl,
    };

    if (data) {
      return NextResponse.json(response);
    } else {
      console.log(error);
      return;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
