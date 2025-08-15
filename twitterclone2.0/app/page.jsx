

// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "./api/lib/supabaseClient";
// import './globals.css';

// export default function HomePage() {
//   const router = useRouter();
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     // Fetch the session on mount
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     // Also subscribe to auth state changes (optional, for realtime updates)
//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     // Cleanup subscription on unmount
//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);

//   useEffect(() => {
//     if (session === null) return; // still loading session

//     if (!session) {
//       router.push("/login");
//     } else {
//       router.push("/sidebar");
//     }
//   }, [session, router]);

//   return null; // or add a loading spinner here if you want
// }
// "use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./api/lib/supabaseClient";
import './globals.css';
export const dynamic = 'force-dynamic';
export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined for loading state

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session === undefined) return; // still loading
    if (!session) {
      router.push("/login");
    } else {
      router.push("/sidebar");
    }
  }, [session, router]);

  if (session === undefined) {
    return <div>Loading...</div>;
  }
  return null;
}
