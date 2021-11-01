import Redis from '@ioc:Adonis/Addons/Redis'
import Good from 'App/Models/Good';
import { Retryable } from './RetryService';

export default class RedisService {
  public static async initGoods() {
    const result = await Good.all();
    if (result.length) {
      await Promise.all(result.map(async (good) => {
        await Redis.set(`good_${good.goodsId}`, good.stock);
      }))
    }
  }

  /**
   * 更新Redis库存
   */
  @Retryable({ maxAttempts: 2, backOff: 3000 })
  public static async updateStock(goodsId: string, stock: number) {
    await Redis.set(`good_${goodsId}`, stock);
  }

  /**
   * 直接在Redis中查询 商品是否存在，不存在 库存为0也直接返回404
   */
  public static async getGoodsById(goodsId: string) {
    const data = await Redis.get(`good_${goodsId}`);
    return data;
  }
}