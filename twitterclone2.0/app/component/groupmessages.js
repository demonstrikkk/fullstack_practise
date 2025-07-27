









"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Smile, Reply, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";



const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function GroupMessage({
  message,
  currentUserEmail,
  onReply,
  reactions = [],
  isLastMessage,
  bookmarkUnreadId,
  onDelete,
  senderProfile,
  onStatusTextUpdate,
  groupId,
  userProfilesnew = {}
  

}) {
  const [hover, setHover] = useState(false);
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [statusText, setStatusText] = useState("");
    const [userProfiles, setUserProfiles] = useState({});
  
  const ref = useRef();

  const isMe = message.sender_email === currentUserEmail;
useEffect(() => {
  const memberEmails = message.seen_by?.map((m) => m.user_email) || [];
  const uniqueEmails = [...new Set(memberEmails)];
  if (uniqueEmails.length === 0) return;

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/getUserProfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: uniqueEmails }),
      });

      const data = await res.json();

      // ✅ Normalize to { email: profileObject }
      const normalizedProfiles = Array.isArray(data)
        ? Object.fromEntries(data.map((user) => [user.email, user]))
        : {};

      setUserProfiles(normalizedProfiles);
    } catch (err) {
      console.error("Failed to fetch user profiles", err);
    }
  };

  fetchProfiles();
}, [message.seen_by]);

const getUserProfile = (email) => userProfilesnew[email] 


useEffect(() => {
  if (!isLastMessage) return;

  if (message.seen_by && message.seen_by.length > 0) {
    const seenNames = message.seen_by.map((user) => {
      const profile = getUserProfile(user.user_email);
      return profile?.profile?.displayName ;
    });

    setStatusText(`Seen by ${seenNames.join(", ")}`);
   if (typeof onStatusTextUpdate === "function") {
  onStatusTextUpdate(`Seen by ${seenNames.join(", ")}`, groupId); // ✅ pass both
      }
  } else {
    setStatusText(`Sent ${formatDistanceToNowStrict(new Date(message.inserted_at))} ago`);
    if (typeof onStatusTextUpdate === "function") {
      onStatusTextUpdate(`Sent ${formatDistanceToNowStrict(new Date(message.inserted_at))} ago`, groupId);
    }
  }
}, [message.seen_by, isLastMessage, message.inserted_at, userProfiles]);


  const toggleReaction = async (emoji) => {
    const alreadyReacted = reactions.some(
      (r) => r.user === currentUserEmail && r.emoji === emoji
    );
    const method = alreadyReacted ? "DELETE" : "POST";
    try {
      await fetch("/api/react-to-message-group", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message_id: message.id,
          emoji,
          user_email: currentUserEmail,
        }),
      });
    } catch (e) {
      console.error("Reaction error:", e);
    }
    setShowPicker(false);
    setShowQuickReactions(false);
  };

  const handleDelete = async () => {
    if (onDelete) await onDelete(message.id);
  };

  return (
    <div className="px-4 my-2" ref={ref}>
    


      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setShowPicker(false);
          setShowQuickReactions(false);
        }}
        className={`flex ${isMe ? "justify-end" : "justify-start move"} items-end`}
      >
         {!isMe && senderProfile?.profile?.avatar && (
    <img
      src={senderProfile?.profile?.avatar}
      alt="avatar"
      className="w-5 h-5 rounded-full object-cover border border-gray-500 relative bottom-[4vh] left-[-1vh] "
    />
  )}
        <div
          className={`relative max-w-[70%] px-4 py-2 rounded-2xl shadow break-words space20 size8 ${
            isMe
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-700 text-white rounded-bl-none"
          } ${message.is_deleted ? "italic text-gray-400" : ""}`}
        >
          {/* Sent/Seen status */}
          {isLastMessage && isMe && statusText && (
            <div className={`absolute -bottom-5 right-2 text-[11px] text-gray-300 italic  space25 inlineseen `}>
              {statusText}
               {/* {lastSeenStatusMap[groupId] || "Tap to open chat"} */}
            </div>
          )}
         
          {/* hover actions */}
          {hover && !message.is_deleted && (
            <div
              className={`absolute flex gap-2 ${
                isMe ? "-left-20" : "-right-20"
              } top-2`}
            >
              <button
                onClick={() => setShowQuickReactions((p) => !p)}
                className="hover:bg-gray-600 rounded-full p-1"
              >
                <Smile size={18} />
              </button>
              <button
                onClick={onReply}
                className="hover:bg-gray-600 rounded-full p-1"
              >
                <Reply size={18} />
              </button>
              {isMe && (
                <button
                  onClick={handleDelete}
                  className="hover:bg-gray-600 rounded-full p-1"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          )}

          {/* reply snippet */}
          {message.reply_snippet && (
            <div className="text-xs bg-black/30 p-1 rounded mb-1 border-l-2 border-blue-400">
              <strong>
                {message.sender_username ||
                  message.sender_email.split("@")[0]}
              </strong>
              :{" "}
              {message.reply_snippet
                .split(":")
                .slice(1)
                .join(":")
                .trim()}
            </div>
          )}

          {/* media messages */}
          {message.message_type === "image" && message.media_url && (
            <img
              src={message.media_url}
              alt="uploaded"
              className="rounded-lg max-w-xs max-h-64 object-cover"
            />
          )}
          {message.message_type === "gif" && message.media_url && (
            <img
              src={message.media_url}
              alt="gif"
              className="rounded-lg max-w-xs object-cover"
            />
          )}
          {message.message_type === "document" && message.media_url && (
            <a
              href={message.media_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-300 underline"
            >
              {message.message}
            </a>
          )}

          {/* text */}
          {message.message_type === "text" && (
            <div>{message.message}</div>
          )}

          {/* timestamp */}
          <div className="text-[10px] text-gray-300 text-right mt-1">
            {format(new Date(message.inserted_at), "hh:mm a")}
          </div>

          {/* quick reactions */}
          {showQuickReactions && !message.is_deleted && (
            <div className="absolute -bottom-8 left-4 bg-gray-800 px-2 py-1 rounded-full border border-gray-600 flex items-center gap-1 text-md shadow-md z-40">
              {["❤️", "😂", "😮", "😢", "👏"].map((emoji) => {
                const alreadyReacted = reactions.some(
                  (r) => r.user === currentUserEmail && r.emoji === emoji
                );
                return (
                  <button
                    key={emoji}
                    onClick={() => toggleReaction(emoji)}
                    className={`px-1 rounded-full hover:bg-gray-700 ${
                      alreadyReacted ? "bg-blue-700" : ""
                    }`}
                    title={emoji}
                  >
                    {emoji}
                  </button>
                );
              })}
              <button
                onClick={() => setShowPicker((p) => !p)}
                className="px-1 rounded-full hover:bg-gray-700"
                title="More emojis"
              >
                <Plus size={18} />
              </button>
            </div>
          )}

          {showPicker && (
            <div className="absolute top-full mt-2 z-50">
              <EmojiPicker
                onEmojiClick={(e) => toggleReaction(e.emoji)}
                theme="dark"
              />
            </div>
          )}

          {/* reactions display */}
          {reactions.length > 0 && (
            <div className="absolute -bottom-4 right-1 bg-gray-700 px-2 py-1 rounded-full flex gap-1 text-xs">
              {reactions.map((r, i) => (
                <span
                  key={i}
                  onClick={() =>
                    r.user === currentUserEmail && toggleReaction(r.emoji)
                  }
                  className="cursor-pointer hover:bg-gray-600 rounded-full px-1"
                  title={r.user}
                >
                  {r.emoji}
                </span>
              ))}
            </div>
          )}

    
        </div>
      </div>
    </div>
  );
}







