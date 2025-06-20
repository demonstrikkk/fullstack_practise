'use client';
import React from 'react';
import { useState , useEffect } from 'react';
export default function PostCard({ userEmail,onVote,onDelete, onLike,onBookmark,bookmarkedByCurrentUser, postId, text, media, poll = { question: '', options: [], votedUsers: [] }, likedByCurrentUser, likesCount, username, userrealname, avatar ,userSelectedOption  , likedbyUsers, createdAt}) {
  const mediaUrl = media[0];
  const isVideo = mediaUrl?.endsWith('.mp4');
  const fillColor = likedByCurrentUser ? 'red' : 'none';
  const hasPoll = Boolean(poll.question && poll.options.length);
  const userVoted = poll.votedUsers.includes(userEmail);

const [showDropdown, setShowDropdown] = useState(false);

// Optional: close dropdown when clicked outside
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(`#dropdown-${postId}`)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [postId]);

  return (
    <div className="post-card p-4 my-6 rounded-xl border border-gray-300 shadow-sm">
      {/* — User Info — */}
      <div className="flex items-center space-x-3 mb-3">
        {onDelete && (
  <div className="relative left-[97%]" id={`dropdown-${postId}`}>
    <button
      onClick={() => setShowDropdown(!showDropdown)}
      className="text-gray-400 hover:text-white text-xl"
    >
      ⋮
    </button>

    {showDropdown && (
      <div className="absolute right-0 mt-1 bg-zinc-800 border border-gray-700 rounded shadow-md z-10  ">
        <button
          onClick={() => {
            setShowDropdown(false);
            onDelete && onDelete(postId);
          }}
          className="block w-full text-left px-4 py-2 deletebuttono text-sm text-red-500 hover:bg-red-600 hover:text-white"
        >
          Delete
        </button>
        <button
          onClick={() => setShowDropdown(false)}
          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    )}
  </div>
)}
        <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-white font-semibold">{username}</p>
          <p className="text-gray-500 text-sm">{userrealname}</p>
        </div>
        <div className ='relative left-1/2 text-gray-300 text-sm '><p> Posted On :{(createdAt).slice(0,10)}</p></div>


      </div>

      {/* — Text — */}
      <p className="text-white text-center">{text}</p>

      {/* — Media — */}
      {mediaUrl && (
        <div className="flex justify-center mt-6">
          {isVideo ? (
          <div className="videobox border rounded-md max-w-2/3 w-full">
            <video controls className="object-cover w-full h-full">
              <source src={mediaUrl} type="video/mp4"  />
            </video>
            </div>
          ) : (
            <div className="videobox border rounded-md max-w-2/3 w-full">
            <img src={mediaUrl} alt="" className="object-cover w-full h-full" loading='lazy'/>
            </div>
          )}
        </div>
      )}

{hasPoll && poll && (
  <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md mt-6  poll-container relative left-1/7 flex flex-col justify-center ">
    <h4 className="text-xl font-bold mb-4 poll-title">{poll.question}</h4>
    {poll.options.map((opt, idx) => {
      const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0) || 1;
      const percent = Math.round((opt.votes / totalVotes) * 100);
      return (
        <div key={idx} className="mb-4 text-white p-4  relative poll-options space-y-4">
          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name={`poll-${postId}`}
              checked={userSelectedOption[postId] === opt.text}
              onChange={() => onVote(postId, opt.text)}
              className='mr-2'
            />
            <span>{opt.text}</span>
          </label>
          <div className="w-full bg-gray-600 h-2 rounded mb-1 progress-bar">
            <div
              className={`h-2 rounded progress   transition-all duration-500 ${
                userSelectedOption[postId] ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            {percent}% ({opt.votes} votes)
          </p>
        </div>
      );
    })}
  </div>
)}


  
      {/* — Actions: Like, Share, Comment — */}
      <div className='flex justify-between relative right-2 post-card'>

      <div className="flex justify-between items-center gap-4 space-x-5 my-5  relative left-5 py-10">
        <div>
          <div className="flex">

        <button onClick={() => onLike(postId)} className="flex items-center like">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            fill={fillColor}
            stroke={likedByCurrentUser ? 'red' : 'white'}
            >
            <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" />
          </svg>
          <span className="ml-2 text-gray-300">{likesCount}</span>
        </button>
            </div>
          </div>

          <div className='share'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}>
                        <path d="M20.3927 8.03168L18.6457 6.51461C17.3871 5.42153 16.8937 4.83352 16.2121 5.04139C15.3622 5.30059 15.642 6.93609 15.642 7.48824C14.3206 7.48824 12.9468 7.38661 11.6443 7.59836C7.34453 8.29742 6 11.3566 6 14.6525C7.21697 13.9065 8.43274 13.0746 9.8954 12.7289C11.7212 12.2973 13.7603 12.5032 15.642 12.5032C15.642 13.0554 15.3622 14.6909 16.2121 14.9501C16.9844 15.1856 17.3871 14.5699 18.6457 13.4769L20.3927 11.9598C21.4642 11.0293 22 10.564 22 9.99574C22 9.4275 21.4642 8.96223 20.3927 8.03168Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.5676 3C6.70735 3.00694 4.68594 3.10152 3.39411 4.39073C2 5.78202 2 8.02125 2 12.4997C2 16.9782 2 19.2174 3.3941 20.6087C4.78821 22 7.03198 22 11.5195 22C16.0071 22 18.2509 22 19.645 20.6087C20.6156 19.64 20.9104 18.2603 21 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg></div>
                      <div className='comment'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}>
                        <path d="M22 11.5667C22 16.8499 17.5222 21.1334 12 21.1334C11.3507 21.1343 10.7032 21.0742 10.0654 20.9545C9.60633 20.8682 9.37678 20.8251 9.21653 20.8496C9.05627 20.8741 8.82918 20.9948 8.37499 21.2364C7.09014 21.9197 5.59195 22.161 4.15111 21.893C4.69874 21.2194 5.07275 20.4112 5.23778 19.5448C5.33778 19.0148 5.09 18.5 4.71889 18.1231C3.03333 16.4115 2 14.1051 2 11.5667C2 6.28357 6.47778 2 12 2C17.5222 2 22 6.28357 22 11.5667Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M11.9955 12H12.0045M15.991 12H16M8 12H8.00897" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg></div>
      </div>
      <div className='bookmark' onClick={() => onBookmark(postId)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={bookmarkedByCurrentUser ? "white" : "none"}
            stroke={bookmarkedByCurrentUser ? "white" : "currentColor"}>
                      <path d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg></div>
    </div>
    {likedbyUsers?.length > 0 && (
                    <div className="text-xs text-gray-300 mt-1 relative left-8 bottom-4">
                      Liked by: {
                        likedbyUsers.slice(-3).join(', ')
                      }
                      {likedbyUsers.length > 3 && '...'}
                    </div>
                  )}

    </div>
  );
}














