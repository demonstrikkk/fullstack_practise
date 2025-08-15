// /lib/models/NewsCache.js
import mongoose from "mongoose";
export const dynamic = 'force-dynamic';

const NewsCacheSchema = new mongoose.Schema({
  tag: { type: String, required: true },         // e.g. "sports", "general", "trending"
  userEmail: { type: String, default: null },    // null for general categories, user email for personalized
  articles: { type: Array, default: [] },        // array of article objects with full info
  fetchedAt: { type: Date, default: Date.now },  // timestamp of last fetch
});

NewsCacheSchema.index({ tag: 1, userEmail: 1 }, { unique: true });

export const NewsCache = mongoose.models.NewsCache || mongoose.model("NewsCache", NewsCacheSchema);
