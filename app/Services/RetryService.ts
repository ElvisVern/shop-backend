import UtilService from "./UtilService";
import Logger from "@ioc:Adonis/Core/Logger";
/**
 * 失败重试的方法装饰器
 * @param options
 */
export function Retryable(options: RetryOptions): Function {
  return function (_target: Record<string, any>, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalFn: Function = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await retryAsync.apply(this, [originalFn, args, options.maxAttempts, options.backOff]);
      } catch (e) {
        if (e instanceof MaxAttemptsError) {
          const msgPrefix = `Failed for '${propertyKey}' for ${options.maxAttempts} times!`;
          e.message = `${msgPrefix} Original Error: ${e.message}` ?? msgPrefix;
        }
        Logger.error(e.message);
        // TODO 推送邮件通知
      }
    };
    return descriptor;
  };

  async function retryAsync(fn: Function, args: any[], maxAttempts: number, backOff?: number): Promise<any> {
    try {
      return await fn.apply(this, args);
    } catch (e) {
      if (--maxAttempts < 0) {
        e?.message && console.error(e.message);
        throw new MaxAttemptsError(e?.message);
      }
      backOff && (await UtilService.sleep(backOff));
      return retryAsync.apply(this, [fn, args, maxAttempts, backOff]);
    }
  }

}

export class MaxAttemptsError extends Error {
  code = '429'
}

export interface RetryOptions {
  /**
   * 最大重试次数
   */
  maxAttempts: number;
  /**
   * 重试间隔 毫秒数
   */
  backOff?: number;
}
