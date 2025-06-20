// components/Poll.js
"use client";
import React, { useState, useEffect } from "react";

const Poll = ({ onPollSelect, onPollSubmit, cross }) => {
  const [showPoll, setShowPoll] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setShowPoll(onPollSelect === "true");
  }, [onPollSelect]);

  const handleSubmit = () => {
    const optionList = options
      .split(",")
      .map((opt) => opt.trim())
      .filter(Boolean);

    if (!question.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    if (optionList.length < 2) {
      setError("Please enter at least two  options.");
      return;
    }

    const pollData = {
      question,
      options: optionList,
    };

    if (onPollSubmit) {
      onPollSubmit(pollData); // Pass poll data to parent
    }

    setQuestion("");
    setOptions("");
    setError("");
    setShowPoll(false); // Close the modal
  };

  return (
    <>
      {showPoll && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-zinc-900 text-white w-[90%] sm:w-[50%] md:w-[35%] p-6 rounded-3xl shadow-lg relative animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 createpollo">
              <h2 className="text-xl font-bold ">Create a Poll</h2>
              <button
                onClick={() => {
                  setShowPoll(false);
                  if (cross) cross();
                }}
                className="text-gray-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  fill="none"
                >
                  <path
                    d="M19 5L5 19M5 5L19 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Question Input */}
            <div className="mb-4 createpollotitle">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter poll title"
                className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 "
              />
            </div>

            {/* Options Input */}
            <div className="mb-2 relative createpolloptions">
              <input
                type="text"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                placeholder="Option1, Option2, Option3..."
                className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 "
              />
              <span className="text-xs text-gray-400 absolute left-2 bottom-[-18px] jeanspant">
                Minimum 2 options separated by commas
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 text-sm mb-2 mt-1">{error}</div>
            )}

            {/* Submit */}
            <div className="flex justify-center mt-4 createsubmitpollo">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow-md"
              >
                Submit Poll
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Poll;
