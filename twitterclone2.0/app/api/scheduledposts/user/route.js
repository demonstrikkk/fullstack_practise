import dbConnect from '../../lib/dBconnect';
import { ScheduledPost } from '../../lib/models/ScheduledPost';
import { NextResponse } from 'next/server';
import UserProfile from '../../lib/models/UserProfile';


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    await dbConnect();

    // Find scheduleposts by the user
    const scheduleposts = await ScheduledPost.find({ userEmail: email }).sort({ scheduledFor: -1 }).lean();

    const enrichedscheduleposts = await Promise.all(
      scheduleposts.map(async (post) => {
        const user = await UserProfile.findOne({ email: post.userEmail }).lean();
        return {
          ...post,
          userInfo: user
            ? {
                username: user.username || '',
                userrealname: user.userrealname || '',
                avatar: user.profile?.avatar || null,
              }
            : null,
        };
      })
    );

    return NextResponse.json({ scheduleposts: enrichedscheduleposts });
  } catch (err) {
    console.error("Error fetching scheduleposts:", err);
    return NextResponse.json({ error: "Failed to fetch scheduleposts" }, { status: 500 });
  }
}
