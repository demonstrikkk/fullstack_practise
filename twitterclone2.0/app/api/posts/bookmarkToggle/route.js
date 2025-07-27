// app/api/posts/bookmarkToggle/route.js
import { Post } from '../../lib/models/Post';
import dbConnect from '../../lib/dBconnect';

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, userEmail, collectionName = 'default' } = body;

    await dbConnect();
    const post = await Post.findOne({ postId });
    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }

    // Check if user already bookmarked this post in that collection
    const existing = post.bookmarks.find(
      b => b.collectionName === collectionName && b.users.includes(userEmail)
    );

    let updatedBookmarks;

    if (existing) {
      // Remove bookmark
      post.bookmarks = post.bookmarks.map(b => {
        if (b.collectionName === collectionName) {
          return {
            ...b.toObject(),
            users: b.users.filter(email => email !== userEmail)
          };
        }
        return b;
      }).filter(b => b.users.length > 0);
    } else {
      // Add bookmark
      const collection = post.bookmarks.find(b => b.collectionName === collectionName);
      if (collection) {
        collection.users.push(userEmail);
      } else {
        post.bookmarks.push({ collectionName, users: [userEmail] });
      }
    }

    await post.save();

    updatedBookmarks = post.bookmarks;
    const bookmarked = post.bookmarks.some(
      b => b.users.includes(userEmail)
    );

    return new Response(JSON.stringify({
      success: true,
      bookmarked,
      bookmarks: updatedBookmarks
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}


