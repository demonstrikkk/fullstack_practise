import { NextResponse } from "next/server";
import dbConnect from "../lib/dBconnect";
import UserProfile from "../lib/models/UserProfile";

export async function GET() {
  await dbConnect();

  const fixedUserId = "demonstrikk"; // Replace with the fixed user _id or email
  const limit = 5;

  const topUsers = await UserProfile.find({})
    .sort({ followers: -1 }) // followers is an array, so sort by length manually later
    .lean();

  const sortedUsers = topUsers
    .map(user => ({ ...user, followerCount: user.followers.length }))
    .sort((a, b) => b.followerCount - a.followerCount);

  const fixedUser = sortedUsers.find(user => user.profile.displayName.toString() === fixedUserId);
  let filtered = sortedUsers.filter(user => user._id.toString() !== fixedUserId).slice(0, limit - 1);

  if (fixedUser) filtered.unshift(fixedUser); // Ensure fixed user is included

  return NextResponse.json(filtered.slice(0, limit));
}
