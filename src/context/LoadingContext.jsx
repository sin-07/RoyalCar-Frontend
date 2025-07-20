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
    // Initial app loading - wait for minimum time and data
    const loadApp = async () => {
      // Minimum loading time for smooth UX
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        // Wait for minimum loading time
        await minLoadingTime;
        
        setInitialDataLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.log("App loading error:", error);
        // Still proceed to load the app
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
