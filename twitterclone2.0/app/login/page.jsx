



// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { supabase } from "../api/lib/supabaseClient";

// export default function LoginPage() {
//   const router = useRouter();

//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Load session on mount and subscribe to auth changes
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setLoading(false);
//     });

//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       setLoading(false);
//     });

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);

//   // After session is loaded and user logged in, verify user and redirect
//   useEffect(() => {
//     if (loading) return;
//     if (!session) return;

//     async function verifyOAuthUser() {
//       try {
//         const email = encodeURIComponent(session.user.email);
//         const res = await fetch(`/api/users/verify?email=${email}`);
//         const data = await res.json();

//         if (res.ok && data.success) {
//           if (data.verified) {
//             router.push("/sidebar");
//           } else {
//             router.push("/userdetailvialogin");
//           }
//         } else {
//           router.push("/userdetailvialogin");
//         }
//       } catch (err) {
//         console.error("OAuth verification failed:", err);
//         router.push("/userdetailvialogin");
//       }
//     }

//     verifyOAuthUser();
//   }, [session, loading, router]);

//   async function handleOAuthLogin(provider) {
//     setError("");
//     const { error } = await supabase.auth.signInWithOAuth({ provider });
//     if (error) setError(error.message);
//     // User is redirected automatically to provider login page
//   }

//   const handleCredentialsLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: credentials.email,
//         password: credentials.password,
//       });

//       if (error) throw error;

//       if (data.session) {
//         router.push("/sidebar");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black via-slate-800 to-black">
//         <p className="text-white text-lg">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative h-screen w-full bg-gradient-to-br from-black via-slate-800 to-black flex items-center justify-center overflow-hidden">
//       {/* Background animations */}
//       <motion.div
//         className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600 opacity-30 blur-3xl"
//         animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.35, 0.25] }}
//         transition={{ duration: 6, repeat: Infinity }}
//       />
//       <motion.div
//         className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-blue-500 opacity-30 blur-2xl"
//         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
//         transition={{ duration: 7, repeat: Infinity }}
//       />

//       {/* Login box */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl p-10 w-full max-w-md flex flex-col items-center"
//       >
//         <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
//         <p className="text-gray-300 mb-6">Sign in to access your world</p>

//         {/* OAuth buttons */}
//         <div className="flex gap-4 w-full mb-6">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.97 }}
//             onClick={() => handleOAuthLogin("github")}
//             className="flex-1 bg-[#24292F] size8  text-white py-3 rounded-lg flex items-center justify-center gap-3"
//           >
//             {/* GitHub icon */}
//             <svg
//               className="w-4 h-4"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             GitHub
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.97 }}
//             onClick={() => handleOAuthLogin("google")}
//             className="flex-1 bg-[#4285F4] size8  text-white py-3 rounded-lg flex items-center justify-center gap-3"
//           >
//             {/* Google icon */}
//             <svg
//               className="w-4 h-4"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 18 19"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Google
//           </motion.button>
//         </div>

//         {/* <div className="text-gray-400 text-sm mb-6">or continue with email</div>

//         <form onSubmit={handleCredentialsLogin} className="w-full space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={credentials.email}
//             onChange={(e) =>
//               setCredentials((prev) => ({ ...prev, email: e.target.value }))
//             }
//             className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 size8 space10"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={credentials.password}
//             onChange={(e) =>
//               setCredentials((prev) => ({ ...prev, password: e.target.value }))
//             }
//             className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 size8 space10"
//             required
//           />

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <motion.button
//             type="submit"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.97 }}
//             disabled={isLoading}
//             className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition size8 space20"
//           >
//             {isLoading ? "Signing in..." : "Sign in"}
//           </motion.button>
//         </form> */}
//       </motion.div>
//     </div>
//   );
// }





"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../api/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authInProgress, setAuthInProgress] = useState(false);

  // Initialize authentication and handle session
  useEffect(() => {
    async function initializeAuth() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        console.log("Session state:", session ? "Active" : "No session");
        setSession(session);
        
        if (session) {
          await handleExistingSession(session);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError(`Authentication initialization failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      
      if (session) {
        await handleExistingSession(session);
      }
    });

    initializeAuth();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  // Handle existing session verification and routing
  async function handleExistingSession(session) {
    try {
      if (!session?.user?.email) return;
      
      setAuthInProgress(true);
      const email = encodeURIComponent(session.user.email);
      const res = await fetch(`/api/users/verify?email=${email}`);
      const data = await res.json();

      console.log("Verification response:", data);

      if (res.ok && data.success) {
        if (data.userExists && data.verified) {
          // Existing verified user - go to sidebar
          router.push("/sidebar");
        } else {
          // New user or unverified - go to user details
          router.push("/userdetailvialogin");
        }
      } else {
        // Error or no user - go to user details
        router.push("/userdetailvialogin");
      }
    } catch (err) {
      console.error("Session verification failed:", err);
      setError("Failed to verify user status. Please try again.");
      router.push("/userdetailvialogin");
    } finally {
      setAuthInProgress(false);
    }
  }

  // Handle OAuth login
  async function handleOAuthLogin(provider) {
    try {
      setError("");
      setAuthInProgress(true);
      
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) throw error;
    } catch (err) {
      console.error(`${provider} login failed:`, err);
      setError(`${provider} login failed: ${err.message}`);
      setAuthInProgress(false);
    }
  }

  // Loading state
  if (loading || authInProgress) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-br from-black via-slate-800 to-black">
        <div className="animate-pulse text-white text-lg mb-4">
          {loading ? "Initializing..." : "Authenticating..."}
        </div>
        {error && (
          <p className="text-red-500 text-sm max-w-md text-center px-4">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Main login UI
  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-black via-slate-800 to-black flex items-center justify-center overflow-hidden">
      {/* Background animations */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600 opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>

      {/* Login box */}
      <div
        className="z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl p-10 w-full max-w-md flex flex-col items-center"
      > 
        <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
        <p className="text-gray-300 mb-6">Sign in to access your world</p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* OAuth buttons */}
        <div className="flex gap-4 w-full mb-6">
          <button
            onClick={() => handleOAuthLogin("github")}
            disabled={authInProgress}
            className="flex-1 size8 bg-[#24292F] hover:bg-[#1a1f24] text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50 active:scale-95"
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
          </button>
          
          <button
            onClick={() => handleOAuthLogin("google")}
            disabled={authInProgress}
            className="flex-1 size8 bg-[#4285F4] hover:bg-[#3367D6] text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50 active:scale-95"
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
          </button>
        </div>
      </div>
    </div>
  );
}



