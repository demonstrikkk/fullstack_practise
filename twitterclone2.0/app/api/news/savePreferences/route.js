





import { NextResponse } from "next/server";
import dbConnect from "../../lib/dBconnect";
import UserProfile from "../../lib/models/UserProfile";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email, preferences } = await req.json();

    // 🛑 Validation
    if (!email || !Array.isArray(preferences)) {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }

    if (preferences.length > 3) {
      return NextResponse.json({ success: false, message: "Maximum 3 preferences allowed" }, { status: 400 });
    }

    await dbConnect();


    // 🔄 Update user profile with preferences
    const updated = await UserProfile.findOneAndUpdate(
      { email: email.toLowerCase() },
      { newsPreferences: preferences },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }


    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
