import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge middleware using only the edge-safe config (no bcrypt).
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
