import Cache from 'contracts/interface/Cache';

export default class CacheService implements Cache {

  constructor(private cache: Cache) {
    this.cache = cache;
  }

  public async get(key: string): Promise<string | null> {
    return this.cache.get(key);
  }

  public async set(key: string, value: any, expire?: number): Promise<"OK" | null> {
    return this.cache.set(key, value, expire);
  }

  public async eval(arg1: string, arg2: number, arg3: any[]): Promise<any> {
    return this.cache.eval(arg1, arg2, arg3);
  }
}