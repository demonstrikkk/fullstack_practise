



import React, { useEffect ,useState} from "react";
import { motion } from "framer-motion";
import EmojiPicker from "./emojiupload";
import { HandPlatter } from "lucide-react";

export default function CommentSection({
    postId,
  comments,
  setComments,
  inputText,
  setInputText,
  showGifUpload,
  setShowGifUpload,
//   showEmojiPicker,
//   setShowEmojiPicker,
  handleEmojiSelect,
  emojiPickerRef,
  avatar,
  iscross
}) {
  const commentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


    useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`/api/posts/comments?postId=${postId}`);
      const data = await res.json();
      setComments(data.comments || []);
    };
    fetchComments();
  }, [postId]);
const [showEmojiPickerComment, setShowEmojiPickerComment] = useState(false);
//   const handleCloseEmoji = () => setShowEmojiPicker(false);
  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setComments([
        "Nice!",
        "Amazing work 🔥",
        "Very well explained!",
        "Cool post!",
        "Thank you 🙌",
      ]);
    }, 200);
  }, []);

  
  const handleSend = async () => {
    if (!inputText.trim()) return;
    const res = await fetch("/api/posts/comments", {
      method: "POST",
      body: JSON.stringify({
        postId,
        comment: {
          user: "test@example.com", // replace with session user
          text: inputText,
          media: "", // add gif logic here if needed
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      setComments(data.comments); // updated list
      setInputText("");
    }
  };

  return (
    <div className="my-6 bg-black w-full rounded-sm text-white h-[110vh]">
      {/* Header */}
      <div className="CommentsHeader text-xl font-bold flex justify-center border-b border-white py-2">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Comments
        </motion.h1>
                    <div className=" rounded-lg w-full max-w-xl relative bottom-2">

        <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => iscross(false)}
              >
                ✕
              </button>
              </div>
      </div>

      {/* Scrollable Comment Body */}
      <div className="commentbody flex flex-col divide-y divide-white w-full max-h-[60vh] overflow-y-scroll px-4">
        {comments.map((text, index) => (
          <motion.div
            key={index}
            variants={commentVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`p-3 ${index === comments.length - 1 ? "border-b border-white" : ""}`}
          >
            {text}
          </motion.div>
        ))}
      </div>

      {/* Input Box */}
      <div className="input title mt-4 px-4 sticky top-[43%] w-full z-10 bg-black py-2">
        <div className="flex items-center space-x-2">
          <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />

          <input
            type="text"
            placeholder="Add a comment..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Emoji button */}
          <div className="relative "
           ref={emojiPickerRef}
            onClick={() => setShowEmojiPickerComment(!showEmojiPickerComment)}>
            <button>
              <svg viewBox="0 0 24 24" className="invert w-7 hover:fill-blue-800" fill="red">
                <g>
                  <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322z" />
                </g>
              </svg>
            </button>
            <span className="tooltip">Emoji</span>
          </div>

          {/* GIF toggle */}
          <div className="icon-container gif" onClick={() => setShowGifUpload(!showGifUpload)}>
            <svg viewBox="0 0 24 24" className="invert w-7" fill="brown">
              <g>
                <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z" />
              </g>
            </svg>
            <span className="tooltip">GIF</span>
          </div>
          <button onClick={handleSend} className="bg-blue-600 px-4 py-2 rounded-md text-sm">
            Send
          </button>
        </div>

        {/* Emoji Picker */}
        
    {    showEmojiPickerComment &&   
           
            <>
        <div className="fixed inset-0 h-1/3 bg-black/10 flex items-center justify-center top-2/3  left-1/2 ">
             <button
        className="relative right-[51%] bottom-[160%] bg-black/50 text-white rounded-full p-1 cursor-pointer "
        onClick={
        () => {
            setShowEmojiPickerComment(!showEmojiPickerComment);;
        }}
        >
        ×
        </button>
            <EmojiPicker 
            onEmojiClick={handleEmojiSelect} 
            // onClose={() => setShowEmojiPicker(!showEmojiPicker)}
            
            />
            </div>
        </>
        }





        
      </div>
    </div>
  );
}



// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import EmojiPicker from "./emojiupload";

// export default function CommentSection({
//   postId,
//   avatar,
//   iscross,
// }) {
//   const [comments, setComments] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [showGifUpload, setShowGifUpload] = useState(false);
//   const [showEmojiPickerComment, setShowEmojiPickerComment] = useState(false);

//   // Fetch comments for a post
//   useEffect(() => {
//     const fetchComments = async () => {
//       const res = await fetch(`/api/posts/comments?postId=${postId}`);
//       const data = await res.json();
//       setComments(data.comments || []);
//     };
//     fetchComments();
//   }, [postId]);

//   const handleEmojiSelect = (emojiObject) => {
//     setInputText((prev) => prev + emojiObject.emoji);
//   };

//   const handleSend = async () => {
//     if (!inputText.trim()) return;
//     const res = await fetch("/api/posts/comments", {
//       method: "POST",
//       body: JSON.stringify({
//         postId,
//         comment: {
//           user: "test@example.com", // replace with session user
//           text: inputText,
//           media: "", // add gif logic here if needed
//         },
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (res.ok) {
//       const data = await res.json();
//       setComments(data.comments); // updated list
//       setInputText("");
//     }
//   };

//   return (
//     <div className="my-6 bg-black w-full rounded-sm text-white h-[110vh]">
//       <div className="CommentsHeader text-xl font-bold flex justify-center border-b border-white py-2 relative">
//         <motion.h1
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           Comments
//         </motion.h1>
//         <button
//           className="absolute top-2 right-4 text-gray-400 hover:text-white"
//           onClick={() => iscross(false)}
//         >
//           ✕
//         </button>
//       </div>

//       <div className="commentbody flex flex-col divide-y divide-white w-full max-h-[60vh] overflow-y-scroll px-4">
//         {comments.map((comment, index) => (
//           <motion.div
//             key={index}
//             initial="hidden"
//             animate="visible"
//             transition={{ duration: 0.3, delay: index * 0.05 }}
//             className="p-3"
//           >
//             <p className="text-sm text-gray-300">{comment.user}</p>
//             <p className="text-lg">{comment.text}</p>
//             {comment.media && (
//               <img
//                 src={comment.media}
//                 alt="comment-gif"
//                 className="mt-2 w-32 h-auto rounded"
//               />
//             )}
//           </motion.div>
//         ))}
//       </div>

//       <div className="mt-4 px-4 sticky top-[43%] w-full z-10 bg-black py-2">
//         <div className="flex items-center space-x-2">
//           <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />

//           <input
//             type="text"
//             placeholder="Add a comment..."
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <button onClick={() => setShowEmojiPickerComment((prev) => !prev)}>
//             😊
//           </button>


//         </div>

//         {showEmojiPickerComment && (
//           <div className="relative z-50 mt-2">
//             <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPickerComment(false)} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
