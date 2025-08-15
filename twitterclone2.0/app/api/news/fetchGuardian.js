


import { CACHE_EXPIRY_HOURS_GENERAL, CACHE_EXPIRY_HOURS_PERSONALIZED } from "../lib/constants";
import dbConnect from "../lib/dBconnect";
import { NewsCache } from "../lib/models/NewsCache";
import UserProfile from "../lib/models/UserProfile";
import redis from "../lib/redis";
const GUARDIAN_API_KEY = process.env.NEWS_API_KEY;
export const dynamic = 'force-dynamic';

// Fetch fresh news from The Guardian API
async function fetchGuardianNews(tag, userEmail = null) {
  let url = `https://content.guardianapis.com/search?show-fields=thumbnail,headline,trailText,body&api-key=${GUARDIAN_API_KEY}`;

  if (userEmail) {
    // Personalized fetch logic — treat each tag as its own section
    url += `&section=${tag}`;
  } else {
    switch (tag) {
      case "general":
        url += `&section=news`;
        break;
      case "sports":
        url += `&section=sport`;
        break;
      case "trending":
        url += `&order-by=newest`;
        break;
      case "entertainment":
        url += `&section=film`;
        break;
      default:
        url += `&section=${tag}`;
        break;
    }
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch from Guardian API");

  const data = await res.json();

  return data.response.results.map((article) => ({
    id: article.id,
    webTitle: article.webTitle,
    thumbnail: article.fields?.thumbnail || null,
    trailText: article.fields?.trailText || null,
    body: article.fields?.body || null,
    webUrl: article.webUrl,
  }));
}



export async function getNews(tag, userEmail = null) {
  await dbConnect();

  const now = new Date();
 const redisKey = userEmail ? `news:${userEmail}:${tag}` : `news:general:${tag}`;
  // Step 1: Try cache
  
   const redisCache = await redis.get(redisKey);
  if (redisCache) {
    return JSON.parse(redisCache); // Already stringified
  }
  
  
  let cache = await NewsCache.findOne({ tag, userEmail }) || await UserProfile.findOne({email:userEmail,newsPreferences:tag})

  const expiryHours = userEmail ? CACHE_EXPIRY_HOURS_PERSONALIZED : CACHE_EXPIRY_HOURS_GENERAL;
  const isCacheValid = cache && (now - cache.fetchedAt) / (1000 * 60 * 60) < expiryHours;

  if (isCacheValid) {
     await redis.set(redisKey, JSON.stringify(cache.articles), 'EX', expiryHours * 3600);
    return cache.articles;
  }

  // Step 2: Fetch from Guardian
  const articles = await fetchGuardianNews(tag, userEmail);

  // Step 3: Save to MongoDB (insert or update)
  await NewsCache.findOneAndUpdate(
    { tag, userEmail },
    { articles, fetchedAt: now },
    { upsert: true }
  );
await redis.set(redisKey, JSON.stringify(articles), 'EX', expiryHours * 3600);
  return articles;
}
