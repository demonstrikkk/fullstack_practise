import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";

export const dynamic = "force-dynamic"; // makes the whole app dynamic
export const revalidate = 0;
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { createBrowserClient } from "@supabase/ssr";
// import './globals.css';

// export default function RootLayout({ children }) {
//   const [supabase] = useState(() =>
//     createBrowserClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//     )
//   );

//   const [session, setSession] = useState(null);

//   // Subscribe to auth state
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => subscription.unsubscribe();
//   }, [supabase]);


//   return (
//     <html lang="en">
//       <body>
     
//         {children}
//       </body>
//     </html>
//   );
// }

