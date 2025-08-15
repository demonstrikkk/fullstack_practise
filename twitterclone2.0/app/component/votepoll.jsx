"use client";

// components/VotePoll.js
import { useState } from "react";

const VotePoll = ({ data }) => {
  const [votes, setVotes] = useState(Array(data.options.length).fill(0));

  const handleVote = (index) => {
    const updated = [...votes];
    updated[index] += 1;
    setVotes(updated);
  };

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-lg mt-4">
      <h3 className="text-xl font-bold mb-3">{data.question}</h3>
      {data.options.map((opt, idx) => (
        <div key={idx} className="mb-2">
          <button
            onClick={() => handleVote(idx)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
          >
            {opt} — {votes[idx]} votes
          </button>
        </div>
      ))}
    </div>
  );
};

export default VotePoll;
