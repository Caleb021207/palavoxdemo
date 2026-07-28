// Restricts CORS to this app's own origins instead of a wildcard.
const ALLOWED_ORIGINS = [
  "https://palavoxdemo.lovable.app",
  "http://localhost:8080",
  "http://localhost:5173",
];

// Lovable preview/sandbox origins for this project
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/[a-z0-9-]*preview--[a-z0-9-]+\.lovable\.app$/i,
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/i,
];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

export function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Vary": "Origin",
  };
}
