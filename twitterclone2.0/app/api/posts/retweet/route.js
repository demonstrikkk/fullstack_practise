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

  const hasRetweeted = post.retweet.users.includes(userEmail);

  if (hasRetweeted) {
    // Unlike: remove userEmail
    post.retweet.users = post.retweet.users.filter(email => email !== userEmail);
  } else {
    // Like: add userEmail
    post.retweet.users.push(userEmail);
    if (post.userEmail !== userEmail) {
      await createNotification({
        userEmail: post.userEmail,      // post owner (receiver of notification)
        fromUserEmail: userEmail,       // person who liked
        type: "retweet",
        postId: post.postId,
      });
    }
  }

  // Update like count
  post.retweet.count = post.retweet.users.length;
  await post.save();

  return NextResponse.json({
    message: hasRetweeted ? "Unretweet" : "retweet",
    retweeted: !hasRetweeted,
    newCount: post.retweet.count,
    retweetUsers: post.retweet.users,
  });
}
