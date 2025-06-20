// /app/api/posts/comments/route.js
import dbConnect from "../../lib/dBconnect";
import { Post } from "../../lib/models/Post";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

  await dbConnect();
  const post = await Post.findOne({ postId }).lean();
  return NextResponse.json({ comments: post?.comments || [] });
}

export async function POST(req) {
  const body = await req.json();
  const { postId, comment } = body;

  if (!postId || !comment) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  await dbConnect();
  const post = await Post.findOne({ postId });

  post.comments.push(comment);
  post.commentCount = post.comments.length;
  await post.save();

  return NextResponse.json({ success: true, comments: post.comments });
}
