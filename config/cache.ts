import { RedisOptions } from 'ioredis'

export const redisCacheConfig: RedisOptions = {
  host: 'localhost',
  port: 6379,
  db: 0,
  password: '',
  keyPrefix: 'shop_'
}