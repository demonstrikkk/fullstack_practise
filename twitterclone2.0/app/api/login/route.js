import dbConnect from "../lib/dBconnect";
import UserProfile from "../lib/models/UserProfile";

import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await dbConnect();

    const { username, password } = await req.json();  // ✅ expect flat body
    
    
    if (!username || !password) {
        return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
    }
    
    const user = await UserProfile.findOne({ username }).select('+password');
    
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    ("Stored password:", user.password);

    if (user.password !== password) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }
 

    return NextResponse.json({
      message: "Login successful",
      user: {
        email: user.email,
        username: user.username,
        userrealname: user.userrealname,
        avatar: user.profile?.avatar || "",
        role: user.role,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}



