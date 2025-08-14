'use client';
import './globals.css';
// import SessionWrapper from './component/SessionWrapper';

// import { SessionProvider } from 'next-auth/react';
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

