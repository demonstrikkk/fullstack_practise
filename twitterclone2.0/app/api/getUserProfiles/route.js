import dbConnect from "../lib/dBconnect";
import UserProfile from "../lib/models/UserProfile";
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { emails } = await req.json();
    await dbConnect();

    const profiles = await UserProfile.find({
      email: { $in: emails }
    }).lean();

    return new Response(JSON.stringify(profiles), { status: 200 });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}
