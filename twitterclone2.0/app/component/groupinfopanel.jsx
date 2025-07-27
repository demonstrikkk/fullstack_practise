




"use client";

import { useState, useEffect, useMemo } from "react";
import {
  X, Upload, User, UserPlus,UserMinus, LogOut, Trash2,
  Shield, ShieldCheck, Crown, Loader2
} from "lucide-react";
import MediaGroupUploader from "./mediagroupUploader";


const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#2a2f38] rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <div className="text-gray-300 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold">Confirm</button>
        </div>
      </div>
    </div>
  );
};

const GroupInfoPanel = ({
  group,
  initialMembers = [],
  currentUserEmail = "",
  supabase,
  onClose = () => {},
  onGroupDeleted = () => {},
  onLeftGroup = () => {},
  senderProfile
}) => {
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState({ type: null, data: null });
  const [isUpdating, setIsUpdating] = useState(null);
  const [showAvatarUploader, setShowAvatarUploader] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});
  const currentUser = useMemo(() => members.find((m) => m.user_email === currentUserEmail), [members, currentUserEmail]);
  const isCreator = group.created_by === currentUserEmail;
  const isAdmin = currentUser?.role === "admin" || isCreator;

  const [searchTerm, setSearchTerm] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [selectedMembers, setSelectedMembers] = useState({});
const [adding, setAdding] = useState(false);

const fetchMembers = async () => {
  const { data, error } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", group.id);

  if (error) {
    console.error("Failed to fetch members:", error);
  } else {
    setMembers(data);
  }
};

useEffect(() => {
  fetchMembers(); // on component mount
}, []);



useEffect(() => {
  if (!searchTerm.trim()) {
    setSearchResults([]);
    return;
  }

  const delay = setTimeout(async () => {
    const res = await fetch(`/api/search-users?q=${searchTerm}&currentUserEmail=${currentUserEmail}`);
    const data = await res.json();
    const existingEmails = initialMembers.map(m => m.user_email);
    const filtered = (data.users || []).filter(u => !existingEmails.includes(u.email));
    setSearchResults(filtered);
  }, 300);

  return () => clearTimeout(delay);
}, [searchTerm, currentUserEmail, initialMembers]);

const handleMemberSelectToggle = (user) => {
  setSelectedMembers(prev => {
    const copy = { ...prev };
    if (copy[user.email]) {
      delete copy[user.email];
    } else {
      copy[user.email] = user;
    }
    return copy;
  });
};


const handleAddMembers = async () => {
  const membersArray = Object.values(selectedMembers);
  if (membersArray.length === 0) return;

  setAdding(true);
  const membersToInsert = membersArray.map(member => ({
    group_id: group.id,
    user_email: member.email,
    role: 'member'
  }));

  const { error } = await supabase.from("group_members").insert(membersToInsert);

  if (error) {
    console.error("Failed to add members:", error);
  } else {
    alert("Members added successfully!");
    setSearchTerm("");
    setSearchResults([]);
    setSelectedMembers({});
  }

  setAdding(false);
  await fetchMembers(); // refresh member list

};



useEffect(() => {
  const memberEmails = initialMembers.map((m) => m.user_email);
  const uniqueEmails = [...new Set(memberEmails)];
  if (uniqueEmails.length === 0) return;

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/getUserProfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: uniqueEmails }),
      });

      const data = await res.json();

      // ✅ Normalize to object
      const normalizedProfiles = Array.isArray(data)
        ? Object.fromEntries(data.map((user) => [user.email, user]))
        : data;

      setUserProfiles(normalizedProfiles);
    } catch (err) {
      console.error("Failed to fetch user profiles", err);
    }
  };

  fetchProfiles();
}, [initialMembers]);


  const updateAvatar = async (e) => {
  const sanitizeFilename = (name) =>
  name
    .replace(/[^a-zA-Z0-9._-]/g, "_")  // replace unsafe characters with _
    .replace(/_+/g, "_")               // collapse multiple underscores
    .slice(0, 100);                    // optional: limit max length

  const file = e.target.files[0];
  if (!file) return;

  const cleanName = sanitizeFilename(file.name);
  const path = `group_avatars/${group.id}/${Date.now()}_${cleanName}`;

  setIsUpdating("avatar");

  const { error: uploadErr } = await supabase
    .storage
    .from("group-images")
    .upload(path, file, { upsert: true });

  if (uploadErr) return console.error(uploadErr);

  const { data: urlData } = supabase
    .storage
    .from("group-images")
    .getPublicUrl(path);

  const { error: updateErr } = await supabase
    .from("groups")
    .update({ avatar_url: urlData.publicUrl })
    .eq("id", group.id);

  if (updateErr) return console.error(updateErr);

  group.avatar_url = urlData.publicUrl;
  setIsUpdating(null);
};


  const changeRole = async (email, newRole) => {
    setIsUpdating(email);
    const { error } = await supabase.from("group_members").update({ role: newRole }).eq("group_id", group.id).eq("user_email", email);
    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.user_email === email ? { ...m, role: newRole } : m))
      );
    }
    setIsUpdating(null);
    await fetchMembers(); // refresh member list

  };

  const removeMember = async (email) => {
    setIsUpdating(email);
    const { error } = await supabase.from("group_members").delete().eq("group_id", group.id).eq("user_email", email);
    if (!error) {
      setMembers((prev) => prev.filter((m) => m.user_email !== email));
    }
    setIsUpdating(null);
    await fetchMembers(); // refresh member list

    setModal({ type: null, data: null });
  };

  const leaveGroup = async () => {
    setIsUpdating("leave");
    await supabase.from("group_members").delete().eq("group_id", group.id).eq("user_email", currentUserEmail);
    setIsUpdating(null);
    await fetchMembers(); // refresh member list

    setModal({ type: null, data: null });
    onLeftGroup();
  };

  const deleteGroup = async () => {
    setIsUpdating("delete");
    await supabase.from("group_members").delete().eq("group_id", group.id);
    await supabase.from("group_messages").delete().eq("group_id", group.id);
    await supabase.from("groups").delete().eq("id", group.id);
    setIsUpdating(null);

    setModal({ type: null, data: null });
    onGroupDeleted();
  };

// const getUserProfile = (email) => userProfiles.find(u => u.email === email);
const getUserProfile = (email) => userProfiles[email] 


  return (
    <>
      <div className="h-full w-full z-50  flex " onClick={onClose}>
        <div className="bg-[#1a1d24] w-full h-full flex flex-col text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <header className="p-4 border-b border-gray-700 flex items-center gap-4">
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X />
            </button>
            <h2 className="text-lg font-bold">Group Info</h2>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col items-center gap-2 p-6 bg-[#20242c]">
              <div className="relative">
                <img
                  src={group.avatar_url || "/groupdefault.png"}
                  alt="Group Avatar"
                  className="w-28 h-28 rounded-full object-cover border"
                />
              
                {isAdmin && (
  <button
    onClick={() => setShowAvatarUploader(true)}
    className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer"
    title="Change Avatar"
  >
    <Upload size={18} />
  </button>
)}

              </div>
              <h2 className="text-2xl font-bold mt-3">{group.name}</h2>
              <p className="text-sm text-gray-400">{members.length} members</p>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">MEMBERS</h3>
              <ul className="space-y-2">
           
                  {members.map(member => {
              const profilez = getUserProfile(member.user_email);
              const name = profilez?.profile?.displayName || member.user_email;
              const avatar = profilez?.profile?.avatar || `https://placehold.co/40x40?text=${name[0] || 'U'}`;
              const ogname = member.full_name = profilez?.profile?.displayName
              const isSelf = member.user_email === currentUserEmail;
              const isCreatorFlag = member.user_email === group.created_by;
              const isMemberAdmin = member.role === "admin";
                                const isMemberCreator = member.user_email === group.created_by;
                                                  const canChangeRole = isCreator && !isMemberCreator;
                                                                    const canRemove = isAdmin && !isMemberCreator;




              return (
                <li
                  key={member.user_email}
                  className="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="avatar"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {name} {isSelf && <span className="text-green-400">(You)</span>}
                      </p>
                      <div className="text-xs text-gray-300 flex items-center gap-1">
                        {isCreatorFlag ? <Crown size={14} className="text-yellow-400" /> : isMemberAdmin ? <ShieldCheck size={14} className="text-blue-400" /> : <User size={14} />}
                        <span>{isCreatorFlag ? "Creator" : member.role?.charAt(0).toUpperCase() + member.role?.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                                        <div className="flex gap-1">
                        {canChangeRole && (
                          <button
                            onClick={() => changeRole(member.user_email, isMemberAdmin ? "member" : "admin")}
                            disabled={isUpdating === member.user_email}
                            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
                          >
                            {isMemberAdmin ? <Shield size={16} /> : <ShieldCheck size={16} />}
                          </button>
                        )}
                        {canRemove && (
                          <button
                            onClick={() => setModal({ type: "remove", data: member })}
                            disabled={isUpdating === member.user_email}
                            className="text-red-500 hover:text-white p-2 rounded-full hover:bg-gray-700"
                          >
                            <UserMinus size={16} />
                          </button>
                        )}
                      </div>
                </li>
              );
            })}
              </ul>
              <div className="mt-6 border-t border-gray-600 pt-4">
  <h3 className="text-lg font-bold mb-2">Add Members</h3>
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search users..."
    className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-2"
  />

  {searchResults.length > 0 && (
    <div className="max-h-40 overflow-y-auto">
      {searchResults.map(user => (
        <div key={user.email} className="flex justify-between items-center p-2 hover:bg-gray-800 rounded">
          <div className="flex items-center gap-3">
            <img src={user.avatar || "/default-avatar.png"} className="w-8 h-8 rounded-full" alt="avatar" />
            <span>{user.username}</span>
          </div>
          <input
            type="checkbox"
            checked={!!selectedMembers[user.email]}
            onChange={() => handleMemberSelectToggle(user)}
            className="form-checkbox text-blue-500"
          />
        </div>
      ))}
    </div>
  )}

  {Object.keys(selectedMembers).length > 0 && (
    <button
      onClick={handleAddMembers}
      disabled={adding}
      className="mt-3 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
    >
      {adding ? "Adding..." : "Add Selected"}
    </button>
  )}
</div>

            </div>
          </div>

          <footer className="p-4 border-t border-gray-700 space-y-2">
            {!isCreator && (
              <button
                onClick={() => setModal({ type: "leave" })}
                className="w-full flex items-center justify-center gap-2 bg-red-800/80 hover:bg-red-800 px-4 py-2 rounded text-red-300 hover:text-white"
              >
                <LogOut size={16} /> Leave Group
              </button>
            )}
            {isCreator && (
              <button
                onClick={() => setModal({ type: "delete" })}
                className="w-full flex items-center justify-center gap-2 bg-red-800/80 hover:bg-red-800 px-4 py-2 rounded text-red-300 hover:text-white"
              >
                <Trash2 size={16} /> Delete Group
              </button>
            )}
          </footer>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={modal.type === "remove"}
        onClose={() => setModal({ type: null })}
        onConfirm={() => removeMember(modal.data?.user_email)}
        title="Remove Member"
      >
        Are you sure you want to remove <strong>{modal.data?.full_name || modal.data?.user_email}</strong> from the group?
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={modal.type === "leave"}
        onClose={() => setModal({ type: null })}
        onConfirm={leaveGroup}
        title="Leave Group"
      >
        Are you sure you want to leave this group?
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={modal.type === "delete"}
        onClose={() => setModal({ type: null })}
        onConfirm={deleteGroup}
        title="Delete Group"
      >
        This will permanently delete the group, all members, and all messages. This action is irreversible.
      </ConfirmationModal>
      {showAvatarUploader && (
  <MediaGroupUploader
    onUploadComplete={async (url) => {
      setIsUpdating("avatar");
      const { error } = await supabase
        .from("groups")
        .update({ avatar_url: url })
        .eq("id", group.id);

      if (!error) {
        group.avatar_url = url;
      } else {
        console.error("Failed to update avatar URL:", error);
      }

      setIsUpdating(null);
      setShowAvatarUploader(false);
    }}
    onClose={() => setShowAvatarUploader(false)}
  />
)}

    </>
  );
};

export default GroupInfoPanel;

