
"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../api/lib/supabaseClient";
import { ChevronLeft, Smile, Send, Paperclip, Film ,ChevronDown} from "lucide-react";
import dynamic from "next/dynamic";
import Message from "./Message";
import ReplyPreview from "./ReplyPreview";
import { useTypingStatus } from "./useTypingStatus";
import GifSearch from "./gifupload";
import MediaUploader from "./MediaUploader";


const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

function generateChatId(a, b) {
  return [a, b].sort().join("-");
}
  1

export default function ChatBox({
  currentUserEmail,
  peerEmail,
  peerUserName,
  peerAvatar,
  peerRealName,
  onClose,
  onBookmarkUpdate,
  onStatusTextUpdate
}) {
  const chat_id = generateChatId(currentUserEmail, peerEmail);
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState({});
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
const [bookmarkUnreadId, setBookmarkUnreadId] = useState(null);
const [postsCache, setPostsCache] = useState({});

// Add function to fetch post data
const fetchPostData = async (postId) => {
  try {
    const res = await fetch(`/api/posts/byPostId?postId=${postId}`);
    const data = await res.json();
    if (data.post) {
      setPostsCache(prev => ({
        ...prev,
        [postId]: data.post
      }));
    }
  } catch (err) {
    console.error('Failed to fetch post:', err);
  }
};


  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  const { peerTyping, handleTypingChange } = useTypingStatus(
    channelRef,
    currentUserEmail,
    peerEmail
  );


  const [userProfiles, setUserProfiles] = useState([]);

  // In your parent component useEffect
 useEffect(() => {
    if (!messages || messages.length === 0) return;
    const uniqueEmails = [
      ...new Set(
        messages.map((msg) => msg.sender_email).filter((email) => email !== currentUserEmail)
      ),
    ];
 const fetchProfiles = async () => {
      try {
        const res = await fetch("/api/getUserProfiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emails: uniqueEmails }),
        });

        const data = await res.json();
        setUserProfiles(data);
      } catch (err) {
        console.error("Failed to fetch user profiles", err);
      }
    };

    fetchProfiles();
  }, [messages]);

  const getProfile = (email) => userProfiles.find((u) => u.email === email);



  const [lastSeenStatusMap, setLastSeenStatusMap] = useState({});

const handleStatusTextUpdate = (text, peerEmail) => {
  setLastSeenStatusMap(prev => ({
    ...prev,
    [peerEmail]: text,
  }));
};
  
  
  
// send media message
const handleSendMedia = (url, file) => {
  sendMessage({
    text: file.name,
    type: file.type.startsWith("image") ? "image" : "document",
    url
  });
    setTimeout(() => {
        messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" }    );
      },800);
};


useEffect(() => {
  if (!chat_id) return;

  const loadMessages = async () => {
      const { data: msgs, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chat_id)
        .order("inserted_at", { ascending: true });

      if (error) {
        console.error("Error loading messages", error);
        return;
      }

      setMessages(msgs || []);
      setTimeout(() => {messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
                      const container = messagesEndRef.current.parentElement;
    container.scrollTop = container.scrollHeight + 20;} // adjust +20 pixels down

      , 100);

      if (msgs?.length > 0) {
        const ids = msgs.map((m) => m.id);
        const { data: reacts, error: reactErr } = await supabase
          .from("message_reactions")
          .select("*")
          .in("message_id", ids);

      if (msgs?.length > 0) {
        // only set bookmark once
  if (!bookmarkUnreadId) {
    const firstUnread = msgs.find(
      (m) => !m.seen && m.sender_email !== currentUserEmail
    )?.id;
    onBookmarkUpdate?.(firstUnread);
    setBookmarkUnreadId(firstUnread);
  }
}



        if (!reactErr && reacts) {
          const map = {};
          reacts.forEach((r) => {
            if (!map[r.message_id]) map[r.message_id] = [];
            map[r.message_id].push({ emoji: r.emoji, user: r.user_email });
          });
          setReactions(map);
        }
      }
    };

    loadMessages();

    const channel = supabase.channel(`chat-${chat_id}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `chat_id=eq.${chat_id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            if (payload.new.sender_email === peerEmail) {
              handleTypingChange(""); // this resets your typing broadcast
            }
            setMessages((prev) => [...prev, payload.new]);

          }
          onBookmarkUpdate?.(payload.new.id);
          if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message_reactions" },
        () => loadMessages()
      )
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.sender === peerEmail) {
          handleTypingChange(payload.isTyping);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chat_id]);

  const sendMessage = async ({
    text,
    type = "text",
    url = null,
    postId = null
  }) => {
    if (!text && !url && !postId) return;


    await supabase.from("messages").insert({
      chat_id,
      sender_email: currentUserEmail,
      receiver_email: peerEmail,
      message: text,
  message_type: type,
  media_url: url,
  post_id: postId,
  reply_to: replyTo?.id || null,
  reply_snippet: replyTo
  ? `${getProfile(replyTo.sender_email)?.profile?.displayName || replyTo.sender_email.split("@")[0]}: ${replyTo.message}`
    : null,
});

 if (postId) {
    fetchPostData(postId);
  }


setInput("");
setReplyTo(null);
setShowEmoji(false);
setShowGif(false);
setShowMedia(false);
setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
};


const handleSendText = () => {
  if (input.trim()) {
    sendMessage({ text: input });
      setTimeout(() => {
        messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" }    );
      },800);
      
   
}}

useEffect(() => {
const container = messagesEndRef.current?.parentElement;
if (!container) return;

const handleScroll = () => {
  const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10;
  setShowScrollButton(!isNearBottom);
};

container.addEventListener("scroll", handleScroll);
return () => container.removeEventListener("scroll", handleScroll);
}, [messagesEndRef.current]);
useEffect(() => {
  messages.forEach(msg => {
    if (msg.message_type === "post" && msg.post_id && !postsCache[msg.post_id]) {
      fetchPostData(msg.post_id);
    }
  });
}, [messages]);

return (
  <div className="flex flex-col h-full  bg-[#0e1117] text-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-700">
        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-700 rounded-full">
          <ChevronLeft />
        </button>
        <img
          src={peerAvatar}
          className="w-10 h-10 rounded-full object-cover ml-2"
          alt="peer"
        />
        <div className="ml-2">
          <div className="font-semibold">{peerUserName}</div>
          <div className="text-xs text-gray-400">{peerRealName}</div>
          {/* {peerTyping && (
            <div className="text-xs text-green-400 animate-pulse">typing...</div>
            )} */}
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 space-y-2 overflow-y-scroll two h-[90vh] ">
        {messages.map((msg,idx) => 
          (
          <Message
            key={msg.id}
            message={msg}
            currentUserEmail={currentUserEmail}
            reactions={reactions[msg.id] || []}
            onReply={() => setReplyTo(msg)}
            isLastMessage={idx === messages.length - 1}
            bookmarkUnreadId={bookmarkUnreadId}
              chattype='private'
              senderProfile={getProfile(msg.sender_email)}
  
              // onStatusTextUpdate={(text) => handleStatusTextUpdate(text, peerEmail)}

onStatusTextUpdate={(status) => {
      // peerEmail is accessible via prop or context in ChatBox
      onStatusTextUpdate?.(status, peerEmail);
    }}
              
          />)
        )}
        {peerTyping && (
  <div className="flex justify-start items-end space-x-2">
    <img
      src={peerAvatar}
      alt="avatar"
      className="w-5 h-5 rounded-full object-cover border border-gray-500 mb-1"
    />
    <div className="bg-gray-600 text-white px-4 py-2 rounded-2xl shadow animate-pulse max-w-[70%] -space20 size8 move">
      {peerUserName} is typing...
    </div>
  </div>
)}

        <div ref={messagesEndRef} />
          {showScrollButton && (
  <button
    onClick={() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }}
    className="fixed bottom-14 right-1/2 bg-gray-800 text-white rounded-full p-3 shadow hover:bg-gray-700 border border-gray-600 transition hover:shadow-amber-300 scrollio"
    aria-label="Scroll to bottom"
  >
    <ChevronDown size={26} />
  </button>
)}
      </div>

      {/* Inputs */}
      <div className="p-4 border-t border-gray-700 bg-[#1a1d24]">
        {replyTo && <ReplyPreview message={replyTo} onCancel={() => setReplyTo(null)} />}
        <div className="flex items-center gap-2 relative">
          <button onClick={() => setShowMedia(true)} className="p-2 text-gray-400 hover:bg-gray-700 rounded-full">
            <Paperclip />
          </button>
          <button onClick={() => setShowGif((prev)=>!prev)} className="p-2 text-gray-400 hover:bg-gray-700 rounded-full">
            <Film />
          </button>
          <button onClick={() => setShowEmoji((p) => !p)} className="p-2 text-gray-400 hover:bg-gray-700 rounded-full">
            <Smile />
          </button>
          {showEmoji && (
            <div className="absolute bottom-16 right-0 z-50">
              <EmojiPicker
                onEmojiClick={(e) => setInput((prev) => prev + e.emoji)}
                theme="dark"
              />
            </div>
          )}
       

          <textarea
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTypingChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
              }
            }}
            className="flex-1 px-4 py-2 text-base bg-gray-800 rounded-2xl resize-none focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendText}
            
            disabled={!input.trim()}
            className="p-2 bg-blue-600 rounded-full hover:bg-blue-700"
          >
            <Send />
          </button>
        </div>
      </div>

      {showGif && (
        <GifSearch  onGifSelect={(url) => sendMessage({ text: "GIF", type: "gif", url })} onClose={() => setShowGif(false)} />
      )}
      {showMedia && (
        <MediaUploader onUploadComplete={handleSendMedia} onClose={() => setShowMedia(false)} />
      )}
    </div>
  );
}











