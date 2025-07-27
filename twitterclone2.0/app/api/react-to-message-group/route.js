import { NextResponse } from 'next/server';
import { supabase } from '../lib/supabaseClient';
export async function POST(req) {
  try {
    const body = await req.json();
    const { message_id, emoji, user_email } = body;

    if (!message_id || !emoji || !user_email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { error } = await supabase.from('group_message_reactions').upsert(
      { message_id, emoji, user_email },
    //   { onConflict: ['message_id','user_email', 'emoji'] }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { message_id, emoji, user_email } = body;

    if (!message_id || !emoji || !user_email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { error } = await supabase
      .from('group_message_reactions')
      .delete()
      .match({ message_id, emoji, user_email });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
