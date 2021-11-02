import { RedisConfig } from "contracts/types/index";
import { createHash } from 'crypto';

/**
 * 根据redis参数生成key值，用于缓存连接
 * @param options
 */
export function genRedisCacheKey(options: RedisConfig) {
    const { keyPrefix, host, port, db } = options;
    const str = `${keyPrefix || ''}_${host || '127.0.0.1'}_${port || 6379}_${db || 0}`;
    const md5 = createHash('md5');
    return md5
        .update(str)
        .digest('hex')
        .toUpperCase();
}
