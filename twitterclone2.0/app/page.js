

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut,signIn,useSession } from "next-auth/react";
import './globals.css';

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
    else{
      router.push('/sidebar')
    }
  }, [router, session]);

  return null; // Or you can add a loading spinner or message if desired
}
