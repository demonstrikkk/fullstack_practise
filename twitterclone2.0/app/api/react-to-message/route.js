


import { NextResponse } from 'next/server';
import { supabase } from '../lib/supabaseClient';

export async function POST(req) {
  const client =  supabase
  if (!client) {
    return NextResponse.json({ error: 'Supabase client not available' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { message_id, emoji, user_email } = body;

    if (!message_id || !emoji || !user_email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Upsert will insert a new row or update an existing one if a conflict occurs
    // The onConflict parameter should specify the unique constraint column(s)
    // Assuming (message_id, user_email) is a unique constraint for reactions
    const { error } = await client.from('message_reactions').upsert(
      { message_id, emoji, user_email },
      { onConflict: 'message_id,user_email' } // Specify the unique constraint
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const client = supabase;
  if (!client) {
    return NextResponse.json({ error: 'Supabase client not available' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { message_id, emoji, user_email } = body;

    if (!message_id || !emoji || !user_email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { error } = await client
      .from('message_reactions')
      .delete()
      .match({ message_id, emoji, user_email }); // Match all three to delete a specific reaction

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
