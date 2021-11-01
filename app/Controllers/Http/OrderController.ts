import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiException } from 'App/Exceptions/ApiExceptions';
import Order from 'App/Models/Order';
import apiResponse from 'App/Services/ApiResponse';
import RedisService from 'App/Services/RedisService';
import UtilService from 'App/Services/UtilService';
import { ActionResult, OrderStatusEnum } from '../Enums';
import { v4 as uuid } from "uuid";
import Good from 'App/Models/Good';
import Redis from '@ioc:Adonis/Addons/Redis';
import { lock, unlock, stock } from 'App/Utils/Sctipts';
import Database from '@ioc:Adonis/Lucid/Database';
import Event from '@ioc:Adonis/Core/Event'

export default class OrderController {

  private goodsIsNotEnoughMessage = 'goods stock is not enough!';
  private goodsIsNullOrNotEnoughMessage = 'goods not found or stock is not enough!!';
  private goodsIdIsNullMessage = 'goods id required';
  private goodsOrderFailedMessage = 'goods order failed!';

  public async add({ request, response, auth }: HttpContextContract) {
    // 参数验证
    const goodsId = request.input('goods_id');
    if (!goodsId) return new ApiException(422, this.goodsIdIsNullMessage);
    const userId = String(auth.user!.id);

    // 判断商品是否存在
    const stockNum = await RedisService.getGoodsById(goodsId);
    if (!stockNum) return new ApiException(422, this.goodsIsNullOrNotEnoughMessage);

    // 加锁，限制一个用户3秒内只能购买一次
    const expireTime = 3;
    const lockKey = `lock:${userId}:${goodsId}`;
    await Redis.eval(lock, 2, [lockKey, 'releaseTime', uuid(), expireTime]);
    try {
      // 扣库存
      const count = await Redis.eval(stock, 1, [`good_${goodsId}`, '']);
      if (count <= 0) {
        return new ApiException(501, this.goodsIsNotEnoughMessage);
      }
      // 开始创建订单, 已经经过Redis的库存过滤，所以这里的数据库写操作是相对安全的
      const order = await this.createOrder(goodsId, userId, count - 1);
      if (!order) return new ApiException(500, this.goodsOrderFailedMessage);

      // 异步发货系统通知
      Event.emit('notify:diliver_goods', order);
    } catch (error) {
      // 解锁
      await Redis.eval(unlock, 1, [lockKey, uuid]);
      return new ApiException(501, this.goodsIsNotEnoughMessage);
    }
    return apiResponse(response, ActionResult.Success);
  }

  private async createOrder(goodsId: string, userId: string, count: number) {
    // 查询商品价格
    const good = await Good.query().where('goods_id', goodsId).firstOrFail();
    // 创建订单
    // 省略支付和支付验证过程，假设直接支付成功
    const order = new Order();
    order.orderId = uuid();
    order.goodsId = goodsId;
    order.userId = userId;
    order.orderStatus = OrderStatusEnum.SUCCESSED;
    order.orderPrice = good.price;
    order.createdAt = UtilService.getUnixTimeNow();

    let result = {} as Order;
    // 更新库存数量
    // 使用事务
    await Database.transaction(async (trx) => {
      good.stock = count;
      good.useTransaction(trx);
      await good.save();
      order.useTransaction(trx);
      result = await order.save();
    });
    return result;
  }
}