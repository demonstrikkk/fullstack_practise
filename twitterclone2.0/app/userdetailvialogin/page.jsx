

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../api/lib/supabaseClient';
const UserDetailsViaLogin = () => {
  // const { data: session } = useSession();
  const [session, setSession] = useState(null);
  const [hasCheckedUser, setHasCheckedUser] = useState(false); // Prevent multiple checks

  useEffect(() => {
    let isSubscribed = true;
    
    // Fetch the session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isSubscribed) {
        setSession(session);
      }
    });

    // Also subscribe to auth state changes (optional, for realtime updates)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isSubscribed) {
        setSession(session);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      isSubscribed = false;
      authListener.subscription.unsubscribe();
    };
  }, []);
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
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }
    
    if (hasCheckedUser) return; // Prevent multiple checks

    try {
      setHasCheckedUser(true);
      const res = await fetch(`/api/users/verify?email=${encodeURIComponent(session.user.email)}`);
      const data = await res.json();

      console.log('User verification check:', data);

      if (res.ok && data.success && data.userExists && data.verified === true) {
        // User already exists and is verified, redirect to sidebar
        router.replace('/sidebar');
      } else {
        // User doesn't exist or not verified, stay on this page
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
      setLoading(false);
      setHasCheckedUser(false); // Reset on error so user can retry
    }
  };

  if (session) {
    checkUserExists();
  } else {
    setLoading(false);
  }
}, [session, router]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userDetails.username.trim()) {
      alert('Username is required');
      return;
    }
    if (!userDetails.password.trim()) {
      alert('Password is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/users/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.name,
          image: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || session.user.image,
          username: userDetails.username,
          password: userDetails.password,
          bio: userDetails.bio || '',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save user');
      }
      
      console.log('User created successfully:', data);
      router.push('/sidebar');
    } catch (error) {
      console.error('Error saving user details:', error);
      alert(`Failed to save user details: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.replace('/login');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 text-white font-semibold">
      <div className="backdrop-blur-lg bg-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-3xl p-10 w-full max-w-md border border-white/20 animate-fade-in">
        <h2 className="text-3xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-8 animate-slide-in">
          🎉 Welcome! Let&apos;s Complete Your Journey
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              value={session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || session?.user?.name || ''}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 text-white font-bold rounded-xl shadow-xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isSubmitting ? 'Saving...' : '🚀 Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsViaLogin;




// /api/users/verify/route.js
