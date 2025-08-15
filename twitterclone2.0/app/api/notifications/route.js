


import { NextResponse } from "next/server";
import dbConnect from "../lib/dBconnect";
import { Notification } from "../lib/models/Notification";
import UserProfile from "../lib/models/UserProfile";
import { Post } from "../lib/models/Post";
import redis from "../lib/redis"; // ✅ Import Redis
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail") || searchParams.get("email");

    if (!userEmail) {
      return NextResponse.json({ error: "userEmail missing" }, { status: 400 });
    }

    const cacheKey = `notifications:${userEmail}`;
    
    // ✅ Check Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json({ notifications: JSON.parse(cached) });
    }

    const notifications = await Notification.find({ userEmail }).sort({ createdAt: -1 });

    const enriched = await Promise.all(
      notifications.map(async (notif) => {
        const fromUser = await UserProfile.findOne({ email: notif.fromUserEmail }).lean();

        let postPreview = null;
        if (notif.postId) {
          const post = await Post.findOne({ postId: notif.postId }).lean();
          postPreview = post?.content?.text || "[Media Post]";
        }

        return {
          ...notif.toObject(),
          fromUsername: fromUser?.username || "Unknown",
          fromAvatar: fromUser?.profile?.avatar || "/default-avatar.png",
          postPreview,
        };
      })
    );

    // ✅ Cache enriched result for 5 minutes
    await redis.set(cacheKey, JSON.stringify(enriched), 'EX', 300);

    return NextResponse.json({ notifications: enriched });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
