import { NextResponse } from "next/server";
import cloudinary from "../lib/cloudinary";
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64String = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64String}`;

  try {
    const uploadRes = await cloudinary.uploader.upload(dataUri, {
      folder: "avatars",
      transformation: [{ width: 300, height: 300, crop: "fill", gravity: "face" }],
    });

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (err) {
    console.error("Cloudinary error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
