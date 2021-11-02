import { ClientOpts } from 'redis';

export type RedisConfig = ClientOpts & { keyPrefix: string };