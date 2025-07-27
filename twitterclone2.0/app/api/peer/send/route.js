




import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { db } from '../../lib/firebase';

// Initialize Firebase Admin SDK only once
if (!getApps().length) {
  try {
    // Firebase service account credentials from environment variables
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newline characters
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: process.env.FIREBASE_AUTH_URI,
      tokenUri: process.env.FIREBASE_TOKEN_URI,
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    };

    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    // It's crucial to handle this error gracefully in production
    // You might want to log it or even crash the process if it's unrecoverable
  }
}


/**
 * POST handler for sending messages.
 * Stores messages in Firestore.
 * @param {Request} req - The incoming request object containing groupId, message, and senderEmail.
 * @returns {NextResponse} - A JSON response indicating status or error.
 */
export async function POST(req) {
  const { groupId, message, senderEmail } = await req.json();

  // Validate incoming fields
  if (!groupId || !message || !senderEmail) {
    return NextResponse.json({ error: 'Missing fields: groupId, message, or senderEmail' }, { status: 400 });
  }

  try {
    const chatRef = db.collection('chats').doc(groupId).collection('messages');
    const timestamp = Date.now();

    await chatRef.add({
      senderEmail,
      message,
      timestamp,
    });

    return NextResponse.json({ status: 'Message stored' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

/**
 * GET handler for fetching messages.
 * Retrieves all messages for a given groupId from Firestore.
 * @param {Request} req - The incoming request object containing the groupId search parameter.
 * @returns {NextResponse} - A JSON response containing the messages or an error.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');

  // Validate groupId parameter
  if (!groupId) {
    return NextResponse.json({ error: 'Missing groupId parameter' }, { status: 400 });
  }

  try {
    const chatRef = db.collection('chats').doc(groupId).collection('messages');
    const snapshot = await chatRef.orderBy('timestamp', 'asc').get();

    const messages = [];
    snapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
