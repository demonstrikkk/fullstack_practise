





// DELETE /api/posts/deleteCollection?userEmail=...&collectionName=...
import { Post } from "../../lib/models/Post";
import dbConnect from "../../lib/dBconnect";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  const collectionName = searchParams.get("collectionName");

  if (!userEmail || !collectionName) {
    return new Response("Missing params", { status: 400 });
  }

  await dbConnect();

  // Step 1: Remove the user from all bookmarks with this collection
  await Post.updateMany(
    { "bookmarks.collectionName": collectionName },
    {
      $pull: {
        "bookmarks.$[elem].users": userEmail,
      },
    },
    {
      arrayFilters: [{ "elem.collectionName": collectionName }],
    }
  );

  // Step 2: Remove bookmark entries where collectionName === target and users array is empty
  const posts = await Post.find({ "bookmarks.collectionName": collectionName });

  for (const post of posts) {
    post.bookmarks = post.bookmarks.filter(b => {
      // Keep bookmark if it's not the target collection OR it has users
      return !(b.collectionName === collectionName && b.users.length === 0);
    });
    await post.save();
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
