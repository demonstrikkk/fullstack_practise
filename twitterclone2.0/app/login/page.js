"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// import { useLoading } from "../context/LoadingContext/page";
export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
//  const { setIsAppLoading } = useLoading();
  // useEffect(() => {
  //   if (status === "loading") return;

  //   if (session) {
  //       setIsAppLoading(true)
  //   (async () => {
  //     try {
  //         const res = await fetch(`/api/users/verify?email=${encodeURIComponent(session.user.email)}`);
  //         const result = await res.json();
  //         if (res.ok && result.success && result.user) {
  //           router.push("/sidebar");
  //         } else {
  //           router.push("/userdetailvialogin");
  //         }
  //       } catch {
  //         router.push("/userdetailvialogin");
  //       }finally{ setIsAppLoading(false)}
  //     })();
  //   }
  // }, [session, status, router]);


// useEffect(() => {
//   if (status === "loading") return;

//   const checkUser = async () => {
//     try {
//       if (session) {
//         // setIsAppLoading(true);
//         const res = await fetch(`/api/users/verify?email=${encodeURIComponent(session.user.email)}`);
//         const result = await res.json();
//         if (res.ok && result.success && result.user) {
//           router.push("/sidebar");
//         } else {
//           router.push("/userdetailvialogin");
//         }
//       }
//     } catch {
//       router.push("/userdetailvialogin");
//     } finally {
//       // setIsAppLoading(false); // ✅ always stop loader
//     }
//   };

//   checkUser();
// }, [session, status, router]);


useEffect(() => {
  if (status === "loading" || !session?.user?.email) return;

  const checkUser = async () => {
    try {
      const email = encodeURIComponent(session.user.email);
      console.log("Verifying user:", email);

      const res = await fetch(`/api/users/verify?email=${email}`);
      const result = await res.json();
      console.log("Verify result:", result);

      if (res.ok && result.success && result.user?.verified) {
        router.push("/sidebar");
      } else {
        router.push("/userdetailvialogin");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      router.push("/userdetailvialogin");
    }
  };

  checkUser();
}, [session, status, router]);



  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black via-slate-800 to-black">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
   <div className="relative h-screen w-full bg-gradient-to-br from-black via-slate-800 to-black flex items-center justify-center overflow-hidden">
      {/* Floating lights / animated background effect */}
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

      {/* Login Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl p-10 w-[100%] h-1/2 max-w-md flex flex-col items-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 tracking-wide">Welcome Back</h1>
        <p className="text-gray-300 mb-6">Sign in to access your world</p>

        {/* OAuth Buttons */}
                <div className="flex loginbutton  gap-4 ">
           <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("github", { callbackUrl: "/useme" })}
            className="bg-[#24292F] loginbutton hover:bg-[#1f1f1f] text-white py-3 rounded-lg flex items-center justify-center gap-3 text-sm font-medium shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {/* <path d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477..." /> */}
               <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>

            </svg>
            Sign in with GitHub
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("google", { callbackUrl: "/useme" })}
            className="bg-[#4285F4] loginbutton hover:bg-[#3367D6] text-white py-3 rounded-lg flex items-center justify-center gap-3 text-sm font-medium shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 18 19">
              {/* <path d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948..." /> */}
               <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd"/>

            </svg>
            Sign in with Google
          </motion.button>
        </div>

        {/* Divider */}
        <div className="text-gray-400 text-sm mt-6 mb-3">or continue with username</div>

        {/* Manual Login Inputs */}
        <div className="w-full space-y-4 justify-center flex flex-col items-center gap-y-3">
          <input
            type="text"
            placeholder="Enter your username"
            className="p-3 rounded-lg bg-white/10 createsubmitpollo text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="p-3 rounded-lg bg-white/10 createsubmitpollo text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="bg-blue-500 text-white submitbutton font-semibold py-2 rounded-lg w-1/2 hover:bg-blue-600 transition"
          >
            Submit
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}


