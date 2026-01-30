import "server-only";
import { auth } from "./auth";

import { headers } from "next/headers";

export async function isAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  if (session.user.role !== "admin") return null;

  return session;
}
