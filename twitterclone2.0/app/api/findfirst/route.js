import dbConnect from '../lib/dBconnect';
import UserProfile from '../lib/models/UserProfile';
import redis from '../lib/redis';
export const dynamic = 'force-dynamic';
export async function GET(req) {
  try {
    // ✅ Use Next.js native URL handling
    const searchParams = req.nextUrl?.searchParams || new URL(req.url).searchParams;
    const email = searchParams.get('email')?.toLowerCase();

    if (!email) {
      return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
    }

    const cacheKey = `userprofile:${email}`;

    // ✅ Check Redis first
    try {
      const cachedUser = await redis.get(cacheKey);
      if (cachedUser) {
        return new Response(cachedUser, { status: 200 });
      }
    } catch (err) {
      console.error('Redis get error:', err);
    }

    // ✅ Connect to DB (only if not already connected)
    await dbConnect();

    const user = await UserProfile.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // ✅ Store in Redis cache (5 mins)
    try {
      await redis.set(cacheKey, JSON.stringify(user), 'EX', 300);
    } catch (err) {
      console.error('Redis set error:', err);
    }

    return new Response(JSON.stringify(user), { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
