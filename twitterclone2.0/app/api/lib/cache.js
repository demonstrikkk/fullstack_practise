import redis from './redis';

/**
 * @param {string} key - The Redis key to store the cache under
 * @param {Function} fetcherFn - A function that returns fresh data (e.g., a DB query)
 * @param {number} ttl - Time to live in seconds (default = 300)
 */
export async function getOrSetCache(key, fetcherFn, ttl = 300) {
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(`Redis hit for ${key}`);
      return JSON.parse(cached);
    }

    const freshData = await fetcherFn();
    if (freshData) {
      await redis.set(key, JSON.stringify(freshData), 'EX', ttl);
    }

    return freshData;
  } catch (error) {
    console.error(`Redis caching error for ${key}:`, error);
    return await fetcherFn(); // fallback to DB query if Redis fails
  }
}
