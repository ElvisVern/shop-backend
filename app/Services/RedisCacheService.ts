import Cache from "Contracts/interface/Cache";
import { genRedisCacheKey } from 'App/Utils/Redis';
import Redis, { RedisOptions } from 'ioredis'
import Logger from "@ioc:Adonis/Core/Logger";
export default class RedisCacheService implements Cache {

  private redis: Redis.Redis;
  /**
   * 实现通用的Redis连接池
   * 初始化Redis连接
   */
  constructor(config?: RedisOptions) {
    const key = genRedisCacheKey(config);
    // 从缓存中获取Redis连接
    if (RedisCacheService.hasCacheKey(key)) {
      this.redis = RedisCacheService.getCache(key);
      console.log(RedisCacheService.redisCacheMap);
    } else {
      const str = `server connecting redis:// ${config?.host ?? '127.0.0.1'}:${config?.port ?? 6379} ${config?.db ?? 0} ${config?.password ?? ''}`;
      this.redis = new Redis(config)
      this.redis.on('connect', () => {
        Logger.info(str);
      });
      this.redis.on('error', err => {
        Logger.error(`${str} error: ${err}`);
      });
      RedisCacheService.addCache(key, this.redis);
    }
  }

  public async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  public async set(key: string, value: any, expire?: number): Promise<"OK" | null> {
    if (expire) {
      return this.redis.set(key, value, 'EX', expire);
    } else {
      const result = this.redis.set(key, value);
      this.redis.persist(key);
      return result;
    }
  }

  public async eval(arg1: string, arg2: number, arg3: any[]): Promise<any> {
    return this.redis.eval(arg1, arg2, arg3);
  }

  /**
   * 暂存redis连接，相同配置会返回相同的redis实例
   */
  private static redisCacheMap: {
    [K: string]: { instance: Redis.Redis; create: number; };
  } = {};

  /**
   * 缓存连接的最大数量限制
   */
  private static maxCacheLimit: number = 10;

  /**
   * 获取缓存的redis限制
   */
  private static get MaxCacheLimit() {
    return this.maxCacheLimit;
  }

  /**
   * 设置缓存的redis限制数
   */
  private static set MaxCacheLimit(val: number) {
    if (val < 0) throw new Error('val must >= 0');
    this.maxCacheLimit = ~~val;
    // 移除超出的缓存
    const keys = Object.keys(this.redisCacheMap);
    if (keys.length > this.maxCacheLimit) {
      const needClear = keys
        .map(k => ({ key: k, create: this.redisCacheMap[k].create }))
        .sort((a, b) => a.create - b.create)
        .slice(0, keys.length - this.maxCacheLimit);

      needClear.forEach(({ key }) => {
        this.removeCache(key);
      });
    }
  }

  /**
   * 检查对应的key值是否已经有缓存
   * @param key
   */
  private static hasCacheKey(key: string) {
    return !!this.redisCacheMap[key];
  }

  /**
   * 把redis实例添加到缓存，如果超出限制，最早创建的会被删除
   * @param key
   * @param redis
   */
  private static addCache(key: string, redis: Redis.Redis) {
    const keys = Object.keys(this.redisCacheMap);
    if (keys.length >= this.MaxCacheLimit) {
      const first = keys
        .map(k => ({ key: k, create: this.redisCacheMap[k].create }))
        .sort((a, b) => a.create - b.create)[0].key;
      this.removeCache(first);
    }
    this.redisCacheMap[key] = {
      instance: redis,
      create: Date.now()
    };
  }

  /**
   * 移除缓存的redis连接
   * @param key
   */
  private static removeCache(key: string) {
    if (this.hasCacheKey(key)) {
      delete this.redisCacheMap[key];
    }
  }

  /**
   * 获取缓存的redis实例
   * @param key
   */
  private static getCache(key: string) {
    // 更新时间
    this.redisCacheMap[key].create = Date.now();
    return this.redisCacheMap[key].instance;
  }
}