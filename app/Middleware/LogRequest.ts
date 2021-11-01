import Logger from "@ioc:Adonis/Core/Logger";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UtilService from "App/Services/UtilService";

export default class LogRequest {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const reqLabel = UtilService.getCurrentTime();
    const url = request.url();
    const method = request.method();
    // 这里先拿请求头中的IP 后面改成Nginx中的IP
    const ip = request.ip();
    const beginTime = Date.now();
    // 记录请求
    Logger.info(`[${reqLabel}] --> ${ip} ${method} ${url}
      requestId: ${request.headers()['x-request-id']}
      params: ${UtilService.jsonString(request.params())}
      query: ${UtilService.jsonString(request.qs())}
      body: ${UtilService.jsonString(request.body())}
    `);
    await next()

    response.response.on("finish", () => {
      const endTime = Date.now();
      const diffTime = endTime - beginTime;

      const statusCode = response.response.statusCode;
      Logger.info(
        `[${reqLabel}] --> ${ip} ${method} ${url} requestId: ${request.headers()['x-request-id']} -- [${statusCode}] in ${diffTime}ms`
      );
    });
  }
}
