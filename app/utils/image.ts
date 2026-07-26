/**
 * Ensures a raw imageUri has a protocol so the browser treats it as an
 * absolute URL instead of resolving it as a relative route path.
 *
 *   "cdn.example.com/images/foo.png" → "https://cdn.example.com/images/foo.png"
 *   "https://cdn.example.com/foo.png" → unchanged
 *   "/local/foo.png"                  → unchanged (relative, stays as-is)
 *   null / undefined                  → undefined
 */
export function normalizeImageUrl(
  rawUri: string | null | undefined,
): string | undefined {
  if (!rawUri) return undefined;

  // Already absolute (has protocol) or relative (starts with /) — leave alone
  if (/^(https?:\/\/|\/)/i.test(rawUri)) return rawUri;

  return `https://${rawUri}`;
}
