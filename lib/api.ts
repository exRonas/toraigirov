import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/** Returns the admin session, or null if unauthenticated. */
export async function getSession() {
  return auth();
}

/** Guard for mutating API routes. Throws a Response (401) when not signed in. */
export async function requireAuth(): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = "Internal error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

/** Wrap a handler so thrown Response objects (from requireAuth) are returned. */
export async function withGuard(
  fn: () => Promise<Response>
): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof Response) return e;
    console.error(e);
    return serverError(e instanceof Error ? e.message : "Internal error");
  }
}
