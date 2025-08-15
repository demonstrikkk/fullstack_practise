"use client";

import React, { useEffect, useState } from "react";
import HomePage from "../sidebar/page";
import { supabase } from "../api/lib/supabaseClient";
const RelevantPeople = ({ setSelectedUser }) => {
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
  const [people, setPeople] = useState([]);
  const [followStatus, setFollowStatus] = useState({}); // {email: boolean}

  // Fetch all people and their follow status
  useEffect(() => {
    const fetchPeople = async () => {
      const res = await fetch("/api/relevantpeople");
      const data = await res.json();
      setPeople(data);

      // Fetch follow status for each user
      const statuses = {};
      for (const person of data) {
        const res2 = await fetch(`/api/user/${person.email}`);
        const personData = await res2.json();
        statuses[person.email] = personData?.followers?.users?.includes(session?.user?.email);
      }
      setFollowStatus(statuses);
    };

    if (session?.user?.email) {
      fetchPeople();
    }
  }, [session?.user?.email]);

  // Toggle follow/unfollow
  const handleFollowToggle = async (targetEmail) => {
    const res = await fetch('/api/followup/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetEmail,
        viewerEmail: session?.user?.email
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setFollowStatus((prev) => ({
        ...prev,
        [targetEmail]: data.following,
      }));
    }
  };

  return (
    <div className="boxx snap-y overflow-y-auto max-h-48 space-y-4 pr-2">
      {people.map((user) => (
        <div
          key={user._id}
          onClick={() => { setSelectedUser(user) }}
          className="flex justify-between items-center gap-3 border-b border-gray-500 pb-2 hover:bg-gray-600 cursor-pointer"
        >

          {/* <div className="flex flex-row place-items-center  gap-5">
            <div >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 ">
                  <img
                    src={user.profile?.avatar || "/default-avatar.png"}
                    alt={user.profile?.displayName}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-white font-medium truncate">
                  {user.profile?.displayName}
                </div>
              </div>
            </div>
              <div>
                <button
                  onClick={() => handleFollowToggle(user.email)}
                  className={`mt-4 py-2 px-3 rounded-3xl border text-white font-bold 
              ${followStatus[user.email] ? "bg-gray-600" : "bg-blue-400"}`}
                >
                  {followStatus[user.email] ? "Following" : "Follow"}
                </button>
              </div>
          </div> */}
          <div className="flex items-center justify-between w-full gap-6 ">
  {/* Left: Avatar + Username */}
  <div className="flex items-center gap-3 min-w-0">
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 shrink-0">
      <img
        src={user.profile?.avatar || "/default-avatar.png"}
        alt={user.profile?.displayName}
        width={40}
        height={40}
        className="object-cover w-full h-full"
      />
    </div>
    <div>
    <p className="text-white font-medium truncate">
      {user.username}
    </p>
    <p className="text-gray-500 text-sm">{user?.profile?.displayName}</p>
</div>
  </div>

  {/* Right: Follow Button */}
  <button
    onClick={() => handleFollowToggle(user.email)}
    className={`py-2 px-4 rounded-3xl border text-white font-bold whitespace-nowrap
      ${followStatus[user.email] ? "bg-gray-600" : "bg-blue-400"}`}
  >
    {followStatus[user.email] ? "Following" : "Follow"}
  </button>
</div>


        </div>
      ))}
    </div>
  );
};

export default RelevantPeople;
