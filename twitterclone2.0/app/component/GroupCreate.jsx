"use client";

import { useState, useEffect } from "react";
import { supabase } from "../api/lib/supabaseClient";
// import { useSession } from "next-auth/react";
// import { supabase } from "../api/lib/supabaseClient";
export default function GroupCreate({ onGroupCreated, onClose, searchTerm, setSearchTerm }) {
  // const { data: session } = useSession();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Fetch the session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Also subscribe to auth state changes (optional, for realtime updates)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  const [groupName, setGroupName] = useState("");
  //   const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const currentUserEmail = session?.user?.email;

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      const res = await fetch(`/api/search-users?q=${searchTerm}&currentUserEmail=${currentUserEmail}`);
      const data = await res.json();
      setSearchResults(data.users || []);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, currentUserEmail]);



  const handleMemberSelectToggle = (user) => {
    setSelectedMembers(prev => {
      const newSelected = { ...prev };
      if (newSelected[user.email]) {
        delete newSelected[user.email];
      } else {
        newSelected[user.email] = user;
      }
      return newSelected;
    });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const membersArray = Object.values(selectedMembers);

    if (!groupName.trim() || membersArray.length === 0) {
      setError("Group name and at least one member are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: groupName,
          created_by: session.user.email,
          description: "",
          avatar_url: "",
        })
        .select()
        .single();

      if (groupError) throw groupError;

      const membersToInsert = [
        { group_id: groupData.id, user_email: session.user.email, role: 'admin' },
        ...membersArray.map(member => ({
          group_id: groupData.id,
          user_email: member.email,
          role: 'member'
        }))
      ];

      const { error: groupMembersError } = await supabase
        .from("group_members")
        .insert(membersToInsert);

      if (groupMembersError) throw groupMembersError;

      alert("Group created successfully!");
      onGroupCreated(groupData);

      setGroupName("");
      setSelectedMembers({});
      setSearchTerm("");
      setSearchResults([]);
    } catch (err) {
      console.error("Error creating group:", err);
      setError(err.message || "Failed to create group.");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="p-4 bg-[#1a1d24] rounded-lg text-white max-w-md mx-auto my-4">
      <h2 className="text-xl font-bold mb-4">Create a New Group</h2>
      <form onSubmit={handleCreateGroup}>
        <div className="mb-4">
          <label htmlFor="groupName" className="block mb-2 text-sm font-medium">Group Name</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-lg focus:outline-none"
            placeholder="My Awesome Group"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="addMember" className="block mb-2 text-sm font-medium">Invite Members</label>
          <input
            type="text"
            id="addMember"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-lg focus:outline-none"
            placeholder="Search by username..."
          />
        </div>
        {isSearching && <p className="text-gray-400">Searching...</p>}
        {searchResults.length > 0 && (
          <div className="mb-4 border border-gray-700 rounded-lg p-2 max-h-48 overflow-y-auto">
            {searchResults.map(user => (
              <div key={user.email} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded">
                <div className="flex items-center gap-3">
                  <img src={user.avatar || 'https://via.placeholder.com/150'} alt={user.username} className="w-8 h-8 rounded-full" />
                  <span>{user.username}</span>
                </div>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-blue-600 rounded focus:ring-blue-500"
                  checked={!!selectedMembers[user.email]}
                  onChange={() => handleMemberSelectToggle(user)}
                />
              </div>
            ))}
          </div>
        )}
        {Object.keys(selectedMembers).length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Selected Members:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(selectedMembers).map(member => (
                <div key={member.email} className="flex items-center bg-blue-600/50 px-2 py-1 rounded-full text-sm">
                  <span>{member.username}</span>
                  <button type="button" onClick={() => handleMemberSelectToggle(member)} className="ml-2 text-white hover:text-red-400">
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed">
            {isLoading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </form>
    </div>
  );
}
