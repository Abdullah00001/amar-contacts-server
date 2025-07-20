import redisClient from '@/configs/redis.configs';
import { Queue } from 'bullmq';

export const EmailQueue = new Queue('email-queue', { connection: redisClient });
