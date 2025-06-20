// server/app/api/posts/user/[email]/route.js
import { Post } from "@/app/api/lib/models/Post";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const { email } = params;

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const userPosts = await Post.find({ userEmail: email }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, posts: userPosts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Failed to fetch user posts" }, { status: 500 });
  }
}
