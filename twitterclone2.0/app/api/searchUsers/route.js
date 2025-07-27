



import dbConnect from '../lib/dBconnect';
import UserProfile from '../lib/models/UserProfile';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const currentUserEmail = searchParams.get('currentUserEmail');

    if (!query) return NextResponse.json([]);

    const users = await UserProfile.find({
      email: { $ne: currentUserEmail },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { userrealname: { $regex: query, $options: 'i' } }
      ]
    }).select('email username userrealname profile.avatar');

    return NextResponse.json(
      users.map((u) => ({
        email: u.email,
        username: u.username,
        userrealname: u.userrealname,
        avatar_url: u.profile?.avatar || '/default-avatar.png',
      }))
    );

  } catch (err) {
    console.error("SearchUsers route error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
