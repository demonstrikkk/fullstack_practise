import mongoose from "mongoose";

// const NotificationSchema = new mongoose.Schema({
//   userEmail: { type: String, required: true }, // Receiver of notification
//   fromUserEmail: { type: String, required: true }, // Actor who triggered it
//   type: {
//     type: String,
//     enum: ["follow", "like", "comment"],
//     required: true,
//   },
//   postId: { type: String }, // Optional, for like/comment
//   isRead: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
// });

const NotificationSchema = new mongoose.Schema({
  userEmail:  { type: String, required: true },
  fromUserEmail: { type: String, required: true },
  type:{
     type: String,
     enum: ["follow", "like", "comment"],
     required: true,
  },
  postId:{ type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });


export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);


