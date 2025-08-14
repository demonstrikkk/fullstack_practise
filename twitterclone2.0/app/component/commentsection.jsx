









import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from "./emojiupload";
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Heart, X, Loader2 } from 'lucide-react';
import { supabase } from '../api/lib/supabaseClient';

import GifSearch from './gifupload'; // Assuming you have a GiphySearch component for GIFs

const CommentSection = ({
  postId,
  currentUser = {},
  handlers = {},
  state = {},
  emojiPickerRef
}) => {
  const { 
    email: currentUserEmail = '', 
    username: currentUsername = '', 
    avatar: currentUserAvatar = '/default-avatar.png' 
  } = currentUser;
  
  const { 
    onClose = () => {}, 
    onEmojiSelect = () => {},
    onGifToggle = () => {} 
  } = handlers;
  
  const { 
    inputText = '', 
    setInputText = () => {},
  } = state;




  // State management
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [showEmojiPickerComment, setShowEmojiPickerComment] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(null);
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [showGifUpload, setShowGifUpload] = useState(false);
  const popupRef = useRef(null);
  const [selectedMedia, setSelectedMedia] = useState(null); // holds GIF url or null


  const [accessToken, setAccessToken] = useState(null);

useEffect(() => {
  async function fetchSession() {
    const { data: { session } } = await supabase.auth.getSession();
    setAccessToken(session?.access_token ?? null);
  }
  fetchSession();

  // Optionally listen for auth state changes to update token
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setAccessToken(session?.access_token ?? null);
  });

  return () => {
    listener?.unsubscribe();
  };
}, []);


  const commentListRef = useRef(null);
const toggleReplies = (commentId) => {
  setVisibleReplies(prev => ({
    ...prev,
    [commentId]: !prev[commentId]
  }));
};

  // Fetch comments from API
  const fetchComments = useCallback(async () => {
    if (!postId) {
      setError('Post ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/posts/comments?postId=${postId}`, {
     headers: {
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
  });
      const data = await res.json();
      
      if (res.ok) {
        setComments(data.comments || []);
      } else {
        setError(data.error || 'Failed to fetch comments');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId,accessToken]);

  // Initial fetch and setup
  useEffect(() => {
    fetchComments();
    
    // Auto-scroll to bottom when comments load
    if (commentListRef.current) {
      commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
    }
  }, [fetchComments]);

  // Handle adding a new comment
  const handleSendComment = useCallback(async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText) return;
    if (!postId) {
      setError('Post ID is missing');
      return;
    }

    setIsSending(true);
    setError(null);
    
    try {

const res = await fetch('/api/posts/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' , ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})},
  body: JSON.stringify({
  type: "ADD_COMMENT",
   postId,
   text: trimmedText,
   media: selectedMedia?.url || null
  }),
});

const data = await res.json();

if (res.ok) {
 setComments(prev => [...prev, {
   ...data,
   username: currentUsername,
   avatar: currentUserAvatar
 }]);
  setInputText('');
  setShowEmojiPickerComment(false);
  setSelectedMedia(null);  // ✅ Clear media

}

      else {
        setError(data.error || 'Failed to add comment');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error sending comment:', err);
    } finally {
      setIsSending(false);
    }
  }, [inputText, postId, currentUserEmail, currentUsername, currentUserAvatar, setInputText,accessToken]);

  const handleSendReply = useCallback(async (commentId) => {
  const replyText = (replyInputs[commentId] || '').trim();
  if (!replyText) return;

  setIsSending(true);
  setError(null);
  
  try {
    const res = await fetch('/api/posts/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' , ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}) },
      body: JSON.stringify({
        postId,
        type: 'ADD_REPLY',
        commentId,
        userEmail: currentUserEmail,
        username: currentUsername,
        avatar: currentUserAvatar,
        text: replyText,
        media: selectedMedia?.url ||null
      }),
    });

    const data = await res.json();
    

  if (res.ok) {
  setComments(data.comments);  // ✅ Replace comment list entirely with updated one
  setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
  setShowReplyInput("");
  setShowReplyEmojiPicker(false);
  setSelectedMedia(null);
}
    else {
      setError(data.error || 'Failed to add reply');
    }
  } catch (err) {
    setError('Failed to connect to server');
    console.error('Error sending reply:', err);
  } finally {
    setIsSending(false);
  }
}, [replyInputs, postId, currentUserEmail, currentUsername, currentUserAvatar,accessToken]);


// ✅ FIXED toggleLike function – no trimmedText, no avatar, no username
const toggleLike = useCallback(async (type, commentId, replyId = null) => {
  if (!postId) {
    setError('Post ID is missing');
    return;
  }

  try {
    const res = await fetch('/api/posts/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}) },
      body: JSON.stringify({
        postId,
        type,
        commentId,
        replyId,
        userEmail: currentUserEmail
      }),
    });

    const data = await res.json();
    
    if (res.ok) {
      setComments(data.comments);
    } else {
      setError(data.error || 'Failed to toggle like');
    }
  } catch (err) {
    setError('Failed to connect to server');
    console.error('Error toggling like:', err);
  }
}, [postId, currentUserEmail,accessToken]);



  const handleEmojiSelect = useCallback((emojiData, event) => {
  setInputText(prev => prev + (emojiData.emoji || ''));

  setShowEmojiPickerComment(false);
}, [setInputText]);

const handleReplyEmojiSelect = useCallback((commentId, emojiData, event) => {
  setReplyInputs(prev => ({
    ...prev,
    [commentId]: (prev[commentId] || '') + (emojiData.emoji || '')
  }));
}, []);


  // Handle Enter key press for comment submission
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  }, [handleSendComment]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Comments</h1>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Close comments"
        >
          <X size={24} />
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-900 text-white p-2 text-center">
          {error}
        </div>
      )}

      {/* Comments list */}
      <div 
        ref={commentListRef}
        className="flex-grow overflow-y-scroll two p-4 space-y-4 "
      >
        {loading && comments.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-400 py-8" data-testid="no-comments-message">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <AnimatePresence>
            {[...comments].reverse().map((comment) => (
              <motion.div
                key={comment.commentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border-b border-gray-700 pb-4 last:border-b-0 "
                data-testid={`comment-${comment.commentId}`}
              >
                {/* Comment */}
                <div className="flex items-start gap-3">
                  <img
                    src={comment.avatar || '/default-avatar.png'}
                    alt={`${comment.username}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white truncate" title={comment.username}>
                        {comment.username}
                      </p>
                     

                      <span className="text-xs text-gray-400 whitespace-nowrap">
{comment.timestamp ? (
  formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })
) : (
  'Just now'
)}
                      </span>
                    </div>
                    
                    <p className="text-white mt-1 whitespace-pre-wrap break-words">
                      {comment.text}
                    </p>
                     {comment.media && (
  <div className="mt-2">
    <img 
      src={comment.media} 
      alt="Comment media"
      className="max-w-xs max-h-52 rounded-md"
    />
  </div>
)}

                    {/* Comment actions */}
                    <div className="flex gap-4 mt-2 text-sm">
                      <button
                        onClick={() => toggleLike('TOGGLE_LIKE_COMMENT', comment.commentId)}
                        className={`flex items-center gap-1 ${comment.likes.includes(currentUserEmail) ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                        aria-label={`${comment.likes.includes(currentUserEmail) ? 'Unlike' : 'Like'} this comment`}
                        disabled={!currentUserEmail}
                      >
                        <Heart 
                          size={16} 
                          fill={comment.likes.includes(currentUserEmail) ? 'currentColor' : 'none'}
                        />
                        <span>{comment.likes.length || 0}</span>
                      </button>
                      <button 
                        onClick={() => setShowReplyInput(
                          showReplyInput === comment.commentId ? null : comment.commentId
                        )}
                        className="flex items-center gap-1 text-gray-400 hover:text-white"
                        aria-label="Reply to this comment"
                        disabled={!currentUserEmail}
                      >
                        <MessageCircle size={16} />
                        <span>Reply</span>
                      </button>
                    </div>

                    
                    {showReplyInput === comment.commentId && (
                      <div className="mt-3 flex items-start gap-2">
                        <img
                          src={currentUserAvatar || '/default-avatar.png'}
                          alt="Your avatar"
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 relative">
                          {selectedMedia?.type === 'gif' && (
  <div className="mb-2">
    <img 
      src={selectedMedia.url} 
      alt="Selected GIF"
      className="max-w-xs max-h-40 rounded-md"
    />
  </div>
)}

                          <textarea
                            value={replyInputs[comment.commentId] || ''}
                            onChange={(e) => setReplyInputs(prev => ({
                              ...prev,
                              [comment.commentId]: e.target.value
                            }))}
                            placeholder={`Reply to ${comment.username}`}
                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            rows={2}
                            autoFocus
                          />
                          <div className="absolute right-2 bottom-2 flex gap-1">
                            <button
                              onClick={() => setShowReplyEmojiPicker(
                                showReplyEmojiPicker === comment.commentId ? null : comment.commentId
                              )}
                              className="text-gray-400 hover:text-white p-1"
                              aria-label="Insert emoji"
                              type="button"
                            >
                               <svg viewBox="0 0 24 24" className="invert w-7 hover:fill-blue-800" fill='red'>
                        <g>
                          <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z" />
                        </g>
                      </svg>
                            </button>
                            {showReplyEmojiPicker === comment.commentId && (
                              <div className="   fixed bottom-1/3 inset-0 flex items-center justify-center z-40 ">
                                  <button
                          className="fixed left-[61vw]   text-white rounded-sm p-1 bg-amber-900"
                          onClick={() => setShowReplyEmojiPicker(false)}
                          >
                          ×
                        </button>
                                <EmojiPicker
  onEmojiClick={(emojiData, event) => handleReplyEmojiSelect(comment.commentId, emojiData, event)}
/>
                              </div>
                            )}

                   <div className="icon-container gif" onClick={() => setShowGifUpload(!showGifUpload)}>
                    <svg viewBox="0 0 24 24" className="invert w-7" fill='brown'>
                      <g>
                        <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z" />
                      </g>
                    </svg>
                    <span className="tooltip">GIF</span>
                  </div>


                            <button
                              onClick={() => handleSendReply(comment.commentId)}
                              className="bg-blue-600 px-3 py-2 rounded-md text-white hover:bg-blue-700 disabled:opacity-50"
                              disabled={!replyInputs[comment.commentId]?.trim()}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    
{Array.isArray(comment.replies) && comment.replies.length > 0 && (
  <div className="mt-3 pl-4 border-l-2 border-gray-600">
    <button
      onClick={() => toggleReplies(comment.commentId)}
      className="text-sm text-blue-400 hover:underline"
    >
      {visibleReplies[comment.commentId] ? 'Hide Replies' : `View Replies (${comment.replies.length})`}
    </button>

    {visibleReplies[comment.commentId] && (
      <div className="mt-2 space-y-3">
        {comment.replies.map((reply) => (
          <div key={reply.replyId} className="pt-3">
            <div className="flex items-start gap-3">
              <img
                src={reply.avatar || '/default-avatar.png'}
                alt={`${reply.username}'s avatar`}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-white truncate" title={reply.username}>
                    {reply.username}
                  </p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {reply.timestamp ? (
                      formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })
                    ) : (
                      'Just now'
                    )}
                  </span>
                </div>
                <p className="text-sm text-white mt-1 whitespace-pre-wrap break-words">
                  {reply.text}
                </p>
                <button
                  onClick={() => toggleLike('TOGGLE_LIKE_REPLY', comment.commentId, reply.replyId)}
                  className={`flex items-center gap-1 text-xs mt-1 ${(Array.isArray(reply.likes) && currentUser.email && reply.likes.includes(currentUser.email))
 ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                  aria-label={`${(Array.isArray(reply.likes) && currentUser.email && reply.likes.includes(currentUser.email))
 ? 'Unlike' : 'Like'} this reply`}
                  disabled={!currentUser.email}
                >
                  <Heart 
                    size={14} 
                    fill={(Array.isArray(reply.likes) && currentUser.email && reply.likes.includes(currentUser.email))
 ? 'currentColor' : 'none'}
                  />
                  <span>{reply.likes.length || 0 }</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

                  </div> 
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Comment input */}
      <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-gray-700">
          {showEmojiPickerComment && (
          <div className="   fixed bottom-1/3 inset-0 flex items-center justify-center z-40 ">
            <button
                          className="fixed left-[61vw]  text-white rounded-md p-1 bg-amber-900"
                          onClick={() => setShowEmojiPickerComment(false)}
                          >
                          ×
                        </button>
            <EmojiPicker
              onEmojiClick={handleEmojiSelect}
            />
          </div>
        )}
         
         {showGifUpload && (
                    <div className=" gifdo fixed bottom-1/3 inset-0 flex items-center justify-center z-40 w-full">
                      <div ref={popupRef} className="w-[500px] h-1/4 rounded-3xl p-5 relative">
                        <button
                          className="relative  bg-black/50 text-white rounded-full p-1"
                          onClick={() => document.querySelector('.gifdo').style.display = 'none'}
                          >
                          ×
                        </button>
                        <GifSearch onGifSelect={(url) => {
                          setShowGifUpload(false);
                          setSelectedMedia({ type: 'gif', url });
                        }} />
                      </div>
                    </div>
                  )}
        <div className="flex items-center gap-2">
          <img 
            src={currentUser.avatar || '/default-avatar.png'} 
            alt="Your avatar" 
            className="w-10 h-10 rounded-full object-cover" 
          />
          <div className="flex-1 relative">
            {selectedMedia?.type === 'gif' && (
  <div className="mb-2">
    <img 
      src={selectedMedia.url} 
      alt="Selected GIF"
      className="max-w-xs max-h-40 rounded-md"
    />
  </div>
)}

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add a comment..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={1}
              />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEmojiPickerComment(!showEmojiPickerComment)}
              className="p-2 text-gray-400 hover:text-white"
              aria-label="Insert emoji"
            >
               <svg viewBox="0 0 24 24" className="invert w-7 hover:fill-blue-800" fill='red'>
                        <g>
                          <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z" />
                        </g>
                      </svg>
                      <span className="tooltip">Emoji</span>
            </button>
                 
                              <div className="icon-container gif" onClick={() => setShowGifUpload(!showGifUpload)}>
                    <svg viewBox="0 0 24 24" className="invert w-7" fill='brown'>
                      <g>
                        <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z" />
                      </g>
                    </svg>
                    <span className="tooltip">GIF</span>
                  </div>
            <button
              onClick={handleSendComment}
              className="bg-blue-600 px-3 py-2 rounded-md text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isSending || !inputText}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
