


// import dbConnect from '../../lib/dBconnect';
// import UserProfile from '../../lib/models/UserProfile';
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email');

//   if (!email) {
//     return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
//   }

//   try {
//     await dbConnect();

//     const user = await UserProfile.findOne({ email }).select('+password'); // since password is select:false by default

//     if (!user) {
//       return new Response(JSON.stringify({ userExists: false }), { status: 200 });
//     }

//     const isVerified = user.checkpoint === 'verified';

//     return new Response(
//       JSON.stringify({
//         userExists: true,
//         username: user.username,
//         password: user.password,
//         verified: isVerified,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('[VERIFY USER ERROR]', error);
//     return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
//   }
// }


// /api/users/verify/route.js or verify.js depending on your structure

import dbConnect from '../../lib/dBconnect';
import UserProfile from '../../lib/models/UserProfile';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ success: false, message: 'Email is required' }), {
      status: 400,
    });
  }

  try {
    await dbConnect();

    const user = await UserProfile.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ success: true, user: null }), { status: 200 });
    }

    const isVerified = user.checkpoint === 'verified';

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          userExists: true,
          username: user.username,
          verified: isVerified,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('[VERIFY USER ERROR]', error);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
    });
  }
}
