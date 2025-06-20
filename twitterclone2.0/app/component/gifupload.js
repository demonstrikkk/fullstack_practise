

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
const apikey = process.env.NEXT_PUBLIC_APIKEY_GIPHY;

const GifSearch = ({ onGifSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const [isGifPickerVisible, setIsGifPickerVisible] = useState(true);
  const gifPickerRef = useRef(null);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Fetch Gifs from Giphy
  const fetchGifs = useCallback(async (query) => {
    try {
      const endpoint = query ? "search" : "trending";
      const params = {
        api_key: apikey,
        limit: 20,
        rating: 'g'
      };

      if (query) params.q = query;

      const response = await axios.get(`https://api.giphy.com/v1/gifs/${endpoint}`, { params });
      setGifs(response.data.data);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    }
  }, [apikey]);

  // Debounced version of fetchGifs
  const debouncedFetchGifs = useCallback(
    debounce((query) => fetchGifs(query), 50),
    [fetchGifs]
  );

  // Handle search term changes
  useEffect(() => {
    debouncedFetchGifs(searchTerm);
  }, [searchTerm, debouncedFetchGifs]);

 

  return (
    <div>
      {isGifPickerVisible && (
        <div className="relative inset-0 z-50 flex items-center bg-black justify-center">
          <div
            ref={gifPickerRef}
            className="w-3/4 max-w-md p-10  bg-black border-slate-800 border-2 rounded-lg shadow-lg text-black relative"
          >
            <div className="flex flex-row space-y-2 opacity-45 bg-black mx-2 my-4 rounded-full ">
              <input
                type="text"
                placeholder="Search for GIFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2    w-full text-white m-6 rounded-full   "
                style={{margin: "6px"}}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-0.5 mt-4 overflow-y-scroll two h-[50vh]">
              {gifs.map((gif) => (
                <img
                  key={gif.id}
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    onGifSelect(gif.images.fixed_height.url);
                    setIsGifPickerVisible(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GifSearch;

