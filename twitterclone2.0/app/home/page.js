'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import MediaUpload from '../component/mediaupload';
import dynamic from "next/dynamic";
import GiphySearch from '../component/gifupload';
import Poll from '../component/poll';
const EmojiPicker = dynamic(() => import("../component/emojiupload"), { ssr: false });
import StaticPollPreview from '../component/StaticPoll';
import CommentSection from '../component/commentsection';
import { SkeletonPost } from '../component/skeletionpost';
import { SkeletonProfile } from '../component/skeletionpost';
import OtherProfileComponent from '../Otherprofile/page';
import { supabase } from '../api/lib/supabaseClient';
// import CommentSection from '../component/comments/CommentSection';

export default function Section2Content({ userrealname, username, avatar, email }) {

  const [pollPreview, setPollPreview] = useState(null);
  const loaderRef = useRef(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [newPostCreated, setNewPostCreated] = useState(false);
  const [posts, setPosts] = useState([]);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('foryou');
  const [showGifUpload, setShowGifUpload] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showPoll, setshowPoll] = useState(false)
  const [openLikedPostId, setOpenLikedPostId] = useState(null);
  const [openretweetPostId, setOpenretweetPostId] = useState(null);

  const [pollData, setPollData] = useState(null);
  const [showStaticPoll, setShowStaticPoll] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [showCollectionPopup, setShowCollectionPopup] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [collections, setCollections] = useState([]);
  const [comments, setComments] = useState([])
  const [showcomments, setshowComments] = useState(false)
  const [scheduledDateTime, setScheduledDateTime] = useState(null);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const handlePollSubmit = (data) => {
    setPollData(data);
    setShowStaticPoll(true);
  };

  const handlePostSubmit = () => {
    setSubmitted(true);
  };




  const handleUserClick = async (clickedEmail) => {
    if (!clickedEmail || clickedEmail === email) return; // Avoid reloading own profile

    try {
      const res = await fetch("/api/getUserProfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: [clickedEmail] }),
      });

      const data = await res.json();
      const profile = data?.[0];

      if (profile) {
        setSelectedUser(profile); // Triggers <OtherProfileComponent />
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };




  const handleScheduledPost = async () => {
    if (inputText.length < 5) return;
    const isValidMediaUrl = (url) =>
      typeof url === "string" &&
      (url.startsWith("https://res.cloudinary.com/") || url.includes("giphy.com"));

    const mediaUrls = selectedMedia?.url && isValidMediaUrl(selectedMedia.url)
      ? [selectedMedia.url]
      : [];

    const payload = {
      userEmail: email, // use session or prop
      content: {
        text: inputText,
        media: mediaUrls,
        poll: pollData?.question
          ? {
            question: pollData.question,
            options: pollData.options.filter((opt) => opt.trim() !== ""),
            votedUsers: [],
          }
          : null,
      },
      scheduledFor: scheduledDateTime,
    };

    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.success) {
      setInputText("");
      setSelectedMedia(null);
      setPollData(null);
      setScheduledDateTime(null);
    }
  };


  const refreshPosts = async () => {
    const res = await fetch(
      activeTab === "following"
        ? `/api/posts/following?viewer=${email}&skip=0&limit=${limit}`
        : `/api/posts?viewer=${email}&skip=0&limit=${limit}`
    );
    const data = await res.json();
    setPosts(data.posts || []);
    setSkip(data.posts.length);
    setHasMore(data.posts.length === limit);
  }

  const openBookmarkModal = async (postId) => {
    try {
      const res = await fetch(`/api/posts/collections?userEmail=${email}`);
      const data = await res.json();

      const uniqueCollections = Array.from(new Set(data.collections || []));

      setCollections(uniqueCollections);
      setSelectedPostId(postId);
      setShowCollectionPopup(true);
    } catch (err) {
      console.error("Failed to load collections:", err);
    }
  };

  const toggleLike = async (postId) => {
    const res = await fetch('/api/posts/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userEmail: email, username: username }),
    });

    const data = await res.json();

    if (res.ok) {
      setPosts(prev =>
        prev.map(post =>
          post.postId === postId
            ? {
              ...post,
              likedByCurrentUser: data.liked,
              likes: {
                count: data.newCount,
                users: data.likedUsers, // ✅ preserve real list from server
              },
            }
            : post
        )
      );
    }
  };
  const toggleretweet = async (postId) => {
    const res = await fetch('/api/posts/retweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userEmail: email, username: username }),
    });

    const data = await res.json();

    if (res.ok) {
      setPosts(prev =>
        prev.map(post =>
          post.postId === postId
            ? {
              ...post,
              retweetByCurrentUser: data.retweeted,
              retweets: {
                count: data.newCount,
                users: data.retweetUsers, // ✅ preserve real list from server
              },
            }
            : post
        )
      );
    }
  };


  const toggleBookmark = async (postId, collectionName = 'default') => {

    const res = await fetch('/api/posts/bookmarkToggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userEmail: email, collectionName }),
    })

    const data = await res.json();

    if (res.ok) {
      setPosts(prev =>
        prev.map(post =>
          post.postId === postId
            ? {
              ...post,
              bookmarkedByCurrentUser: data.bookmarked,
              bookmarks: data.bookmarks,
            }
            : post
        )
      );
    } else {
      console.error('Bookmark error:', data.message);
    }

  };

  const saveBookmark = async (postId, rawName) => {
    const collectionName = rawName.trim();

    if (!collectionName || collections.includes(collectionName)) {
      return; // Do nothing if invalid or already exists
    }

    try {
      const res = await fetch('/api/posts/bookmarkToggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userEmail: email, collectionName }),
      });

      const data = await res.json();

      if (res.ok) {
        setPosts(prev =>
          prev.map(post =>
            post.postId === postId
              ? {
                ...post,
                bookmarkedByCurrentUser: data.bookmarked,
                bookmarks: data.bookmarks,
              }
              : post
          )
        );

        // Refetch updated collections to prevent ghost re-add
        const refresh = await fetch(`/api/posts/collections?userEmail=${email}`);
        const refreshData = await refresh.json();
        setCollections(Array.from(new Set(refreshData.collections || [])));

        setShowCollectionPopup(false);
        setNewCollectionName('');
      } else {
        console.error('Bookmark error:', data.message);
      }
    } catch (err) {
      console.error('Failed to bookmark:', err);
    }
  };


  const [selectedUser, setSelectedUser] = useState(null);
  const [showSkeletonProfile, setShowSkeletonProfile] = useState(true);
  const [showSkeletonPosts, setShowSkeletonPosts] = useState(true);
  const [showMorePostsSkeleton, setShowMorePostsSkeleton] = useState(false);

  // Trigger 4s delay skeleton for "load more"


  // Delay hiding SkeletonProfile after avatar is loaded
  useEffect(() => {
    let profileTimer;
    if (avatar) {
      profileTimer = setTimeout(() => setShowSkeletonProfile(false), 3000);
    }
    return () => clearTimeout(profileTimer);
  }, [avatar]);

  // Delay hiding SkeletonPost after posts are loaded


  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10; // number of posts to load per batch
  const [tabReady, setTabReady] = useState(false);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
    setTabReady(false); // prevent early fetch
  };


  const fetchPosts = useCallback(async () => {
    if (!email || loading || !hasMore) return;

    setLoading(true);
    try {
      const endpoint =
        activeTab === "following"
          ? `/api/posts/following?viewer=${email}&skip=${skip}&limit=${limit}`
          : `/api/posts?viewer=${email}&skip=${skip}&limit=${limit}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      const newPosts = data?.posts || [];

      setPosts(prev => [...prev, ...newPosts]);
      setSkip(prev => prev + newPosts.length);
      setHasMore(newPosts.length === limit);
    } finally {
      setLoading(false);
    }
  }, [email, loading, hasMore, skip, limit, activeTab]);


  useEffect(() => {
    if (email) {
      setPosts([]);
      setSkip(0);
      setHasMore(true);
      setLoading(true); // Add this so loader shows on tab change / new user
      fetchPosts().finally(() => setLoading(false)); // call initial fetch
    }
  }, [email, activeTab, tabReady]);
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab === "following" || savedTab === "foryou") {
      setActiveTab(savedTab);
    }
    setTabReady(true);
  }, []);


  useEffect(() => {
    if (!loading && hasMore && posts.length > 0) {
      setShowMorePostsSkeleton(true);
      const timer = setTimeout(() => setShowMorePostsSkeleton(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, hasMore, posts.length]);


  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/api/scheduled-tasks/publish');  // Triggers the promotion
        await refreshPosts(); // Re-fetch updated posts
      } catch (err) {
        console.error('Failed to fetch/publish scheduled posts:', err);
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    let postTimer;
    if (!loading && posts?.length > 0) {
      postTimer = setTimeout(() => setShowSkeletonPosts(false), 2000);
    }
    return () => clearTimeout(postTimer);
  }, [loading, posts]);



  // 💡 Only use IntersectionObserver (avoid scroll listener)
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      {
        rootMargin: '200px', // triggers before reaching actual bottom
      }
    );

    observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchPosts, hasMore, loading]);




  const handleFileSelect = async (file) => {
    if (!file) return;
    const isGiphyUrl = typeof file === "string" && file.includes("giphy.com");
    const isLocalFile = typeof file !== "string" && file instanceof File;

    if (isGiphyUrl) {
      // 💡 Directly use Giphy link
      setSelectedMedia({
        type: "gif",
        url: file,
        isGiphy: true,
      });
      return;
    }

    else {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        // Save to state (or send to MongoDB)
        setFiles((prev) => [...prev, file]);

        setSelectedMedia({
          type: file.type.startsWith("image") ? "image" : "video",
          url: data.secure_url, // direct Cloudinary CDN link
          public_id: data.public_id, // useful if using <CldImage />
        });
      } catch (err) {
        console.error("Upload error:", err);
        // You can add toast here if needed
      }
    }
  };
  const handlePostClick = async () => {
    if (inputText.length < 5) return;
    const isValidMediaUrl = (url) =>
      typeof url === "string" &&
      (url.startsWith("https://res.cloudinary.com/") || url.includes("giphy.com"));

    const mediaUrls = selectedMedia?.url && isValidMediaUrl(selectedMedia.url)
      ? [selectedMedia.url]
      : [];

    const payload = {
      userEmail: email,
      text: inputText,
      media: mediaUrls,
      poll: pollData
        ? {
          question: pollData.question,
          options: pollData.options.map(opt => ({
            text: opt,
            votes: 0,
            voters: [],
          })),
          votedUsers: [],
        }
        : null,
    };

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.post) {
        throw new Error("Post creation failed or incomplete.");
      }

      const newPost = {
        ...data.post,
        userInfo: {
          username,
          userrealname,
          avatar,
        },
        likedByCurrentUser: false,
        likes: {
          count: 0,
          users: [],
        },
      };

      // Reset all inputs
      setInputText('');
      setFiles([]);
      setSelectedMedia(null);
      setPollPreview(null);

      setPosts(prev => [newPost, ...prev]);

    } catch (error) {
      console.error("Error while posting:", error);
    }
  };




  const handleEmojiSelect = (emojiObj) => {
    setInputText((prev) => prev + (emojiObj.native || emojiObj.emoji));
  };



  // 1. First, create a user object to consolidate user-related props
  const currentUser = {
    email,
    username,
    avatar
  };

  // 2. Create a handlers object for all action props
  const commentHandlers = {
    onClose: () => setshowComments(false),
    onEmojiSelect: handleEmojiSelect,
    onGifToggle: setShowGifUpload
  };

  // 3. Create a state object for all state-related props
  const commentState = {
    inputText,
    setInputText,
    showGifUpload
  };

  // Simplified component usage

  return (



    <div className="two secondd flex-1 bg-black snap-y overflow-y-scroll scrollbar-hide overflow-x-hidden">
      {selectedUser && <OtherProfileComponent
        userrealname={selectedUser?.profile?.displayName}
        username={selectedUser?.username}
        avatar={selectedUser?.profile?.avatar}
        followers={selectedUser?.followers?.count}
        following={selectedUser?.following?.count}
        createdAt={selectedUser?.firstlogincreatedAt}
        email={selectedUser?.email}
        bio={selectedUser?.profile?.bio}
        location={selectedUser?.profile?.location}
        onClose={() => setSelectedUser(null)}
      />
      }

      {!selectedUser && (<>  <div className="headers textu flex h-12 sticky top-0 bg-black z-10 bg-opacity-70">
        <div
          className={`foryou w-[50%] flex flex-col items-center justify-center border-b-2 ${activeTab === 'foryou' ? 'border-blue-400' : 'border-gray-400'
            } hover:bg-slate-900 hover:border-slate-300 cursor-pointer`}
          onClick={() => setActiveTab('foryou')}
        >
          For you
          {activeTab === 'foryou' && <div className="w-16 rounded h-1 relative top-[10px] bg-blue-400" />}
        </div>
        <div
          className={`foryou w-[50%] flex flex-col items-center justify-center border-b-2 ${activeTab === 'following' ? 'border-blue-400' : 'border-gray-400'
            } hover:bg-slate-900 hover:border-slate-300 cursor-pointer`}
          onClick={() => setActiveTab('following')}
        >
          Following
          {activeTab === 'following' && <div className="w-16 rounded h-1 relative top-[10px] bg-blue-400" />}
        </div>

      </div>

        <div className="postbox flex w-full h-[20%]">
          <div className="two snap-y overflow-y-scroll w-full sticky top-0 bg-black z-10 h-40">
            <div className="gmail flex left-[15%] items-center space-x-1.5 rounded-3xl px-3">
              <div className="inputbox w-full">
                {/* 
                  {showSkeletonProfile ? (
                    <SkeletonProfile />
                  ) : (
                    <div className="image w-10 h-10 rounded-full  relative overflow-hidden bottom-[30%]">
                      <img
                        src={avatar}
                        className="absolute w-full h-full object-cover"
                        alt="Profile"
                      />
                    </div>
                  )}


                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-[90%] left-[0px] h-[80px]  bg-transparent break-words relative top-[15px]  textu hover:cursor-pointer resize-none"
                    placeholder="What's Happening ?"
                    aria-label="Compose post"
                    id='postinput'
                  />

                </div> */}
                <div className="grampa flex items-start gap-2 w-full min-w-0">
  {showSkeletonProfile ? (
    <SkeletonProfile />
  ) : (
    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
      <img
        src={avatar}
        className="w-full h-full object-cover"
        alt="Profile"
      />
    </div>
  )}
  <textarea
    value={inputText}
    onChange={(e) => setInputText(e.target.value)}
    className="w-full h-20 relative top-2 bg-transparent resize-none text-white p-2 rounded-md border border-gray-700  hover:cursor-pointer"
    placeholder="What's Happening ?"
    aria-label="Compose post"
    id="postinput"
  />
</div>

                <center
                  className={`videobox items-center flex justify-center border rounded-md relative top-6 left-1/7 max-w-2/3 h-2/3 ${selectedMedia?.url ? 'border-white' : 'border-black'
                    } ${!selectedMedia?.url && 'hidden'}`}
                >
                  {selectedMedia?.url && (
                    <>
                      {selectedMedia.type === 'gif' || selectedMedia.type === 'image' ? (
                        <img
                          src={selectedMedia.url}
                          className="object-cover w-full h-full"
                          alt="Media preview"
                        />
                      ) : (
                        <video controls className="object-cover w-full h-full">
                          <source src={selectedMedia.url} />
                        </video>
                      )}
                      <button
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                        onClick={() => setSelectedMedia(null)}
                      >
                        ×
                      </button>
                    </>
                  )}





                  {showStaticPoll && !submitted && pollData && (
                    <StaticPollPreview data={pollData} />

                  )}



                </center>
                <div className="postbutton flex mt-4 justify-between items-center">
                  <div className="iconic flex gap-3 relative left-2 top-6">
                    <div className="icon-container img">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          hidden
                          accept="image/*,video/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleFileSelect(file)
                              setSelectedMedia({
                                type: file.type.startsWith('image') ? 'image' : 'video',
                                url: URL.createObjectURL(file)
                              });
                            }
                          }}
                        />
                        <svg viewBox="0 0 24 24" className="invert w-7" fill='brown'>
                          <g>
                            <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                          </g>
                        </svg>
                      </label>
                      <span className="tooltip">Media</span>
                    </div>


                    {/* GIF Upload */}
                    <div className="icon-container gif" onClick={() => setShowGifUpload(!showGifUpload)}>
                      <svg viewBox="0 0 24 24" className="invert w-7" fill='brown'>
                        <g>
                          <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z" />
                        </g>
                      </svg>
                      <span className="tooltip">GIF</span>
                    </div>
                    <div className="icon-container poll"
                      onClick={() => {

                        setshowPoll(true)


                      }
                      }>



                      <svg viewBox="0 0 24 24" aria-hidden="true" className=" w-7 mb-3 mt-1 invert  hover:fill-cyan-400" fill='red' >
                        <g><path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"></path></g>
                      </svg>
                      <span className="tooltip" >Poll</span>
                      {showPoll && <Poll onPollSelect="true" onPollSubmit={handlePollSubmit} />}


                    </div>
                    {/* Emoji Picker */}
                    <div className="icon-container emoji relative" ref={emojiPickerRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <button>
                        <svg viewBox="0 0 24 24" className="invert w-7 hover:fill-blue-800" fill='red'>
                          <g>
                            <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z" />
                          </g>
                        </svg>
                      </button>
                      <span className="tooltip">Emoji</span>
                    </div>

                    {showEmojiPicker && (
                      <div className="gifdo fixed inset-0 h-1/3  bg-black/10 flex items-center justify-center z-50 left-1/2 top-2/3 riboou">
                        <div ref={popupRef} className="w-[500px] h-1/4 rounded-3xl p-5 relative gifinside ">
                          <button
                            className="relative  bg-black/50 text-white rounded-full p-1"
                            onClick={() => document.querySelector('.gifdo').style.display = 'none'}
                          >
                            ×
                          </button>
                        <EmojiPicker
                          onEmojiSelect={handleEmojiSelect}
                        />
                        </div>
                      </div>
                    )}

                    {showGifUpload && (
                      <div className=" gifdo fixed bottom-1/3 inset-0 flex items-center justify-center z-50  w-full">
                        <div ref={popupRef} className="w-[500px] h-1/4 rounded-3xl p-5 relative gifinside ">
                          <button
                            className="relative  bg-black/50 text-white rounded-full p-1"
                            onClick={() => document.querySelector('.gifdo').style.display = 'none'}
                          >
                            ×
                          </button>
                          <GiphySearch onGifSelect={(url) => {
                            setShowGifUpload(false);
                            setSelectedMedia({ type: 'gif', url });
                          }} />
                        </div>
                      </div>
                    )}
                    {/* <div className="icon-container Schedule">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-7 mb-3 mt-1" style={{ color: "rgb(29, 155, 240)" }} fill='red' onClick ={() =>setShowSchedulePicker(true)}>
                      <g>
                        <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z" />
                      </g>
                    </svg>
                                        
                    <span className="tooltip">Schedule</span>
                                     
              
              


                  </div> */}
                    <div className="icon-container Schedule">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="invert w-7 mb-3 mt-1"
                        style={{ color: "rgb(29, 155, 240)" }}
                        onClick={() => setShowSchedulePicker(true)} // 🔧 corrected `onclick` to `onClick`
                        fill="red"
                      >
                        <g>
                          <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z" />
                        </g>
                      </svg>

                      <span className="tooltip">Schedule</span>

                      {scheduledDateTime && (
                        <div className="text-xs text-blue-400 absolute top-10 left-0">
                          {new Date(scheduledDateTime).toLocaleString()}
                          <button
                            className="text-red-500 ml-2"
                            onClick={() => setScheduledDateTime(null)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 🧩 FIX: this whole block was improperly closed */}
                    {showSchedulePicker && (
                      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                        <div className="bg-black p-6 rounded-xl w-[90%] max-w-md shadow-lg">
                          <h3 className="text-xl font-semibold mb-4 text-center">Schedule Post</h3>

                          <input
                            type="datetime-local"
                            className="w-full border p-2 rounded bg-gray-300 text-black"
                            value={scheduledDateTime || ""}
                            onChange={(e) => setScheduledDateTime(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                          />

                          <div className="mt-6 flex justify-between">
                            <button
                              onClick={() => setShowSchedulePicker(false)}
                              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => setShowSchedulePicker(false)}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                  <div
                    className={`button post bg-blue-400 flex justify-center relative top-5 w-10 px-10 py-2 font-extrabold font-sans rounded-3xl h-11 cursor-pointer ${inputText.length < 5 ? 'opacity-50' : ''
                      }`}
                    onClick={() => {
                      if (inputText.length >= 5) {
                        if (scheduledDateTime) { handleScheduledPost() }
                        else {
                          handlePostClick();
                          handlePollSubmit();
                        }
                      }
                    }}

                  >
                    <button>Post</button>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bordere border-b-2 border-gray-400 w-full my-6" />
        <div className="yourpost h-[60vh] ">

          <div className="content postty flex flex-col puttr h-[500px] overflow-y-auto overflow-x-hidden px-4">
            {showSkeletonPosts ? (
              <> {/* Show 3-5 skeleton posts while loading first batch */}
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : (
              posts.map((post, idx) => {
                const mediaUrl = post?.content?.media?.[0];
                const isVideo = mediaUrl?.endsWith('.mp4');
                const fillColor = post.likedByCurrentUser ? 'red' : 'none';
                const userEmail = email;
                const hasPoll = post.content?.poll?.question && post.content?.poll?.options?.length > 0;

                const handleVote = async (postId, selectedOption) => {
                  const res = await fetch(`/api/posts/${postId}/vote`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userEmail: email, selectedOption }),
                  });

                  const data = await res.json();
                  if (res.ok) {
                    // Update the UI instantly with new post data
                    setPosts(prev =>
                      prev.map(p => (p.postId === postId ? data.post : p))
                    );
                  } else {
                    alert(data.error);
                  }
                };





                return (
                  <div
                    key={idx}
                    className="post-card p-4 my-6 rounded-xl border border-gray-300  shadow-sm"
                  >
                    {showcomments && selectedPostId === post.postId && (
                      <div className="h-[110vh] inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
                        <CommentSection
                          postId={post.postId}
                          comments={comments}
                          setComments={setComments}
                          currentUser={currentUser}
                          handlers={commentHandlers}
                          state={commentState}
                          emojiPickerRef={emojiPickerRef}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-3 mb-2 my-3 space-y-2">
                      
                        <div className="image w-10 h-10 rounded-full bg-pink-500 text-green-300 relative overflow-hidden bottom-[30%]">
                          <img
                            src={post?.userInfo?.avatar}
                            className="absolute w-full h-full object-cover"
                            alt="Profile"
                          />
                        </div>
                        <div className='postprofilesletsgo cursor-pointer' onClick={() => handleUserClick(post.userEmail)}>
                          <div>
                          <p className="text-white font-semibold text-base ">{post?.userInfo?.username}</p>
                          <p className="text-gray-500 text-sm">{post?.userInfo?.userrealname}</p>
                          </div>
                        <div className=" text-gray-300 text-sm "><p> Posted On :{(post?.createdAt).slice(0, 10)}</p></div>
                        </div>
                      



                    </div>


                    <p className="text-white text-center">{post?.content?.text || ''}</p>



                    {mediaUrl && (
                      <div className="flex justify-center mt-6">
                        {isVideo ? (
                          <div className="videobox border rounded-md max-w-2/3 w-full">
                            <video controls className="object-cover w-full h-full">
                              <source src={mediaUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className="videobox border rounded-md max-w-2/3 w-full">
                            <img
                              src={mediaUrl}
                              alt="Post Media"
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    )}


                    {hasPoll && post?.content?.poll && (
                      <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md poll-container relative left-1/7 flex flex-col justify-center mt-6">
                        <h4 className="poll-title text-xl font-bold mb-4">{post.content.poll.question}</h4>

                        {post.content.poll.options?.map((opt, idx) => {
                          const totalVotes = post.content.poll.options.reduce((sum, o) => sum + o.votes, 0) || 1;
                          const percent = Math.round((opt.votes / totalVotes) * 100);
                          const userVoted = post.content.poll?.votedUsers?.includes(email);
                          const userVotedForThisOption = post.content.poll?.votedUsers?.includes(email) && post.content.poll.options.find(o => o.voters?.includes(email))?.text === opt.text;

                          return (
                            <div key={idx} className="text-white p-4 relative poll-options space-y-4">
                              <label className="flex items-center gap-2 mb-1">
                                <input
                                  type="radio"
                                  name={`poll-${post.postId}`}
                                  value={opt.text}
                                  checked={userVotedForThisOption} // Mark the selected option as checked
                                  onChange={() => handleVote(post.postId, opt.text)}
                                  className="mr-2"
                                />
                                <span>{opt.text}</span>
                              </label>

                              <div className="progress-bar bg-gray-600 h-2 rounded mb-1">
                                <div
                                  className={`progress h-2 rounded transition-all duration-500 ${userVotedForThisOption ? "bg-green-500" : "bg-blue-500"}`}
                                  style={{ width: `${percent}%` }}
                                ></div>
                              </div>

                              <p className="text-xs text-gray-400">{percent}% ({opt.votes} votes)</p>
                            </div>
                          );
                        })}
                      </div>
                    )}



                    <div className='flex justify-between relative right-2 post-card'>


                      <div className='flex justify-between items-center gap-4 space-x-5 my-5  relative left-5 py-10 '>
                        <div  >

                          <div className="flex">
                            <div className='like ' onClick={() => { toggleLike(post.postId) }} ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={fillColor} >
                              <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke={post.likedByCurrentUser ? "#ff0000" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
                            </svg></div>
                            <span className='text-white ' onClick={() => {
                              setOpenLikedPostId(openLikedPostId === post.postId ? null : post.postId);
                            }}>{post.likes.count}</span>
                          </div>

                        </div>
                        {/* <div className='share' ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}>
                          <path d="M20.3927 8.03168L18.6457 6.51461C17.3871 5.42153 16.8937 4.83352 16.2121 5.04139C15.3622 5.30059 15.642 6.93609 15.642 7.48824C14.3206 7.48824 12.9468 7.38661 11.6443 7.59836C7.34453 8.29742 6 11.3566 6 14.6525C7.21697 13.9065 8.43274 13.0746 9.8954 12.7289C11.7212 12.2973 13.7603 12.5032 15.642 12.5032C15.642 13.0554 15.3622 14.6909 16.2121 14.9501C16.9844 15.1856 17.3871 14.5699 18.6457 13.4769L20.3927 11.9598C21.4642 11.0293 22 10.564 22 9.99574C22 9.4275 21.4642 8.96223 20.3927 8.03168Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10.5676 3C6.70735 3.00694 4.68594 3.10152 3.39411 4.39073C2 5.78202 2 8.02125 2 12.4997C2 16.9782 2 19.2174 3.3941 20.6087C4.78821 22 7.03198 22 11.5195 22C16.0071 22 18.2509 22 19.645 20.6087C20.6156 19.64 20.9104 18.2603 21 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></div> */}
                        <div className='comment' onClick={() => {
                          setshowComments(true);
                          setSelectedPostId(post.postId);
                        }
                        }><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}>
                            <path d="M22 11.5667C22 16.8499 17.5222 21.1334 12 21.1334C11.3507 21.1343 10.7032 21.0742 10.0654 20.9545C9.60633 20.8682 9.37678 20.8251 9.21653 20.8496C9.05627 20.8741 8.82918 20.9948 8.37499 21.2364C7.09014 21.9197 5.59195 22.161 4.15111 21.893C4.69874 21.2194 5.07275 20.4112 5.23778 19.5448C5.33778 19.0148 5.09 18.5 4.71889 18.1231C3.03333 16.4115 2 14.1051 2 11.5667C2 6.28357 6.47778 2 12 2C17.5222 2 22 6.28357 22 11.5667Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M11.9955 12H12.0045M15.991 12H16M8 12H8.00897" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>


                        <div  >

                          <div className="flex">
                            <div className='retweet ' onClick={() => { toggleretweet(post.postId) }} >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={22} height={22} color={"#ffffff"} fill={"white"}>
                                <g>
                                  <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z">
                                  </path>
                                </g>
                              </svg>
                            </div>
                            <span className='text-white ' onClick={() => {
                              setOpenretweetPostId(openretweetPostId === post.postId ? null : post.postId);
                            }}>{post.retweet.count}</span>
                          </div>

                        </div>
                      </div>
                      <div className='bookmark'
                        onClick={() => {
                          // toggleBookmark(post.postId)
                          // setShowCollectionPopup(true)
                          openBookmarkModal(post.postId)
                        }
                        }><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={post.bookmarkedByCurrentUser ? "white" : "none"}
                          stroke={post.bookmarkedByCurrentUser ? "white" : "currentColor"} >
                          <path d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></div>
                    </div>


                    {showCollectionPopup && (
                      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center">
                        <div className="bg-zinc-900 p-6 rounded-xl w-[90%] max-w-sm text-white space-y-5 shadow-2xl border border-gray-700">
                          <h2 className="text-xl font-semibold text-center border-b border-gray-600 pb-2">Save to Collection</h2>

                          <div className="flex flex-col space-y-2 max-h-40 overflow-y-auto">
                            {collections.length === 0 && (
                              <p className="text-gray-400 text-sm text-center">No collections yet. Create one below.</p>
                            )}


                            {collections
                              .filter(col => col && typeof col === 'string')
                              .map((col, idx) => (
                                <div
                                  key={idx}
                                  className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-700 transition ${col === newCollectionName ? 'bg-blue-600 border-blue-500' : 'border-gray-600'
                                    }`}
                                  onClick={() => saveBookmark(selectedPostId, col)}
                                >
                                  {col}
                                </div>
                              ))}

                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="New collection name"
                              className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                              value={newCollectionName}
                              onChange={(e) => setNewCollectionName(e.target.value)}
                            />


                            <button
                              disabled={
                                !newCollectionName.trim() ||
                                collections.some(col => col.toLowerCase() === newCollectionName.trim().toLowerCase())
                              }
                              onClick={() => saveBookmark(selectedPostId, newCollectionName.trim())}
                              className={`w-full py-2 rounded text-sm font-semibold transition ${!newCollectionName.trim() ||
                                collections.some(col => col.toLowerCase() === newCollectionName.trim().toLowerCase())
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            >
                              {collections.some(col => col.toLowerCase() === newCollectionName.trim().toLowerCase())
                                ? 'Collection already exists'
                                : 'Create & Save'}
                            </button>

                          </div>

                          <button
                            onClick={() => {
                              setShowCollectionPopup(false);
                              setNewCollectionName('');
                            }}
                            className="w-full py-1 text-sm text-gray-400 hover:text-white underline text-center mt-3"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}



                    {post.likedUsernames?.length > 0 && (
                      <div className="text-xs text-gray-300 mt-1 relative left-8 bottom-4">
                        Liked by: {
                          post.likedUsernames.slice(-3).join(', ')
                        }
                        {post.likedUsernames.length > 3 && '...'}
                      </div>
                    )}




                  </div>
                );
              })

            )}



            <div ref={loaderRef}>
              {hasMore && showMorePostsSkeleton && (
                <>
                  <SkeletonPost />
                  <SkeletonPost />
                  <SkeletonPost />
                </>
              )}
              {hasMore && !showMorePostsSkeleton && !loading && (
                <div className="h-10 mt-4 flex justify-center items-center text-gray-400">
                  loading more....
                </div>
              )}
            </div>


          </div>
        </div></>)
      }
    </div >
  );
}


