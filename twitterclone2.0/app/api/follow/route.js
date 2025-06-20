import { NextResponse } from "next/server";
import dbConnect from "../lib/dBconnect";
import UserProfile from "../lib/models/UserProfile";
import redis from "../lib/redis";
import { invalidateCache } from "../lib/cacheInvalidator";

export async function POST(req) {
  await dbConnect();

  const { currentUserId, targetUserId } = await req.json();

  if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const currentUser = await UserProfile.findById(email);
  const targetUser = await UserProfile.findById(targetUserId);

  if (!currentUser || !targetUser) {
    return NextResponse.json({ error: "Users not found" }, { status: 404 });
  }

  const isFollowing = targetUser.followers.includes(currentUserId);

  if (isFollowing) {
    // Unfollow
    targetUser.followers.pull(currentUserId);
  } else {
    // Follow
    targetUser.followers.push(currentUserId);
  }

  await targetUser.save();
    // ✅ Invalidate Redis cache for target user profile
  await invalidateCache(`userprofile:${targetUser.email}`);
  // Optionally: if you're caching currentUser’s followings, clear that too
  await invalidateCache(`userprofile:${currentUser.email}`);

  return NextResponse.json({
    success: true,
    followed: !isFollowing,
    followersCount: targetUser.followers.length,
  });
}
