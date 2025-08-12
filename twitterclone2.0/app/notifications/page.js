





"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Bell, MessageCircle, Heart, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PostPopup from "../component/PostPopup"; // adjust path as needed
import OtherProfileComponent from "../Otherprofile/page";
import { supabase } from "../api/lib/supabaseClient";
const iconMap = {
  like: <Heart className="text-pink-500 w-5 h-5" />,
  follow: <UserPlus className="text-blue-500 w-5 h-5" />,
  comment: <MessageCircle className="text-green-500 w-5 h-5" />,
  retweet:  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={15} height={15} color={"#ffffff"} fill={"white"}>
                          <g>
                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z">
                              </path>
                              </g>
                              </svg>
};


async function fetchUserProfile(email) {
  try {
    const res = await fetch(`/api/userprofile?email=${email}`);
    const data = await res.json();
    return data.profile;
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    return null;
  }
}


export function NotificationPanel({ userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(`/api/notifications?userEmail=${userEmail}`);
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail]);

  

  async function handleNotificationClick(notif) {
  try {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      body: JSON.stringify({ notificationId: notif._id }),
    });

    if (notif.type === "follow") {
      const res = await fetch(`/api/userprofile?email=${notif.fromUserEmail}`);
      const { profile } = await res.json();

      if (profile) {
        setSelectedUser(profile); // pass full profile object
      }
    } else if (notif.type === "like" || notif.type === "comment" || notif.type === "retweet") {
      setSelectedPostId(notif.postId);
      setShowPostModal(true);
    }
  } catch (error) {
    console.error("Error handling notification click:", error);
  }
}






  if (!userEmail) return null;

  return (
    <>
    {selectedUser && (
      
          <div className="bg-black text-white min-h-screen p-4 relative">

   <div className="z-40 relative">
      <OtherProfileComponent
        userrealname={selectedUser?.profile?.displayName}
        username={selectedUser?.username}
        avatar={selectedUser?.profile?.avatar}
        followers={selectedUser?.followers?.count}
        following={selectedUser?.following?.count}
        createdAt={selectedUser?.firstlogincreatedAt}
        email={selectedUser?.email}
        bio={selectedUser?.profile?.bio}
        onClose={() => setSelectedUser(null)}
      />
    </div>
   </div>
)}

      <div className="w-full max-h-full max-w-md p-4 bg-[#121212] rounded-xl shadow-lg text-white border border-gray-700 trick">
        <div className="flex items-center gap-2 mb-4" style={{ display: 'flex', flexDirection: 'row', gap: '0.3rem' }}>
          <Bell className="text-yellow-500" />
          <h2 className="text-lg font-bold">Notifications</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">No notifications yet</p>
        ) : (
          <ul className="space-y-3 overflow-y-scroll max-h-[400px] pr-1 two " style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className="flex items-start gap-3 bg-[#1e1e1e] rounded-lg p-3 border border-gray-600 hover:bg-[#2a2a2a] transition cursor-pointer"
                 style={{ height: '5rem' }}
                onClick={() => handleNotificationClick(notif)}
              >
                <Image
                  src={notif.fromAvatar || "/default-avatar.png"}
                  width={36}
                  height={36}
                  alt="avatar"
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {iconMap[notif.type]}
                    <span className="font-semibold">{notif.fromUsername}</span>
                  </div>
                  <p className="text-sm mt-1 text-gray-300">
                    {notif.type === "like" && "liked your post"}
                    {notif.type === "follow" && "started following you"}
                    {notif.type === "comment" && "commented on your post"}
                    {notif.type === "retweet" && "retweeted your post"}
                  </p>
                  {notif.postPreview && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{notif.postPreview}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Modal to show post */}
        {showPostModal && selectedPostId && (
          <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm  flex items-center justify-center z-50">
            <div className="bg-[#181818] p-4 rounded-lg w-full max-w-xl relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => setShowPostModal(false)}
              >
                ✕
              </button>
              <PostPopup postId={selectedPostId} />
            </div>
          </div>
        )}




      </div>
    </>
  );
}

export default function Notifications() {
  // const { data: session } = useSession();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Fetch the session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Also subscribe to auth state changes (optional, for realtime updates)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);  
  const userEmail = session?.user?.email;

  return (
    <main className="m-2">
      <NotificationPanel userEmail={userEmail} />
    </main>
  );
}







