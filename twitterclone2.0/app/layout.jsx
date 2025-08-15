// 'use client';
import './globals.css';
export const dynamic = 'force-dynamic';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <SessionWrapper> */}
      {/* <SessionProvider refetchInterval={300}> */}
        {/* <LoadingProvider> */}
          {children}
          {/* <SplashScreen /> */}
         {/* </LoadingProvider>  */}
  {/* </SessionProvider> */}
        {/* </SessionWrapper> */}
      </body>
    </html>
  );
}

