// testRedis.js
import redis from './lib/redis.js';

(async () => {
  try {
    await redis.set('testkey', 'hello', 'EX', 10);
    const val = await redis.get('testkey');
    console.log('Redis working ✅:', val);
  } catch (err) {
    console.error('Redis test failed ❌:', err.message);
  }
})();
