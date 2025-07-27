// /app/api/posts/repostsbyuser/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../lib/dBconnect';
import { Post } from '../lib/models/Post';
import UserProfile from '../lib/models/UserProfile'; // make sure this is correct

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    await dbConnect();

    // Find reposts by the user
    const reposts = await Post.find({ "retweet.users": email }).sort({ createdAt: -1 }).lean();

    // Enrich each repost with user profile
    const enrichedReposts = await Promise.all(
      reposts.map(async (post) => {
        const user = await UserProfile.findOne({ email: post.userEmail }).lean();
        return {
          ...post,
          userInfo: user
            ? {
                username: user.username || '',
                userrealname: user.userrealname || '',
                avatar: user.profile?.avatar || null,
              }
            : null,
          retweetByCurrentUser: post.retweet?.users?.includes(email),
        };
      })
    );

    return NextResponse.json({ reposts: enrichedReposts });
  } catch (err) {
    console.error("Error fetching reposts:", err);
    return NextResponse.json({ error: "Failed to fetch reposts" }, { status: 500 });
  }
}
