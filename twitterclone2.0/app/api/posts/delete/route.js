import { Post } from "../../lib/models/Post";
import dbConnect from "../../lib/dBconnect";
export const dynamic = 'force-dynamic';

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  const email = searchParams.get("email");

  if (!postId || !email) {
    return new Response("Missing postId or email", { status: 400 });
  }

  await dbConnect();

  const post = await Post.findOne({ postId });

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  if (email !== email) {
    return new Response("Unauthorized", { status: 403 });
  }

  await Post.deleteOne({ postId });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
