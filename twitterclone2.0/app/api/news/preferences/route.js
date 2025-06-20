import { NextResponse } from "next/server";
import dbConnect from "../../lib/dBconnect";
import UserProfile from "../../lib/models/UserProfile";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });

  await dbConnect();
  const user = await UserProfile.findOne({ email });
  return NextResponse.json({ preferences: user?.newsPreferences || [] });
}
