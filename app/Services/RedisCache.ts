import { genRedisCacheKey } from 'App/Utils/Redis';
import { RedisConfig } from 'Contracts/types';
import { createClient, RedisClient } from 'redis';


export class RedisCache implements Cache {

    private redis: RedisClient;
    /**
     * 初始化Redis连接 并设置客户端连接池用以连接复用
     */
    constructor(config: RedisConfig = { keyPrefix: '' }) {
        const { keyPrefix, host, port, password, db } = config;
        const key = genRedisCacheKey({ keyPrefix, host, port, password, db });

        // 从缓存中获取Redis连接
        if (RedisCache.hasCacheKey(key)) {
            this.redis = RedisCache.getCache(key);
        } else {
            this.redis = createClient({ prefix: keyPrefix, host, port, password, db });
            const str = `server connecting redis:// ${config.host ?? '127.0.0.1'}:${config.port ?? 6379} ${config.db ?? 0}`;
            this.redis.on('connect', () => {
                console.log(str);
            });
            this.redis.on('error', err => {
                console.log(`${str} error: ${err}`);
            });
            RedisCache.addCache(key, this.redis);
        }
    }

    public async get(key: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            this.redis.get(key, function (err, reply) {
                if (err) return reject(err);
                return resolve(reply);
            });
        });
    }

    public async set(key: string, value: any, expire?: number): Promise<"OK" | undefined> {
        return new Promise((resolve, reject) => {
            if (expire) {
                this.redis.set(key, value, 'EX', expire, (err, reply) => {
                    if (err) return reject(err);
                    return resolve(reply);
                });
            } else {
                this.redis.set(key, value, (err, reply) => {
                    if (err) return reject(err);
                    this.redis.persist(key);
                    return resolve(reply);
                });
            }
        });
    }

    /**
     * 暂存redis连接，相同配置会返回相同的redis实例
     */
    private static redisCacheMap: {
        [K: string]: { instance: RedisClient; create: number; };
    } = {};

    /**
     * 缓存连接的最大数量限制
     */
    private static maxCacheLimit: number = 10;

    /**
     * 获取缓存的redis限制
     */
    private static get MaxCacheLimit() {
        return this.maxCacheLimit;
    }

    /**
     * 设置缓存的redis限制数
     */
    private static set MaxCacheLimit(val: number) {
        if (val < 0) throw new Error('val must >= 0');
        this.maxCacheLimit = ~~val;
        // 移除超出的缓存
        const keys = Object.keys(this.redisCacheMap);
        if (keys.length > this.maxCacheLimit) {
            const needClear = keys
                .map(k => ({ key: k, create: this.redisCacheMap[k].create }))
                .sort((a, b) => a.create - b.create)
                .slice(0, keys.length - this.maxCacheLimit);

            needClear.forEach(({ key }) => {
                this.removeCache(key);
            });
        }
    }

    /**
     * 检查对应的key值是否已经有缓存
     * @param key
     */
    private static hasCacheKey(key: string) {
        return !!this.redisCacheMap[key];
    }

    /**
     * 把redis实例添加到缓存，如果超出限制，最早创建的会被删除
     * @param key
     * @param redis
     */
    private static addCache(key: string, redis: RedisClient) {
        const keys = Object.keys(this.redisCacheMap);
        if (keys.length >= this.MaxCacheLimit) {
            const first = keys
                .map(k => ({ key: k, create: this.redisCacheMap[k].create }))
                .sort((a, b) => a.create - b.create)[0].key;
            this.removeCache(first);
        }
        this.redisCacheMap[key] = {
            instance: redis,
            create: Date.now()
        };
    }

    /**
     * 移除缓存的redis连接
     * @param key
     */
    private static removeCache(key: string) {
        if (this.hasCacheKey(key)) {
            delete this.redisCacheMap[key];
        }
    }

    /**
     * 获取缓存的redis实例
     * @param key
     */
    private static getCache(key: string) {
        // 更新时间
        this.redisCacheMap[key].create = Date.now();
        return this.redisCacheMap[key].instance;
    }
}