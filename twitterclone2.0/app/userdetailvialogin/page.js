// "use client";

// import React, { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// const UserDetailsViaLogin = () => {
//   const { data: session } = useSession();
//   const [userDetails, setUserDetails] = useState({
//     username: '',
//     password: '',
//     bio: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     if (session) {
//       setUserDetails({
//         username: '',
//         password: '',
//         bio: '',
      
//       });
//     }
//   }, [session]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const res = await fetch('/api/users/create-user', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: session.user.email,
//           name: session.user.name,
//           image: session.user.image,
//           username: userDetails.username,
//           password: userDetails.password,
//           bio: userDetails.bio,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to save user');

//       router.push('/sidebar');
//     } catch (error) {
//       console.error('Error saving user details:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
//           Set Your Username and Password
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="text"
//             placeholder="Enter your username"
//             value={userDetails.username}
//             onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
//             className="w-full p-3 border rounded-lg bg-white text-gray-800"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={userDetails.password}
//             onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
//             className="w-full p-3 border rounded-lg bg-white text-gray-800"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Enter about yourself (optional bio)"
//             value={userDetails.bio}
//             onChange={(e) => setUserDetails({ ...userDetails, bio: e.target.value })}
//             className="w-full p-3 border rounded-lg bg-white text-gray-800"
//           />
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-800 transition-colors"
//           >
//             {isSubmitting ? 'Saving...' : 'Save'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserDetailsViaLogin;


'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const UserDetailsViaLogin = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: '',
    bio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserExists = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/users/verify?email=${encodeURIComponent(session.user.email)}`);
        const data = await res.json();

        if (res.ok && data.userExists && data.verified === true) {
          router.push('/sidebar');
          return;
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserExists();
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/users/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          username: userDetails.username,
          password: userDetails.password,
          bio: userDetails.bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save user');
      router.push('/sidebar');
    } catch (error) {
      console.error('Error saving user details:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 text-white font-semibold">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="backdrop-blur-lg bg-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-3xl p-10 w-full max-w-md border border-white/20"
      >
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-3xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-8"
        >
          🎉 Welcome! Let's Complete Your Journey
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              value={session?.user?.name || ''}
              disabled
              className="w-full mt-1 px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg text-white cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="text"
              value={session?.user?.email || ''}
              disabled
              className="w-full mt-1 px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg text-white cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Username</label>
            <input
              type="text"
              placeholder="Choose a unique username"
              value={userDetails.username}
              onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
              className="w-full mt-1 px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={userDetails.password}
              onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
              className="w-full mt-1 px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Bio (optional)</label>
            <textarea
              placeholder="Tell us a little about yourself..."
              value={userDetails.bio}
              onChange={(e) => setUserDetails({ ...userDetails, bio: e.target.value })}
              className="w-full mt-1 px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              rows={3}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 text-white font-bold rounded-xl shadow-xl hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isSubmitting ? 'Saving...' : '🚀 Save & Continue'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default UserDetailsViaLogin;




// "use client";

// import React, { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// const UserDetailsViaLogin = () => {
//   const { data: session } = useSession();
//   const [userDetails, setUserDetails] = useState({
//     username: '',
//     password: '',
//     bio: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const checkUserExists = async () => {
//       if (!session?.user?.email) return;

//       try {
//         const res = await fetch(`/api/users/verify?email=${encodeURIComponent(session.user.email)}`);
//         const data = await res.json();

//         if (res.ok && data.userExists && data.verified === true) {
//           router.push('/sidebar');
//           return;
//         }
//       } catch (error) {
//         console.error("Error checking existing user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUserExists();
//   }, [session, router]);
  
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const res = await fetch('/api/users/create-user', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: session.user.email,
//           name: session.user.name,
//           image: session.user.image,
//           username: userDetails.username,
//           password: userDetails.password,
//           bio: userDetails.bio,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to save user');

//       router.push('/sidebar');
//     } catch (error) {
//       console.error('Error saving user details:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) return null; // avoids flicker while fetching

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
//           Set Your Username and Password
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="text"
//             placeholder="Enter your username"
//             value={userDetails.username}
//             onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
//             className="w-full p-3 border rounded-lg bg-white text-gray-800"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={userDetails.password}
//             onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
//             className="w-full p-3 border rounded-lg bg-white text-gray-800"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Enter about yourself (optional bio)"
//             value={userDetails.bio}
//             onChange={(e) => setUserDetails({ ...userDetails, bio: e.target.value })}
//             className="w-full p-3 border rounded-lg bg-white text-gray-800"
//           />
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-800 transition-colors"
//           >
//             {isSubmitting ? 'Saving...' : 'Save'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserDetailsViaLogin;
