import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@repo/prisma/client";

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

if (!baseURL) {
  throw new Error("Defina BETTER_AUTH_URL.");
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  baseURL,
});
