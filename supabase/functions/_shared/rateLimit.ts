// Shared ad-hoc rate limiter for the public demo's paid AI endpoints.
//
// Limits (enforced atomically in the database via public.consume_ai_quota):
//  - Per IP: 40 AI calls per rolling 60 minutes (all endpoints combined)
//  - Global: 600 AI calls per UTC calendar day (all endpoints combined)
//  - Realtime only: 3 sessions per IP per day AND 40 sessions per day globally
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RATE_LIMIT_MESSAGE =
  "The demo is at capacity right now — please try again in a little while.";

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    "unknown";
}

/**
 * Returns a 429 Response when the caller is over quota, otherwise null.
 * Fails open (returns null) if the quota check itself errors, so a database
 * hiccup never takes the demo offline.
 */
export async function enforceAiRateLimit(
  req: Request,
  corsHeaders: Record<string, string>,
  options: { isRealtime?: boolean } = {},
): Promise<Response | null> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) return null;

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabase.rpc("consume_ai_quota", {
      _ip: getClientIp(req),
      _is_realtime: options.isRealtime ?? false,
    });

    if (error) {
      console.error("Rate limit check failed:", error.message);
      return null;
    }

    if (data && (data as { allowed?: boolean }).allowed === false) {
      return new Response(JSON.stringify({ error: RATE_LIMIT_MESSAGE }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return null;
  } catch (e) {
    console.error("Rate limit check error:", e);
    return null;
  }
}
