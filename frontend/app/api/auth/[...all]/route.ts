import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Mount Better Auth on /api/auth/[...all]
// This exposes all Better Auth endpoints (sign-in, get-session, etc.)
export const { GET, POST } = toNextJsHandler(auth);

