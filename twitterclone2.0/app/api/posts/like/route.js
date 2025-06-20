// server/app/api/posts/like/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../lib/dBconnect";
import { Post } from "../../lib/models/Post";
import { createNotification } from "../../lib/createNotification";
export async function POST(req) {
  await dbConnect();
  const { postId, userEmail } = await req.json();

  const post = await Post.findOne({ postId });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const hasLiked = post.likes.users.includes(userEmail);

  if (hasLiked) {
    // Unlike: remove userEmail
    post.likes.users = post.likes.users.filter(email => email !== userEmail);
  } else {
    // Like: add userEmail
    post.likes.users.push(userEmail);
    if (post.userEmail !== userEmail) {
      await createNotification({
        userEmail: post.userEmail,      // post owner (receiver of notification)
        fromUserEmail: userEmail,       // person who liked
        type: "like",
        postId: post.postId,
      });
    }
  }

  // Update like count
  post.likes.count = post.likes.users.length;
  await post.save();

  return NextResponse.json({
    message: hasLiked ? "Unliked" : "Liked",
    liked: !hasLiked,
    newCount: post.likes.count,
    likedUsers: post.likes.users,
  });
}
