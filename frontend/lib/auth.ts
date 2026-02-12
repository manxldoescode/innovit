import { betterAuth } from "better-auth";

// Server-side Better Auth instance
// Currently configured for stateless Google OAuth.
// For real production usage, you should:
// - Set BETTER_AUTH_SECRET and BETTER_AUTH_URL in your env
// - Provide real GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
// - Later, plug in a database adapter (e.g. Prisma) if you need
//   email/password auth or persistent user data.

const googleClientId = process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID";
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET";

export const auth = betterAuth({
  // No database config -> Better Auth runs in stateless mode
  // using signed/encrypted cookies only.
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
});

export type AuthInstance = typeof auth;

