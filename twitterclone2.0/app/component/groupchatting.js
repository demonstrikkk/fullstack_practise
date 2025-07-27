







"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../api/lib/supabaseClient";
import { ChevronLeft, Smile, Send, Paperclip, Film ,ChevronDown} from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import GroupMessage from "./groupmessages";
import ReplyPreview from "./ReplyPreview";
import MediaUploader from "./MediaUploader";
import GifSearch from "./gifupload";
import GroupInfoPanel from "./groupinfopanel";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export function GroupChatBox({ groupId, onClose ,onStatusTextUpdate , onNewMessage  }) {
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;
  const [showGroupInfo, setShowGroupInfo] = useState(false);
const [showScrollButton, setShowScrollButton] = useState(false);
const [bookmarkUnreadId, setBookmarkUnreadId] = useState(null);

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [seenMap, setSeenMap] = useState({});
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showMedia, setShowMedia] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [reactions, setReactions] = useState({});
  const [userProfiles, setUserProfiles] = useState([]);

  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
  const container = messagesEndRef.current?.parentElement;
  if (!container) return;

  const handleScroll = () => {
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    setShowScrollButton(!isNearBottom);
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [messages]);


useEffect(() => {
  if (!messages || messages.length === 0) return;

  const emailSet = new Set();

  messages.forEach((msg) => {
    if (msg.sender_email) emailSet.add(msg.sender_email);
    (msg.seen_by || []).forEach(({ user_email }) => {
      if (user_email) emailSet.add(user_email);
    });
  });

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/getUserProfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: Array.from(emailSet) }),
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

  useEffect(() => {
    if (!groupId || !currentUserEmail) return;

    const loadInitialData = async () => {
      const { data: groupData } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();

      const { data: memberData } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId);

      const { data: messageData } = await supabase
        .from("group_messages")
        .select("*")
        .eq("group_id", groupId)
        .order("inserted_at", { ascending: true });

      const messageIds = messageData?.map((m) => m.id) || [];

      const { data: reactionData } = await supabase
        .from("group_message_reactions")
        .select("*")
        .in("message_id", messageIds);

      const { data: seenData } = await supabase
        .from("group_message_seen")
        .select("message_id, user_email");

      const reactionMap = {};
      reactionData?.forEach((r) => {
        if (!reactionMap[r.message_id]) reactionMap[r.message_id] = [];
        reactionMap[r.message_id].push(r);
      });
      
      const seenBy = {};
      seenData?.forEach((s) => {
        if (!seenBy[s.message_id]) seenBy[s.message_id] = [];
        seenBy[s.message_id].push(s.user_email);
      });
     const messagesWithReactions = messageData.map((m) => ({
  ...m,
  reactions: reactionMap[m.id] || [],
  seen_by: (seenBy[m.id] || []).map((email) => ({ user_email: email })),
}));
if (!bookmarkUnreadId) {
  const firstUnread = messagesWithReactions.find(
    (m) => !seenBy[m.id]?.includes(currentUserEmail)
  )?.id;
  setBookmarkUnreadId(firstUnread);
}



      setGroup(groupData);
      setMembers(memberData);
      setMessages(messagesWithReactions);
      setSeenMap(seenBy);
      markAsSeen(messageData);
      scrollToBottom();
    };

    loadInitialData();

    const channel = supabase.channel(`group-${groupId}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "group_messages", filter: `group_id=eq.${groupId}` }, (payload) => {
        setMessages((prev) => {
          const updated = [...prev, { ...payload.new, reactions: [] }];
          markAsSeen(updated);
         
          return updated;
        });
        setTimeout(() => {
  if (typeof onStatusTextUpdate === "function") {
    onStatusTextUpdate("Sent just now", groupId);
  }
  if (typeof onNewMessage === "function") {
    onNewMessage(groupId, payload.new.inserted_at);;
  }
}, 0);
        scrollToBottom();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "group_messages", filter: `group_id=eq.${groupId}` }, (payload) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === payload.new.id ? { ...payload.new, reactions: msg.reactions || [] } : msg))
        );
      })
      
      .on("postgres_changes", {
  event: "*",
  schema: "public",
  table: "group_message_reactions",
}, async (payload) => {
  const { message_id } = payload.new || payload.old;

  const { data: newReactions } = await supabase
    .from("group_message_reactions")
    .select("*")
    .eq("message_id", message_id);

  setReactions((prev) => ({
    ...prev,
    [message_id]: newReactions || [],
  }));
})

      .on("postgres_changes", {
  event: "INSERT",
  schema: "public",
  table: "group_message_seen",
}, async (payload) => {
  const { message_id, user_email } = payload.new;

  // Update local seen map
  setSeenMap((prev) => {
    const current = prev[message_id] || [];
    return {
      ...prev,
      [message_id]: [...new Set([...current, user_email])],
    };
  });

  // Update message's seen_by array for UI
  setMessages((prevMessages) =>
    prevMessages.map((msg) =>
      msg.id === message_id
        ? {
            ...msg,
            seen_by: [...(msg.seen_by || []), { user_email }]
          }
        : msg
    )
  );
})

      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.groupId === groupId && payload.sender !== currentUserEmail) {
          setTypingUsers((prev) => [...new Set([...prev, payload.sender])]);
          setTimeout(() => {
            setTypingUsers((prev) => prev.filter((u) => u !== payload.sender));
          }, 1000);
        }
      })
      .subscribe();

    channelRef.current = channel;
    return () => supabase.removeChannel(channel);
  }, [groupId, currentUserEmail]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const markAsSeen = async (msgs) => {
    const unseen = msgs
      .filter((msg) => msg.sender_email !== currentUserEmail)
      .map((msg) => ({ message_id: msg.id, user_email: currentUserEmail }));

    if (unseen.length > 0) {
      await supabase.from("group_message_seen").upsert(unseen, { onConflict: ['message_id', 'user_email'] });
      unseen.forEach(({ message_id, user_email }) => {
        setSeenMap((prev) => ({
          ...prev,
          [message_id]: [...new Set([...(prev[message_id] || []), user_email])],
        }));
      });
    }
  };

  const sendMessage = async ({ text, type = "text", url = null }) => {
    if ((!text || text.trim() === "") && !url) return;
    const payload = {
      group_id: groupId,
      sender_email: currentUserEmail,
      message: text,
      message_type: type,
      media_url: url,
      reply_to: replyTo?.id || null,
      reply_snippet: replyTo ? `${replyTo.sender_email.split("@")[0]}: ${replyTo.message}` : null,
    };
    const { error } = await supabase.from("group_messages").insert(payload);
    if (error) console.error("Send error:", error);
    setInput("");
    setReplyTo(null);
    setShowEmoji(false);
    setShowGif(false);
    setShowMedia(false);
    setTimeout(() => scrollToBottom(100), 700);
  };

  const handleTyping = () => {
    if (channelRef.current && currentUserEmail) {
      channelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { sender: currentUserEmail, groupId },
      });
    }
  };

  const handleSendMedia = (url, file) => {
    sendMessage({ text: file.name, type: file.type.startsWith("image") ? "image" : "document", url });
  };

  const handleDeleteMessage = async (id) => {
    const { error } = await supabase
      .from("group_messages")
      .update({ is_deleted: true, message: "This message was deleted" })
      .eq("id", id);
    if (error) console.error("Delete error", error);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e1117] text-white">
      {!showGroupInfo && (
        <>
          <div className="flex items-center p-4 border-b border-gray-700">
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-700 rounded-full">
              <ChevronLeft />
            </button>
            <div className=" flex ml-2 cursor-pointer" onClick={() => setShowGroupInfo(true)}>
 <img src={group?.avatar_url || "/groupdefault.png"} className="w-8 h-8 rounded-full" alt="group" />
              <div className="font-semibold text-lg hover:underline">{group?.name}</div>
            
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 h-[80vh] space-y-2 two ">
            {messages.map((msg) => (
              <GroupMessage
              
                key={msg.id + (msg.seen_by?.length || 0)}
                message={msg}
                currentUserEmail={currentUserEmail}
                reactions={reactions[msg.id] || msg.reactions || []}
                seenBy={seenMap[msg.id] || []}
                onReply={() => setReplyTo(msg)}
                onDelete={() => handleDeleteMessage(msg.id)}
                isLastMessage={msg.id === messages[messages.length - 1]?.id}
                chattype="group"
                senderProfile={getProfile(msg.sender_email)}
                 onStatusTextUpdate={onStatusTextUpdate}
                   bookmarkUnreadId={bookmarkUnreadId}
                 groupId
                 userProfilesnew={userProfiles.reduce((acc, user) => {
    acc[user.email] = user;
    return acc; }, {})}

                
              />
            ))}
            <div ref={messagesEndRef} />
            {showScrollButton && (
  <button
    onClick={() => scrollToBottom()}
    className="fixed bottom-14 right-1/2 bg-gray-800 text-white rounded-full p-3 shadow hover:bg-gray-700 border border-gray-600 transition hover:shadow-amber-300 scrollio"
    aria-label="Scroll to bottom"
  >
    <ChevronDown size={26} />
  </button>
)}

          </div>

        
          {/* {typingUsers.length > 0 && (
  <div className="space-y-1">
    {typingUsers.map((email) => {
      const profile = getProfile(email);
      return (
        <div key={email} className="flex items-end space-x-2 animate-pulse">
          <img
            src={profile?.profile?.avatar || '/defaultavatar.png'}
            alt="avatar"
            className="w-5 h-5 rounded-full object-cover border border-gray-500 mb-1"
          />
          <div className="bg-gray-600 text-white px-4 py-2 rounded-2xl shadow max-w-[70%]">
            {profile?.profile?.displayName || email.split('@')[0]} is typing...
          </div>
        </div>
      );
    })}
  </div>
)} */}
{typingUsers.length > 0 && (
  <div className="space-y-1 px-4">
    {typingUsers.map((email) => {
      const profile = getProfile(email);
      return (
        <div key={email} className="flex items-end space-x-2 animate-fadeIn">
          <img
            src={profile?.profile?.avatar || '/defaultavatar.png'}
            alt="avatar"
            className="w-5 h-5 rounded-full object-cover border border-gray-500 mb-1"
          />
          <div className="bg-gray-600 text-white px-4 py-2 rounded-2xl shadow max-w-[70%] flex items-center gap-2 move -space20 size8 inlineseen ">
            <span className="text-sm font-medium">
              {profile?.profile?.displayName || email.split('@')[0]}
            </span>
            <span className="typing-dots flex gap-[2px]">
              <span className="w-[4px] h-[4px] rounded-full bg-white animate-bounce [animation-delay:0s]" />
              <span className="w-[4px] h-[4px] rounded-full bg-white animate-bounce [animation-delay:0.15s]" />
              <span className="w-[4px] h-[4px] rounded-full bg-white animate-bounce [animation-delay:0.3s]" />
            </span>
          </div>
        </div>
      );
    })}
  </div>
)}



          <div className="p-4 border-t border-gray-700 bg-[#1a1d24]">
            {replyTo && <ReplyPreview message={replyTo} onCancel={() => setReplyTo(null)} />}
            <div className="flex items-center gap-2 relative">
              <button onClick={() => setShowMedia(true)} className="text-gray-400">
                <Paperclip />
              </button>
              <button onClick={() => setShowGif((p) => !p)} className="text-gray-400">
                <Film />
              </button>
              <button onClick={() => setShowEmoji((p) => !p)} className="text-gray-400">
                <Smile />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage({ text: input });
                  }
                }}
                placeholder="Message..."
                className="flex-1 bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none"
              />
              <button onClick={() => sendMessage({ text: input })} className="text-blue-500">
                <Send />
              </button>
              {showEmoji && (
                <div className="absolute bottom-14 right-0 z-50">
                  <EmojiPicker
                    onEmojiClick={(emojiObject) => setInput((prev) => prev + emojiObject.emoji)}
                    theme="dark"
                  />
                </div>
              )}
            </div>
          </div>

          {showGif && <GifSearch onGifSelect={(url) => sendMessage({ text: "GIF", type: "gif", url })} onClose={() => setShowGif(false)} />}
          {showMedia && <MediaUploader onUploadComplete={handleSendMedia} onClose={() => setShowMedia(false)} />}
        </>
      )}

      {showGroupInfo && (
        <GroupInfoPanel
          group={group}
          initialMembers={members}
          currentUserEmail={currentUserEmail}
          supabase={supabase}
          onClose={() => setShowGroupInfo(false)}
          onGroupDeleted={onClose}
          onLeftGroup={onClose}
          senderProfile={getProfile}

        />
      )}
    </div>
  );
}








