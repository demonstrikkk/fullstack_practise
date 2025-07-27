import { getNews } from "../../fetchGuardian";
export const dynamic = "force-dynamic";

// Define your categories to refresh (except personalized)
const categoriesToRefresh = ["general", "sports", "trending", "entertainment"];

export async function GET() {
  try {
    // Refresh categories in parallel
    await Promise.all(categoriesToRefresh.map((cat) => getNews(cat)));

    // Optionally: refresh personalized for some users here or trigger via frontend

    return new Response(JSON.stringify({ success: true, message: "Cache refreshed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: "Cache refresh failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
