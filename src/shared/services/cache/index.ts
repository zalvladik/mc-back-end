import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class CacheService {
  private readonly cache = new Map<string, unknown>()

  reset(): void {
    this.cache.clear()
  }

  set(key: string | number, value: unknown): void {
    this.cache.set(String(key), value)
  }

  get<T>(key: string | number): T | undefined {
    const cache = this.cache.get(String(key)) as T | undefined

    if (!cache) throw new NotFoundException('Кеш відсутній')

    return cache
  }

  delete(key: string | number): void {
    this.cache.delete(String(key))
  }
}
