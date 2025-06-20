

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PostCard from "../component/post-card";
import { useRouter } from "next/navigation";

export default function BookmarkedPosts() {
  const { data: session } = useSession();
  const [collections, setCollections] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSelectedOption, setUserSelectedOption] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const email = session?.user?.email;
  const router = useRouter();

  // Fetch all collections
  useEffect(() => {
    if (!email) return;

    const fetchCollections = async () => {
      try {
        const res = await fetch(`/api/posts/collections?userEmail=${email}`);
        const data = await res.json();
        setCollections(data.collections || []);
        if (data.collections?.length === 1) {
          setActiveCollection(data.collections[0]);
        }
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      }
    };

    fetchCollections();
  }, [email]);

  // Fetch posts of selected collection
  useEffect(() => {
    if (!email || !activeCollection) return;

    const fetchBookmarks = async () => {
      try {
        const res = await fetch(
          `/api/posts/bookmarked?userEmail=${email}&collectionName=${activeCollection}`
        );
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Bookmark load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [email, activeCollection]);

  // Fetch user info
  useEffect(() => {
    if (!email) return;

    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`/api/user/byEmail?email=${email}`);
        const data = await res.json();
        setUserInfo(data);
      } catch (error) {
        console.error("User info error:", error);
      }
    };

    fetchUserInfo();
  }, [email]);

  const handleDeleteCollection = async (collectionName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${collectionName}"?`);
    if (!confirmDelete) return;

    setDeleting(collectionName);

    try {
      const res = await fetch(
        `/api/posts/deleteCollection?userEmail=${email}&collectionName=${collectionName}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setCollections(prev => prev.filter(col => col !== collectionName));
        if (activeCollection === collectionName) setActiveCollection(null);
      } else {
        console.error("Failed to delete collection");
      }
    } catch (err) {
      console.error("Delete collection error:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/posts/delete?postId=${postId}&email=${email}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts(prev => prev.filter(post => post.postId !== postId));
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Post delete error:", err);
    }
  };

  const handleVote = async (postId, selectedOption) => {
    try {
      const res = await fetch("/api/posts/voteuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, email, selectedOption }),
      });

      const data = await res.json();

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.postId === postId
              ? { ...p, content: { ...p.content, poll: data.post.content.poll } }
              : p
          )
        );
        setUserSelectedOption((prev) => ({ ...prev, [postId]: selectedOption }));
      }
    } catch (err) {
      console.error("Voting error:", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userEmail: email }),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.postId === postId
              ? {
                  ...post,
                  likedByCurrentUser: data.liked,
                  likes: {
                    count: data.newCount,
                    users: data.likedUsers,
                  },
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const res = await fetch("/api/posts/bookmarkToggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userEmail: email, collectionName: activeCollection }),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.postId === postId
              ? {
                  ...post,
                  bookmarkedByCurrentUser: data.bookmarked,
                  bookmarks: data.bookmarks,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarks</h1>

      {!activeCollection ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {collections.map((col, idx) => (
            <div
              key={idx}
              className="relative bg-zinc-900 border border-gray-700 rounded-xl shadow-md p-4 hover:border-blue-500 transition-all duration-200"
            >
              {/* 3-Dots Menu Button */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setDeleting((prev) => (prev === col ? null : col))}
                  className="text-gray-400 hover:text-white"
                >
                  ⋮
                </button>

                {/* Dropdown Menu */}
                {deleting === col && (
                  <div className="absolute right-0 mt-2 w-28 bg-zinc-800 border border-gray-700 rounded shadow-md z-10">
                    <button
                      onClick={() => handleDeleteCollection(col)}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-600 hover:text-white rounded-t"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleting(null)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-b"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div
                onClick={() => setActiveCollection(col)}
                className="cursor-pointer h-full flex flex-col items-center justify-center"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-gray-800 to-gray-700 rounded-md flex items-center justify-center text-center p-2">
                  <h2 className="text-white font-semibold text-lg break-words">{col}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4">
            <button
              className="bg-gray-700 px-4 py-1 rounded hover:bg-gray-600 text-sm"
              onClick={() => setActiveCollection(null)}
            >
              ← Back to Collections
            </button>
            <h2 className="text-xl mt-4 font-semibold">Collection: {activeCollection}</h2>
          </div>

          <div className="h-[90vh] overflow-y-scroll overflow-x-hidden two pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {loading ? (
              <p className="text-gray-400">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-500">No posts in this collection yet.</p>
            ) : (
              posts.slice().reverse().map((post, idx) => (
                <div key={post.postId || idx}>
                  <PostCard
                    userEmail={email}
                    postOwnerEmail={post.userInfo.email}
                    onLike={handleLike}
                    onVote={handleVote}
                    onDelete={handleDeletePost}
                    onBookmark={handleBookmark}
                    userSelectedOption={userSelectedOption}
                    postId={post.postId}
                    text={post.content.text}
                    media={post.content.media}
                    poll={post.content.poll}
                    likedByCurrentUser={post.likedByCurrentUser}
                    likedbyUsers={post.likedUsernames}
                    likesCount={post.likes.count}
                    username={post.userInfo.username}
                    userrealname={post.userInfo.userrealname}
                    avatar={post.userInfo.avatar}
                    createdAt={post.createdAt}
                    bookmarkedByCurrentUser={post.bookmarkedByCurrentUser}
                  />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
