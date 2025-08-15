"use client";

import { useState } from "react";

export default function NewsPreferenceModal({ email, onClose }) {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const tags = [ "technology", "politics", "entertainment", "business", "world","books","community","culture","law","money"];



   const toggle = (tag) => {
    setSelected((prev) =>
// -     prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
     prev.includes(tag)
       ? prev.filter((t) => t !== tag)
       : prev.length < 3
         ? [...prev, tag]
         : prev // max 3
    );
  };

  const save = async () => {
    setLoading(true);
    try {
      await fetch("/api/news/savePreferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, preferences: selected }),
      });
      onClose();
    } catch (err) {
      console.error("Error saving preferences", err);
    } finally {
      setLoading(false);
    }
  };

  return (
   

<div className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 two">
  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 relative two">
    
    <h2 className="text-3xl font-extrabold mb-6 text-white text-center drop-shadow-md">
      🧠 Tailor Your Feed
    </h2>
    <p className="text-gray-400 text-sm text-center mb-6 max-w-xs mx-auto">
Select topics you care about. We&apos;ll show you news that matters most ✨    </p>

    <div className="flex flex-wrap gap-3 justify-center max-h-[200px] overflow-y-auto custom-scroll pr-2 mb-8">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggle(tag)}
          className={`capitalize px-5 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ease-in-out
            ${selected.includes(tag)
              ? "bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-800 text-white shadow-lg scale-105"
              : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
            }`}
        >
          {tag}
        </button>
      ))}
    </div>

    <button
      onClick={save}
      disabled={loading || selected.length === 0}
      className="w-full py-3 rounded-xl text-white font-semibold text-lg transition-all duration-300 ease-in-out
        bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md
        disabled:opacity-40 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600"
    >
      {loading ? "Saving Preferences..." : "Save Preferences"}
    </button>

    <div className="absolute bottom-3 right-4 text-xs text-gray-500 italic">
      powered by 📰 Guardian API
    </div>
  </div>
</div>


  );
}
