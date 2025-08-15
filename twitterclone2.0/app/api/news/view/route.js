import { NextResponse } from "next/server";
import { getNews } from "../fetchGuardian";
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  if (!tag) {
    return NextResponse.json({ success: false, message: "Tag is required" }, { status: 400 });
  }

  try {
    const articles = await getNews(tag);
    return NextResponse.json(articles); // ✅ just return array

} catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch news" }, { status: 500 });
  }
}
