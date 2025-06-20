import React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react';
import MediaUpload from './mediaupload';
import dynamic from "next/dynamic";
import GiphySearch from './gifupload';
import Poll from './poll';
const EmojiPicker = dynamic(() => import("./emojiupload"), { ssr: false });
import StaticPollPreview from './StaticPoll';

export default function  Postbutton({ userrealname, username, avatar, email ,showpostbutton ,setshowpostbutton }) {

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

  const [pollData, setPollData] = useState(null);
  const [showStaticPoll, setShowStaticPoll] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [showCollectionPopup, setShowCollectionPopup] = useState(false);
const [newCollectionName, setNewCollectionName] = useState('');
const [collections, setCollections] = useState([]);


  const handlePollSubmit = (data) => {
    setPollData(data);
    setShowStaticPoll(true);
  };

  const handlePostSubmit = () => {
    setSubmitted(true);
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

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
  };


  const handlePostClick = async () => {
    if (inputText.length < 5) return;

    const mediaUrls = selectedMedia ? [selectedMedia.url] : [];

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

      // 🔄 Only after post is saved and returned
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

      // Clear input and show post
      setInputText('');
      setFiles([]);
      setSelectedMedia(null);
      setPollPreview(null);
      // setshowlivevote(!!data.post.content?.poll);

      setPosts(prev => [newPost, ...prev]);

    } catch (error) {
      console.error("Error while posting:", error);
    }
  };


  const handleEmojiSelect = (emojiObj) => {
    setInputText((prev) => prev + (emojiObj.native || emojiObj.emoji));
  };
 return (
    <>
    {(showpostbutton) && 

    //  <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center rounded-md  z-50">
    //       <div className="bg-zinc-700 text-white w-3xl  sm:w-[50%] md:w-[45%] p-16 rounded-md shadow-lg relative animate-fadeIn">
     <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
  <div className="bg-zinc-900 text-white w-[90%] sm:w-[50%] md:w-[35%] p-6 rounded-3xl shadow-lg relative animate-fadeIn">

     
     <div className= "postbox flex w-full rounded-md ">
        
        <div className="two snap-y overflow-y-scroll w-full sticky top-0 bg-zinc-800 z-10 h-full">
        <div className="flex  justify-between items-center text-2xl font-extrabold px-4 py-2 space-x-4">
  <h1 className="text-white">POST</h1>
  <button
    className="text-white text-2xl font-bold hover:text-red-400"
    onClick={() => setshowpostbutton(false)}
    aria-label="Close Post Modal"
  >
    ×
  </button>
</div>

          <div className="gmail flex left-[15%] items-center space-x-1.5 rounded-3xl px-3 max-h-full">
            <div className="inputbox w-full ">
              <div className="grampa flex items-center space-x-1.5">
                <div className="image w-10 h-10 rounded-full bg-pink-500 text-green-300 relative overflow-hidden bottom-[30%]">
                  <img
                    src={avatar}
                    className="absolute w-full h-full object-cover"
                    alt="Profile"
                  />
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-[90%] left-[5px] h-[80px] inputboxx bg-transparent break-words relative top-[15px] overflow-hidden textu hover:cursor-pointer resize-none"
                  placeholder="What's Happening ?"
                  aria-label="Compose post"
                />

              </div>
              <center
                className={`videobox items-center flex justify-center border rounded-md relative top-6 left-1/7 max-w-2/3 h-2/3 ${selectedMedia?.url ? 'border-white' : 'border-zinc-800'
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
                    <div className=" fixed inset-0 h-1/3  bg-black/10 flex items-center justify-center z-50 left-1/2 top-2/3 riboou">
                      <EmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                      />
                    </div>
                  )}

                  {showGifUpload && (
                    <div className=" gifdo fixed bottom-1/3 inset-0 flex items-center justify-center z-40 w-full">
                      <div ref={popupRef} className="w-[500px] h-1/4 rounded-3xl p-5 relative">
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
                  <div className="icon-container Schedule">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-7 mb-3 mt-1" style={{ color: "rgb(29, 155, 240)" }} fill='red'>
                      <g>
                        <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z" />
                      </g>
                    </svg>
                    <span className="tooltip">Schedule</span>
                  </div>
                </div>
                <div
                  className={`button post bg-blue-400 flex justify-center relative top-5 w-10 px-10 py-2 font-extrabold font-sans rounded-3xl h-11 cursor-pointer ${inputText.length < 5 ? 'opacity-50' : ''
                    }`}
                  onClick={() => {
                    if (inputText.length >= 5) {
                      handlePostClick();
                      handlePollSubmit();
                    }
                  }}

                >
                  <button onClick={()=>{
                    setshowpostbutton(false)
                  }}>Post</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      }
    </>
 )


};



