// app/components/SplashScreen.jsx
"use client";

import { useLoading } from "../context/LoadingContext/page";
import { motion } from "framer-motion";

export default function SplashScreen() {
  const { isAppLoading } = useLoading();

  if (!isAppLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-white text-2xl font-bold">Loading your world...</h1>
    </motion.div>
  );
}
