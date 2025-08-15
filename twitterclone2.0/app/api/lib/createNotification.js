import { Notification } from "./models/Notification";
import dbConnect from "./dBconnect";

export const dynamic = 'force-dynamic';


export  async function createNotification({ userEmail, fromUserEmail, type, postId = null }) {



try {
    await dbConnect();
    if (userEmail === fromUserEmail) return;
    await Notification.create({
      userEmail,
      fromUserEmail,
      type,
      postId,
    });
  } catch (err) {
  }

}
