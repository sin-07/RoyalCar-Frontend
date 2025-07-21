import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppContext } from './AppContext';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    // Optimized initial app loading
    const loadApp = async () => {
      // Reduced minimum loading time for better UX
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 400));
      
      // Quick connectivity check without blocking
      const quickCheck = fetch(`${import.meta.env.VITE_BASE_URL}/api/user/cars`, {
        method: 'HEAD', // HEAD request is faster than GET
        timeout: 1500 // 1.5 second timeout
      }).catch(() => null);
      
      try {
        // Wait for minimum time (no need to wait for API)
        await minLoadingTime;
        
        setInitialDataLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.log("App loading error:", error);
        setIsLoading(false);
      }
    };

    loadApp();
  }, []);

  const value = {
    isLoading,
    setIsLoading,
    initialDataLoaded,
    setInitialDataLoaded
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
