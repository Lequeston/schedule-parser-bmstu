import { createClient } from 'redis';
import logger from '../config/logger';

export const cacheClient = createClient({
  url: `redis://:${process.env.CACHE_PASSWORD}@${process.env.CACHE_HOST}:${process.env.CACHE_PORT}`,
});

cacheClient.on('error', (err) => logger.error('Redis Client Error', err));