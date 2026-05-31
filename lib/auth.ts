import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

// @next/env раскрывает $VAR в значениях .env, что ломает bcrypt-хеши (они начинаются с $2a$10$...).
// Решение: хеш хранится в ADMIN_PASSWORD_HASH_B64 (base64), здесь декодируем обратно.
function getAdminHash(): string {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64 ?? "";
  if (!b64) return "";
  return Buffer.from(b64, "base64").toString("utf8");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim();
        const adminHash = getAdminHash();
        if (!adminEmail || !adminHash) return null;

        if (email.toLowerCase() !== adminEmail.toLowerCase()) return null;

        const valid = await bcrypt.compare(password, adminHash);
        if (!valid) return null;

        return { id: "admin", email: adminEmail, name: "Administrator" };
      },
    }),
  ],
});
