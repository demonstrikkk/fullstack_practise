import { NextResponse } from "next/server";
import { getNews } from "../fetchGuardian"; // update path if your file is elsewhere

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const userEmail = searchParams.get("userEmail"); // optional for personalized

  if (!tag) {
    return NextResponse.json({ success: false, message: "Tag is required" }, { status: 400 });
  }

  try {
    const articles = await getNews(tag, userEmail);
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch news" }, { status: 500 });
  }
}
