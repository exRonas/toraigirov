import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no bcrypt / node APIs) — shared by middleware and the
// full auth instance. The `authorized` callback guards all /admin routes.
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [], // real providers are added in lib/auth.ts
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const path = request.nextUrl.pathname;
      const isAdminArea = path.startsWith("/admin");
      const isLoginPage = path === "/admin/login";

      if (isAdminArea && !isLoginPage) {
        return isLoggedIn; // redirects to signIn page when false
      }
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
