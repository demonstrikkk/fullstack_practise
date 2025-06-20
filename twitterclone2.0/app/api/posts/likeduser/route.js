// // server/app/api/posts/like/route.js
// import { NextResponse } from "next/server";
// import { Post } from "../../lib/models/Post";
// import dbConnect from "../../lib/dBconnect";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { postId, userEmail } = await req.json();
//     const post = await Post.findOne({ postId });
//     if (!post) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     const hasLiked = post.likes.users.includes(userEmail);
//     if (hasLiked) {
//       post.likes.users = post.likes.users.filter(u => u !== userEmail);
//       post.likes.count -= 1;
//     } else {
//       post.likes.users.push(userEmail);
//       post.likes.count += 1;
//     }

//     await post.save();

//     // ← Return the full post
//     return NextResponse.json({ post });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


// server/app/api/posts/like/route.js
import { NextResponse } from "next/server";
import { Post } from "../../lib/models/Post";
import UserProfile from "../../lib/models/UserProfile";
import dbConnect from "../../lib/dBconnect";
import { createNotification } from "../../lib/createNotification";

export async function POST(req) {
  try {
    await dbConnect();
    const { postId, userEmail } = await req.json();

    const post = await Post.findOne({ postId });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const hasLiked = post.likes.users.includes(userEmail);
    if (hasLiked) {
      post.likes.users = post.likes.users.filter(u => u !== userEmail);
      post.likes.count -= 1;
    } else {
      post.likes.users.push(userEmail);
      post.likes.count += 1;

if (post.userEmail !== userEmail) {
  await createNotification({
    userEmail: post.userEmail,      // post owner (receiver of notification)
    fromUserEmail: userEmail,       // person who liked
    type: "like",
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
      likedByCurrentUser: post.likes.users.includes(userEmail)
    };

    return NextResponse.json({ post: enrichedPost });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
