import { NextResponse } from 'next/server';
import { getSupabaseFromSession } from '../lib/getSupabaseClientFromSession';

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, chat_id, sender_email, receiver_email } = body;

    const client = await getSupabaseFromSession(req);
    
    if (!client) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { error } = await client
      .from('messages')
      .insert({
        chat_id,
        sender_email,
        receiver_email,
        message: 'Shared a post',
        message_type: 'post',
        post_id: postId
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to share post' },
      { status: 500 }
    );
  }
}