// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2, CheckCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import AvatarDropzone from "./AvatarDropzone";
// import useSWR from "swr";

// export default function UpdateProfileForm({ isOpen, onClose, initialData = {} ,  triggerRefresh }) {
//   const [formData, setFormData] = useState({
//     displayName: "",
//     avatar: "",
//     bio: "",
//     location: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [updated, setUpdated] = useState(false);
//   const [loadingInitial, setLoadingInitial] = useState(false);

//   // Load profile with SWR (and also use mutate for refetch after update)
//   const { data,  mutate: swrMutate } = useSWR("/api/getprofile", async (url) => {
//     const res = await fetch(url);
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || "Failed to fetch");
//     return data;
//   });


// useEffect(() => {
//   if (isOpen && initialData) {
//     setFormData((prev) => ({ ...prev, ...initialData }));
//   }
// }, [isOpen, initialData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };



// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setUpdated(false);

//   try {
//     const res = await fetch("/api/updateProfile", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     const result = await res.json();
//     if (!res.ok) throw new Error(result.error || "Update failed");

//     toast.success("Profile updated!");
//      triggerRefresh?.(true);
    
//     // if (mutate) mutate();         // from parent, optional
//     // if (swrMutate) swrMutate();   // from local useSWR

//     setUpdated(true);
//     setTimeout(() => onClose(), 1500);
//   } catch (err) {
//     toast.error(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div
//             className="bg-black dark:bg-[#181818] p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0.8 }}
//             transition={{ duration: 0.3 }}
//           >
//             <button
//               onClick={onClose}
//               className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
//             >
//               ×
//             </button>

//             <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

//             {!data ? (
//               <div className="flex justify-center my-10">
//                 <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                   name="displayName"
//                   value={formData.displayName}
//                   onChange={handleChange}
//                   placeholder="Display Name"
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <AvatarDropzone
//                   currentImage={formData.avatar}
//                   onUpload={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
//                 />

//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleChange}
//                   placeholder="Bio"
//                   maxLength={160}
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <input
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   placeholder="Location"
//                   maxLength={30}
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="New Password (optional)"
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
//                 >
//                   {loading ? (
//                     <span className="flex justify-center items-center gap-2">
//                       <Loader2 className="animate-spin" /> Updating...
//                     </span>
//                   ) : updated ? (
//                     <span className="flex justify-center items-center gap-2">
//                       <CheckCircle /> Updated!
//                     </span>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </button>
//                 {(updated && isOpen)? isOpen = !isOpen :null}
//               </form>
//             )}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2, CheckCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import AvatarDropzone from "./AvatarDropzone";

// export default function UpdateProfileForm({ isOpen, onClose, initialData = {}, triggerRefresh }) {
//   const [formData, setFormData] = useState({
//     displayName: "",
//     avatar: "",
//     bio: "",
//     location: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [updated, setUpdated] = useState(false);

//   useEffect(() => {
//     if (isOpen && initialData) {
//       setFormData((prev) => ({ ...prev, ...initialData }));
//     }
//   }, [isOpen, initialData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setUpdated(false);

//     try {
//       const res = await fetch("/api/updateProfile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || "Update failed");

//       toast.success("Profile updated!");
//       triggerRefresh?.(true); // Trigger soft reload

//       setUpdated(true);
//       setTimeout(() => onClose(), 1500);
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div
//             className="bg-black dark:bg-[#181818] p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0.8 }}
//             transition={{ duration: 0.3 }}
//           >
//             <button
//               onClick={onClose}
//               className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
//             >
//               ×
//             </button>

//             <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 name="displayName"
//                 value={formData.displayName}
//                 onChange={handleChange}
//                 placeholder="Display Name"
//                 className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <AvatarDropzone
//                 currentImage={formData.avatar}
//                 onUpload={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
//               />

//               <textarea
//                 name="bio"
//                 value={formData.bio}
//                 onChange={handleChange}
//                 placeholder="Bio"
//                 maxLength={160}
//                 className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <input
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 placeholder="Location"
//                 maxLength={30}
//                 className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="New Password (optional)"
//                 className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
//               >
//                 {loading ? (
//                   <span className="flex justify-center items-center gap-2">
//                     <Loader2 className="animate-spin" /> Updating...
//                   </span>
//                 ) : updated ? (
//                   <span className="flex justify-center items-center gap-2">
//                     <CheckCircle /> Updated!
//                   </span>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </button>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import AvatarDropzone from "./AvatarDropzone";

export default function UpdateProfileForm({ isOpen, onClose, initialData = {}, triggerRefresh }) {
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
  }, [isOpen, initialData]);

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
        headers: { "Content-Type": "application/json" },
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="bg-black dark:bg-[#181818] p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




// "use client";
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2, CheckCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import AvatarDropzone from "./AvatarDropzone";

// export default function UpdateProfileForm({ isOpen, onClose }) {
//   const [formData, setFormData] = useState({
//     displayName: "",
//     avatar: "",
//     bio: "",
//     location: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [updated, setUpdated] = useState(false);
//   const [loadingInitial, setLoadingInitial] = useState(false);

//   // Fetch user profile when modal opens
//   useEffect(() => {
//     const fetchProfile = async () => {
//       setLoadingInitial(true);
//       try {
//         const res = await fetch("/api/getprofile");
//         const data = await res.json();
//         if (res.ok) {
//           setFormData((prev) => ({ ...prev, ...data.profile }));
//         } else {
//           toast.error(data.error || "Could not fetch profile");
//         }
//       } catch (err) {
//         toast.error("Failed to load profile");
//       } finally {
//         setLoadingInitial(false);
//       }
//     };

//     if (isOpen) {
//       fetchProfile();
//     }
//   }, [isOpen]);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setUpdated(false);

//     try {
//       const res = await fetch("/api/updateProfile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to update profile");

//       toast.success("Profile updated successfully!");
//       setUpdated(true);
//       setTimeout(() => onClose(), 1500);
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div
//             className="bg-black dark:bg-[#181818] p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0.8 }}
//             transition={{ duration: 0.3 }}
//           >
//             <button
//               onClick={onClose}
//               className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
//             >
//               ×
//             </button>

//             <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

//             {loadingInitial ? (
//               <div className="flex justify-center my-10">
//                 <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                   name="displayName"
//                   value={formData.displayName}
//                   onChange={handleChange}
//                   placeholder="Display Name"
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   name="avatar"
//                   value={formData.avatar}
//                   onChange={handleChange}
//                   placeholder="Avatar URL"
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <AvatarDropzone
//   onUpload={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
// />
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleChange}
//                   placeholder="Bio"
//                   maxLength={160}
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   placeholder="Location"
//                   maxLength={30}
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="New Password (optional)"
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
//                 >
//                   {loading ? (
//                     <span className="flex justify-center items-center gap-2">
//                       <Loader2 className="animate-spin" /> Updating...
//                     </span>
//                   ) : updated ? (
//                     <span className="flex justify-center items-center gap-2">
//                       <CheckCircle /> Updated!
//                     </span>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </button>
//               </form>
//             )}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
