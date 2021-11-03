import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import CacheService from 'App/Services/CacheService';
import RedisCacheService from 'App/Services/RedisCacheService';
import { redisCacheConfig } from '../config/cache';

export default class AppProvider {
  constructor(protected app: ApplicationContract) {
  }

  public register() {
    // Register your own bindings
    const redisConfig = redisCacheConfig;
    const redisCache = new RedisCacheService(redisConfig);

    this.app.container.singleton('App/CacheService', () => {
      return new CacheService(redisCache);
    });
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
    // 初始化 商品数据到 Redis
    const RedisUtil = await (await import('App/Utils/Redis/RedisUtil')).default;
    RedisUtil.initGoods();

    // const CpuOverload = await (await import('App/Middleware/CpuOverload')).default;
    // new CpuOverload().check();
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
