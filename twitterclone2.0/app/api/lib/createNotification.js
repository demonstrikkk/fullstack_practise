import { Notification } from "./models/Notification";
import dbConnect from "./dBconnect";


export async function createNotification({ userEmail, fromUserEmail, type, postId = null }) {
//   await dbConnect();

//   if (userEmail === fromUserEmail) return; // no self-notify

//   await Notification.create({
//     userEmail,
//     fromUserEmail,
//     type,
//     postId,
//   });


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
    console.error("Notification creation failed:", err);
  }

}
