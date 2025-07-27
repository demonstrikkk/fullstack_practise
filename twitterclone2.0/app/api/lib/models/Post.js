



// server/app/api/lib/models/Post.js
import mongoose from "mongoose";


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

// Main Post schema
const postSchema = new mongoose.Schema({
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
  createdAt:    { type: Date, default: Date.now },
});

// === Instance methods for bookmark management ===

// Add a user to a named bookmark collection
postSchema.methods.addBookmark = async function(userEmail, collectionName) {
  let col = this.bookmarks.find(c => c.collectionName === collectionName);
  if (!col) {
    col = { collectionName, users: [] };
    this.bookmarks.push(col);
  }
  if (!col.users.includes(userEmail)) {
    col.users.push(userEmail);
  }
  return this.save();
};

// Remove a user from a named bookmark collection
postSchema.methods.removeBookmark = async function(userEmail, collectionName) {
  const col = this.bookmarks.find(c => c.collectionName === collectionName);
  if (col) {
    col.users = col.users.filter(u => u !== userEmail);
    // Remove empty collections
    this.bookmarks = this.bookmarks.filter(c => c.users.length > 0);
  }
  return this.save();
};

// Check if a post is bookmarked by a specific user in any collection
postSchema.methods.isBookmarkedBy = function(userEmail) {
  return this.bookmarks.some(c => c.users.includes(userEmail));
};

// Export the model
export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
// At the bottom of Post.js
export const postSchemaed = postSchema;
