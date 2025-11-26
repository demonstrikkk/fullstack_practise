

"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import AvatarDropzone from "./AvatarDropzone";
import { supabase } from "../api/lib/supabaseClient";

export default function UpdateProfileForm({ isOpen, onClose, initialData = {}, triggerRefresh }) {
  const [accessToken, setAccessToken] = useState(null);
  const [formData, setFormData] = useState({
    displayName: "",
    avatar: "",
    bio: "",
    location: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        displayName: initialData.userrealname || "",
        avatar: initialData.avatar || "",
        bio: initialData.bio || "",
        location: initialData.location || "",
        password: "",
      });
    }
  }, [isOpen, initialData, accessToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUpdated(false);

    try {
      const res = await fetch("/api/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" , ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})},
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");

      toast.success("Profile updated!");
      setUpdated(true);
      triggerRefresh?.(true); // 💡 Tells parent to reload
      setTimeout(() => onClose(), 1000); // Close after success
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };



useEffect(() => {
  async function fetchSession() {
    const { data: { session } } = await supabase.auth.getSession();
    setAccessToken(session?.access_token ?? null);
  }
  fetchSession();

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setAccessToken(session?.access_token ?? null);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);


  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-black dark:bg-[#181818] p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-scale-in">
            <button onClick={onClose}
              className="absolute top-2 right-3  hover:text-red-500 text-xl">
              ×
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="displayName" value={formData.displayName} onChange={handleChange}
                placeholder="Display Name"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <AvatarDropzone
                currentImage={formData.avatar}
                onUpload={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
              />

              <textarea name="bio" value={formData.bio} onChange={handleChange}
                placeholder="Bio" maxLength={160}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <input name="location" value={formData.location} onChange={handleChange}
                placeholder="Location" maxLength={30}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <input type="password" name="password" value={formData.password} onChange={handleChange}
                placeholder="New Password (optional)"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition">
                {loading ? (
                  <span className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" /> Updating...
                  </span>
                ) : updated ? (
                  <span className="flex justify-center items-center gap-2">
                    <CheckCircle /> Updated!
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}



