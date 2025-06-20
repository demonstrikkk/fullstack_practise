// import Redis from "ioredis";

// const redis = new Redis(process.env.REDIS_URL); 
// // Example: "redis://localhost:6379" or "rediss://user:pass@host:port"

// redis.ping().then(console.log).catch(console.error);

// export default redis;

// lib/redis.js
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost', // or Redis server address
  port: 6379,
  // password: 'yourpassword', // if needed
});

export default redis;
