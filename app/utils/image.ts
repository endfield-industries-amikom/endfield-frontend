import { cdnUrl } from "./cdn";

/**
 * Ensures a raw imageUri can be used as a full URL.
 *
 *   "HeroSection.png"       → "https://endfield-cdn.example.com/HeroSection.png" (CDN)
 *   "cdn.example.com/foo"   → "https://cdn.example.com/foo" (bare hostname)
 *   "https://cdn.example/foo.png" → unchanged
 *   "/local/foo.png"        → unchanged (root-relative)
 *   null / undefined        → undefined
 */
export function normalizeImageUrl(
  rawUri: string | null | undefined,
): string | undefined {
  if (!rawUri) return undefined;

  // Already absolute (has protocol) or root-relative — leave alone
  if (/^(https?:\/\/|\/)/i.test(rawUri)) return rawUri;

  // Bare filename (no domain-like dots after the start) — use CDN if configured
  if (!rawUri.includes(".") || !rawUri.match(/\.\w{2,}/)) {
    return cdnUrl(rawUri);
  }

  // Bare hostname like cdn.example.com/foo.png — add protocol
  return `https://${rawUri}`;
}
