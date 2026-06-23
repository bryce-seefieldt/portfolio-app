export const BASE_SECURITY_HEADERS = [
  ["X-Frame-Options", "DENY"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-XSS-Protection", "1; mode=block"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Permissions-Policy", "geolocation=(), microphone=(), camera=()"],
  ["Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload"],
] as const;

export function buildCsp(nonce: string) {
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' https://cdn.vercel-analytics.com`
      : `script-src 'self' 'nonce-${nonce}' https://cdn.vercel-analytics.com`;

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://vitals.vercel-analytics.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}
