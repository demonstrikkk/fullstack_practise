// GET /api/posts/collections?userEmail=...
import { Post } from "../../lib/models/Post";
import dbConnect from "../../lib/dBconnect";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) return new Response("Missing email", { status: 400 });

  await dbConnect();
  const posts = await Post.find({ "bookmarks.users": userEmail }).lean();

  const collectionSet = new Set();

  posts.forEach(post => {
    post.bookmarks.forEach(b => {
      if (b.users.includes(userEmail)) {
        collectionSet.add(b.collectionName || 'Default');
      }
    });
  });

  return new Response(JSON.stringify({
    collections: [...collectionSet]
  }), { status: 200 });
}
