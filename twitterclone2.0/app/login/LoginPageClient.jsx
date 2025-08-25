"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../api/lib/supabaseClientbrowser";

export default function LoginPageClient() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(session);

        if (session) await handleExistingSession(session);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError(`Authentication initialization failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) await handleExistingSession(session);
    });

    initializeAuth();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  async function handleExistingSession(session) {
    try {
      if (!session?.user?.email) return;
      setAuthInProgress(true);

      const email = encodeURIComponent(session.user.email);
      const res = await fetch(`/api/users/verify?email=${email}`);
      const data = await res.json();

      router.push(data.success && data.verified ? "/sidebar" : "/userdetailvialogin");
    } catch (err) {
      console.error("Session verification failed:", err);
      setError("Failed to verify user status. Please try again.");
      router.push("/userdetailvialogin");
    } finally {
      setAuthInProgress(false);
    }
  }

  async function handleOAuthLogin(provider) {
    try {
      setError("");
      setAuthInProgress(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/userdetailvialogin` },
      });

      if (error) throw error;
    } catch (err) {
      console.error(`${provider} login failed:`, err);
      setError(`${provider} login failed: ${err.message}`);
      setAuthInProgress(false);
    }
  }

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-black via-slate-800 to-black flex items-center justify-center overflow-hidden">
      {/* Background animations */} 
    
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600 opacity-30 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.35, 0.25] }}
        transition={{ duration: 6, repeat: Infinity }}
      /> 
      <motion.div
        className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-blue-500 opacity-30 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Login box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl p-10 w-full max-w-md flex flex-col items-center"
      > 
        <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
        <p className="text-gray-300 mb-6">Sign in to access your world</p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* OAuth buttons */}
        <div className="flex gap-4 w-full mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOAuthLogin("github")}
            disabled={authInProgress}
            className="flex-1 size8 bg-[#24292F] hover:bg-[#1a1f24] text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOAuthLogin("google")}
            disabled={authInProgress}
            className="flex-1 size8 bg-[#4285F4] hover:bg-[#3367D6] text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Google
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
