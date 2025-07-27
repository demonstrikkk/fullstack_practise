




// components/StaticPollPreview.js
import { useState } from "react";

const StaticPollPreview = ({ data, cross }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    if (cross) cross();
  };

  if (!show) return null;

  return (
    <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md mt-4 poll-container relative">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-gray-300 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
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

      <div className="poll-title text-xl font-bold mb-4">{data.question}</div>
      <div className="poll-options space-y-4">
        {data.options.map((opt, idx) => (
          <div key={idx} className="poll-option">
            <input
              type="radio"
              name="poll"
              id={`option${idx}`}
              value={opt}
              className="mr-2"
              disabled
            />
            <label htmlFor={`option${idx}`} className="mr-2">
              {opt}
            </label>
            <div className="progress-bar bg-gray-600 h-2 rounded mt-1">
              <div
                className="progress bg-blue-500 h-2 rounded"
                style={{ width: "0%" }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaticPollPreview;
