'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const conversations = [
    {
      id: 1,
      user: {
        name: 'John Doe',
        handle: '@johndoe',
        avatar: 'globe.svg',
        online: true
      },
      lastMessage: 'Hey, how are you?',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      user: {
        name: 'Jane Smith',
        handle: '@janesmith',
        avatar: 'globe.svg',
        online: false
      },
      lastMessage: 'See you tomorrow!',
      timestamp: new Date(Date.now() - 7200000)
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'currentUser',
      timestamp: new Date(),
      read: false
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setActiveChat(conversation)}
              className={`p-4 border-b border-gray-800 hover:bg-gray-900 cursor-pointer ${
                activeChat?.id === conversation.id ? 'bg-gray-900' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  {conversation.user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{conversation.user.name}</h2>
                    <span className="text-gray-500 text-sm">
                      {new Date(conversation.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{conversation.user.handle}</p>
                  <p className="text-gray-300 truncate">{conversation.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col relative h-1/2 w-full">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
              <Image
                src={activeChat.user.avatar}
                alt={activeChat.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h2 className="font-semibold">{activeChat.user.name}</h2>
                <p className="text-gray-500 text-sm">{activeChat.user.handle}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-3 ${
                      message.sender === 'currentUser'
                        ? 'bg-blue-500 rounded-br-none'
                        : 'bg-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-white">{message.text}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Start a new message"
                  className="flex-1 bg-transparent border border-gray-700 rounded-2xl px-4 py-2 resize-none focus:outline-none focus:border-blue-500"
                  rows="1"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
