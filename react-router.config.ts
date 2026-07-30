import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    const apiBase = process.env.API_GATEWAY_URL || "";
    const slugs: string[] = [];

    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/blog?page=1&limit=100`);
        const json = await res.json();
        const blogs: { id: string }[] = json?.data?.data ?? [];
        slugs.push(...blogs.map((b) => `/blog/${b.id}`));
      } catch {
        // Blog API unavailable — skip dynamic prerendering
      }
    }

    return ["/", "/about", "/products", "/contact", "/blogs", ...slugs];
  },
} satisfies Config;
