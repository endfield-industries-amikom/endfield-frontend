import type { Route } from "./+types/image-proxy";

export async function loader({ params, request }: Route.LoaderArgs) {
  const id = params.id;

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const cdnUsed = process.env.CDN_USED === "true";
  const cdnBase = process.env.CDN_BASE_URL || "";

  /* ------------------------------------------------------------------ */
  /*  CDN mode – redirect directly to the CDN                           */
  /* ------------------------------------------------------------------ */
  if (cdnUsed && cdnBase) {
    const cdnUrl = `${cdnBase.replace(/\/+$/, "")}/image/${id}`;
    return fetch(cdnUrl, { redirect: "follow" }).then((res) => {
      if (!res.ok) {
        return new Response("Image not found", { status: res.status });
      }
      return res;
    }).catch(() => new Response("Image fetch failed", { status: 502 }));
  }

  /* ------------------------------------------------------------------ */
  /*  Backend proxy mode                                                */
  /* ------------------------------------------------------------------ */
  const apiBase = process.env.API_GATEWAY_URL || "";

  if (!apiBase) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const backendRes = await fetch(`${apiBase}/image/${id}`, {
      headers: {
        Cookie: request.headers.get("Cookie") || "",
      },
    });

    if (!backendRes.ok) {
      return new Response("Image not found", { status: backendRes.status });
    }

    const contentType = backendRes.headers.get("Content-Type") || "image/jpeg";
    const buffer = await backendRes.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Image fetch failed", { status: 502 });
  }
}
