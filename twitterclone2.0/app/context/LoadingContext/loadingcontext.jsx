"use client";
import { createContext, useContext, useState } from "react";

// Create context
const LoadingContext = createContext();

// ✅ Correct hook export
export const useLoading = () => useContext(LoadingContext);

// ✅ Provider export
export const LoadingProviderClient = ({ children }) => {
  const [isAppLoading, setIsAppLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isAppLoading, setIsAppLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
