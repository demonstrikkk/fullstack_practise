
// server/app/api/posts/like/route.js
import { NextResponse } from "next/server";
import { Post } from "../../lib/models/Post";
import UserProfile from "../../lib/models/UserProfile";
import dbConnect from "../../lib/dBconnect";
import { createNotification } from "../../lib/createNotification";
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await dbConnect();
    const { postId, userEmail } = await req.json();

    const post = await Post.findOne({ postId });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const hasRetweeted = post.retweet.users.includes(userEmail);
    if (hasRetweeted) {
      post.retweet.users = post.retweet.users.filter(u => u !== userEmail);
      post.retweet.count -= 1;
    } else {
      post.retweet.users.push(userEmail);
      post.retweet.count += 1;

if (post.userEmail !== userEmail) {
  await createNotification({
    userEmail: post.userEmail,      // post owner (receiver of notification)
    fromUserEmail: userEmail,       // person who liked
    type: "retweet",
    postId: post.postId,
  });
}


    }

    await post.save();

    // Add userInfo before sending to frontend
    const user = await UserProfile.findOne({ email: post.userEmail }).lean();
    const userInfo = user
      ? {
          username: user?.username || '',
          userrealname: user?.userrealname || '',
          avatar: user.profile?.avatar || null,
        }
      : null;

    const enrichedPost = {
      ...post.toObject(),
      userInfo,
      retweetByCurrentUser: post.retweet.users.includes(userEmail)
    };

    return NextResponse.json({ post: enrichedPost });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
