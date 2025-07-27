

import { NextResponse } from 'next/server';
import { getSupabaseFromSession } from '../lib/getSupabaseClientFromSession';

export async function POST(req) {
  const client = await getSupabaseFromSession(req); // Ensure client is obtained
  if (!client) {
    return NextResponse.json({ error: 'Supabase client not available' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const {
      chat_id,
      sender_email,
      receiver_email,
      message,
      reply_to,
      reply_snippet,
    } = body;

    if (!chat_id || !sender_email || !receiver_email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await client.from('messages').insert({
      chat_id,
      sender_email,
      receiver_email,
      message,
      reply_to,
      reply_snippet,
    });

    if (error) {
      console.error('Supabase message insert error:', error.message); // Log specific error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('POST /api/send-messages error:', err.message || err); // Log unexpected errors
    return NextResponse.json({ error: err.message || 'Failed to send message' }, { status: 500 });
  }
}