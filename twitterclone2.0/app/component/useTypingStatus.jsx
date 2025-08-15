"use client";

import { useState, useEffect, useRef } from "react";

export function useTypingStatus(channelRef, currentUser, peerUser) {
  const [peerTyping, setPeerTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleTypingChange = (input) => {
    if (typeof input !== "string") return;
    if (!channelRef.current) return;

    const isTyping = input.trim().length > 0;

    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { sender: currentUser, isTyping },
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // send stopped typing if no input after 1s
    typingTimeoutRef.current = setTimeout(() => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "typing",
          payload: { sender: currentUser, isTyping: false },
        });
      }
    }, 1000);
  };

  useEffect(() => {
    if (!channelRef.current) return;

    const subscription = channelRef.current.on(
      "broadcast",
      { event: "typing" },
      ({ payload }) => {
        // 🟢 only update peerTyping if the peer is sending it
        if (payload.sender === peerUser) {
          setPeerTyping(payload.isTyping);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [peerUser, channelRef.current]);

  return { peerTyping, handleTypingChange };
}




