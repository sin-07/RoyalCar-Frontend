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
    // Initial app loading - optimized for production
    const loadApp = async () => {
      // Reduced minimum loading time for better UX
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800));
      
      // Maximum loading time to prevent infinite loading
      const maxLoadingTime = new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        // Try to fetch initial data (like cars) to check backend connectivity
        const dataPromise = fetch(`${import.meta.env.VITE_BASE_URL}/api/user/cars`)
          .then(res => res.json())
          .catch(() => null); // Don't fail if backend is slow/unavailable
        
        // Wait for either minimum time + data, or maximum time (whichever comes first)
        await Promise.race([
          Promise.all([minLoadingTime, dataPromise]),
          maxLoadingTime
        ]);
        
        setInitialDataLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.log("App loading error:", error);
        // Still proceed to load the app after minimum time
        await minLoadingTime;
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
