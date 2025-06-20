// // app/context/LoadingContext.js
// "use client";
// import { createContext, useContext, useState } from "react";

// const  LoadingContext = createContext();

// export default  useLoading = () => useContext(LoadingContext);

// export const LoadingProvider = ({ children }) => {
//   const [isAppLoading, setIsAppLoading] = useState(false);

//   return (
//     <LoadingContext.Provider value={{ isAppLoading, setIsAppLoading }}>
//       {children}
//     </LoadingContext.Provider>
//   );
// };
// app/context/LoadingContext.js
"use client";
import { createContext, useContext, useState } from "react";

// Create context
const LoadingContext = createContext();

// ✅ Correct hook export
export const useLoading = () => useContext(LoadingContext);

// ✅ Provider export
export const LoadingProvider = ({ children }) => {
  const [isAppLoading, setIsAppLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isAppLoading, setIsAppLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
