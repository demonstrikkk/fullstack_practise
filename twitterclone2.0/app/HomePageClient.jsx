"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./api/lib/supabaseClientbrowser";

export default function HomePageClient() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = loading
  const [loadingMessage, setLoadingMessage] = useState("Loading session...");

  useEffect(() => {
    async function loadSession() {
      try {
        // Get session from Supabase
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("Supabase getSession error:", error);

        if (!data?.session) {
          console.warn("No session found");
        } else {
          console.log("Session found:", data.session);
        }

        setSession(data?.session ?? null);
      } catch (err) {
        console.error("Exception in getSession:", err);
        setSession(null);
      }
    }

    loadSession();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === undefined) return; // still loading

    if (!session) {
      setLoadingMessage("No session found, redirecting to login...");
      router.replace("/login");
    } else {
      setLoadingMessage("Session found, redirecting to sidebar...");
      router.replace("/sidebar");
    }
  }, [session, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div>{loadingMessage}</div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}




// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "./api/lib/supabaseClientbrowser";

// export default function HomePageClient() {
//   const router = useRouter();
//   const [session, setSession] = useState(undefined); // undefined = loading

//   useEffect(() => {
//     async function loadSession() {
//       try {
//         const { data, error } = await supabase.auth.getSession();
//         if (error) console.error("Supabase error:", error);
//         setSession(data?.session ?? null);
//       } catch (err) {
//         console.error("Exception in getSession:", err);
//         setSession(null);
//       }
//     }
//     loadSession();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       console.log("Auth state change:", _event, session);
//       setSession(session);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (session === undefined) return; // still loading
//     if (!session) {
//       router.replace("/login");
//     } else {
//       router.replace("/sidebar");
//     }
//   }, [session, router]);

//   return (
//     <div className="flex h-screen items-center justify-center bg-black text-white">
//       Loading...
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "./api/lib/supabaseClient";

// export default function HomePageClient() {
//   const router = useRouter();
//   const [session, setSession] = useState(undefined); // undefined = loading

//   useEffect(() => {
//     async function loadSession() {
//       try {
//         const { data, error } = await supabase.auth.getSession();
//         console.log("getSession result:", data, "error:", error);
//         setSession(data?.session ?? null);
//       } catch (err) {
//         console.error("Exception in getSession:", err);
//         setSession(null);
//       }
//     }
//     loadSession();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       console.log("Auth state change:", event, session);
//       setSession(session);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     console.log("Session state changed:", session);
//     if (session === undefined) return;
//     if (!session) {
//       console.log("Redirecting to /login");
//       router.replace("/login");
//     } else {
//       console.log("Redirecting to /sidebar");
//       router.replace("/sidebar");
//     }
//   }, [session, router]);

//   return (
//     <div className="flex h-screen items-center justify-center bg-black text-white">
//       loading....
//     </div>
//   );
// }
// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import { useRouter } from "next/navigation";
// // // import { supabase } from "./api/lib/supabaseClient";

// // // export default function HomePageClient() {
// // //   const router = useRouter();
// // //   const [session, setSession] = useState(undefined); // undefined = loading

// // //   useEffect(() => {
// // //     // Get initial session
// // //     supabase.auth.getSession().then(({ data: { session } }) => {
// // //       setSession(session);
// // //     });

// // //     // Listen for auth changes
// // //     const {
// // //       data: { subscription },
// // //     } = supabase.auth.onAuthStateChange((_event, session) => {
// // //       setSession(session);
// // //     });

// // //     return () => subscription.unsubscribe();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (session === undefined) return; // still loading
// // //     if (!session) {
// // //       router.replace("/login");
// // //     } else {
// // //       router.replace("/sidebar");
// // //     }
// // //   }, [session, router]);

// // //   return (
// // //     <div className="flex h-screen items-center justify-center bg-black text-white">
// // //       Loading...
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { supabase } from "./api/lib/supabaseClient";

// // export default function HomePageClient() {
// //   const router = useRouter();
// //   console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
// // console.log("Supabase key length:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
// // const [session, setSession] = useState(undefined);  // undefined = loading, null = no session, object = logged in

// //   useEffect(() => {
// //     async function loadSession() {
// //       try {
// //         const { data, error } = await supabase.auth.getSession();
// //         if (error) {
// //           console.error("Error fetching Supabase session:", error);
// //         }
// //         setSession(data?.session ?? null);
// //       } catch (err) {
// //         console.error("Exception in getSession:", err);
// //         setSession(null);
// //       }
// //     }
// //     loadSession();

// //     // Listen for auth changes
// //     const {
// //       data: { subscription },
// //     } = supabase.auth.onAuthStateChange((_event, session) => {
// //       console.log("Auth state change:", session ? "Logged in" : "Logged out");
// //       setSession(session);
// //     });

// //     return () => subscription.unsubscribe();
// //   }, []);


// // useEffect(() => {
// //   const timer = setTimeout(() => {
// //     if (session === undefined) {
// //       console.warn("Session fetch timed out, redirecting to /login");
// //       setSession(null);
// //     }
// //   }, 1500); // 3s fallback
// //   return () => clearTimeout(timer);
// // }, [session]);


// //   useEffect(() => {
// //     if (session === undefined) return; // still loading
// //     if (!session) {
// //       console.log("No session, redirecting to /login");
// //       router.replace("/login");
// //     } else {
// //       console.log("Session found, redirecting to /sidebar");
// //       router.replace("/sidebar");
// //     }
// //   }, [session, router]);

// //   return (
// //     <div className="flex h-screen items-center justify-center bg-black text-white">
// //       loading....
// //     </div>
// //   );
// // }



