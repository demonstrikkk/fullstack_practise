// // server/app/api/posts/create/route.js

// import { NextResponse } from "next/server";
// import { Post } from "../../lib/models/Post";
// import dbConnect from "../../lib/dBconnect";
// import { v4 as uuidv4 } from "uuid";
// // import { useEffect } from "react";
// export async function POST(req) {
//   await dbConnect();
//   const { userEmail, text, media, poll } = await req.json();
  
  
//   const newPost = new Post({
//     postId: uuidv4(),
//     userEmail,
//     content: {
//       text,
//       media,
//       poll: poll || null,
//     },
//     likes: { count: 0, users: [] },
//     bookmarks: [],
//     comments: [],
//     commentCount: 0,
//   });

//   await newPost.save();
//   return NextResponse.json({ success: true, post: newPost });
// }


import { NextResponse } from "next/server";
import { Post } from "../../lib/models/Post";
import UserProfile from "../../lib/models/UserProfile";
import dbConnect from "../../lib/dBconnect";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  await dbConnect();
  const { userEmail, text, media, poll } = await req.json();

  const newPost = new Post({
    postId: uuidv4(),
    userEmail,
    content: {
      text,
      media,
      poll: poll
        ? {
            question: poll.question,
            options: poll.options.map(opt => ({ text: opt.text, votes: 0 })),
            votedUsers: [],
          }
        : null,
    },
    likes: { count: 0, users: [] },
    bookmarks: [],
    comments: [],
    commentCount: 0,
  });

  await newPost.save();

  const savedPost = await Post.findOne({ postId: newPost.postId }).lean();
  const user = await UserProfile.findOne({ email: userEmail }).lean();

  return NextResponse.json({
    success: true,
    post: {
      ...savedPost,
      userInfo: {
        avatar: user?.profile?.avatar || '',
        username: user?.username || '',
        userrealname: user?.profile?.displayName || '',
        userbio : user?.profile?.bio || '',
      },
      likedByCurrentUser: false,
    },
  });
}



