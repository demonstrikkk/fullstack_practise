import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dBconnect';
import { Post } from '../../lib/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createNotification } from '../../lib/createNotification';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json(
      { error: 'Post ID is required' },
      { status: 400 }
    );
  }

  try {
    // Only selecting comments
    const post = await Post.findOne({ postId }).select('comments');

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
 

    // ✅ Return as wrapped object
    return NextResponse.json({ comments: post.comments });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}







export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      postId,
      type,
      commentId,
      replyId,
      text,
      media,
      username,
      avatar
    } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // === ADD_COMMENT ===
    if (type === 'ADD_COMMENT') {
      if (!text && !media) {
        return NextResponse.json({ error: 'Text or media is required' }, { status: 400 });
      }

      const comment = {
        commentId: crypto.randomUUID(),
        user: session.user.email,
        username: username || session.user.name || 'Anonymous',
        avatar: avatar || session.user.image || '/default-avatar.png',
        text,
        media: media || null,
        likes: [],
        replies: [],
        timestamp: new Date()
      };

      const updated = await Post.findOneAndUpdate(
        { postId },
        {
          $push: { comments: comment },
          $inc: { commentCount: 1 }
        },
        { new: true, runValidators: true }
      );
         const postDoc = await Post.findOne({ postId }); // ✅ must await this!

if (!postDoc) {
  return NextResponse.json({ error: "Post not found" }, { status: 404 });
}

const receiverEmail = postDoc.userEmail; // ✅ this now works

// ⚠️ Don't notify self
if (receiverEmail && receiverEmail !== session.user.email) {
  await createNotification({
    userEmail: receiverEmail,
    fromUserEmail: session.user.email,
    type: "comment",
    postId,
  });
}

          
      return NextResponse.json(comment, { status: 201 });
    }

    // === ADD_REPLY ===
    if (type === 'ADD_REPLY') {
      if (!commentId || !text) {
        return NextResponse.json({ error: 'Comment ID and text are required' }, { status: 400 });
      }

      const reply = {
        replyId: crypto.randomUUID(),
        user: session.user.email,
        username: username || session.user.name || 'Anonymous',
        avatar: avatar || session.user.image || '/default-avatar.png',
        text,
        media: media || null,
        likes: [],
        timestamp: new Date()
      };

      const updated = await Post.findOneAndUpdate(
        { postId, "comments.commentId": commentId },
        { $push: { "comments.$.replies": reply } },
        { new: true, runValidators: true }
      );

      return NextResponse.json({ comments: updated.comments }, { status: 201 });
    }

    // === TOGGLE_LIKE ===
    if (type === 'TOGGLE_LIKE_COMMENT' || type === 'TOGGLE_LIKE_REPLY') {
      const post = await Post.findOne({ postId });
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

      const userEmail = session.user.email;

      if (type === 'TOGGLE_LIKE_COMMENT') {
        const comment = post.comments.find(c => c.commentId === commentId);
        if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });

        const index = comment.likes.indexOf(userEmail);
        if (index >= 0) comment.likes.splice(index, 1);
        else comment.likes.push(userEmail);
      }

      if (type === 'TOGGLE_LIKE_REPLY') {
        const comment = post.comments.find(c => c.commentId === commentId);
        if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });

        const reply = comment.replies.find(r => r.replyId === replyId);
        if (!reply) return NextResponse.json({ error: 'Reply not found' }, { status: 404 });

        const index = reply.likes.indexOf(userEmail);
        if (index >= 0) reply.likes.splice(index, 1);
        else reply.likes.push(userEmail);
      }

      await post.save();
      return NextResponse.json({ comments: post.comments }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
