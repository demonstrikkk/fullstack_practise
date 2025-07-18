// app/component/page.js
"use client";
import {React} from "react";

import { useSession } from 'next-auth/react';
import PostCard from "../component/post-card";



import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from "react";
export  function usePollVoting(userEmail, posts, setPosts) {
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


export default function OtherProfileComponent({ userrealname, username, avatar,followers,following,bio,location,createdAt,email,onClose }) {
  const { data: session, status } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const { handleVote, userSelectedOption } = usePollVoting(email, posts, setPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/postsofemail?email=${email}`);
        const data = await res.json();
        
        // Handle different response structures
        if (data.posts) {
          // If response has { posts: [...] }
          setPosts(data.posts);
        } else if (Array.isArray(data.users)) {
          // If response has { users: [...] }
          setPosts(data.users);
        } else if (Array.isArray(data)) {
          // If response is direct array
          setPosts(data);
        } else {
          setError('Invalid posts data format');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      }
    };
    
    fetchPosts();
  }, [email]);

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
    
   
const [followerCount, setFollowerCount] = useState(
  typeof followers === 'number' ? followers : followers?.count || 0
);
useEffect(() => {
  const count = typeof followers === 'number' ? followers : followers?.count || 0;
  setFollowerCount(count);
}, [followers]);

const [followingCount, setFollowingCount] = useState(
  typeof following === 'number' ? following : following?.count || 0
);
useEffect(() => {
  const count = typeof following === 'number' ? following : following?.count || 0;
  setFollowingCount(count);
}, [following]);

  
  useEffect(() => {
    if (!session?.user?.email || !email) return;
  
    const checkFollowing = async () => {
      const res = await fetch(`/api/user/${email}`);
      const data = await res.json();
      setIsFollowing(data.followers.users.includes(session.user.email));
    };
  
    checkFollowing();
  }, [email, session?.user?.email]);
  

  
 
    const [selectedUser, setSelectedUser] = useState(null);

    return (
    <>
    
      <div className="flex flex-col justify-center rounded bg-black">
         
      <div className="box0 sticky w-full h-[10vh] top-0 text-white bg-black flex flex-row opacity-90">
          <div className="mx-4" onClick={() => onClose()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none" className="back-arrow">
              <path d="M11 6H15.5C17.9853 6 20 8.01472 20 10.5C20 12.9853 17.9853 15 15.5 15H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6.99998 12C6.99998 12 4.00001 14.2095 4 15C3.99999 15.7906 7 18 7 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              
            </svg>
          </div>
          <div className="text-white relative top-[50%] left-[2%] font-bold">{userrealname} !</div>
        </div>
        <div className="overflow-y-scroll overflow-x-hidden two" style={{ scrollbarWidth: "none" }}>
          <div className="box1 w-full h-[30vh] bg-gray-600 text-white">
            <div className="circle overflow-hidden">
              {/* <img src= ${avatar} alt=" Avatar" className="profilepic"/> */}
              <img src={avatar} alt="Avatar" className="profilepic" />
            </div>
          </div>
          <div className="box2 w-full h-[60vh] bg-black text-white">
    
            {/* <div className="profile_edit "> */}
                <div className = "profile_editz">
              <button 
               onClick={async () => {
                const res = await fetch('/api/followup/follow', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    targetEmail: email,
                    viewerEmail: session?.user?.email
                  }),
                });
          
                const data = await res.json();

if (res.ok) {
  setIsFollowing(data.following);
  setFollowerCount(data.newFollowerCount);

} 
                
              }}
              className={`relative left-[70%] top-[50%] mt-4 py-2 px-3 rounded-3xl border text-white font-bold 
                ${isFollowing ? 'bg-gray-600' : 'bg-blue-400'}`}
            >
              {isFollowing ? 'Following' : 'Follow'}
              </button>
                {/* </div> */}
            </div>
            <div className="profileinfo flex flex-col relative top-[10%] left-[5%] w-[80%] h-[100vh] px-2">
              <div className="text-lg font-bold">{userrealname}</div>
              <div className="text-gray-600"><p>@{username}</p></div>
              <div className="text-white font-serif font-semibold text-lg my-3"><h6>{bio}</h6></div>
              <div className="my-3.5 text-gray-300 text-xs font-serif">
  Joined On : {new Date(createdAt).toLocaleDateString()}
</div>              <div className="flex">
                <div className="followingnumber text-white font-bold mx-1">{followingCount}</div>
                <div className="text-gray-600  ">Following</div>
                <div className="space w-[20px]"></div>
                <div className="followernumber text-white font-bold mx-1">{followerCount}</div>
                <div className="text-gray-600 ml-1">Followers</div>
              </div>
              <div className="mt-16 font-bold text-white">Posts</div>
              <div className="w-16 rounded h-1 relative bottom-[2px] bg-blue-400"></div>
              <div className="bordere border-b-2 border-gray-400 w-[43vw] my-5"></div>




              <div className="postsdonebyou border h-auto border-t-2 w-[43vw] ">

                   {error && <div className="text-red-500">{error}</div>}
                   
                   {posts.length > 0 ? (
                     posts.slice().reverse().map((post,idx) => (
                       <div key = {post.postId || idx}>
                       <PostCard
                         // key={post.postId || post._id || post.id}
                         
                         userEmail={email}
                         onLike={handleLike}
                         // onVote={handleVote}
                         onVote={handleVote}
                         userSelectedOption={userSelectedOption}
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
                     ))
                   ) : (
                     // <p className="text-gray-500">No posts to show</p>
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
                   )}
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
