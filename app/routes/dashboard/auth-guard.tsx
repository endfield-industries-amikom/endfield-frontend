import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/auth-guard";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  if (url.pathname === "/dashboard/login") {
    return null;
  }

  return redirect("/dashboard/login");
}

export default function AuthGuard() {
  return <Outlet />;
}