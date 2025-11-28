

// import { NextResponse } from "next/server";
// import dbConnect from "../lib/dBconnect";
// import UserProfile from "../lib/models/UserProfile";
// import bcrypt from "bcryptjs";
// import { authOptions } from "../lib/authOptions";

// export async function POST(req) {
//   await dbConnect();

//   const { displayName, avatar, bio, location, password } = await req.json();
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const email = session.user.email;

//   try {
//     const updateFields = {
//       "profile.displayName": displayName,
//       "profile.avatar": avatar,
//       "profile.bio": bio,
//       "profile.location": location,
//     };

//     if (password && password.length >= 6) {
//       const hashed = await bcrypt.hash(password, 10);
//       updateFields.password = hashed;
//     }

//     const updatedUser = await UserProfile.findOneAndUpdate(
//       { email },
//       { $set: updateFields },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Profile updated successfully" });
//   } catch (err) {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import dbConnect from "../lib/dBconnect";
import UserProfile from "../lib/models/UserProfile";
import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabaseClient";
export const dynamic = 'force-dynamic';

export async function POST(req) {
  await dbConnect();

  // Extract Supabase token from Authorization header
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  // Verify user session with Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user?.email) {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
  }

  const email = user.email;

  try {
    const { displayName, avatar, bio, location, password } = await req.json();

    const updateFields = {
      "profile.displayName": displayName,
      "profile.avatar": avatar,
      "profile.bio": bio,
      "profile.location": location,
    };

    if (password && password.length >= 6) {
      const hashed = await bcrypt.hash(password, 10);
      updateFields.password = hashed;
    }

    const updatedUser = await UserProfile.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
