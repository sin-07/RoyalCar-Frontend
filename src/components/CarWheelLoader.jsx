import React from 'react';

const CarWheelLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <style jsx>{`
        @keyframes smokeFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.3; }
          100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
        }
        
        @keyframes smokeDrift {
          0% { transform: translateX(0) translateY(0) scale(0.8); opacity: 0.5; }
          25% { transform: translateX(-5px) translateY(-10px) scale(1); opacity: 0.4; }
          50% { transform: translateX(3px) translateY(-20px) scale(1.1); opacity: 0.3; }
          75% { transform: translateX(-2px) translateY(-30px) scale(1.2); opacity: 0.2; }
          100% { transform: translateX(0) translateY(-40px) scale(1.3); opacity: 0; }
        }
        
        .smoke-particle {
          animation: smokeFloat 2s infinite ease-out;
        }
        
        .smoke-drift {
          animation: smokeDrift 3s infinite ease-out;
        }
      `}</style>
      
      <div className="flex flex-col items-center">
        {/* Car Wheel SVG with Smoke */}
        <div className="relative">
          {/* Smoke Effect at Base of Tire */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
            {/* Main smoke particles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gray-400 rounded-full smoke-particle"
                style={{
                  left: `${-16 + i * 4}px`,
                  bottom: '0px',
                  animationDelay: `${i * 0.25}s`,
                  animationDuration: `${2 + (i % 3) * 0.5}s`,
                }}
              />
            ))}
            
            {/* Drifting smoke clouds */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`drift-${i}`}
                className="absolute w-3 h-3 bg-gray-300 rounded-full smoke-drift opacity-40"
                style={{
                  left: `${-12 + i * 4}px`,
                  bottom: `${5 + i * 3}px`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${2.5 + (i % 2) * 0.5}s`,
                }}
              />
            ))}
            
            {/* Small dust particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`dust-${i}`}
                className="absolute w-1 h-1 bg-gray-500 rounded-full opacity-30"
                style={{
                  left: `${-20 + i * 3.5}px`,
                  bottom: `${-2 + (i % 4)}px`,
                  animation: `smokeFloat ${1.5 + (i % 3) * 0.3}s infinite ease-out`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Royal Cars</h2>
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
