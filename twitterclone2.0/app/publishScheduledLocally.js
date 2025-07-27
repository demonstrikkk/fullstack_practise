// publishScheduledLocally.js
import dbConnect from "./api/lib/dBconnect.js";
import { ScheduledPost } from "./api/lib/models/ScheduledPost.js";
import { Post } from "./api/lib/models/Post.js";

const MONGODB_URI = "mongodb://127.0.0.1:27017/your-db-name"; // ← replace if needed


async function publishDuePosts() {
  await dbConnect();

  const now = new Date();
  const duePosts = await ScheduledPost.find({ scheduledFor: { $lte: now } });

  for (const post of duePosts) {
    const { _id, scheduledFor, __v, ...postData } = post.toObject();
    await Post.create(postData);
    await ScheduledPost.findByIdAndDelete(_id);
  }

  if (duePosts.length === 0) {
  }
}

publishDuePosts().then(() => process.exit());
