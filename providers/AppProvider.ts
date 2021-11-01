import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {
  }

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
    // 初始化 商品数据到 Redis
    const RedisService = await (await import('App/Services/RedisService')).default;
    RedisService.initGoods();

    const CpuOverload = await (await import('App/Middleware/CpuOverload')).default;
    new CpuOverload().check();
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
