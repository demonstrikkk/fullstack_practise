import { NextResponse } from "next/server";
import dbConnect from "../lib/dBconnect";
import UserProfile from "../lib/models/UserProfile";
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email query param is required" }, { status: 400 });
    }

    const user = await UserProfile.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: user });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
