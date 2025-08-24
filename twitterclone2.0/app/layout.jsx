// // 'use client';
// import './globals.css';
// import { SessionProvider } from 'next-auth/react';
// import SessionWrapper from './component/SessionWrapper.jsx';

// export const dynamic = 'force-dynamic';
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <SessionWrapper>
//       <SessionProvider refetchInterval={300}>
//         {/* <LoadingProvider> */}
//           {children}
//           {/* <SplashScreen /> */}
//          {/* </LoadingProvider>  */}
//   </SessionProvider>
//         </SessionWrapper>
//       </body>
//     </html>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function RootLayout({ children }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  const [session, setSession] = useState(null);

  // Subscribe to auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);


  return (
    <html lang="en">
      <body>
        <header >

        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}