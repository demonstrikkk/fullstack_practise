// app/api/user/byEmail/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dBconnect';
import UserProfile from '../../lib/models/UserProfile';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  await dbConnect();
  const user = await UserProfile.findOne({ email }).lean();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    username: user.username || '',
    userrealname: user.userrealname || '',
    avatar: user.profile?.avatar || '',
  });
}
