

import { NextResponse } from "next/server";
import { Post } from "../../lib/models/Post"; // Adjust if needed
import UserProfile from "../../lib/models/UserProfile"; // Adjust if needed
import dbConnect from "../../lib/dBconnect"; // Ensure DB connection

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const viewerEmail = searchParams.get("viewer");
  const skip = parseInt(searchParams.get("skip")) || 0;
  const limit = parseInt(searchParams.get("limit")) || 10;

  if (!viewerEmail) {
    return NextResponse.json({ error: "Viewer email is required" }, { status: 400 });
  }

  try {
    const viewerProfile = await UserProfile.findOne({ email: viewerEmail });

    if (!viewerProfile || !Array.isArray(viewerProfile.following?.users)) {
      return NextResponse.json({ posts: [] });
    }

    const followingEmails = viewerProfile.following.users;

    const posts = await Post.find({ userEmail: { $in: followingEmails } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const user = await UserProfile.findOne({ email: post.userEmail }).lean();
        const likedUsers = await UserProfile.find(
          { email: { $in: post.likes?.users || [] } },
          "username email"
        ).lean();
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
          likedByCurrentUser: (post.likes?.users || []).includes(viewerEmail),
          retweetByCurrentUser: (post.retweet?.users || []).includes(viewerEmail),
          likedUsernames: likedUsers.map((u) => u.username),
          retweetUsers: retweetByUsers.map((u) => u.username),
        };
      })
    );

    return NextResponse.json({ posts: enrichedPosts });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
