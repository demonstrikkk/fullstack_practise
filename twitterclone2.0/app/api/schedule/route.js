// app/api/schedule/route.js
import { ScheduledPost } from "../lib/models/ScheduledPost";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "../lib/dBconnect";
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const body = await req.json();
  const { userEmail, content, scheduledFor } = body;

  await dbConnect();

  const newScheduled = new ScheduledPost({
    userEmail,
    postId: uuidv4(),
    content,
    scheduledFor: new Date(scheduledFor),
    likes: { count: 0, users: [] },
    retweet: { count: 0, users: [] },
    bookmarks: [],
    comments: [],
    commentCount: 0,
  });

  await newScheduled.save();

  return Response.json({ success: true, message: "Post scheduled." });
}
