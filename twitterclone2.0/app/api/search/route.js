import { NextResponse } from 'next/server';
import dbConnect from '../lib/dBconnect';
import UserProfile from '../lib/models/UserProfile';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase();

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  const regex = new RegExp(`^${query}`, 'i');

  try {
    const users = await UserProfile.find({
      $or: [
        { username: { $regex: regex } },
        { userrealname: { $regex: regex } },
      ],
    });

    const sortedUsers = users.sort((a, b) => {
      const aStartsWith = a.username.toLowerCase().startsWith(query);
      const bStartsWith = b.username.toLowerCase().startsWith(query);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    });

    return NextResponse.json(sortedUsers);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
