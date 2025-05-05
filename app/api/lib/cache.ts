interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class MemoryCache {
  private cache: Record<string, CacheItem<any>> = {};
  private readonly DEFAULT_TTL = 15 * 60 * 1000;

  get<T>(key: string): T | null {
    const item = this.cache[key];

    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > this.DEFAULT_TTL;

    if (isExpired) {
      delete this.cache[key];
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };

    // Secara otomatis hapus item dari cache setelah TTL berakhir
    setTimeout(() => {
      delete this.cache[key];
    }, ttl);
  }

  clear(): void {
    this.cache = {};
  }
}

// Export singleton instance
export const memoryCache = new MemoryCache();
