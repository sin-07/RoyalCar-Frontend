import React from 'react';

const CarWheelLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Car Wheel SVG */}
        <div className="relative">
          <svg 
            width="80" 
            height="80" 
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
              <line x1="67.68" y1="67.68" x2="53.54" y2="53.54" />
              <line x1="32.32" y1="32.32" x2="46.46" y2="46.46" />
              <line x1="32.32" y1="67.68" x2="46.46" y2="53.54" />
              <line x1="67.68" y1="32.32" x2="53.54" y2="46.46" />
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
        
        {/* Loading text */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Royal Car</h2>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-gray-600">Loading</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarWheelLoader;
