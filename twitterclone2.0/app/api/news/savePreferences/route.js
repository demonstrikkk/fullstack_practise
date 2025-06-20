// import { NextResponse } from "next/server";
// import dbConnect from "../../lib/dBconnect"; // your actual db connection function
// import { NewsCache } from "../../lib/models/NewsCache";// your actual model
// import UserProfile from "../../lib/models/UserProfile";

// export async function POST(req) {
//   const { email, preferences } = await req.json();

//   if (!email || !Array.isArray(preferences)) {
//       if (preferences.length > 3) {
//     return NextResponse.json({ success: false, message: "Maximum 3 preferences allowed" }, { status: 400 });
//   }

//     return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
//   }

//   await dbConnect();

//   const updated = await UserProfile.findOneAndUpdate(
//     { email },
//     { newsPreferences: preferences },
//     { new: true }
//   );

//   if (!updated) {
//     return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//   }

//   return NextResponse.json({ success: true });
// }





import { NextResponse } from "next/server";
import dbConnect from "../../lib/dBconnect";
import UserProfile from "../../lib/models/UserProfile";


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

    console.log("📨 Incoming:", { email, preferences });

    // 🔄 Update user profile with preferences
    const updated = await UserProfile.findOneAndUpdate(
      { email: email.toLowerCase() },
      { newsPreferences: preferences },
      { new: true }
    );

    if (!updated) {
      console.error("❌ User not found:", email);
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    console.log("✅ Updated UserProfile:", updated);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("🔥 Error saving preferences:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
