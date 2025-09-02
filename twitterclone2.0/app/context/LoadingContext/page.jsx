


export const dynamic = "force-dynamic"; // make sure page is not static
import { LoadingProviderClient } from "./loadingcontext";

export default function LoadingProvider() {
  return <LoadingProviderClient />;
}
// "use client";
// import { createContext, useContext, useState } from "react";

// // Create context
// const LoadingContext = createContext();

// // ✅ Correct hook export
// export const useLoading = () => useContext(LoadingContext);

// // ✅ Provider export
// export const LoadingProvider = ({ children }) => {
//   const [isAppLoading, setIsAppLoading] = useState(false);

//   return (
//     <LoadingContext.Provider value={{ isAppLoading, setIsAppLoading }}>
//       {children}
//     </LoadingContext.Provider>
//   );
// };
