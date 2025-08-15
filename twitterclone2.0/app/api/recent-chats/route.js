import dbConnect from "../lib/dBconnect";
import UserProfile from "../lib/models/UserProfile";
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { peers } = await req.json();
    await dbConnect();
    const profiles = await UserProfile.find({ email: { $in: peers } }).lean();
    return Response.json(profiles);
  } catch (err) {
    return Response.json([], { status: 500 });
  }
}
