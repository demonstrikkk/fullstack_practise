"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileComponent from "../userprofile/page";
import Section2Content from "../home/page";

import Explore from "../explore/page"; // Fixed import name
import Community from "../Community/page";
import Notifications from "../notifications/page";
import Bookmarks from "../Bookmarks/page";
import useUserProfile from "../hooks/useUserProfile";
import { v4 as uuvid } from 'uuid';
import useUserSearch from "../hooks/useUserSearch";
import OtherProfileComponent from "../Otherprofile/page";
import Pirate from "../mappodop/page";
import RelevantPeople from "../component/RelevantPeople";
import Postbutton from "../component/postbutton";
import { WhatsHappening } from "../explore/page";
import Comment from "../component/commentsection";
import ChatBox from "../component/chatting";
import { formatDistanceToNow } from 'date-fns';
import { supabase } from "../api/lib/supabaseClient";
import { Search } from 'lucide-react';
import { formatDistanceToNowStrict } from "date-fns";
import GroupCreate from "../component/GroupCreate";
import { GroupChatBox } from "../component/groupchatting";
import { SkeletonProfile } from "../component/skeletionpost";


// Modularize your Private Chats into this:



export default function HomePage() {




  const [chatactiveTab, setchatActiveTab] = useState("private");
  const [chathide, setchathide] = useState(false)

  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');
  const { results, loading, searchUsers } = useUserSearch();
  const [showpostbutton, setshowpostbutton] = useState(false)
  useEffect(() => {
    const debounce = setTimeout(() => {
      searchUsers(query);
    }, 300);
    return () => clearTimeout(debounce);
  }, [query]);
  const { data: session, status } = useSession();
  const router = useRouter();
  // router.push('/userdetailvialogin')
  const [showPopup, setShowPopup] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [message, setMessage] = useState('');
  const userrealname = session?.user?.name || "User";
  const username = session?.user?.username || "username";
  const avatar = session?.user?.image || "https://via.placeholder.com/150";
  const email = session?.user?.email || ''
  const auth = session?.user?.provider
  const { data, loading1, error, getAllUsers, getFirstUser, createUser, updateUser, deleteUser } = useUserProfile();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedUserchat, setSelectedUserchat] = useState(false);
  const [unreadBookmarkMap, setUnreadBookmarkMap] = useState({});
  const [showSkeleton, setShowSkeleton] = useState(true);

  const [lastSeenStatusMap, setLastSeenStatusMap] = useState({});


  const [recentChats, setRecentChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);

  const currentUserEmail = session?.user?.email;
  const [userList, setUserList] = useState([]);

  // States for managing group chat UI


  const [activeGroup, setActiveGroup] = useState(null);

  const handleStatusTextUpdate = (text, peerEmail) => {
    setLastSeenStatusMap(prev => ({
      ...prev,
      [peerEmail]: text,
    }));
  };

  useEffect(() => {
    let timer;

    // if (
    // session.user.avatar 
    // ||
    // ) {
    timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 2000); // 4 seconds delay
    // }

    return () => clearTimeout(timer); // cleanup on unmount
  }, [session?.user?.avatar]);


  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchGroupsAndStatuses = async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("groups!inner(*)")
        .eq("user_email", session.user.email);

      if (error || !data) return;

      const fetchedGroups = data.map((item) => item.groups);

      for (const group of fetchedGroups) {
        const { data: lastMessage } = await supabase
          .from("group_messages")
          .select("*")
          .eq("group_id", group.id)
          .order("inserted_at", { ascending: false })
          .limit(1)
          .single();

        if (!lastMessage) {
          group.last_message_timestamp = group.created_at; // fallback
          continue;
        }

        // ✅ Track timestamp for sorting
        group.last_message_timestamp = lastMessage.inserted_at;

        const { data: seenByData } = await supabase
          .from("group_message_seen")
          .select("user_email")
          .eq("message_id", lastMessage.id);

        const seenEmails = seenByData?.map((s) => s.user_email) || [];
        const isSender = lastMessage.sender_email === session.user.email;
        const hasSeen = seenEmails.includes(session.user.email);

        if (isSender) {
          if (seenEmails.length > 0) {
            const profileRes = await fetch("/api/getUserProfiles", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ emails: seenEmails }),
            });

            const profiles = await profileRes.json();
            const seenNames = profiles.map((p) => p.profile?.displayName).filter(Boolean);

            setLastSeenStatusMap((prev) => ({
              ...prev,
              [group.id]: `Seen by ${seenNames.join(", ")}`,
            }));
          } else {
            setLastSeenStatusMap((prev) => ({
              ...prev,
              [group.id]: `Sent ${formatDistanceToNowStrict(new Date(lastMessage.inserted_at))} ago`,
            }));
          }
        } else {
          if (!hasSeen) {
            setLastSeenStatusMap((prev) => ({
              ...prev,
              [group.id]: "-- New messages --",
            }));
          } else {
            const profileRes = await fetch("/api/getUserProfiles", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ emails: seenEmails }),
            });

            const profiles = await profileRes.json();
            const seenNames = profiles.map((p) => p.profile?.displayName).filter(Boolean);

            setLastSeenStatusMap((prev) => ({
              ...prev,
              [group.id]: seenNames.length > 0
                ? `Seen by ${seenNames.join(", ")}`
                : `Sent ${formatDistanceToNowStrict(new Date(lastMessage.inserted_at))} ago`,
            }));
          }
        }
      }

      // ✅ Sort groups by most recent message
      const sortedGroups = [...fetchedGroups].sort(
        (a, b) =>
          new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp)
      );

      setGroups(sortedGroups);
    };

    fetchGroupsAndStatuses();
  }, [session?.user?.email, activeGroup]);



  const bumpGroupToTop = (groupId, newTimestamp) => {
    setGroups((prevGroups) => {
      const index = prevGroups.findIndex((g) => g.id === groupId);
      if (index === -1) return prevGroups;

      const updatedGroup = {
        ...prevGroups[index],
        last_message_timestamp: newTimestamp || new Date().toISOString(),
      };

      const otherGroups = prevGroups.filter((g) => g.id !== groupId);

      return [updatedGroup, ...otherGroups].sort((a, b) =>
        new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp)
      );
    });
  };









  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groups, setGroups] = useState([]);

  // // Fetch user's groups on component mount
  // useEffect(() => {
  //   const fetchGroups = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from('group_members')
  //         .select('groups!inner(*)')
  //         .eq('user_email', session.user.email)

  //       if (error) throw error;
  //       setGroups(data.map(item => item.groups));
  //     } catch (err) {
  //       console.error('Error fetching groups:', err);
  //     }
  //   };

  //   if (session?.user?.id) fetchGroups();
  // }, [session?.user?.id]);

  // const handleGroupCreated = (newGroup) => {
  //   setGroups(prev => [...prev, newGroup]);
  //   setShowCreateGroup(false);
  //   setActiveGroup(newGroup.id);
  // };




  useEffect(() => {
    const channel = supabase.channel('message-status-global');

    channel
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
      }, async (payload) => {
        const msg = payload.new;

        // OPTIONAL: Check if user is sender/receiver
        const isCurrentUserSender = msg.sender_email === currentUserEmail;
        const peerEmail = isCurrentUserSender ? msg.receiver_email : msg.sender_email;

        const timeText = msg.seen
          ? `Seen ${formatDistanceToNowStrict(new Date(msg.seen_at))} ago`
          : `Sent ${formatDistanceToNowStrict(new Date(msg.inserted_at))} ago`;

        setLastSeenStatusMap(prev => ({
          ...prev,
          [peerEmail]: timeText,
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserEmail]);






  // Load groups on mount
  useEffect(() => {
    if (!session?.user?.email) return;
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("groups!inner(*)")
        .eq("user_email", session.user.email);
      if (!error) setGroups(data.map(g => g.groups));
    };
    fetchGroups();
  }, [session]);

  // Real-time subscription to group updates
  useEffect(() => {
    const channel = supabase.channel("group-tabs")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "groups",
      }, payload => {
        setGroups(prev => prev.map(g => g.id === payload.new.id ? { ...g, ...payload.new } : g));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const handleGroupCreated = (group) => {
    setGroups(prev => [...prev, group]);
    setActiveGroup(group.id);
  };







  const [userProfiles, setUserProfiles] = useState({}); // maps email → profile

  const messagesEndRef = useRef();

  // 👇 1️⃣ Setup Supabase session
  useEffect(() => {
    if (!session?.supabaseAccessToken) return;
    supabase.auth.setSession({
      access_token: session.supabaseAccessToken,
      refresh_token: undefined,
    }).catch(console.error);
  }, [session]);


  useEffect(() => {
    const channel = supabase.channel("live-previews").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      (payload) => {
        const msg = payload.new;
        const peer = msg.sender_email === currentUserEmail ? msg.receiver_email : msg.sender_email;

        const dynamicPreview =
          msg.sender_email === currentUserEmail
            ? msg.seen
              ? `Seen ${formatDistanceToNow(new Date(msg.seen_at || msg.inserted_at), { addSuffix: true })}`
              : `Sent ${formatDistanceToNow(new Date(msg.inserted_at), { addSuffix: true })}`
            : "New messages";

        setLastSeenStatusMap((prev) => ({
          ...prev,
          [peer]: dynamicPreview,
        }));
      }
    ).subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUserEmail]);






  const loadRecentChats = async () => {
    const { data, error } = await supabase.rpc("get_recent_chats", {
      current_user_email: currentUserEmail,
    });
    if (error) {
      console.error("Error loading chats", error);
      return;
    }


    setRecentChats(data || []);


    // enrich with user profiles
    const emails = data.map(c => c.peer_email);
    try {
      const res = await fetch("/api/getUserProfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
      const profiles = await res.json();
      const map = {};
      profiles.forEach(p => {
        map[p.email] = p;
      });
      setUserProfiles(map);
    } catch (err) {
      console.error("getUserProfiles error", err);
    }
  };
  // 👇 2️⃣ Load recent chats from Supabase + enrich with profiles
  useEffect(() => {
    if (!currentUserEmail) return;


    loadRecentChats();

    // subscribe to message inserts
    const channel = supabase
      .channel("public:messages")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
      }, loadRecentChats)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages" }, loadRecentChats)

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserEmail]);




  function getPeerName(email) {
    return userProfiles[email]?.username || email.split("@")[0];
  }

  function getPeerAvatar(email) {
    return userProfiles[email]?.profile?.avatar || "/default-avatar.png";
  }

  function getPeerRealName(email) {
    return userProfiles[email]?.userrealname || "";
  }


  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      const res = await fetch(`/api/search-users?q=${searchTerm}&currentUserEmail=${currentUserEmail}`);
      const data = await res.json();
      setSearchResults(data.users || []);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, currentUserEmail]);






  useEffect(() => {
    getFirstUser(email);
  }, [session]);
  const handleUpdate = () => updateUser(email, { username: 'newUsername' });
  const handleDelete = () => deleteUser(email);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };






  const handleGmailClick = () => {
    if (session) {
      setShowPopup((prev) => !prev);
    } else {
      signIn();
    }
  };




  return (
    <>

      <script src="https://cdn.lordicon.com/lordicon.js"></script>
      <div className="containere w-[100%]">
        <div className="section section1 ">
          <div className="logo xlogo justify-center flex ">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="invert w-9 mb-3 mt-1"
            >
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </g>
            </svg>
          </div>




          <div className="icons flex flex-col items-start  relative left-[30%] w-[50%]  gap-4  ">
            {/* Navigation items */}
            <div className="flex flex-col gap-3 smallscreeneffect ">
              {[
                {
                  name: "Home", section: "Home", icon:
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                      <g>
                        <path
                          d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z">
                        </path>
                      </g>
                    </svg>
                },

                {
                  name: "Explore", section: "Explore", icon:
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                      <g>
                        <path
                          d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z">
                        </path>
                      </g>
                    </svg>
                },

                {
                  name: "Notifications", section: "Notifications", icon:
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                      <g>
                        <path
                          d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z">
                        </path>
                      </g>
                    </svg>
                },

                {
                  name: "Messages", section: "Messages", icon:
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                      <g>
                        <path
                          d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z">
                        </path>
                      </g>
                    </svg>
                },

                {
                  name: "Bookmarks", section: "Bookmarks", icon:
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                      <g>
                        <path
                          d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z">
                        </path>
                      </g>
                    </svg>
                },



                {
                  name: "Profile", section: "ProfileComponent", icon:
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                      <g>
                        <path
                          d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z">
                        </path>
                      </g>
                    </svg>
                },


              ].map((item) => (

                // <div
                //   key={item.section}
                //   className="icon flex   rounded-3xl hover:bg-slate-900 hover:border-slate-300 cursor-pointer w-full p-2 "
                //   onClick={() => setActiveSection(item.section)}
                // >
                //   {item.icon}
                //   <div className="textu">{item.name}</div>
                // </div>
                <div
                  key={item.section}
                  className={`icon  flex rounded-3xl hover:bg-slate-900 hover:border-slate-300 cursor-pointer w-full   p-2 ${activeSection === item.section ? 'scaled ' : ''
                    }`}
                  onClick={() => setActiveSection(item.section)}
                >
                  {item.icon}
                  <div
                    className={`textu ml-2 ${activeSection === item.section ? 'font-extrabold font-serif text-2xl text-white' : 'font-normal text-gray-400 text-xl'
                      }`}
                  >
                    {item.name}
                  </div>
                </div>


              ))}
            </div>
          </div>

          {/* Post button and profile section */}
          <div className="button bg-white flex justify-center w-12   font-extrabold font-sans rounded-3xl h-11 relative left-[30%] mt-3 cursor-pointer smallscreenposteffect" onClick={() => setshowpostbutton(true)} >
            <button className="cursor-pointer">Post</button>
          </div>

          <div
            className="gmail logger flex absolute bottom-6 left-[6%] items-center space-x-1.5 hover:bg-slate-900 hover:border-slate-300 rounded-3xl px-6 py-2 cursor-pointer"
            onClick={handleGmailClick}
          >

            {showSkeleton ? (
              <SkeletonProfile />
            ) : (
              <div className="image w-12 h-12 rounded-full relative overflow-hidden">
                {
                  // session?.user
                  //  ||
                  data?.profile ? (
                    <img
                      src={data?.profile?.avatar}
                      className="absolute w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <span></span>
                    </div>
                  )}
              </div>
            )}


            {session?.user ? (
              <div className="textu">{data?.username}</div>
            ) : (
              <div className="textu"></div>
            )}
          </div>


          {showPopup && (
            <div className="absolute bottom-15 left-40 mt-2 bg-white p-4 rounded shadow-md z-10">
              <p className="text-black mb-2">Do you want to sign out?</p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={async () => {
                    await signOut({ redirect: false });
                    router.push("/login");
                    setShowPopup(false);
                  }}
                >
                  Yes, Sign Out
                </button>
                <button
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-700"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="group w-full">



          <div className="section section2 w-[100%]">

            {selectedArticle && (
              <div className="mt-4 bg-[#181818] p-4 rounded-lg h-[110vh]">
                <button onClick={() => setSelectedArticle(null)} className="text-blue-400 underline mb-2">← Back</button>
                <div className="h-[90vh] overflow-y-auto two ">
                  <h2 className="text-xl font-bold mb-2">{selectedArticle.webTitle}</h2>
                  {selectedArticle.thumbnail && (
                    <img src={selectedArticle.thumbnail} alt="Thumbnail" className="rounded mb-4 max-h-[300px] object-cover" />
                  )}
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.body }} className="prose prose-invert max-w-none text-white" />
                </div>
              </div>
            )}


            {!selectedArticle && selectedUser && <OtherProfileComponent
              userrealname={selectedUser?.profile?.displayName}
              username={selectedUser?.username}
              avatar={selectedUser?.profile?.avatar}
              followers={selectedUser?.followers}
              following={selectedUser?.following}
              createdAt={selectedUser?.firstlogincreatedAt}
              email={selectedUser?.email}
              bio={selectedUser?.profile?.bio}
              location={selectedUser?.profile?.location}
              onClose={() => setSelectedUser(null)}
            />
            }
            {activeSection === "Home" && !selectedArticle && <Section2Content
              userrealname={data?.profile?.displayName}
              username={data?.username}
              avatar={data?.profile?.avatar
              }
              email={data?.email}
            />}
            {activeSection === "Explore" && !selectedArticle && <Explore email={data?.email} />}
            {activeSection === "Notifications" && !selectedArticle && <Notifications />}
            {activeSection === "Messages" && !selectedArticle && (
              <>
                <div className="flex flex-col h-screen w-full bg-[#0e1117] text-white">
                  {/* Tab Selector */}
                  {!chathide && !selectedArticle && (<>
                    <div className="p-4 border-b border-gray-600">
                      <h1 className="text-xl font-bold mb-4">Messages</h1>
                    </div>
                    <div className="flex border-b border-gray-700">
                      <button
                        onClick={() => setchatActiveTab("private")}
                        className={`flex-1 text-center p-4 font-semibold ${chatactiveTab === "private" ? "bg-blue-600" : "bg-[#1a1d24] hover:bg-gray-800"
                          }`}
                      >
                        Chats
                      </button>
                      <button
                        onClick={() => setchatActiveTab("group")}
                        className={`flex-1 text-center p-4 font-semibold ${chatactiveTab === "group" ? "bg-blue-600" : "bg-[#1a1d24] hover:bg-gray-800"
                          }`}
                      >
                        Groups
                      </button>
                    </div>
                  </>)}

                  {/* Tab Content */}
                  <div className="flex-1 overflow-hidden">
                    {!selectedArticle && chatactiveTab === "private" ? (
                      <div className="flex h-[96vh] w-full bg-[#0e1117] text-white">
                        {/* Left Panel */}
                        {!selectedUserchat && !selectedArticle && (
                          <div className="w-full border-r border-gray-700 flex flex-col">
                            <div className="p-4 border-b border-gray-600">
                              {/* <h1 className="text-xl font-bold mb-4">Messages</h1> */}
                              <div className="relative">
                                <input
                                  type="text"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  placeholder="Search for people"
                                  className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                              {searchTerm.trim() ? (
                                <div>
                                  {searchResults.map((user) => (
                                    <div
                                      key={user.email}
                                      onClick={() => {
                                        setActiveChat({
                                          peerEmail: user.email,
                                          peerUserName: user.username,
                                          peerAvatar: user.avatar,
                                          peerRealName: user.userrealname,
                                        });
                                        setSearchTerm("");
                                        setSearchResults([]);
                                        setSelectedUserchat(true);
                                        setchathide(true);
                                      }}
                                      className="p-4 flex items-center gap-4 hover:bg-gray-800 cursor-pointer"
                                    >
                                      <img
                                        src={user.avatar || "/default-avatar.png"}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full"
                                      />
                                      <div>
                                        <div className="font-semibold">{user.username}</div>
                                        <div className="text-xs text-gray-400">{user.userrealname}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div>





                                  {recentChats
                                    .sort((a, b) => new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp))
                                    .map((chat) => {
                                      const unread = chat.unread_count || 0;

                                      let unreadMsgs = [];
                                      let lastMessages = [];

                                      try {
                                        unreadMsgs = Array.isArray(chat.unread_messages)
                                          ? chat.unread_messages
                                          : JSON.parse(chat.unread_messages || "[]");
                                      } catch (e) {
                                        console.error("failed to parse unread_messages", e);
                                      }

                                      try {
                                        lastMessages = Array.isArray(chat.last_messages)
                                          ? chat.last_messages
                                          : JSON.parse(chat.last_messages || "[]");
                                      } catch (e) {
                                        console.error("failed to parse last_messages", e);
                                      }

                                      const bookmarkId = unreadBookmarkMap[chat.peer_email];
                                      const bookmarkMessage = lastMessages.find((m) => m.id === bookmarkId);

                                      const lastMsg = lastMessages[0] || chat.last_message;
                                      let preview = "";

                                      const isFromPeer = lastMsg?.sender_email !== currentUserEmail;
                                      const isToCurrent = lastMsg?.receiver_email === currentUserEmail;
                                      const isSeen = lastMsg?.seen;
                                      const isSeenAt = lastMsg?.seen_at;
                                      const insertedAt = lastMsg?.inserted_at;

                                      // ✅ 1. Show "New messages" if peer sent and not seen
                                      if (lastMsg?.sender_email === currentUserEmail) {
                                        preview = isSeen
                                          ? `Seen ${formatDistanceToNow(new Date(isSeenAt || insertedAt), { addSuffix: true })}`
                                          : `Sent ${formatDistanceToNow(new Date(insertedAt), { addSuffix: true })}`;
                                      }
                                      // ✅ 3. Fallback: show text preview
                                      else {
                                        preview = lastMsg?.message?.length > 50
                                          ? lastMsg.message.slice(0, 50) + "..."
                                          : lastMsg?.message || "(no messages)";
                                      }

                                      // ✅ Use dynamic override if exists
                                      const finalPreview = lastSeenStatusMap[chat.peer_email] || preview;

                                      return (
                                        <div
                                          key={chat.peer_email}
                                          onClick={() => {
                                            setActiveChat({
                                              peerEmail: chat.peer_email,
                                              peerUserName: getPeerName(chat.peer_email),
                                              peerAvatar: getPeerAvatar(chat.peer_email),
                                              peerRealName: getPeerRealName(chat.peer_email),
                                            });
                                            setSelectedUserchat(true);
                                            setchathide(true)

                                            // ✅ As soon as chat opens, show actual message content
                                            if (lastMsg) {
                                              const openedPreview = lastMsg?.message?.length > 50
                                                ? lastMsg.message.slice(0, 50) + "..."
                                                : lastMsg?.message || "(no messages)";

                                              setLastSeenStatusMap((prev) => ({
                                                ...prev,
                                                [chat.peer_email]: openedPreview
                                              }));
                                            }
                                          }}
                                          className={`flex gap-2 p-4 hover:bg-gray-800 cursor-pointer ${activeChat?.peerEmail === chat.peer_email ? "bg-blue-600/20" : ""
                                            }`}
                                        >
                                          <img
                                            src={getPeerAvatar(chat.peer_email)}
                                            className="w-10 h-10 rounded-full object-cover"
                                            alt="avatar"
                                          />
                                          <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center">
                                              <span className="font-semibold">{getPeerName(chat.peer_email)}</span>
                                              <span className="text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(chat.last_message_timestamp), { addSuffix: true })}
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                              <span className="text-gray-400 truncate pr-4">{finalPreview}</span>
                                              {unread > 0 && (
                                                <span className="bg-blue-600 text-white text-xs rounded-full px-2">
                                                  {unread > 4 ? "4+" : unread}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}










                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Right Panel */}
                        {selectedUserchat && !selectedArticle && (
                          <div className="w-full">
                            {activeChat ? (
                              <ChatBox
                                currentUserEmail={currentUserEmail}
                                peerEmail={activeChat.peerEmail}
                                peerUserName={activeChat.peerUserName}
                                peerAvatar={activeChat.peerAvatar}
                                peerRealName={activeChat.peerRealName}
                                onClose={() => {
                                  setActiveChat(null);
                                  setSelectedUserchat(false);
                                  setchathide(false)
                                }}
                                onBookmarkUpdate={(id) => {
                                  setUnreadBookmarkMap((prev) => ({
                                    ...prev,
                                    [activeChat.peerEmail]: id
                                  }));
                                }}

                                onStatusTextUpdate={(status, peerEmail) => {
                                  setLastSeenStatusMap(prev => ({
                                    ...prev,
                                    [peerEmail]: status
                                  }));
                                }}
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-gray-400">
                                Select a conversation to start messaging.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-screen bg-gray-900 text-white">

                        {!activeGroup && !selectedArticle && <div className=" w-full border-r border-gray-700 bg-[#1a1d24] p-4">
                          <button
                            onClick={() => {
                              setShowCreateGroup(true)
                            }
                            }
                            className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-2 mb-4"
                          >
                            Create New Group
                          </button>

                          <h2 className="text-lg font-bold mb-2">Your Groups</h2>

                          <div className="space-y-2">

                            {groups.map(group => (
                              <div
                                key={group.id}
                                onClick={() => {
                                  setActiveGroup(group.id)
                                  setchathide(true)
                                }}
                                className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-700 ${activeGroup === group.id ? 'bg-gray-700' : ''}`}
                              >
                                <img
                                  src={group.avatar_url || "/groupdefault.png"}
                                  className="w-10 h-10 rounded-full object-cover mr-3"
                                  alt="avatar"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold truncate">{group.name}</p>
                                  <p className={`text-xs text-gray-400 truncate ${lastSeenStatusMap[group.id] === "-- New messages --" ? "font-bold text-white" : ""}`}>
                                    {lastSeenStatusMap[group.id] || "Tap to open chat"}
                                  </p>

                                </div>
                              </div>
                            ))}
                          </div>
                        </div>}


                        <div className="flex-1 flex flex-col">
                          {activeGroup && !selectedArticle && (
                            <GroupChatBox
                              groupId={activeGroup}
                              onClose={() => {
                                setActiveGroup(null)
                                setchathide(false)
                              }}


                              onStatusTextUpdate={(status, groupId) => {
                                // ✅ Always update the status no matter sender/viewer
                                setLastSeenStatusMap((prev) => ({
                                  ...prev,
                                  [groupId]: status,
                                }))

                              }}
                              onNewMessage={(groupId, timestamp) => {
                                setTimeout(() => {
                                  bumpGroupToTop(groupId, timestamp);
                                }, 0);
                              }}
                            />
                          )
                          }
                        </div>


                        {showCreateGroup && !activeGroup && !selectedArticle && (
                          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                            <GroupCreate
                              onGroupCreated={handleGroupCreated}
                              searchTerm={searchTerm}
                              setSearchTerm={setSearchTerm}
                              onClose={() => setShowCreateGroup(false)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>




              </>
            )}
            {activeSection === "Bookmarks" && <Bookmarks />}
            {/* {activeSection === "Community" && (<>




            </>
            )} */}

            {activeSection === "ProfileComponent" && (
              <ProfileComponent
                userrealname={data?.profile?.displayName}
                username={data?.username}
                avatar={data?.profile?.avatar || "https://tse1.mm.bing.net/th?id=OIP.lcdOc6CAIpbvYx3XHfoJ0gHaF3&pid=Api&P=0&h=180"}
                followers={data?.followers}
                following={data?.following}
                createdAt={data?.firstlogincreatedAt}
                email={data?.email}
                location={data?.profile?.location}
                bio={data?.profile?.bio}
              />
            )}

          </div>

          <div className="section section3">


            <div className="three flex-1 bg-black p-4 relative z-10">


              <div className="relative px-4 py-3 ">
                {/* Search Input Container */}
                {activeSection !== "Explore" && <div className="flex searchbar items-center w-full bg-[#1a1a1a] border border-gray-600 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-white transition duration-200">
                  {/* Search Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="white"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
                  </svg>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent outline-none border-none text-white placeholder-gray-400 pl-3 flex-1 text-sm sm:text-base"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>}


              </div>


              {query && (

                <div className="searchbox text-white two absolute z-50 bg-black px-4 py-4 my-5 mx-6 min-w-full overflow-y-scroll overflow-x-clip break-words align-middle text-lg font-bold flex flex-col justify-start items-start shadow-lg rounded-xl right-4 bottom-3">
                  {loading ? (
                    <p className="text-gray-300">Loading...</p>
                  ) : results.length > 0 ? (
                    results.map((user) => (
                      <div
                        key={uuvid()}
                        className="gmail pale flex items-center space-x-2 w-full gap-4 border-b border-gray-500 pb-2 m-[2px] px-[4px] py-[6px] hover:bg-zinc-800 cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <img0k
                          src={user.profile?.avatar || "/default.png"}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-semibold">{user.username}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No results found.</p>
                  )}
                </div>

              )}

              <div className="relevant two w-[80%] h-max[400px] border relative overflow-y-scroll z-20 border-gray-600 my-9 p-4 rounded-2xl bg-[#121212]">
                <h2 className="text-white font-extrabold text-xl mb-4">Relevant People</h2>
{/* 1100-1550 tak ka responsive theek karna */}
                <RelevantPeople email={email} followers={data?.followers?.count} following={data?.following?.count} setSelectedUser={setSelectedUser} />
              </div>





              <WhatsHappening onArticleSelect={handleArticleClick} />


            </div>
          </div>



        </div>
      </div>

      {showpostbutton && (
        <Postbutton
          showpostbutton={showpostbutton}
          setshowpostbutton={setshowpostbutton}
          username={username}
          userrealname={userrealname}
          avatar={avatar}
          email={email}
        />
      )}

    </>
  );
}












