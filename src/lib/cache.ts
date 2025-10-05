/**
 * In-memory cache with TTL support
 * Suitable for serverless environments where Redis might not be available
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>>;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor() {
    this.cache = new Map();
    this.cleanupInterval = null;

    // Run cleanup every 5 minutes
    if (typeof window === 'undefined') {
      // Only in server environment
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set value in cache with TTL in seconds
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Create singleton instance
export const cache = new MemoryCache();

/**
 * Cache decorator for async functions
 */
export function withCache<T>(
  cacheKey: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Check cache first
      const cached = cache.get<T>(cacheKey);
      if (cached !== null) {
        console.log(`Cache hit for key: ${cacheKey}`);
        resolve(cached);
        return;
      }

      // Cache miss - execute function
      console.log(`Cache miss for key: ${cacheKey}`);
      const result = await fn();

      // Store in cache
      cache.set(cacheKey, result, ttlSeconds);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate cache key from multiple parts
 */
export function generateCacheKey(...parts: (string | number)[]): string {
  return parts.join(':');
}

/**
 * Cache key patterns for different resources
 */
export const CacheKeys = {
  analysis: (domain: string) => `analysis:${domain}`,
  history: (limit: number, offset: number) => `history:${limit}:${offset}`,
  stats: () => 'stats:global',
  logo: (hostname: string) => `logo:${hostname}`,
} as const;
