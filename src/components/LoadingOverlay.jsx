import React from 'react';
import CarWheelLoader from './CarWheelLoader';

// A component that provides a loading overlay for specific actions
const LoadingOverlay = ({ isLoading, message = "Loading...", children }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
          <div className="text-center">
            {/* Mini Car Wheel Loader */}
            <div className="flex justify-center mb-4">
              <svg 
                width="60" 
                height="60" 
                viewBox="0 0 100 100" 
                className="animate-spin"
                style={{ animationDuration: '1s' }}
              >
                {/* Outer tire */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="#2c2c2c"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                />
                
                {/* Inner rim */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="#c0c0c0"
                  stroke="#a0a0a0"
                  strokeWidth="1"
                />
                
                {/* Rim spokes */}
                <g stroke="#888" strokeWidth="2" strokeLinecap="round">
                  <line x1="50" y1="15" x2="50" y2="35" />
                  <line x1="50" y1="65" x2="50" y2="85" />
                  <line x1="15" y1="50" x2="35" y2="50" />
                  <line x1="65" y1="50" x2="85" y2="50" />
                  <line x1="32.3" y1="32.3" x2="46.5" y2="46.5" />
                  <line x1="67.7" y1="32.3" x2="53.5" y2="46.5" />
                  <line x1="32.3" y1="67.7" x2="46.5" y2="53.5" />
                  <line x1="67.7" y1="67.7" x2="53.5" y2="53.5" />
                </g>
                
                {/* Center hub */}
                <circle
                  cx="50"
                  cy="50"
                  r="12"
                  fill="#666"
                  stroke="#444"
                  strokeWidth="1"
                />
                
                {/* Hub logo/center */}
                <circle
                  cx="50"
                  cy="50"
                  r="6"
                  fill="#333"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for using loading state with CarWheelLoader
export const useCarWheelLoader = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);
  
  const withLoader = async (asyncFunction, loadingMessage) => {
    showLoader();
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      hideLoader();
    }
  };
  
  return {
    isLoading,
    showLoader,
    hideLoader,
    withLoader,
    LoaderOverlay: ({ children, message }) => (
      <LoadingOverlay isLoading={isLoading} message={message}>
        {children}
      </LoadingOverlay>
    ),
    FullPageLoader: () => isLoading ? <CarWheelLoader /> : null
  };
};

export default LoadingOverlay;
