

import { NextResponse } from "next/server";
import { Post } from "../../lib/models/Post";
import dbConnect from "../../lib/dBconnect";

export async function POST(req) {
  try {
    await dbConnect();

    const { postId, userEmail, selectedOption } = await req.json();

    const post = await Post.findOne({ postId });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const pollOptions = post.content.poll.options;

    // Remove user's previous vote, if any
    for (let option of pollOptions) {
      if (option.voters?.includes(userEmail)) {
        option.votes = Math.max(0, option.votes - 1); // prevent negative
        option.voters = option.voters.filter(email => email !== userEmail);
      }
    }

    // Add vote to the selected option
    const selected = pollOptions.find(o => o.text === selectedOption);
    if (!selected) {
      return NextResponse.json({ error: "Option not found" }, { status: 400 });
    }

    selected.votes += 1;
    if (!selected.voters) selected.voters = [];
    selected.voters.push(userEmail);

    await post.save();

    return NextResponse.json({ post });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
