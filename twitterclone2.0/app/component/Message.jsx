

"use client";

import { useEffect, useRef, useState } from "react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Smile, Reply, Trash2, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { supabase } from "../api/lib/supabaseClient";
import PostCard from "./post-card";
import PostPopup from "./PostPopup";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function Message({
  message,
  currentUserEmail,
  onReply,
  reactions = [],
  isLastMessage,
  bookmarkUnreadId,
  senderProfile,
  onStatusTextUpdate,
  
}) {
  const [hover, setHover] = useState(false);
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [statusText, setStatusText] = useState("");
  const ref = useRef();

  const isMe = message.sender_email === currentUserEmail;





useEffect(() => {
  if (!isLastMessage) return;

  if (isMe) {
    if (message.seen) {
      const seenTime = formatDistanceToNowStrict(new Date(message.seen_at || new Date()));
      setStatusText(`Seen ${seenTime} ago`);
      onStatusTextUpdate?.(`Seen ${seenTime} ago`);
    } else {
      const sentTime = formatDistanceToNowStrict(new Date(message.inserted_at));
      setStatusText(`Sent ${sentTime} ago`);
      onStatusTextUpdate?.(`Sent ${sentTime} ago`);
    }
  } else {
    // Receiver sees nothing in bubble
    onStatusTextUpdate?.("New message");
  }
}, [message.seen, isLastMessage, message.inserted_at, message.seen_at]);


  useEffect(() => {
    if (!ref.current || message.seen || isMe) return;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        try {
          await supabase
            .from("messages")
            .update({ seen: true, seen_at: new Date().toISOString() })
            .eq("id", message.id);
        } catch (e) {
          console.error("Error marking seen", e);
        }
        observer.disconnect();
      }
    }, { threshold: 0.8 });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [message.id, message.seen, isMe]);

  const toggleReaction = async (emoji) => {
    const alreadyReacted = reactions.some(
      (r) => r.user === currentUserEmail && r.emoji === emoji
    );
    const method = alreadyReacted ? "DELETE" : "POST";

    try {
      const res = await fetch("/api/react-to-message", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message_id: message.id,
          emoji,
          user_email: currentUserEmail,
        }),
      });

      if (!res.ok) console.error(await res.json());
    } catch (e) {
      console.error("reaction error", e);
    }
    setShowPicker(false);
    setShowQuickReactions(false);
  };

  const deleteMessage = async () => {
    try {
      await supabase
        .from("messages")
        .update({
          message: "This message was deleted",
          is_deleted: true,
          message_type: "text",
          media_url: null,
        })
        .eq("id", message.id);
    } catch (e) {
      console.error("delete error", e);
    }
  };

  return (
    <div className="px-4 my-2" ref={ref}>
      {message.id === bookmarkUnreadId && (
        <div className="flex justify-center my-4">
          <div className="bg-gray-500 w-1/2 text-md text-white px-2 py-1 rounded-full hover:shadow-white flex justify-center items-center">
            -- New messages --
          </div>
        </div>
      )}

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
          className={`relative max-w-[70%] px-4 py-2 rounded-2xl shadow break-words space20 size8  ${
            isMe
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-700 text-white rounded-bl-none "
          } ${message.is_deleted ? "italic text-gray-400" : ""}`}
        >
          {/* Sent/Seen status */}
          {isLastMessage && isMe && statusText && (
            <div className="absolute -bottom-5 right-2 text-[11px] text-gray-300 italic inlineseen -space20 ">
              {statusText}
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
                  onClick={deleteMessage}
                  className="hover:bg-gray-600 rounded-full p-1"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          )}

          

          {message.reply_snippet && (
  <div className="text-xs bg-black/30 p-1 rounded mb-1 border-l-2 border-blue-400">
    <strong>
      {message.reply_snippet.split(":")[0]}
    </strong>:{" "}
    {message.reply_snippet.split(":").slice(1).join(":").trim()}
  </div>
)}


 {message.message_type === "post" && postData && (
    <div className="p-2 bg-zinc-800 rounded-md shadow-md max-w-md">
      <PostCard
        userEmail={postData.userEmail}
        postId={postData.postId}
        text={postData.content?.text}
        media={postData.content?.media}
        poll={postData.content?.poll}
        likedByCurrentUser={postData.likedByCurrentUser}
        likesCount={postData.likes?.count || 0}
        username={postData.userInfo?.username}
        userrealname={postData.userInfo?.userrealname}
        avatar={postData.userInfo?.avatar}
        createdAt={postData.createdAt}
        likedbyUsers={postData.likedUsernames}
        comments={postData.comments}
        retweetByCurrentUser={postData.retweetByCurrentUser}
        retweetByUsers={postData.retweetByUsers}
        retweetCount={postData.retweet?.count || 0}
       
      />
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
                    className={`px-1 rounded-full transition ${
                      alreadyReacted ? "bg-gray-600" : "hover:bg-gray-700"
                    }`}
                    title={alreadyReacted ? "Remove your reaction" : "React"}
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

          {/* emoji picker */}
          {showPicker && (
            <div className="absolute top-full mt-2 z-50">
              <EmojiPicker
                onEmojiClick={(e) => toggleReaction(e.emoji)}
                theme="dark"
              />
            </div>
          )}

          {/* reaction bar */}
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
