"use client";

import { SessionProvider } from "next-auth/react";

// Wraps the whole /admin area (login + panel) with the NextAuth session context.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
