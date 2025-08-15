// server/app/api/lib/models/ScheduledPost.js
import mongoose from "mongoose";
export const dynamic = 'force-dynamic';

// === Nested Reply Schema (for replies to comments) ===
const replySchema = new mongoose.Schema({
  replyId:  { type: String, required: true, unique: true },
  user:     { type: String, required: true }, // email or userId
  text:     { type: String, default: "" },
  media:    { type: String, default: null }, // GIF/image/video (URL)
  likes:    { type: [String], default: [] }, // list of userEmails who liked
  timestamp: { type: Date, default: Date.now },
  username:  { type: String, required: true },  // NEW
  avatar:    { type: String, default: '/default-avatar.png' } 
}, { _id: false });

// === Main Comment Schema (includes replies) ===
const commentSchema = new mongoose.Schema({
  commentId: { type: String, required: true, unique: true },
  user:      { type: String, required: true }, // email or userId
  text:      { type: String, default: "" },
  media:     { type: String, default: null }, // Can be GIF/image/video URL
  likes:     { type: [String], default: [] }, // emails who liked the comment
  replies:   { type: [replySchema], default: [] }, // nested replies
  timestamp: { type: Date, default: Date.now },
   username:  { type: String, required: true },  // NEW
  avatar:    { type: String, default: '/default-avatar.png' } // NEW
});



const pollOptionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 },
});

// Sub-schema for bookmark collections within a post
const bookmarkCollectionSubschema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  users:         [{ type: String }],        // userEmails who saved this post to that collection
}, { _id: false });




const scheduledPostSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  postId:    { type: String, required: true, unique: true },
  content: {
    text:  String,
    media: [String], // image, video, gif URLs
    poll: {
      question:   String,
      options:    [pollOptionSchema],
      votedUsers: [String], // emails who voted
    },
  },
  likes: {
    count: { type: Number, default: 0 },
    users: [String],
  },
  retweet: {
    count: { type: Number, default: 0 },
    users: [String],
  },
  // Bookmarks: an array of collections; each holds a list of userEmails
  bookmarks: [bookmarkCollectionSubschema],
  comments:     [commentSchema],
  commentCount: { type: Number, default: 0 },
  scheduledFor: { type: Date, required: true }, // this is when it should go live
  createdAt:    { type: Date, default: Date.now },
});

export const ScheduledPost = mongoose.models.ScheduledPost || mongoose.model("ScheduledPost", scheduledPostSchema);
