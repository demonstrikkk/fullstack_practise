import { NextResponse } from "next/server";
import dbConnect from "../../lib/dBconnect";
import { Post } from "../../lib/models/Post";
import UserProfile from "../../lib/models/UserProfile";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "postId missing" }, { status: 400 });
    }

    const post = await Post.findOne({ postId });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const user = await UserProfile.findOne({ email: post.userEmail }).lean();
    const userInfo = user
      ? {
          username: user.username || "",
          userrealname: user.userrealname || "",
          avatar: user.profile?.avatar || "/default-avatar.png",
        }
      : null;

    const enrichedPost = {
      ...post.toObject(),
      userInfo,
    };

    return NextResponse.json({ post: enrichedPost });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
