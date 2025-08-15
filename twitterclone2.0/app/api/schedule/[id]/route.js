// app/api/schedule/[id]/route.js
import { ScheduledPost } from "../../lib/models/ScheduledPost";
import dbConnect from "../../lib/dBconnect";
export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  const body = await req.json();
  await dbConnect();

  const updated = await ScheduledPost.findOneAndUpdate(
    { postId: params.id },
    { ...body },
    { new: true }
  );

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true, updated });
}

export async function DELETE(_, { params }) {
  await dbConnect();
  await ScheduledPost.findOneAndDelete({ postId: params.id });

  return Response.json({ success: true, message: "Scheduled post deleted." });
}
