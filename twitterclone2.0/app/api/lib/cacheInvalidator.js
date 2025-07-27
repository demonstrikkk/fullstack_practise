import redis from "./redis";

export async function invalidateCache(key) {
  try {
    await redis.del(key);
  } catch (err) {
  }
}
