// import dbConnect from '../lib/dBconnect';
// import UserProfile from '../lib/models/UserProfile';
// import redis from '../lib/redis';
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email');

//   if (!email) {
//     return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
//   }
//   const cacheKey = `userprofile:${email}`


// try {
//     // ✅ Check Redis cache first
//     const cachedUser = await redis.get(cacheKey);
//     if (cachedUser) {
//       return new Response(cachedUser, { status: 200 }); // Already stringified
//     }

  
//     await dbConnect();
//     const user = await UserProfile.findOne({ email });

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
//     }
   
//      await redis.set(cacheKey, JSON.stringify(user), 'EX', 300);

//     return new Response(JSON.stringify(user), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
//   }
// }













import dbConnect from '../lib/dBconnect';
import UserProfile from '../lib/models/UserProfile';
import redis from '../lib/redis';

export async function GET(req) {
  const { searchParams } = new URL(req.url, 'http://localhost:3000'); // ✅ safer

  const email = searchParams.get('email')?.toLowerCase();

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  const cacheKey = `userprofile:${email}`;

  try {
    // ✅ Try Redis cache first
    let cachedUser;
    try {
      cachedUser = await redis.get(cacheKey);
    } catch (err) {
      console.warn("Redis error:", err.message);
    }

    if (cachedUser) {
      return new Response(cachedUser, { status: 200 });
    }

    await dbConnect();

    const user = await UserProfile.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // ✅ Cache result
    await redis.set(cacheKey, JSON.stringify(user), 'EX', 300);

    return new Response(JSON.stringify(user), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
