import Logger from "@ioc:Adonis/Core/Logger";
import Order from "App/Models/Order";
import { Retryable } from "App/Services/RetryService";

export default class Deliver {

  @Retryable({ maxAttempts: 2, backOff: 3000 })
  public static deliverNotify(order: Order) {

    Logger.info("deliver goods notify..", {
      orderId: order.orderId,
      goodsId: order.goodsId,
      userId: order.userId
    });

    try {
      // 这里可以发送到 MQ 失败自动重试两次
    } catch (error) {
      // 这里抛出异常实现自动重试处理
      // throw new Error(error);
    }
  }
}
