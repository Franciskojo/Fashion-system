interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Fixed-window rate limiter. In-memory, so it is per server instance; it slows brute force
 * on a single instance. Use a shared store (e.g. Redis) for strict limits across instances.
 */
export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();

  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

export function clearRateLimit(key: string): void {
  buckets.delete(key);
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : req.headers.get('x-real-ip')) || 'unknown';
}
