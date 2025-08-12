// "use client";

// import { useState, useEffect } from "react";
// import { useSession, signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { supabase } from "../api/lib/supabaseClient";

// export default function LoginPage() {
//   // const { data: session, status } = useSession();
//     const session = supabase.auth.getSession().then(({data:{session}}) => (session,status));

//   const router = useRouter();

//   const [credentials, setCredentials] = useState({
//     username: "",
//     password: ""
//   });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//    async function handleOAuthLogin(provider) {
//     const { error } = await supabase.auth.signInWithOAuth({ provider });
//     if (error) setError(error.message);
//     // OAuth redirects to provider and back automatically
//   }


//   useEffect(() => {
//     if (status !== "authenticated" || !session?.user?.email) return;

//     const verifyOAuthUser = async () => {
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
//     };

//     verifyOAuthUser();
//   }, [status, session, router]);


//   if (status === "loading") {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black via-slate-800 to-black">
//         <p className="text-white text-lg">Loading...</p>
//       </div>
//     );
//   }

//   const handleCredentialsLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(credentials)
//       });


//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       // Check if the response indicates a new user
//       if (data.redirectTo) {
//         // Redirect to user details page if it's a new user
//         router.push(data.redirectTo);
//       } else {
//         // Proceed with signing in if the user is verified
//         const result = await signIn("credentials", {
//           username: credentials.username,
//           password: credentials.password,
//           redirect: false
//         });

//         if (result?.error) {
//           throw new Error(result.error);
//         }

//         router.push("/sidebar");
//       }
//     } catch (err) {
//       setError(err.message || "Failed to login");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative h-screen w-full bg-gradient-to-br from-black via-slate-800 to-black flex items-center justify-center overflow-hidden">
//       {/* Animated background lights */}
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
//         <div className="flex loginbutton gap-4 w-full">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.97 }}
//             // onClick={() => signIn("github", { callbackUrl: "/userdetailvialogin" })}
//             onClick={() => handleOAuthLogin('github')}
//             className="flex-1 bg-[#24292F] size8 hover:bg-[#1f1f1f] text-white py-3 rounded-lg flex items-center justify-center gap-3"
//           >
//             <svg className="w-4 h-4 me-2" ariaHidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
//             </svg>
//             GitHub
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.97 }}
//             // onClick={() => signIn("google", { callbackUrl: "/userdetailvialogin" })}
//             onClick={() => handleOAuthLogin('google')}
//             className="flex-1 bg-[#4285F4] size8 hover:bg-[#3367D6] text-white py-3 rounded-lg flex items-center justify-center gap-3"
//           >
//             <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
//               <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd"/>
//             </svg>
//             Google
//           </motion.button>
//         </div>

//         <div className="text-gray-400 text-sm my-6">or continue with username</div>

//         {/* Credentials form */}
//         <form onSubmit={handleCredentialsLogin} className="w-full space-y-4">
//           <input
//             type="text"
//             placeholder="Username"
//             value={credentials.username}
//             onChange={(e) =>
//               setCredentials((prev) => ({ ...prev, username: e.target.value }))
//             }
//             className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 size8 space10"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={credentials.password}
//             onChange={(e) =>
//               setCredentials((prev) => ({ ...prev, password: e.target.value }))
//             }
//             className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 size8 space10" 
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
//         </form>
//       </motion.div>
//     </div>
//   );
// }











"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../api/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load session on mount and subscribe to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // After session is loaded and user logged in, verify user and redirect
  useEffect(() => {
    if (loading) return;
    if (!session) return;

    async function verifyOAuthUser() {
      try {
        const email = encodeURIComponent(session.user.email);
        const res = await fetch(`/api/users/verify?email=${email}`);
        const data = await res.json();

        if (res.ok && data.success) {
          if (data.verified) {
            router.push("/sidebar");
          } else {
            router.push("/userdetailvialogin");
          }
        } else {
          router.push("/userdetailvialogin");
        }
      } catch (err) {
        console.error("OAuth verification failed:", err);
        router.push("/userdetailvialogin");
      }
    }

    verifyOAuthUser();
  }, [session, loading, router]);

  async function handleOAuthLogin(provider) {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
    // User is redirected automatically to provider login page
  }

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.session) {
        router.push("/sidebar");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black via-slate-800 to-black">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
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

        {/* OAuth buttons */}
        <div className="flex gap-4 w-full mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOAuthLogin("github")}
            className="flex-1 bg-[#24292F] text-white py-3 rounded-lg flex items-center justify-center gap-3"
          >
            {/* GitHub icon */}
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOAuthLogin("google")}
            className="flex-1 bg-[#4285F4] text-white py-3 rounded-lg flex items-center justify-center gap-3"
          >
            {/* Google icon */}
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 19"
            >
              <path
                fillRule="evenodd"
                d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                clipRule="evenodd"
              />
            </svg>
            Google
          </motion.button>
        </div>

        <div className="text-gray-400 text-sm mb-6">or continue with email</div>

        {/* Email/password form */}
        <form onSubmit={handleCredentialsLogin} className="w-full space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
