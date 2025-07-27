




import dbConnect from '../lib/dBconnect';
import UserProfile from '../lib/models/UserProfile';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const currentUserEmail = searchParams.get('currentUserEmail');

    if (!query) return Response.json({ users: [] });

    const users = await UserProfile.find({
      email: { $ne: currentUserEmail },
      username: { $regex: query, $options: 'i' },
    }).select({
      email: 1,
      username: 1,
      'profile.displayName': 1,
      'profile.avatar': 1
    });

    // make sure userrealname is mapped correctly
    const formattedUsers = users.map(u => ({
      email: u.email,
      username: u.username,
      avatar: u.profile?.avatar || null,
      userrealname: u.profile?.displayName || null
    }));

    return Response.json({ users: formattedUsers });
  } catch (error) {
    console.error('Search error:', error);
    return new Response('Server error', { status: 500 });
  }
}

