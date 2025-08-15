
import { NextResponse } from "next/server";
import dbConnect from "../../lib/dBconnect";
import UserProfile from "../../lib/models/UserProfile";
import { invalidateCache } from "../../lib/cacheInvalidator";
import { createNotification } from "../../lib/createNotification";
export const dynamic = 'force-dynamic';

export async function POST(req) {
  await dbConnect();

  const { targetEmail, viewerEmail } = await req.json();

  if (!targetEmail || !viewerEmail || targetEmail === viewerEmail) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const viewer = await UserProfile.findOne({ email: viewerEmail });
  const target = await UserProfile.findOne({ email: targetEmail });

  if (!viewer || !target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Ensure default structure exists
  target.followers = target.followers || { users: [], count: 0 };
  viewer.following = viewer.following || { users: [], count: 0 };

  const isFollowing = target.followers.users.includes(viewerEmail);

if (isFollowing) {
    // Unfollow
    target.followers.users = target.followers.users.filter(u => u !== viewerEmail);
    target.followers.count = Math.max(0, target.followers.count - 1);
    
    viewer.following.users = viewer.following.users.filter(u => u !== targetEmail);
    viewer.following.count = Math.max(0, viewer.following.count - 1);
} else {
    // Follow
    if (!target.followers.users.includes(viewerEmail)) {
        target.followers.users.push(viewerEmail);
        target.followers.count += 1;
    }
    
    if (!viewer.following.users.includes(targetEmail)) {
        viewer.following.users.push(targetEmail);
        viewer.following.count += 1;
    }
    await createNotification({
  userEmail: targetEmail,          // receiver of the notification
  fromUserEmail: viewerEmail,      // actor who followed
  type: "follow",
});

}

await target.save();
await viewer.save();

  await invalidateCache(`userprofile:${targetEmail}`);
  await invalidateCache(`userprofile:${viewerEmail}`);

return NextResponse.json({
    following: !isFollowing,
    newFollowerCount: target.followers.count,
    viewerNewFollowingCount: viewer.following.count
});
}