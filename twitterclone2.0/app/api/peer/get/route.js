// /app/api/peer/send/route.js
import { NextResponse } from 'next/server';
import { getPearCore } from '../../lib/pear-core';


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');

  if (!groupId) {
    return NextResponse.json({ error: 'Missing groupId' }, { status: 400 });
  }

  try {
    const { db } = await getPearCore();
    const groupDb = db.sub(groupId);
    const messages = [];

    for await (const [key, value] of groupDb.createReadStream()) {
      try {
        messages.push(JSON.parse(value));
      } catch (e) {
      }
    }

    messages.sort((a, b) => a.timestamp - b.timestamp);
    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
