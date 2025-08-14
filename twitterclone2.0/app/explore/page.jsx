"use client"
import React, { useState, useEffect } from 'react';
import useUserSearch from "../hooks/useUserSearch";
import { useSession } from "next-auth/react";
import OtherProfileComponent from "../Otherprofile/page";

import { v4 as uuvid } from 'uuid';
import useUserProfile from "../hooks/useUserProfile";
import NewsPreferenceModal from '../component/NewsPreferenceModal';
const TABS = ['For You', 'Trending', 'News', 'Sports', 'Entertainment'];

import { supabase } from '../api/lib/supabaseClient';

export function WhatsHappening({ onArticleSelect }) {
  const [newsPreview, setNewsPreview] = useState({});

  useEffect(() => {
    const fetchPreview = async () => {
      const result = {};
      for (const tag of TABS) {
        try {
          const res = await fetch(`/api/news/view?tag=${tag.toLowerCase()}`);
          const data = await res.json();
          result[tag] = data.slice(0, 2); // only first 2 items
        } catch (e) {
          console.error(`Error loading ${tag} preview:`, e);
        }
      }
      setNewsPreview(result);
    };

    fetchPreview();
  }, []);

  return (
    <div className="happening w-full border border-gray-600 p-4 rounded-2xl bg-[#121212] overflow-y-auto relative z-20 two ">
      <h2 className="text-white font-extrabold text-xl mb-4">What&apos;s Happening</h2>
      {TABS.map((section) => (
        <div key={section} className="mb-4">
          <h3 className="text-blue-400 font-semibold text-md mb-2">{section}</h3>
          {newsPreview[section]?.map((article, index) => (
            <p
              key={index}
              onClick={() => onArticleSelect(article)}
              className="text-white text-sm cursor-pointer hover:text-blue-300 mb-1 truncate"
              title={article.webTitle}
            >
              • {article.webTitle}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}



export default function Exploree({email}) {
  // const { data: session, status } = useSession();
  // email = session?.user?.email || email;

  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { data, loading1, getAllUsers, getFirstUser, createUser, updateUser, deleteUser } = useUserProfile();
  const [activeTab, setActiveTab] = useState('News');
  const [newsData, setNewsData] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading2, setLoading2] = useState(false);
const [showPreferencesModal, setShowPreferencesModal] = useState(false);
const [showPrefModal, setShowPrefModal] = useState(false);

  const { results, loading, searchUsers } = useUserSearch();




const [loadingPreferences, setLoadingPreferences] = useState(true);

// const { data: session, status } = useSession();
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
const userEmail = session?.user?.email || email;

useEffect(() => {
  if (!userEmail) return;

  const checkPreferences = async () => {
    try {
      const res = await fetch(`/api/news/checkPreferences?email=${userEmail}`);
      const data = await res.json();
      if (!data.hasPreferences) setShowPrefModal(true);
    } catch (err) {
      console.error("Preference check failed:", err);
    } finally {
      setLoadingPreferences(false);
    }
  };

  checkPreferences();
}, [userEmail]);


  useEffect(() => {
    if (email) getFirstUser(email);
  }, [email]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchUsers(query);
    }, 300);
    return () => clearTimeout(debounce);
  }, [query]);



useEffect(() => {
  const fetchNews = async () => {
    setLoading2(true);

    try {
      let newsData = [];


      if (activeTab === 'For You' && userEmail) {
  const prefCheckRes = await fetch(`/api/news/checkPreferences?email=${userEmail}`);
  const { hasPreferences } = await prefCheckRes.json();

  if (!hasPreferences) {
    newsData = [];
  } else {
    const prefRes = await fetch(`/api/news/preferences?email=${userEmail}`);
    const { preferences } = await prefRes.json();

    if (Array.isArray(preferences) && preferences.length > 0) {
      const responses = await Promise.all(
        preferences.map(tag =>
          fetch(`/api/news/fetch?tag=${tag}&userEmail=${userEmail}`).then(res => res.json())
        )
      );

      const mixedNews = [];
      for (const news of responses) {
        mixedNews.push(...news.slice(0, Math.ceil(10 / preferences.length)));
      }

      newsData = mixedNews.sort(() => 0.5 - Math.random());
    }
  }
}
       else {
        // Default category view
        const res = await fetch(`/api/news/view?tag=${activeTab.toLowerCase()}`);
        newsData = await res.json();
      }

      // Final: Update state
      if (Array.isArray(newsData)) {
        setNewsData(newsData);
      } else {
        console.warn("❗ Expected array but got:", typeof newsData, newsData);
        setNewsData([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNewsData([]);
    }

    setLoading2(false);
  };

  fetchNews();
}, [activeTab, email]);





const [error, setError] = useState(null); // New state for error messages
const [loading3, setLoading3] = useState(true); // New state for loading indicator




  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };





  return (
    <div className="bg-black text-white min-h-screen p-4 relative ">
      {/* Header */}
      {!selectedUser && (
        <header className="flex items-center space-x-4 mb-6 sticky top-0 bg-black z-30">
          <input 
            className="w-full p-10 bg-gray-800 rounded-full createsearch" 
            placeholder="Search"
            type='text' 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="p-2 text-gray-400">⚙️</button>
        </header>
      )}

      {/* Profile View */}

{showPrefModal && <NewsPreferenceModal email={email} onClose={() => setShowPrefModal(false)} />}

      {selectedUser ? (
        <div className="z-40 relative">
          <OtherProfileComponent
            userrealname={selectedUser?.profile?.displayName}
            username={selectedUser?.username}
            avatar={selectedUser?.profile?.avatar}
            followers={selectedUser?.followers?.count}
            following={selectedUser?.following?.count}
            createdAt={selectedUser?.firstlogincreatedAt}
            email={selectedUser?.email}
            bio={selectedUser?.profile?.bio}
            onClose={() => setSelectedUser(null)}
          />
        </div>
      ) : (
        <>
          {/* Search Results */}
          {query && (
            <div className="fixed top-14 inset-0 z-50 flex justify-center items-start pt-32">
              <div className="bg-black p-6 rounded-xl shadow-2xl w-full max-w-2xl overflow-y-auto">
                {loading ? (
                  <p className="text-gray-300">Loading...</p>
                ) : results.length > 0 ? (
                  results.map((user) => (
                    <div
                      key={uuvid()}
                      className="gmail pale flex items-center space-x-2 w-full gap-4 border-b border-gray-500 pb-2 m-[2px] px-[4px] py-[6px] hover:bg-zinc-800 cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <img
                        src={user.profile?.avatar || "/default.png"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-semibold">{user.username}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No results found.</p>
                )}
              </div>
            </div>
          )}

          {/* News Navigation & Content */}
          <div className="p-6 text-white">
            <nav className="flex space-x-6 mb-6 text-gray-400 justify-between">
              {TABS.map((tab) => (
                <span
                  key={tab}
                  className={`cursor-pointer pb-1 transition-all ${
                    activeTab === tab ? 'text-white border-b-2 border-blue-500' : ''
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedArticle(null);
                  }}
                >
                  {tab}
                </span>
              ))}
            </nav>

            {/* News Article */}
            {loading2 ? (
              <p className="text-gray-400">Loading news...</p>
            ) : selectedArticle ? (
              <div className='max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-700 two'>
                <button onClick={handleBack} className="mb-4 text-blue-400 underline">
                  ← Back to headlines
                </button>
                <h2 className="text-2xl font-bold mb-2 ">{selectedArticle.webTitle}</h2>
                {selectedArticle.thumbnail && (
                  <img src={selectedArticle.thumbnail} alt="Thumbnail" className="mb-4 rounded-lg w-full max-h-[400px] object-cover" />
                )}
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.body }} className="prose prose-invert max-w-none" />
              </div>
            ) : (

   
              <div className="space-y-8 kiddospace max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-700 two ">
               
                 {newsData.map((item, index) => (
        <div
          key={item.id || index}
          className="flex gap-4 cursor-pointer hover:bg-gray-500 rounded-lg"
          onClick={() => handleArticleClick(item)}
        >
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt="Thumbnail"
              className="w-16 h-16 object-cover rounded-r-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              {TABS.includes(activeTab) ? activeTab.charAt(0) : 'N/A'}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold">{item.webTitle}</h3>
            {item.trailText && (
              <p
                className="text-gray-400 text-sm"
                dangerouslySetInnerHTML={{ __html: item.trailText }}
              />
            )}
          </div>
        </div>
      ))}

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};


