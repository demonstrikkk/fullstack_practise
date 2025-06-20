import redis from "./redis";

export async function invalidateCache(key) {
  try {
    await redis.del(key);
    console.log(`Cache invalidated for ${key}`);
  } catch (err) {
    console.error(`Failed to invalidate cache for ${key}:`, err);
  }
}
