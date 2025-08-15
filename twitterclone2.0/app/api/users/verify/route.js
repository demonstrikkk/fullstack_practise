





import dbConnect from '../../lib/dBconnect';
import UserProfile from '../../lib/models/UserProfile';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ success: false, message: 'Email is required' }), { status: 400 });
  }

  try {
    await dbConnect();
    const user = await UserProfile.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({
        success: true,
        userExists: false,
        verified: false,
        user: null
      }), { status: 200 });
    }

    const isVerified = user.checkpoint === 'verified';

    return new Response(JSON.stringify({
      success: true,
      userExists: true,
      verified: isVerified,
      user: {
        username: user.username,
        email: user.email,
        avatar: user.profile?.avatar,
        name: user.userrealname
      }
    }), { status: 200 });

  } catch (error) {
    console.error('[VERIFY USER ERROR]', error);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
  }
}
