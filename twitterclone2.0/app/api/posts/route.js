

// server/app/api/posts/route.js
import { NextResponse } from "next/server";
import { Post } from "../lib/models/Post";
import UserProfile from "../lib/models/UserProfile";
import dbConnect from "../lib/dBconnect";
export const dynamic = 'force-dynamic';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const viewer = searchParams.get("viewer");
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const enrichedPosts = await Promise.all(
    posts.map(async (post) => {
      const user = await UserProfile.findOne({ email: post.userEmail }).lean();
      const bookmarkedByCurrentUser = post.bookmarks?.some(b => b.users.includes(viewer));
      const likedUsers = await UserProfile.find({
        email: { $in: post.likes.users }
      }, 'username email').lean();

        const retweetByUsers = await UserProfile.find(
                { email: { $in: post.retweet?.users || [] } },
                "username email"
              ).lean();
   
      return {
        ...post,
        userInfo: {
          avatar: user?.profile?.avatar || '',
          username: user?.username || '',
          userrealname: user?.userrealname || '',
          userbio: user?.profile?.bio || '',
        },
        likedByCurrentUser: post.likes.users.includes(viewer),
        likedUsernames: likedUsers.map(u => u.username),
                  retweetByCurrentUser: (post.retweet?.users || []).includes(viewer),

          retweetUsers: retweetByUsers.map((u) => u.username),

        bookmarkedByCurrentUser,
        // bookmarkedByCurrentUser: post.bookmarks.users.includes(viewer),
      };
    })
  );

  return NextResponse.json({ posts: enrichedPosts });
}
