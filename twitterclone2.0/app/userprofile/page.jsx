
// app/component/page.js
"use client";
import { useEffect, useState } from 'react';
import { getDisplayName } from "next/dist/shared/lib/utils";
import { React } from "react";
import PostCard from "../component/post-card";
import { useSession } from 'next-auth/react';
import UpdateProfileForm from "../component/updateprofile";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from 'lucide-react';
import { supabase } from '../api/lib/supabaseClient';
export  function usePollVoting(userEmail, posts , setPosts) {
  const [userSelectedOption, setUserSelectedOption] = useState({}); // keyed by postId
   
  const handleVote = async (postId, selectedOption) => {
    try {
      const res = await fetch('/api/posts/voteuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userEmail, selectedOption }),
      });

      const data = await res.json();

      if (res.ok) {
        setPosts(prev =>
          prev.map(p =>
            p.postId === postId
              ? { ...p, content: { ...p.content, poll: data.post.content.poll } }
              : p
          )
        );

        setUserSelectedOption(prev => ({ ...prev, [postId]: selectedOption }));
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Voting error:", err);
    }
  };
  
  return { handleVote, userSelectedOption };
}





export default function ProfileComponent({ userrealname, username, avatar, followers, following, bio, location, createdAt, email  }) {
  
  
  const [session, setSession] = useState(null);

  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  
  const [refreshNeeded, setRefreshNeeded] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'followers' or 'following'
  const [modalUsers, setModalUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  useEffect(() => {
    // Fetch the session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Also subscribe to auth state changes (optional, for realtime updates)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

const handleOpenModal = async (type, data) => {
  setModalType(type);
  setIsModalOpen(true);
  setLoadingUsers(true);

  try {
    const emails = data?.users || [];
    const res = await fetch("/api/getUserProfiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails }),
    });
    const result = await res.json();

    if (Array.isArray(result)) {
      setModalUsers(result);
    } else {
      setModalUsers([]);
    }
  } catch (err) {
    console.error("Error fetching user list:", err);
    setModalUsers([]);
  } finally {
    setLoadingUsers(false);
  }
};





const fetchScheduledPosts = async () => {
  try {
    const res = await fetch(`/api/scheduledposts/user?email=${email}`);
    const data = await res.json();

    if (res.ok && data.scheduleposts) {
      setScheduledPosts(data.scheduleposts);  // ✅ Corrected
    } else {
      console.error("Failed to load scheduled posts: Invalid response format");
    }
  } catch (err) {
    console.error("Failed to load scheduled posts:", err);
  }
};


const handleScheduledDelete = async (postId) => {

  try {
    const res = await fetch(`/api/schedule?id=${postId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setScheduledPosts(prev => prev.filter(p => p._id !== postId));
    }
  } catch (err) {
    console.error("Failed to delete scheduled post:", err);
  }
};
useEffect(() => {
  
    setLoading(false);
    fetchScheduledPosts();
  
}, [ email]);




useEffect(() => {
  const fetchReposts = async () => {
    try {
      const res = await fetch(`/api/repostsbyuser?email=${email}`);
      const data = await res.json();
      if (res.ok) {
        setReposts(data.reposts || []);
      } else {
        console.error("Failed to fetch reposts:", data.error);
      }
    } catch (err) {
      console.error("Reposts fetch error:", err);
    }
  };

  fetchReposts();
}, [email]);


useEffect(() => {
  if (refreshNeeded) {
    router.refresh();              // ✅ Proper App Router way
    setRefreshNeeded(false);
  }
}, [refreshNeeded]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
   const [isOpen, setIsOpen] = useState(false);
   const [reposts, setReposts] = useState([]);


  const { handleVote, userSelectedOption } = usePollVoting(email, posts, setPosts);
 


useEffect(() => {
  const fetchPosts = async () => {
    setLoading(true);

    try {
      // Ensure loader stays at least 1.5 seconds
      const delay = new Promise(resolve => setTimeout(resolve, 1500));
      const response = fetch(`/api/posts/postsofemail?email=${email}`);
      const [res] = await Promise.all([response, delay]);

      const data = await res.json();

      if (data.posts) {
        setPosts(data.posts);
      } else if (Array.isArray(data.users)) {
        setPosts(data.users);
      } else if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setError('Invalid posts data format');
      }

    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false); // hide loader after delay + fetch
    }
  };

  fetchPosts();
}, [email]);



const handleDeletePost = async (postId) => {
 

  try {
    const res = await fetch(`/api/posts/delete?postId=${postId}&email=${email}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      // Refetch posts
      const updated = await fetch(`/api/posts/postsofemail?email=${email}`);
      const data = await updated.json();
      setPosts(data.posts || []);
    } else {
      console.error("Failed to delete post.");
    }
  } catch (err) {
    console.error("Error deleting post:", err);
  }
};


const handleLike = async (postId) => {
    const res = await fetch('/api/posts/likeduser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userEmail: email }) })
    const data = await res.json();
    if (res.ok) {
      setPosts(prev =>
        prev.map(p => p.postId === postId ? data.post : p)
      );
    }
  };


  const handleRetweet = async (postId) => {
    const res = await fetch('/api/posts/retweetedprofile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userEmail: email })
    });
    const data = await res.json();
    if (res.ok) {
      setPosts(prev =>
        prev.map(p => p.postId === postId ? data.post : p)
      );
    }
  };


    
    return (
    <>

      <div className="flex flex-col justify-center rounded bg-black">
        {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
    <div className="bg-zinc-900 text-white rounded-lg w-[90vw] max-w-md h-[80vh] overflow-y-auto shadow-2xl relative p-4">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-2 right-2 text-white text-lg font-bold"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4 capitalize">{modalType}</h2>
      {loadingUsers ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-400 w-6 h-6" />
        </div>
      ) : modalUsers.length > 0 ? (
        modalUsers.map((user, idx) => (
          <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-700">
            <img
              src={user?.profile?.avatar}
              className="w-10 h-10 rounded-full object-cover"
              alt={`${user.username}'s avatar`}
            />
            <div>
              <p className="text-white font-semibold">{user.username}</p>
              <p className="text-gray-400 text-sm">{user.userrealname}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">No users found.</p>
      )}
    </div>
  </div>
)}


        <div className="box0 sticky w-full h-[10vh] top-0 text-white bg-black flex flex-row opacity-90">

          <div className="text-white relative top-[50%] left-[2%] font-bold">{userrealname} !</div>
        </div>
        <div className="overflow-y-scroll overflow-x-hidden two" style={{ scrollbarWidth: "none" }}>
          <div className="box1 w-full h-[30vh] bg-gray-600 text-white">
            <div className="h-[20vh] w-[20vh] overflow-hidden rounded-full relative top-[20vh] left-[3%] border-3 border-black">
              <img src={avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            </div>
            {/* <div className="h-[30vh] w-[30vh] overflow-hidden rounded-full">
  <img
    src={avatar}
    alt="Avatar"
    className="h-full w-full object-cover"
  />
</div> */}

          
          </div>
          <div className="box2 w-full h-[60vh] bg-black text-white">
            <div className="profile_edit">
            <Toaster />
              <button  onClick={() => setIsOpen(true)}
               className="relative left-[70%] top-[50%]  mt-4 py-2 px-3 rounded-3xl border bg-black text-white font-bold">Edit Profile</button>
          <UpdateProfileForm
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialData={{ userrealname, avatar, bio, location }}
  triggerRefresh={setRefreshNeeded}
/>
           </div>
           
            <div className="profileinfo flex flex-col relative top-[10%] left-[5%] w-[80%] h-[100vh] px-2">
              <div className="text-lg font-bold">{userrealname}</div>
              <div className="text-gray-600"><p>@{username}</p></div>
              <div className="text-gray-400 text-sm my-2">Currently In : {location}</div>
              <div className="text-white font-serif font-semibold text-lg my-3"><h6>{bio}</h6></div>
              <div className="my-3.5 text-gray-300 text-xs font-serif">
                Joined on : {new Date(createdAt).toLocaleDateString()}
              </div>
              {/* <div className="flex">
                <div className="followingnumber text-white font-bold mx-1">{following}</div>
                <div className="text-gray-600  ">Following</div>
                <div className="space w-[20px]"></div>
                <div className="followernumber text-white font-bold mx-1">{followers}</div>
                <div className="text-gray-600 ml-1">Followers</div>
              </div> */}
              <div className="flex">
  <div
    onClick={() => handleOpenModal('following', following)}
    className="followingnumber text-white font-bold mx-1 cursor-pointer hover:underline"
  >
    {following?.count }
  </div>
  <div className="text-gray-600 cursor-pointer "  onClick={() => handleOpenModal('following', following)}>Following</div>

  <div className="space w-[20px]"></div>

  <div
    onClick={() => handleOpenModal('followers', followers)}
    className="followernumber text-white font-bold mx-1 cursor-pointer hover:underline"
  >
    {followers?.count}
  </div>
  <div className="text-gray-600 ml-1 cursor-pointer " onClick={() => handleOpenModal('followers', followers)}>Followers</div>
</div>

             


              <div className="flex flex-col gap-2 mt-6 w-full relative">
  {/* Tab Buttons */}
  <div className="flex gap-4 relative">
    <button
      onClick={() => setActiveTab('posts')}
      className={`font-bold px-4 py-2 transition-colors duration-300 ${
        activeTab === 'posts' ? 'text-white' : 'text-gray-400'
      }`}
    >
      Posts
    </button>
    <button
      onClick={() => setActiveTab('reposts')}
      className={`font-bold px-4 py-2 transition-colors duration-300 ${
        activeTab === 'reposts' ? 'text-white' : 'text-gray-400'
      }`}
    >
      Reposts
    </button>
    <button
      onClick={() => setActiveTab('scheduleposts')}
      className={`font-bold px-4 py-2 transition-colors duration-300 ${
        activeTab === 'scheduleposts' ? 'text-white' : 'text-gray-400'
      }`}
    >
      Scheduled Posts
    </button>
  </div>

  {/* Animated underline */}
  <div className="relative h-[2px] bg-transparent w-full mt-1">
    <div
      className="absolute bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ease-in-out"
      style={{
        width: '50px',
        left: activeTab === 'posts' ? '0px' : activeTab === 'reposts'? '60px' : '150px'
        // adjust '80px' as per button width + gap
      }}
    />
  </div>

  {/* Divider below the tab */}
  <div className="border-b border-gray-500 w-[43vw] my-3" />
</div>




<div className="postsdonebyou border h-auto border-t-2  w-[43vw]">
  {error && <div className="text-red-500">{error}</div>}

  {/* {activeTab === 'posts' && posts.length > 0 && (
    posts.slice().reverse().map((post, idx) => {
      if (post.userEmail !== email) return null; // Only original posts
      return (
        <PostCard
          key={post.postId || idx}
          userEmail={email}
          postId={post.postId}
          text={post.content.text}
          media={post.content.media}
          poll={post.content.poll}
          likedByCurrentUser={post.likedByCurrentUser}
          likedbyUsers={post.likedUsernames}
          likesCount={post.likes?.count}
          comments={post.comments}
          retweetByCurrentUser={post.retweetByCurrentUser}
          retweetByUsers={post.retweet?.users}
          retweetCount={post.retweet?.count}
          username={post.userInfo?.username}
          userrealname={post.userInfo?.userrealname}
          avatar={post.userInfo?.avatar}
          createdAt={post.createdAt}
          onLike={handleLike}
          onretweet={handleRetweet}
          onVote={handleVote}
          onDelete={handleDeletePost}
          userSelectedOption={userSelectedOption}
        />
      );
    })
  )} */}

   {loading ? (
    <div className="flex justify-center items-center h-20">
      <Loader2 className="animate-spin w-6 h-6 text-blue-400" />
    </div>
  ) : (
    <>
      {activeTab === 'posts' && posts.filter(p => p.userEmail === email).length > 0 && (
        posts
          .slice()
          .reverse()
          .map((post, idx) => {
            if (post.userEmail !== email) return null;
            return (
              <PostCard
                key={post.postId || idx}
                userEmail={email}
                postId={post.postId}
                text={post.content.text}
                media={post.content.media}
                poll={post.content.poll}
                likedByCurrentUser={post.likedByCurrentUser}
                likedbyUsers={post.likedUsernames}
                likesCount={post.likes?.count}
                comments={post.comments}
                retweetByCurrentUser={post.retweetByCurrentUser}
                retweetByUsers={post.retweet?.users}
                retweetCount={post.retweet?.count}
                username={post.userInfo?.username}
                userrealname={post.userInfo?.userrealname}
                avatar={post.userInfo?.avatar}
                createdAt={post.createdAt}
                onLike={handleLike}
                onretweet={handleRetweet}
                onVote={handleVote}
                onDelete={handleDeletePost}
                userSelectedOption={userSelectedOption}
              />
            );
          })
      )}

      {activeTab === 'posts' && !loading && posts.filter(p => p.userEmail === email).length === 0 && (
        <center style={{ paddingTop: '26px' }}>
          <h2>Create your first post now</h2>
          <script src="https://cdn.lordicon.com/lordicon.js" async />
          <lord-icon
            src="https://cdn.lordicon.com/mfdeeuho.json"
            trigger="hover"
            stroke="light"
            state="hover-swirl"
            colors="primary:#3080e8,secondary:#b4b4b4"
            style={{ width: '60px', height: '80px' }}
          ></lord-icon>
        </center>
      )}
    </>
  )}

 {activeTab === 'reposts' && reposts.length > 0 && (
  reposts.map((post, idx) => (

        <PostCard
          key={post.postId || idx}
          userEmail={post.userEmail}
          postId={post.postId}
          text={post.content.text}
          media={post.content.media}
          poll={post.content.poll}
          likedByCurrentUser={post.likedByCurrentUser}
          likedbyUsers={post.likedUsernames}
          likesCount={post.likes?.count}
          comments={post.comments}
          retweetByCurrentUser={post.retweetByCurrentUser}
          retweetByUsers={post.retweet?.users}
          retweetCount={post.retweet?.count}
          username={post?.userInfo?.username}
          userrealname={post?.userInfo?.userrealname}
          avatar={post?.userInfo?.avatar}
          createdAt={post.createdAt}
          onLike={handleLike}
          onretweet={handleRetweet}
          onVote={handleVote}
          userSelectedOption={userSelectedOption}
        />
      ))
  )}

  {/* {activeTab === 'posts' && posts.filter(p => p.userEmail === email).length === 0 && (
    <center style={{ paddingTop: '26px' }}>
                <h2>Create your first post now </h2>
                <script src="https://cdn.lordicon.com/lordicon.js"></script>

                <lord-icon
          src="https://cdn.lordicon.com/mfdeeuho.json"
          trigger="hover"
          stroke="light"
          state="hover-swirl"
          colors="primary:#3080e8,secondary:#b4b4b4"
          style={{ width: '60px', height: '80px' }}
        ></lord-icon>
                </center>
  )} */}

  {activeTab === 'reposts' && reposts.length === 0 && (
  <p className="text-gray-500 p-4">No reposts yet.</p>
)}
{/* {  scheduledPosts.length > 0 && (
  <>

    {activeTab === 'scheduleposts' && scheduledPosts.length > 0 && 
    (scheduledPosts.map((post, idx) => (
      <div key={idx} className="p-4 my-4 border border-gray-700 rounded-lg bg-zinc-800 text-white">
        <p><strong>Scheduled Time:</strong> {new Date(post.scheduledFor).toLocaleString()}</p>
              <PostCard
          key={post.postId || idx}
          userEmail={email}
          postId={post.postId}
          text={post.content.text}
          media={post.content.media}
          poll={post.content.poll}
          likedByCurrentUser={post.likedByCurrentUser}
          likedbyUsers={post.likedUsernames}
          likesCount={post.likes?.count}
          comments={post.comments}
          retweetByCurrentUser={post.retweetByCurrentUser}
          retweetByUsers={post.retweet?.users}
          retweetCount={post.retweet?.count}
          username={post.userInfo?.username}
          userrealname={post.userInfo?.userrealname}
          avatar={post.userInfo?.avatar}
          createdAt={post.createdAt}
          onLike={handleLike}
          onretweet={handleRetweet}
          onVote={handleVote}
          onDelete={handleDeletePost}
          userSelectedOption={userSelectedOption}
          />

       
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => handleScheduledDelete(post._id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
            Delete
          </button>

         
        </div>
      </div>
    )))}
  </>
)} */}


{activeTab === 'scheduleposts' && (
  <>
    {scheduledPosts.length > 0 ? (
      scheduledPosts.map((post, idx) => (
        <div key={idx} className="p-4 my-4 border border-gray-700 rounded-lg bg-zinc-800 text-white">
          <p><strong>Scheduled Time:</strong> {new Date(post.scheduledFor).toLocaleString()}</p>
          <PostCard
            key={post.postId || idx}
            userEmail={email}
            postId={post.postId}
            text={post.content?.text}
            media={post.content?.media}
            poll={post.content?.poll}
            likedByCurrentUser={post.likedByCurrentUser}
            likedbyUsers={post.likedUsernames}
            likesCount={post.likes?.count}
            comments={post.comments}
            retweetByCurrentUser={post.retweetByCurrentUser}
            retweetByUsers={post.retweet?.users}
            retweetCount={post.retweet?.count}
            username={post.userInfo?.username}
            userrealname={post.userInfo?.userrealname}
            avatar={post.userInfo?.avatar}
            createdAt={post.createdAt}
            onLike={handleLike}
            onretweet={handleRetweet}
            onVote={handleVote}
            onDelete={() => handleScheduledDelete(post._id)}
            userSelectedOption={userSelectedOption}
          />
        </div>
      ))
    ) : (
      <p className="text-gray-500 p-4">No scheduled posts yet.</p>
    )}
  </>
)}


{/* {activeTab === 'scheduleposts' && scheduledPosts.length === 0 && (
<p className="text-gray-500 p-4">No scheduled posts yet.</p>
)} */}

</div>




        
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  }
  body{
    overflow:hidden;}
    
    .two{
      /* For Webkit browsers (Chrome, Safari, Edge, etc.) */
      ::-webkit-scrollbar {
        width: 8px;  /* Adjust the width of the scrollbar */
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;  /* Makes the track transparent */
          }
          
          ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.3);  /* Thumb with opacity for transparency */
            border-radius: 10px;  /* Rounded thumb */
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background-color: rgba(0, 0, 0, 0.6);  /* Darker thumb on hover */
              }
              
              /* For Firefox */
              scrollbar-width: thin;
              scrollbar-color: rgba(0, 0, 0, 0.3) transparent; /* Thumb and track color */
              
              }
              
              
              
              
              
              .profile_edit{
                position:relative;
                top: 10%;
                left: 10%;
                }
                .profile_edit button{
                  padding: 2.8px;
                  }
                  .profile_edit button:hover{
                    background-color:hsl(267, 6%, 28%);
                    }
                    .postsdonebyou {
                      border-bottom-right-radius: 10px;
                      border-bottom-left-radius: 10px;
                      }
                      
                      html,
                      body {
                        height: 100%;
                        width: 100%;
                        background-color: black;
                        color: white;
                        }
                        .containere {
                          display: flex;
                          flex-direction: row;
                          height: 100vh;
                          }
                          .section {
                            border: 1px solid;
                            padding: 20px;
                            flex: 1;
                            min-width: 0;
                            }
                            .section1 {
                              flex: 0 0 25%;
                              }
                              .section2 {
                                border-right-color: white;
                                border-left-color: white;
                                flex: 0 0 50%;
                                }
                                .section3 {
                                  flex: 0 0 25%;
                                  }
                                  .group {
                                    display: contents;
                                    }
                                    .textu {
                                      color: white;
                                      font-size: large;
    font-family: sans-serif;
    font-weight: 500;
  }
  .button {
    color:black;
    width:120px;
    height:35px;
    margin: 10px 0 0 0 ;
  }
  .icon svg{
    width: 24px;
    height: 24px;
    }
    .icon{
      justify-content:space-between; 
      align-items: center;
      gap: 6;
      padding: 4px 3px 4px 3px;
      }
      .icon-container {
        position: relative;
        display: inline-block;
        }
        .icon-container svg {
          cursor: pointer;
          }
          .icon-container:hover .tooltip,
          .post:hover .tooltip,
          .polloptions:hover .tooltip {
            display: block;
            }
            .scaled {
              transform: scale(1.1);
              transition: transform 0.3s ease;
              font-style: oblique;
              }
              .scaled .textu {
                font-weight: 900;
                font-size: larger;
                }
                @media (max-width: 1000px) {
                  .containere {
                    flex-direction: column;
                    height: 100vh;
                    overflow: hidden;
                    }
                    .group {
                      display: flex;
                      flex-direction: row;
                      flex: 1;
                      min-height: 0;
                      }
                      .section {
                        padding: 10px;
                        overflow-y: auto;
                        }
                        .section1 {
                          order: 2;
                          height: 60px;
                          padding: 0;
                          border-right: none;
                          border-top: 1px solid white;
                          display: flex;
                          align-items: center;
                          }
                          .icons {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-around;
                            width: 100%;
                            height: 100%;
                            position: static;
                            }
                            .icon {
                              flex: 0 0 auto;
                              padding: 8px;
                              }
                              .icon svg {
                                width: 24px;
                                height: 24px;
                                }
                                }
                                @media (max-width: 1000px) {
                                  .containere {
                                    flex-direction: column;
                                    }
                                    .group {
                                      display: flex;
                                      flex-direction: row;
                                      width: 100%;
                                      order: 1;
                                      flex: 1;
                                      }
                                      .group .section {
                                        flex: 1;
                                        }
                                        .section1 {
                                          order: 2;
                                          width: 100%;
                                          height: 50px;
                                          flex: 0 0 auto;
                                          padding: 10px;
                                          border-top-color: #ccc;
                                          }
                                          .section2 {
                                            border-right-color: black;
                                            border-left-color: white;
                                            }
                                            .icons {
                                              display: flex;
                                              flex-direction: row;
                                              align-items: stretch;
                                              left: 20%;
                                              }
                                              .textu,
                                              .logo,
                                              .button,
                                              .gmail {
      display: none;
      }
      }
      
      .icon-container {
        position: relative;
        display: inline-block;
        }
        
        .icon-container svg {
          cursor: pointer;
          }
          
          .tooltip {
            display: none;  /* Hide the tooltip by default */
            position: absolute;
            bottom: 125%;  /* Adjust to control the position */
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px;
            border-radius: 5px;
            text-align: center;
            font-size: 12px;
            width: 120px;
            }
            
            .icon-container:hover .tooltip , .post:hover .tooltip , .polloptions:hover .tooltip{
              display: block;  /* Show the tooltip when the icon is hovered */
              }
              
              .scaled {
                transform: scale(1.1);
                transition: transform 0.3s ease;
                font-style: oblique;
                
                }
                .scaled .textu{
                  font-weight: 900;
                  font-size: larger;
                  }
                  
                  
                  .pollbox ,.timeinterval{
                    position: relative;
                    display: flex;
                    justify-content: center;
                    z-index: 30;
                    background-color: #0000006e;
                    bottom: 100vh;
                    height: 100vh;
                    color: white;
                    }
                    .userdetails{
                      position: relative;
                      display: flex;
                      justify-content: center;
                      z-index: 30;
                      background-color: #9c8b8b;
                      background-image: url('https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?cs=srgb&dl=pexels-pixabay-235985.jpg&fm=jpg');
                      /* background-repeat: no-repeat; */
                      /* background-size: cover; */
                      bottom: 100vh;
                      height: 100vh;
                      color: white;
                      }
                      .submituser{
                        padding: 10px;
                        padding-right: 80px;
                        cursor: pointer;
                        }
                        
                        
                        .poll-container {
                          width: 90%;
                          max-width: 400px;
                          background: rgba(60, 104, 236, 0.434);
                          color: rgb(0, 0, 0);
                          font-weight: 400;
padding: 20px;
border-radius: 10px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.poll-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  }
  
  .poll-option {
    margin-bottom: 15px;
    }
    
    .poll-option label {
      font-size: 16px;
      margin-bottom: 5px;
      display: block;
      cursor: pointer;
      }
      
      .poll-option input[type="radio"] {
        display: none;
        }
        
        .poll-option input[type="radio"] + label {
          position: relative;
          padding-left: 30px;
          cursor: pointer;
          color: #fefcfc;
          }
          
          .poll-option input[type="radio"] + label::before {
            content: '';
            position: absolute;
            left: 0;
            top: 3px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid #ccc;
            background-color: #fff;
            }
            
            .poll-option input[type="radio"]:checked + label::before {
              border-color: #2fc6ce;
              background-color: #2fc6ce;
              }
              
              .progress-bar {
                position: relative;
                height: 25px;
                border-radius: 15px;
                background-color: #e0e0e0;
                margin-top: 5px;
                overflow: hidden;
                }
                
                .progress {
                  height: 100%;
                  background-color: #2fc6ce; 
                  width: 0%;
                  transition: width 0.3s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #fff;
                  font-size: 14px;
                  }
                  
                  
                  
                  .hidden {
                    display: none;
                    }
                    
                    #emoji-picker-container {
                      position: absolute;
                      top: 50px;
                      left: 20px;
                      z-index: 100;
                      background: white;
                      border: 1px solid #ccc;
                      border-radius: 10px;
                      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                      }
                      
                      
                      
                      .searchbox {
                        display: none;
                        margin-left: 4%;
                        width: 56%;
                        position: relative;
                        z-index: 10;
                        height: 400px;
                        border: 1px solid rgb(255, 255, 255);
                        border-top-color: transparent;
                        background-color: black;
                        border-radius: 10px;
                        
                        }
                        .profilepic{
                          object-fit: contain;}
                          .circle{
                            
                          background-color: rgb(0, 0, 0);
                          width: 25%;
                          height: 70%;
                          border: 5px solid black;
                          position:relative;
                          left:5%;
                          top:65%;
                          border-radius: 80%;
                          
                          }
                          .flex{
                            display: flex;
                            }
                            .boxxxxx{
                              width: 40px;
                              height: 60px;
                              border-radius: 100%;
                              
                              }
                              .hiddene{display: none;}
                              .contain{
                                object-fit:contain;
                                }
                                .puttr{
                                  background-color: black;
                                  
                                  }
                                  .searchitem:hover{
                                    background-color: rgba(93, 255, 252, 0.167);
                                    
                                    }
                                    .back-arrow:hover{
                                      background-color: rgba(255, 255, 255, 0.526);
                                      border-radius: 100%;
                                      }
                                      .highlighte:hover{
                                        color: #ccc;
                                        text-decoration: underline;
                                        }
                                        .text-blue-500 {
                                          color: rgb(76, 180, 255);
                                          }
                                          /*.relevant,.happening{bottom: 60vh;} */
                                          
                                          .container {
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            height: 100vh;
                                            height: 100dvh;
                                            }
                                            
                                            .content-grid {
                                              display: grid;
                                              gap: 32px;
                                              grid-template: repeat(2, 1fr) / repeat(4, 1fr);
                                              }
                                              
                                              
                                              
                                              `}
      </style>

    </>
  );
}
