


// app/api/chat/route.js
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateChatId } from '@/app/utils/generateGroupId';

export async function POST(request) {
  const body = await request.json();
  const { from, to, text } = body;

  if (!from || !to || !text) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  const chatId = generateChatId(from, to);

  await addDoc(
    collection(db, `chats/${chatId}/messages`),
    {
      sender: from,
      text,
      timestamp: serverTimestamp(),
    }
  );

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}

