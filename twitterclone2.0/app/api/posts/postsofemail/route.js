// server/app/api/posts/byEmail/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dBconnect';
import { Post } from '../../lib/models/Post';
import UserProfile from '../../lib/models/UserProfile';
import redis from '../../lib/redis'; // ✅ import Redis

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cacheKey = `posts:${email}`;
    
    // ✅ Try fetching from Redis first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    await dbConnect();

    const posts = await Post.find({ userEmail: email }).lean();
    const user = await UserProfile.findOne({ email }).lean();
    const userInfo = user
      ? {
          username: user?.username || '',
          userrealname: user?.userrealname || '',
          avatar: user.profile?.avatar || null,
        }
      : null;

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const likedUsers = await UserProfile.find(
          { email: { $in: post.likes.users } },
          'username email'
        ).lean();

        return {
          ...post,
          userInfo,
          likedByCurrentUser: post.likes.users.includes(email),
          likedUsernames: likedUsers.map((u) => u.username),
        };
      })
    );

    // ✅ Save to Redis (5 minutes TTL)
    await redis.set(cacheKey, JSON.stringify(formattedPosts), 'EX', 300);

    return NextResponse.json(formattedPosts);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
