


// import { createServerClient } from '@supabase/ssr';
import jwt from 'jsonwebtoken';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'No email provided' }), { status: 400 });
    }

    // Sign a custom Supabase JWT with your service role key
    const token = jwt.sign(
      {
        sub: email,
        email,
        role: 'authenticated',
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
      },
      process.env.SUPABASE_JWT_SECRET
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 });
  }
}


