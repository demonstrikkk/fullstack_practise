import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic"; 
export const revalidate = 0;
export default function HomePage() {
  // return <HomePageClient />;
  try {
    return <HomePageClient />;
  } catch (err) {
    console.error("Error rendering HomePage:", err);
    throw err; // still lets Next.js handle the failure, but logs details
  }
}

// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "./api/lib/supabaseClient";
// import './globals.css';
// export default function HomePage() {
//   const router = useRouter();
//   const [session, setSession] = useState(undefined); // undefined for loading state

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });
//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });
//     return () => {
//       authListener?.subscription?.unsubscribe();
//     };
//   }, []);

//   useEffect(() => {
//     if (session === undefined) return; // still loading
//     if (!session) {
//       router.push("/login");
//     } else {
//       router.push("/sidebar");
//     }
//   }, [session, router]);

//   if (session === undefined) {
//     return <div>Loading...</div>;
//   }
//   return null;
// }



