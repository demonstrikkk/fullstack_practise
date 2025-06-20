// 'use client';
// import { useState } from 'react';
// import Image from 'next/image';

// const NotificationsPage = () => {
//   const [activeTab, setActiveTab] = useState('all');
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       type: 'like',
//       user: {
//         name: 'John Doe',
//         handle: '@johndoe',
//         avatar:  'globe.svg'
//       },
//       message: 'liked your post',
//       timestamp: new Date(Date.now() - 3600000),
//       postPreview: 'Just shipped a new feature! 🚀',
//     },
//     {
//       id: 2,
//       type: 'retweet',
//       user: {
//         name: 'Jane Smith',
//         handle: '@janesmith',
//         avatar:  'globe.svg'
//       },
//       timestamp: new Date(Date.now() - 7200000),
//       postPreview: 'The future of web development looks bright!',
//     },
//     {
//       id: 3,
//       type: 'follow',
//       user: {
//         name: 'Mike Johnson',
//         handle: '@mikej',
//         avatar:  'globe.svg'
//       },
//       timestamp: new Date(Date.now() - 86400000),
//     },
//   ]);

//   const getTimeAgo = (date) => {
//     const hours = Math.floor((Date.now() - date) / 3600000);
//     if (hours < 24) return `${hours}h`;
//     const days = Math.floor(hours / 24);
//     return `${days}d`;
//   };

//   return (
//     <div className=" mx-auto min-h-max bg-black text-white ">
//       {/* Header */}
//       <div className="sticky top-0 bg-black bg-opacity-90 backdrop-blur-sm z-10">
//         <div className="p-4">
//           <h1 className="text-xl font-bold">Notifications</h1>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-800">
//           <button
//             onClick={() => setActiveTab('all')}
//             className={`flex-1 p-4 font-medium  ${
//               activeTab === 'all' 
//                 ? 'border-b-4 border-blue-500 text-blue-500'
//                 : 'text-gray-500 hover:bg-gray-900'
//             }`}
//           >
//             All
//           </button>
//           <button
//             onClick={() => setActiveTab('mentions')}
//             className={`flex-1 p-4 font-medium ${
//               activeTab === 'mentions'
//                 ? 'border-b-4 border-blue-500 text-blue-500'
//                 : 'text-gray-500 hover:bg-gray-900'
//             }`}
//           >
//             Mentions
//           </button>
//         </div>
//       </div>

//       {/* Notifications List */}
//       <div className="divide-y divide-gray-800 my-3  ">
//         {notifications.map((notification) => (
//           <div key={notification.id} className="p-4 hover:bg-gray-900 transition-colors py-6">
//             <div className="flex gap-3 my-3 ">
//               {/* Icon */}
//               <div className="flex-shrink-0 my-3">
//                 {notification.type === 'like' && (
//                   <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
//                     ❤️
//                   </div>
//                 )}
//                 {notification.type === 'retweet' && (
//                   <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
//                     🔁
//                   </div>
//                 )}
//                 {notification.type === 'follow' && (
//                   <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
//                     ➕
//                   </div>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="flex-1">
//                 <div className="flex items-center gap-2">
//                   <Image
//                     src={notification.user.avatar}
//                     alt={notification.user.name}
//                     width={40}
//                     height={40}
//                     className="rounded-full w-10 h-10"
//                   />
//                   <div>
//                     <span className="font-bold">{notification.user.name}</span>
//                     <span className="text-gray-500 ml-2">{notification.user.handle}</span>
//                   </div>
//                   <span className="text-gray-500 ml-auto">
//                     {getTimeAgo(notification.timestamp)}
//                   </span>
//                 </div>

//                 <div className="mt-2">
//                   {notification.message && (
//                     <p className="text-gray-300">
//                       {notification.message}
//                     </p>
//                   )}
//                   {notification.postPreview && (
//                     <div className="mt-2 p-3 bg-gray-800 rounded-lg">
//                       <p className="text-gray-300">{notification.postPreview}</p>
//                     </div>
//                   )}
//                   {notification.type === 'follow' && (
//                     <button className="mt-2 px-4 py-2 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
//                       Follow
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Show More Button */}
//       <div className="p-4 text-center">
//         <button className="text-blue-500 hover:bg-blue-500/10 px-4 py-2 rounded-full transition-colors">
//           Show more
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;





"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Bell, MessageCircle, Heart, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PostPopup from "../component/PostPopup"; // adjust path as needed
import OtherProfileComponent from "../Otherprofile/page";

const iconMap = {
  like: <Heart className="text-pink-500 w-5 h-5" />,
  follow: <UserPlus className="text-blue-500 w-5 h-5" />,
  comment: <MessageCircle className="text-green-500 w-5 h-5" />,
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
    } else if (notif.type === "like" || notif.type === "comment") {
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
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  return (
    <main className="m-2">
      <NotificationPanel userEmail={userEmail} />
    </main>
  );
}









// "use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Loader2, Bell, MessageCircle, Heart, UserPlus } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// const iconMap = {
//   like: <Heart className="text-pink-500 w-5 h-5" />,
//   follow: <UserPlus className="text-blue-500 w-5 h-5" />,
//   comment: <MessageCircle className="text-green-500 w-5 h-5" />,
// };


// function handleNotificationClick(notif) {
//   const router = useRouter();
//   if (notif.type === "follow") {
//     // Redirect to the user's profile page
//     router.push(`/profile/${notif.fromUserEmail}`);
//   } else if (notif.type === "like" || notif.type === "comment") {
//     // Open post modal (you can also set a state to render a popup)
//     setSelectedPostId(notif.postId); // you’ll handle modal logic below
//     setShowPostModal(true);
//   }
// }



// export function NotificationPanel({ userEmail }) {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showPostModal, setShowPostModal] = useState(false);
// const [selectedPostId, setSelectedPostId] = useState(null);


//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const res = await fetch(`/api/notifications?userEmail=${userEmail}`);
//         const data = await res.json();
//         setNotifications(data.notifications || []);
//       } catch (err) {
//         console.error("Failed to fetch notifications:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (userEmail) {
//       fetchNotifications();
//     }
//   }, [userEmail]);

//   if (!userEmail) return null;
  
//   return (
//     <>
//     <div className="w-full max-h-full max-w-md p-4 bg-[#121212] rounded-xl shadow-lg text-white border border-gray-700 trick">
//       <div className="flex items-center gap-2 mb-4" style={{ display: 'flex', flexDirection: 'row', gap: '0.3rem' }}>
//         <Bell className="text-yellow-500" />
//         <h2 className="text-lg font-bold">Notifications</h2>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-6">
//           <Loader2 className="animate-spin text-gray-400" />
//         </div>
//       ) : notifications.length === 0 ? (
//         <p className="text-sm text-gray-400 text-center">No notifications yet</p>
//       ) : (
//         <ul className="space-y-3 overflow-y-scroll two  pr-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
//           {notifications.map((notif) => (
//             <li
//               key={notif._id}
//               className="flex items-start gap-3 bg-[#1e1e1e] rounded-lg p-3 border border-gray-600 hover:bg-[#2a2a2a] transition"
//               style={{ height: '5rem' }}
//             >
//               <Image
//                 src={notif.fromAvatar || "/default-avatar.png"}
//                 width={36}
//                 height={36}
//                 alt="avatar"
//                 className="rounded-full object-cover"
//               />
//               <div className="flex-1 ">
//                 <div className="flex items-center gap-2">
//                   {iconMap[notif.type]}
//                   <span className="font-semibold">{notif.fromUsername}</span>
//                 </div>
//                 <p className="text-sm mt-1 text-gray-300">
//                   {notif.type === "like" && "liked your post"}
//                   {notif.type === "follow" && "started following you"}
//                   {notif.type === "comment" && "commented on your post"}
//                 </p>
                
//                 {notif.postId && (
//                   <a
//                     href={`/post/${notif.postId}`}
//                     className="text-xs text-blue-400 underline mt-1 inline-block"
//                   >
//                     View Post
//                   </a>
//                 )}
//               </div>
//               <span className="text-xs text-gray-500 mt-1">
//                 {new Date(notif.createdAt).toLocaleDateString()}
//               </span>
//             </li>
//             <li
//                   key={notif._id}
//                   className="flex items-start gap-3 bg-[#1e1e1e] rounded-lg p-3 border border-gray-600 hover:bg-[#2a2a2a] transition cursor-pointer"
//                   onClick={() => handleNotificationClick(notif)}
//                 ></li>
//           ))}
//         </ul>
//       )}
//          {showPostModal && selectedPostId && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-[#181818] p-4 rounded-lg w-full max-w-xl relative">
//       <button
//         className="absolute top-2 right-2 text-gray-400 hover:text-white"
//         onClick={() => setShowPostModal(false)}
//       >
//         ✕
//       </button>
//       {/* Fetch and show the post here */}
//       <PostPopup postId={selectedPostId} />
//     </div>
//   </div>
// )}
//     </div>
// </>
//   );
// }
// export default function Notifications() {
//   const { data: session } = useSession();
//   const userEmail = session?.user?.email;

//   return (
//     <>
//       <main className="m-2">
//       </main>

//       <NotificationPanel userEmail={userEmail} />
   

//     </>
//   )
// }