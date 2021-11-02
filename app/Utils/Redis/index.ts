import { RedisOptions } from 'ioredis'
import { createHash } from 'crypto';

/**
 * 根据redis参数生成key值，用于缓存连接
 * @param options
 */
export function genRedisCacheKey(options?: RedisOptions) {
  const str = `${options?.keyPrefix || ''}_${options?.host || '127.0.0.1'}_${options?.port || 6379}_${options?.db || 0}`;
  const md5 = createHash('md5');
  return md5
    .update(str)
    .digest('hex')
    .toUpperCase();
}
