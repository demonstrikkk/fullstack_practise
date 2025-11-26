import Redis from 'ioredis';

export const dynamic = 'force-dynamic';

let redis = null;

// Only create Redis connection if URL is provided and valid
if (process.env.REDIS_URL && typeof window === 'undefined') {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        // Stop retrying after 3 attempts
        if (times > 3) {
          console.warn('Redis connection failed after 3 attempts. Running without Redis cache.');
          return null;
        }
        // Retry after delay
        return Math.min(times * 200, 1000);
      },
      reconnectOnError(err) {
        // Only reconnect on specific errors
        const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
        if (targetErrors.some(targetError => err.message.includes(targetError))) {
          return true;
        }
        return false;
      },
      lazyConnect: true, // Don't connect immediately
      enableOfflineQueue: false, // Don't queue commands when offline
    });

    // Suppress error event spam
    redis.on('error', (err) => {
      console.warn('Redis connection error:', err.message);
    });

    // Optional: Log successful connection
    redis.on('connect', () => {
      console.log('Redis connected successfully');
    });

    // Attempt to connect (but don't block if it fails)
    redis.connect().catch((err) => {
      console.warn('Redis initial connection failed:', err.message);
      redis = null; // Disable Redis if connection fails
    });

  } catch (error) {
    console.warn('Redis initialization error:', error.message);
    redis = null;
  }
} else {
  console.log('Redis URL not provided or running in browser - Redis caching disabled');
}

// Export a safe Redis wrapper that handles null cases
export default {
  async get(key) {
    if (!redis) return null;
    try {
      return await redis.get(key);
    } catch (error) {
      console.warn(`Redis get error: ${error.message}`);
      return null;
    }
  },

  async set(key, value, ...args) {
    if (!redis) return 'OK';
    try {
      return await redis.set(key, value, ...args);
    } catch (error) {
      console.warn(`Redis set error: ${error.message}`);
      return 'OK';
    }
  },

  async del(key) {
    if (!redis) return 0;
    try {
      return await redis.del(key);
    } catch (error) {
      console.warn(`Redis del error: ${error.message}`);
      return 0;
    }
  },

  async exists(key) {
    if (!redis) return 0;
    try {
      return await redis.exists(key);
    } catch (error) {
      console.warn(`Redis exists error: ${error.message}`);
      return 0;
    }
  },

  async expire(key, seconds) {
    if (!redis) return 0;
    try {
      return await redis.expire(key, seconds);
    } catch (error) {
      console.warn(`Redis expire error: ${error.message}`);
      return 0;
    }
  },

  async ttl(key) {
    if (!redis) return -2;
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.warn(`Redis ttl error: ${error.message}`);
      return -2;
    }
  },

  // Disconnect method for cleanup
  async disconnect() {
    if (redis) {
      try {
        await redis.quit();
      } catch (error) {
        console.warn('Redis disconnect error:', error.message);
      }
    }
  }
};
