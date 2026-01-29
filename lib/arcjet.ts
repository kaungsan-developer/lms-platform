import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/next";

import { env } from "@/lib/env";
const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});

export default aj;
