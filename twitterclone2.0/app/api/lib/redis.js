
import Redis from 'ioredis';

export const dynamic = 'force-dynamic';

const redis = new Redis(process.env.REDIS_URL);


export default redis;
