// app/components/SplashScreen.jsx
"use client";

import { useLoading } from "../context/LoadingContext/page";

export default function SplashScreen() {
  const { isAppLoading } = useLoading();

  if (!isAppLoading) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999] animate-fade-in">
      <h1 className="text-white text-2xl font-bold">Loading your world...</h1>
    </div>
  );
}
