import { NextResponse } from "next/server";
import dbConnect from "../../lib/dBconnect";
import UserProfile from "../../lib/models/UserProfile";

export async function GET(req, context) {
  await dbConnect();

  const { email } = await context.params;  // ✅ await the params
  const decodedEmail = decodeURIComponent(email);

  const user = await UserProfile.findOne({ email: decodedEmail }).lean();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    email: user.email,
    username: user.username,
    followers: user.followers || { count: 0, users: [] },
    following: user.following || { count: 0, users: [] },
    realname: user.realname,
    avatar: user.profile?.avatar,
    bio: user.profile?.bio,
    location: user.profile?.location,
    createdAt:user.createdAt,
    

  });
}
