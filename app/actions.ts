"use server";

import { auth } from "@/lib/auth";
import { registerSchema, signInSchema } from "./schemas/authSchema";
import z from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// signUp with email and password
export async function signUpAction(values: z.infer<typeof registerSchema>) {
  const { data, success } = registerSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid input data");
  }
  const res = await auth.api
    .signUpEmail({
      body: {
        name: data.name, // required
        email: data.email, // required
        password: data.password, // required
        callbackURL: "http://localhost:3000/",
      },
    })
    .then(() => {
      return { success: true };
    })
    .catch((error) => ({ success: false, error }));

  return res;
}
// signIn with email and password
export async function signInAction(values: z.infer<typeof signInSchema>) {
  const { data, success } = signInSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid input data");
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
        rememberMe: true,
      },
      headers: await headers(),
    });
  } catch (error: any) {
    if (error.statusCode === 403) {
      redirect("/verify-email");
    }

    throw new Error(error.message);
  }
}

// signOut
export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
}
// get auth user's session
export async function getSessionAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}
