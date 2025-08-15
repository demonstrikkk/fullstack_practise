import { Post } from "../../lib/models/Post";
import dbConnect from "../../lib/dBconnect";
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, userEmail, collectionName = 'default' } = body;

    await dbConnect();

    const post = await Post.findOne({ postId });
    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
      });
    }

    await post.removeBookmark(userEmail, collectionName);

    return new Response(JSON.stringify({
      success: true,
      bookmarks: post.bookmarks,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

