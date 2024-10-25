export interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitStore {
  tokens: Set<string>;
  timestamp: number;
}

export function rateLimit(config: RateLimitConfig) {
  const stores = new Map<string, RateLimitStore>();

  return {
    check: async (request: Request, limit: number) => {
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown';
      const now = Date.now();
      const store = stores.get(ip) || { tokens: new Set(), timestamp: now };

      // Clear tokens if interval has passed
      if (now - store.timestamp > config.interval) {
        store.tokens.clear();
        store.timestamp = now;
      }

      // Check if limit is exceeded
      if (store.tokens.size >= limit) {
        throw new Error('Rate limit exceeded');
      }

      // Add new token
      store.tokens.add(crypto.randomUUID());
      stores.set(ip, store);

      // Clean up old stores periodically
      if (stores.size > config.uniqueTokenPerInterval) {
        const oldestKey = Array.from(stores.keys())[0];
        stores.delete(oldestKey);
      }

      return true;
    },
  };
}