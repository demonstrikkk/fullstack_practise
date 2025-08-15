// app/api/upload-media/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// Initialize the admin client for secure server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Use the Service Role Key here
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `public/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('chat-media') // The bucket name we created
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL of the uploaded file
    const { data } = supabaseAdmin.storage
      .from('chat-media')
      .getPublicUrl(filePath);

    return NextResponse.json({ publicUrl: data.publicUrl });

  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media.', details: error.message },
      { status: 500 }
    );
  }
}