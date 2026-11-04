type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local-client";
}

export function checkRateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 10000) {
    for (const [key, entry] of buckets) if (entry.resetAt <= now) buckets.delete(key);
  }
  const key = `${scope}:${clientKey(request)}`;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return { allowed: current.count <= limit, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
}

export function rateLimitResponse(retryAfter: number) {
  return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
    status: 429,
    headers: { "content-type": "application/json", "cache-control": "no-store", "retry-after": String(retryAfter) },
  });
}
