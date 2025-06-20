"use client";       

import { useState,useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileComponent from "../userprofile/page";
import Section2Content from "../home/page";
import Messages from "../Messages/page";
import More from "../More/page";
import Explore from "../explore/page"; // Fixed import name
import Community from "../Community/page";
import Notifications from "../notifications/page";
import Bookmarks from "../Bookmarks/page";
import useUserProfile from "../hooks/useUserProfile";
import { v4 as uuvid } from 'uuid';
import useUserSearch from "../hooks/useUserSearch";
import OtherProfileComponent from "../Otherprofile/page";
import Pirate from "../mappodop/page";
import RelevantPeople from "../component/RelevantPeople";
import Postbutton from "../component/postbutton";
import { WhatsHappening } from "../explore/page";
import Comment from "../component/commentsection";



export default  function HomePage() {

  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');
  const { results ,loading, searchUsers } = useUserSearch();
 const [showpostbutton,setshowpostbutton] = useState(false)
  useEffect(() => {
    const debounce = setTimeout(() => {
      searchUsers(query);
    }, 300);
    return () => clearTimeout(debounce);
  }, [query]);
  const { data: session, status } = useSession();
  const router = useRouter();
  // router.push('/userdetailvialogin')
  const [showPopup, setShowPopup] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [message, setMessage] = useState('');
  const userrealname = session?.user?.name || "User";
  const username = session?.user?.username || "username";
  const avatar = session?.user?.image || "https://via.placeholder.com/150";
  const email = session?.user?.email || ''
  const auth = session?.user?.provider
  const { data, loading1, error, getAllUsers, getFirstUser, createUser, updateUser, deleteUser } = useUserProfile();
  const [selectedArticle, setSelectedArticle] = useState(null);

  
  useEffect(() => {
    getFirstUser(email); 
  }, [session]);
  const handleUpdate = () => updateUser(email, { username: 'newUsername' });
  const handleDelete = () => deleteUser(email);
 
const handleArticleClick = (article) => {
  setSelectedArticle(article);
};

  
// useEffect(()=>{if(showpostbutton)
// {showpostbutton && (
//   <Postbutton 
//     showpostbutton = {showpostbutton}
//     setshowpostbutton={setshowpostbutton}
//     username={username}
//     userrealname={userrealname}
//     avatar={avatar}
//     email={email}
   
//   />
// )}

// },[showpostbutton])



 
  const handleGmailClick = () => {
    if (session) {
      setShowPopup((prev) => !prev);
    } else {
      signIn();
    }
  };




  return (
    <>

      <script src="https://cdn.lordicon.com/lordicon.js"></script>
      <div className="containere w-[100%]">
        <div className="section section1">
                  <div className="logo justify-center flex">
           <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="invert w-9 mb-3 mt-1"
            >
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </g>
            </svg>
          </div>




          <div className="icons flex flex-col items-start  relative left-[30%] w-[50%] gap-4">
            {/* Navigation items */}
            <div className="flex flex-col gap-3">
            {[
              { name: "Home", section: "Home", icon: 
                <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                <g>
                    <path
                        d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z">
                    </path>
                </g>
            </svg> },

              { name: "Explore", section: "Explore", icon: 
                <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                <g>
                    <path
                        d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z">
                    </path>
                </g>
            </svg> },

              { name: "Notifications", section: "Notifications", icon: 
                <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                <g>
                    <path
                        d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z">
                    </path>
                </g>
            </svg> },

              { name: "Messages", section: "Messages", icon: 
                <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                              <g>
                                  <path
                                      d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z">
                                  </path>
                              </g>
                          </svg>},

              { name: "Bookmarks", section: "Bookmarks", icon: 
                <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                              <g>
                                  <path
                                      d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z">
                                  </path>
                              </g>
                          </svg>},

              { name: "Community", section: "Community", icon: 
                <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                              <g>
                              <path
                                  d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z">
                              </path>
                              </g>
                          </svg> },

              { name: "Profile", section: "ProfileComponent", icon: 
                              <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                              <g>
                                  <path
                                      d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z">
                                  </path>
                              </g>
                          </svg> },
              // { name: "Pirate", section: "Pirate", icon: 
              //                 <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
              //                 <g>
              //                     <path
              //                         d="M2 21.494C3.2945 21.5899 4.38367 20.5 5.33333 20.5C6.283 20.5 7.82473 21.5053 8.66667 21.494C9.67699 21.5025 10.8604 20.5 12 20.5C13.1396 20.5 14.323 21.5025 15.3333 21.494C16.6278 21.5899 17.717 20.5 18.6667 20.5C19.6163 20.5 21.1581 21.5053 22 21.494">
              //                     </path>
              //                 </g>
              //             </svg> },

              { name: "More", section: "More", icon: 
                              <svg viewBox="0 0 24 24" aria-hidden="true" className="invert w-8 m-2 p-1">
                              <g>
                                  <path
                                      d="M3.75 12c0-4.56 3.69-8.25 8.25-8.25s8.25 3.69 8.25 8.25-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12zM12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-4.75 11.5c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25S6 11.31 6 12s.56 1.25 1.25 1.25zm9.5 0c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zM13.25 12c0 .69-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25z">
                                  </path>
                              </g>
                          </svg> }
            ].map((item) => (
             
              <div
              key={item.section}
              className="icon flex   rounded-3xl hover:bg-slate-900 hover:border-slate-300 cursor-pointer w-full p-2"
              onClick={() => setActiveSection(item.section)}
              >
                {item.icon}
                <div className="textu">{item.name}</div>
              </div>
              
            ))}
   </div>
          </div>

          {/* Post button and profile section */}
          <div className="button bg-white flex justify-center w-12 font-extrabold font-sans rounded-3xl h-11 relative left-[30%] mt-3 cursor-pointer"  onClick={() => setshowpostbutton(true)} >
            <button className="cursor-pointer">Post</button>
          </div>
          
          <div 
            className="gmail flex absolute bottom-6 left-[6%] items-center space-x-1.5 hover:bg-slate-900 hover:border-slate-300 rounded-3xl px-6 py-2 cursor-pointer"
            onClick={handleGmailClick}
          >
                       <div className="image w-12 h-12 rounded-full bg-pink-500 text-green-300 relative overflow-hidden">
               {session?.user ? (
                <img
                  src={data?.profile?.avatar}
                  alt="${data?.username}'s profile "
                  className="absolute w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                   <span></span>
                 </div>
               )}
             </div>
             {session?.user ? (
               <div className="textu">{data?.username}</div>
            ) : (
              <div className="textu"></div>
            )}
          </div>
          {showPopup && (
    <div className="absolute left-40 mt-2 bg-white p-4 rounded shadow-md z-10">
      <p className="text-black mb-2">Do you want to sign out?</p>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={async () => {
            await signOut({
              redirect: true,
              callbackUrl: '/logged-out', // a neutral page
            });       
            setShowPopup(false);
          }}
        >
          Yes, Sign Out
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-700"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </button>
      </div>
     </div> 
  )}

          {/* </div> */}
                    {showPopup && (
    <div className="absolute left-40 mt-2 bg-white p-4 rounded shadow-md z-10">
      <p className="text-black mb-2">Do you want to sign out?</p>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={async () => {
            await signOut({ redirect: false });
            router.push("/login");
            setShowPopup(false);
          }}
        >
          Yes, Sign Out
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-700"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  )}

        </div>

        <div className="group w-full">
          <div className="section section2 w-[100%]">

{selectedArticle && (
  <div className="mt-4 bg-[#181818] p-4 rounded-lg">
    <button onClick={() => setSelectedArticle(null)} className="text-blue-400 underline mb-2">← Back</button>
    <h2 className="text-xl font-bold mb-2">{selectedArticle.webTitle}</h2>
    {selectedArticle.thumbnail && (
      <img src={selectedArticle.thumbnail} alt="Thumbnail" className="rounded mb-4 max-h-[300px] object-cover" />
    )}
    <div dangerouslySetInnerHTML={{ __html: selectedArticle.body }} className="prose prose-invert max-w-none text-white" />
  </div>
)}


            {selectedUser && <OtherProfileComponent 
          userrealname={selectedUser?.profile?.displayName}
          username={selectedUser?.username}
          avatar={selectedUser?.profile?.avatar }
          followers = {selectedUser?.followers?.count}
          following = {selectedUser?.following?.count}
          createdAt = {selectedUser?.firstlogincreatedAt}
          email = {selectedUser?.email}
          bio = {selectedUser?.profile?.bio}
          location = {selectedUser?.profile?.location}
          onClose={() => setSelectedUser(null)}
           />  
          }
            {activeSection === "Home" && <Section2Content
                            userrealname={data?.profile?.displayName}
                            username={data?.username}
                            avatar={data?.profile?.avatar || "https://tse1.mm.bing.net/th?id=OIP.lcdOc6CAIpbvYx3XHfoJ0gHaF3&pid=Api&P=0&h=180" }
                            email = {data?.email}
           />}
            {activeSection === "Explore" && <Explore  email = {data?.email}/>}
            {activeSection === "Notifications" && <Notifications />}
            {activeSection === "Messages" && <Messages />}
            {activeSection === "Bookmarks" && <Bookmarks />}
            {activeSection === "Community" && <Community />}
            {activeSection === "ProfileComponent" && (
              <ProfileComponent
                userrealname={data?.profile?.displayName}
                username={data?.username}
                avatar={data?.profile?.avatar || "https://tse1.mm.bing.net/th?id=OIP.lcdOc6CAIpbvYx3XHfoJ0gHaF3&pid=Api&P=0&h=180"}
                followers = {data?.followers?.count}
                following = {data?.following?.count}
                createdAt = {data?.firstlogincreatedAt}
                email = {data?.email}
                location={data?.profile?.location }
                bio = {data?.profile?.bio}
              />
            )}
            {/* {activeSection === "Pirate" && <Pirate />} */}
            {/* {activeSection === "More" && <More />} */}
            {activeSection === "More" && <Comment />}
          </div>

          <div className="section section3">

     
          <div className="three flex-1 bg-black p-4 relative z-10">
   
      
<div className="relative px-4 py-3">
  {/* Search Input Container */}
  {activeSection !=="Explore" && <div className="flex searchbar items-center w-full bg-[#1a1a1a] border border-gray-600 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-white transition duration-200">
    {/* Search Icon */}
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="white"
      className="w-5 h-5 text-gray-400"
    >
      <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
    </svg>

    {/* Input */}
    <input
      type="text"
      placeholder="Search"
      className="bg-transparent outline-none border-none text-white placeholder-gray-400 pl-3 flex-1 text-sm sm:text-base"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  </div>}


</div>


        {query && (
 
  <div className="searchbox text-white two absolute z-50 bg-black px-4 py-4 my-5 mx-6 min-w-full overflow-y-scroll overflow-x-clip break-words align-middle text-lg font-bold flex flex-col justify-start items-start shadow-lg rounded-xl right-4 bottom-3">
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
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <span className="font-semibold">{user.username}</span>
      </div>
    ))
  ) : (
    <p className="text-gray-400">No results found.</p>
  )}
</div>

)}

   <div className="relevant two w-[70%] h-max[400px] border relative overflow-y-scroll z-20 border-gray-600 my-9 p-4 rounded-2xl bg-[#121212]">
      <h2 className="text-white font-extrabold text-xl mb-4">Relevant People</h2>

      <RelevantPeople email={email}  followers={data?.followers?.count} following={data?.following?.count} setSelectedUser={setSelectedUser}/>
    </div> 

 

{/* What's Happening Section */}
{/* <div className="two  happening w-[70%] max-h-[50vh] border border-gray-600 my-9 p-4 rounded-2xl bg-[#121212] overflow-y-auto relative z-20">
  <h2 className=" text-white font-extrabold text-xl mb-4">What's Happening</h2>
  <div className="text-white text-sm leading-relaxed space-y-2">
   
    <p>
      Random things happening. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil rerum dolorem ipsam vitae totam
      sit ab cum, unde officia similique accusantium vel est assumenda quae!
    </p>
    <p>
      Laudantium asperiores architecto, ex labore et ratione. Deserunt tenetur, praesentium iure, eius reprehenderit nihil
      voluptas minima ipsam dolorum quia omnis?
    </p>
  </div>
</div> */}

<WhatsHappening onArticleSelect={handleArticleClick} />


      </div>
    </div>


        
        </div>
      </div>

{showpostbutton && (
        <Postbutton 
          showpostbutton={showpostbutton}
          setshowpostbutton={setshowpostbutton}
          username={username}
          userrealname={userrealname}
          avatar={avatar}
          email={email}
        />
      )}

    </>
  );
}









