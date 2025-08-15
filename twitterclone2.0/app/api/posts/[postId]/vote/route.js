


import { Post } from "@/app/api/lib/models/Post";
import { NextResponse } from "next/server";
import UserProfile from "@/app/api/lib/models/UserProfile";
export const dynamic = 'force-dynamic';


export async function POST(req, context) {
  const { postId } = context.params; // Correct way to access dynamic route params
  const { userEmail, selectedOption } = await req.json();

  const post = await Post.findOne({ postId });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const poll = post.content.poll;

  // Remove previous vote if user already voted
  const prevOption = poll.options.find(
    (opt) =>
      poll.votedUsers.includes(userEmail) &&
      opt.voters?.includes(userEmail)
  );
  if (prevOption) {
    prevOption.votes -= 1;
    prevOption.voters = prevOption.voters.filter(
      (voter) => voter !== userEmail
    );
  }

  // Add vote to selected option
  const newOption = poll.options.find((opt) => opt.text === selectedOption);
  if (!newOption) {
    return NextResponse.json({ error: "Invalid poll option" }, { status: 400 });
  }

  newOption.votes += 1;
  newOption.voters = newOption.voters || [];
  newOption.voters.push(userEmail);

  // Update votedUsers to include the current user
  if (!poll.votedUsers.includes(userEmail)) {
    poll.votedUsers.push(userEmail);
  }

  await post.save();

  // Enrich the post with user information
  const user = await UserProfile.findOne({ email: post.userEmail }).lean();
  const likedUsers = await UserProfile.find({
    email: { $in: post.likes.users }
  }, 'username email').lean();

  const enrichedPost = {
    ...post.toObject(),
    userInfo: {
      avatar: user?.profile?.avatar || '',
      username: user?.username || '',
      userrealname: user?.userrealname || '',
      userbio: user?.profile?.bio || '',
    },
    likedByCurrentUser: post.likes.users.includes(userEmail),
    likedUsernames: likedUsers.map(u => u.username), // Usernames array
  };

  return NextResponse.json({ message: "Vote updated", post: enrichedPost }, { status: 200 });
}
