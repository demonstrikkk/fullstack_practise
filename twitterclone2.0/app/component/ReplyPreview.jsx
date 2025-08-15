"use client";

// components/ReplyPreview.js

import { X } from 'lucide-react';

export default function ReplyPreview({ message, onCancel }) {
  return (
    <div className="flex items-center justify-between p-2 mb-2 text-sm rounded-lg bg-gray-700/50">
      <div className="pl-2 border-l-2 border-blue-400">
        <p className="font-semibold text-blue-300">
          Replying to {message.sender_email.split('@')[0]}
        </p>
        <p className="italic text-gray-300 truncate">{message.message}</p>
      </div>
      <button onClick={onCancel} className="p-1 text-gray-400 rounded-full hover:bg-gray-600">
        <X size={18} />
      </button>
    </div>
  );
}