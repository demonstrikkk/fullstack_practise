// components/GifPicker.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

export default function GifPicker({ onGifSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);
  const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

  const fetchGifs = useCallback(async (query) => {
    const endpoint = query ? 'search' : 'trending';
    const { data } = await axios.get(`https://api.giphy.com/v1/gifs/${endpoint}`, {
      params: { api_key: apiKey, q: query, limit: 24 }
    });
    setGifs(data.data);
  }, [apiKey]);

  useEffect(() => {
    const handler = setTimeout(() => fetchGifs(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm, fetchGifs]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1f26] rounded-lg shadow-xl w-full max-w-lg p-4 flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Select a GIF</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X /></button>
        </div>
        <input
          type="text"
          placeholder="Search GIPHY"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded-lg mb-4 focus:outline-none"
        />
        <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1">
          {gifs.map(gif => (
            <img key={gif.id} src={gif.images.fixed_width.url} alt={gif.title} onClick={() => onGifSelect(gif.images.original.url)} className="cursor-pointer rounded hover:opacity-80" />
          ))}
        </div>
      </div>
    </div>
  );
}