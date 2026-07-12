import { post } from "~/services/api.server";

/** Refresh JWT from session cookie. Call in every server-side loader. */
export async function getAccessToken(cookie: string): Promise<string> {
  const tokenRes = await post<{ data: { access_token: string } }>(
    "/auth/refresh",
    {},
    undefined,
    cookie,
  );
  return tokenRes.data.access_token;
}
