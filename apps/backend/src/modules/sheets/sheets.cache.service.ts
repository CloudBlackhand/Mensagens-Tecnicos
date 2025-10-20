import { Injectable } from '@nestjs/common';

interface CacheItem<T> {
  data: T;
  expires: number;
}

@Injectable()
export class SheetsCacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutos

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T, customTTL?: number): void {
    const expires = Date.now() + (customTTL || this.TTL);
    this.cache.set(key, { data, expires });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    return item ? Date.now() <= item.expires : false;
  }

  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      memoryUsage: this.getMemoryUsage(),
    };
  }

  private getMemoryUsage(): string {
    const usage = process.memoryUsage();
    return `${Math.round(usage.heapUsed / 1024 / 1024)}MB`;
  }

  // Limpar entradas expiradas periodicamente
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }
}
