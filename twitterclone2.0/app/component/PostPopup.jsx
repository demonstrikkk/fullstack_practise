"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import PostCard from "./post-card";
import { usePollVoting } from "../Otherprofile/page";

export default function PostPopup({ postId }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/api/posts/byPostId?postId=${postId}`);
                const data = await res.json();
                setPost(data.post);
            } catch (err) {
                console.error("Failed to fetch post:", err);
            } finally {
                setLoading(false);
            }
        }
        
        if (postId) fetchPost();
    }, [postId]);
    
    const handleLike = async (postId) => {
       const res = await fetch('/api/posts/likeduser', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ postId, UserEmail: post.userEmail }) })
         const data = await res.json();
         if (res.ok) {
           setPosts(prev =>
             prev.map(p => p.postId === postId ? data.post : p)
           )
         }
       };
    // const { handleVote, userSelectedOption } = usePollVoting(post.userEmail, posts, setPosts);
    
    if (loading) return <p className="text-gray-400">Loading post...</p>;

  if (!post) return <p className="text-red-400">Post not found.</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
         <PostCard
                                 
                                 
                                 userEmail={post.userEmail}
                                 onLike={handleLike}
                                //  onVote={handleVote}
                                 
                                //  userSelectedOption={userSelectedOption}
                                 postId = {post.postId}
                                 text = {post.content.text}
                                 media = {post.content.media}
                                 poll = {post.content.poll}
                                 likedByCurrentUser={post.likedByCurrentUser}
                                 likedbyUsers = {post.likedUsernames}
                                 likesCount = {post.likes.count}
                                 username = {post.userInfo.username }
                                 userrealname = {post.userInfo.userrealname}
                                 avatar =  {post.userInfo.avatar}
                                 createdAt = {post.createdAt}
                                 
                                 // ... other props
                                 />
        
    </div>
    </div>
  );
}
