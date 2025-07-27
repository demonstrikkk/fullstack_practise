import { NextResponse } from "next/server";
import { getNews } from "../fetchGuardian";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
  }

  try {
    const articles = await getNews("personalized", email);
    return NextResponse.json(articles );
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch personalized news" }, { status: 500 });
  }
}
