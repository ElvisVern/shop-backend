import { RedisOptions } from 'ioredis'
import Env from '@ioc:Adonis/Core/Env'

export const redisCacheConfig: RedisOptions = {
  host: Env.get('REDIS_HOST', 'localhost'),
  port: Env.get('REDIS_PORT', '6379'),
  db: Env.get('REDIS_DB', 0),
  password: Env.get('REDIS_PASSWORD', ''),
  keyPrefix: Env.get('REDIS_PREFIX', 'shop_')
}