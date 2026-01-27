import "server-only";
import { env } from "@/lib/env";
import { EmailTemplate } from "../../../components/mails/email-template";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export async function POSTEMAIL({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["rottenfrog9@gmail.com"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: "John" }),
    });

    if (data) {
      console.log("Email sent successfully:", data);
    }
    console.log("resend email is running");

    if (error) {
      console.log("error in email route " + error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
