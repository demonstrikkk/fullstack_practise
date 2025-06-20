import { NextResponse } from "next/server";
import dbConnect from "../lib/dBconnect";
import UserProfile from "../lib/models/UserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions"; // path to your auth config

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;

  try {
    const user = await UserProfile.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = {
      displayName: user.profile?.displayName || "",
      avatar: user.profile?.avatar || "",
      bio: user.profile?.bio || "",
      location: user.profile?.location || "",
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
