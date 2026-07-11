import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/auth-guard";
import { post } from "~/services/api.server";

interface LoaderData {
  accessToken: string;
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderData | Response> {
  const url = new URL(request.url);

  // Allow unauthenticated access to the login page itself
  if (url.pathname === "/dashboard/login") {
    return { accessToken: "" };
  }

  const cookie = request.headers.get("Cookie") || "";

  // No session cookie at all — definitely not logged in
  if (!cookie) {
    return redirect("/dashboard/login");
  }

  try {
    // Forward cookies to /auth/refresh — the backend validates the session
    // via @fastify/session (sessionId cookie). If valid, returns a fresh JWT.
    const result = await post<{ access_token: string }>(
      "/auth/refresh",
      {},
      undefined,
      cookie,
    );
    return { accessToken: result.access_token };
  } catch {
    // Session expired or invalid — redirect to login
    return redirect("/dashboard/login");
  }
}

export default function AuthGuard() {
  return <Outlet />;
}
