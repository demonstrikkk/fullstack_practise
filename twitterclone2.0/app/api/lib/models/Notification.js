import mongoose from "mongoose";



const NotificationSchema = new mongoose.Schema({
  userEmail:  { type: String, required: true },
  fromUserEmail: { type: String, required: true },
  type:{
     type: String,
     enum: ["follow", "like", "comment","retweet"],
     required: true,
  },
  postId:{ type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });


export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);


