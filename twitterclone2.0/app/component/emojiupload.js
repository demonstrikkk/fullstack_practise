"use client";
import React, {  useRef } from 'react';
import dynamic from 'next/dynamic';

const Picker = dynamic(
  () => import('emoji-picker-react'),
  { ssr: false }
);

const EmojiPicker = ({ onEmojiSelect }) => {
  const pickerRef = useRef(null);

  return (
    <div 
    ref={pickerRef} 
    className="absolute bottom-10 left-0 z-50">

{/* <button
        className="relative  bg-black/50 text-white rounded-full p-1 cursor-pointer"
        onClick={
      () => {
          document.querySelector('.riboou').style.display = 'none';
              
              }}
     >
        ×
      </button> */}
      <Picker
        onEmojiClick={(emojiObject) => {
          onEmojiSelect(emojiObject);
          // Removed the close on emoji select
        }}
        theme="dark"
        native
      />
    </div>
  );
};

export default EmojiPicker;

// "use client";
// import React from 'react';
// import dynamic from 'next/dynamic';

// const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

// const EmojiPicker = ({ onEmojiSelect, onClose }) => {
//   return (
//     <div className="fixed inset-0 h-1/3 bg-black/10 flex items-center justify-center z-50">
//       <div className="relative">
//         <button
//           className="absolute -top-3 -right-3 bg-black/50 text-white rounded-full p-1"
//           onClick={onClose}
//         >
//           ×
//         </button>
//         <Picker
//           onEmojiClick={onEmojiSelect}
//           theme="dark"
//           native
//         />
//       </div>
//     </div>
//   );
// };

// export default EmojiPicker;


