import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/auth-guard";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  if (url.pathname === "/dashboard/login") {
    return null;
  }
  const cookie = request.headers.get("Cookie") || "";
  const isAuth = cookie.includes("auth=true");

  if (!isAuth) {
    return redirect("/dashboard/login");
  }

  return null;
}

export default function AuthGuard() {
  return <Outlet />;
}