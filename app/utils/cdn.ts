/**
 * CDN URL helper — reads VITE_CDN_URL from environment.
 * Callable from server (loader) or client (component).
 */

const CDN_BASE = import.meta.env.VITE_CDN_URL
  ? import.meta.env.VITE_CDN_URL.replace(/\/+$/, "")
  : "";

/** Prefix a relative asset path with the CDN base URL. */
export function cdnUrl(path: string): string {
  if (!CDN_BASE) return path; // no CDN configured — leave as-is
  if (/^(https?:\/\/|\/)/i.test(path)) return path; // already absolute or root-relative
  return `${CDN_BASE}/${path}`;
}

/** Returns the CDN base URL itself (for constructing full URLs manually). */
export function getCdnBase(): string {
  return CDN_BASE;
}
