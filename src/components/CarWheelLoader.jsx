import React from 'react';

const CarWheelLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <style jsx>{`
        @keyframes tireDragSmoke {
          0% { 
            transform: translateX(0) translateY(0) scale(0.5) rotate(0deg); 
            opacity: 0.9; 
          }
          15% { 
            transform: translateX(-8px) translateY(-3px) scale(0.8) rotate(15deg); 
            opacity: 0.8; 
          }
          30% { 
            transform: translateX(-15px) translateY(-8px) scale(1.1) rotate(30deg); 
            opacity: 0.7; 
          }
          50% { 
            transform: translateX(-25px) translateY(-15px) scale(1.4) rotate(45deg); 
            opacity: 0.5; 
          }
          70% { 
            transform: translateX(-35px) translateY(-25px) scale(1.7) rotate(60deg); 
            opacity: 0.3; 
          }
          85% { 
            transform: translateX(-45px) translateY(-35px) scale(2.0) rotate(75deg); 
            opacity: 0.15; 
          }
          100% { 
            transform: translateX(-55px) translateY(-45px) scale(2.3) rotate(90deg); 
            opacity: 0; 
          }
        }
        
        @keyframes tireDragSmokeRight {
          0% { 
            transform: translateX(0) translateY(0) scale(0.5) rotate(0deg); 
            opacity: 0.9; 
          }
          15% { 
            transform: translateX(8px) translateY(-3px) scale(0.8) rotate(-15deg); 
            opacity: 0.8; 
          }
          30% { 
            transform: translateX(15px) translateY(-8px) scale(1.1) rotate(-30deg); 
            opacity: 0.7; 
          }
          50% { 
            transform: translateX(25px) translateY(-15px) scale(1.4) rotate(-45deg); 
            opacity: 0.5; 
          }
          70% { 
            transform: translateX(35px) translateY(-25px) scale(1.7) rotate(-60deg); 
            opacity: 0.3; 
          }
          85% { 
            transform: translateX(45px) translateY(-35px) scale(2.0) rotate(-75deg); 
            opacity: 0.15; 
          }
          100% { 
            transform: translateX(55px) translateY(-45px) scale(2.3) rotate(-90deg); 
            opacity: 0; 
          }
        }
        
        @keyframes rubberDust {
          0% { 
            transform: translateX(0) translateY(0) scale(0.3) rotate(0deg); 
            opacity: 0.8; 
          }
          25% { 
            transform: translateX(-5px) translateY(-2px) scale(0.5) rotate(90deg); 
            opacity: 0.6; 
          }
          50% { 
            transform: translateX(-8px) translateY(-6px) scale(0.7) rotate(180deg); 
            opacity: 0.4; 
          }
          75% { 
            transform: translateX(-12px) translateY(-12px) scale(0.9) rotate(270deg); 
            opacity: 0.2; 
          }
          100% { 
            transform: translateX(-15px) translateY(-20px) scale(1.1) rotate(360deg); 
            opacity: 0; 
          }
        }
        
        @keyframes roadHeat {
          0% { 
            transform: translateY(0) scaleX(1) scaleY(0.5); 
            opacity: 0.6; 
          }
          50% { 
            transform: translateY(-10px) scaleX(1.5) scaleY(1); 
            opacity: 0.4; 
          }
          100% { 
            transform: translateY(-20px) scaleX(2) scaleY(1.5); 
            opacity: 0; 
          }
        }
        
        .tire-drag-left {
          animation: tireDragSmoke 3s infinite ease-out;
        }
        
        .tire-drag-right {
          animation: tireDragSmokeRight 3s infinite ease-out;
        }
        
        .rubber-dust {
          animation: rubberDust 2s infinite ease-out;
        }
        
        .road-heat {
          animation: roadHeat 4s infinite ease-out;
        }
      `}</style>
      
      <div className="flex flex-col items-center">
        {/* Car Wheel SVG with Smoke */}
        <div className="relative">
          {/* Smoke Effect at Base of Tire - Realistic Tire Drag */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
            {/* Road heat distortion effect */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`heat-${i}`}
                className="absolute w-6 h-2 bg-gray-200 rounded-full road-heat opacity-30"
                style={{
                  left: `${-9 + i * 6}px`,
                  bottom: '-2px',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${3.5 + i * 0.5}s`,
                  filter: 'blur(3px)',
                }}
              />
            ))}
            
            {/* Tire drag smoke - Left side */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`drag-left-${i}`}
                className="absolute w-2 h-2 bg-gray-500 rounded-full tire-drag-left"
                style={{
                  left: `${-1 - i * 1.5}px`,
                  bottom: `${0 + (i % 2)}px`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2.8 + (i % 3) * 0.4}s`,
                  filter: 'blur(1.5px)',
                }}
              />
            ))}
            
            {/* Tire drag smoke - Right side */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`drag-right-${i}`}
                className="absolute w-2 h-2 bg-gray-500 rounded-full tire-drag-right"
                style={{
                  left: `${1 + i * 1.5}px`,
                  bottom: `${0 + (i % 2)}px`,
                  animationDelay: `${i * 0.3 + 0.15}s`,
                  animationDuration: `${2.8 + (i % 3) * 0.4}s`,
                  filter: 'blur(1.5px)',
                }}
              />
            ))}
            
            {/* Rubber dust particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`rubber-${i}`}
                className="absolute w-1 h-1 bg-gray-700 rounded-full rubber-dust"
                style={{
                  left: `${-6 + i * 1}px`,
                  bottom: `${-1 + (i % 3)}px`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: `${1.8 + (i % 3) * 0.3}s`,
                }}
              />
            ))}
            
            {/* Dense contact smoke at tire base */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`contact-${i}`}
                className="absolute w-1.5 h-1.5 bg-gray-600 rounded-full opacity-70"
                style={{
                  left: `${-3 + i * 1}px`,
                  bottom: '0px',
                  animation: `tireDragSmoke ${2 + i * 0.2}s infinite ease-out`,
                  animationDelay: `${i * 0.1}s`,
                  filter: 'blur(1px)',
                }}
              />
            ))}
            
            {/* Tire contact patches and skid marks */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-0">
              {/* Main contact patch */}
              <div className="w-12 h-2 bg-gray-800 rounded-full opacity-25 blur-sm"></div>
              {/* Skid mark streaks */}
              <div className="flex justify-center space-x-0.5 mt-0.5">
                <div className="w-0.5 h-2 bg-gray-700 rounded-full opacity-20 blur-sm"></div>
                <div className="w-0.5 h-1.5 bg-gray-700 rounded-full opacity-20 blur-sm"></div>
                <div className="w-0.5 h-2 bg-gray-700 rounded-full opacity-20 blur-sm"></div>
              </div>
            </div>
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
            
            {/* Rolls Royce Spirit of Ecstasy Logo */}
            <g transform="translate(50, 50)">
              {/* Background circle for logo */}
              <circle cx="0" cy="0" r="5" fill="#1a1a1a" stroke="#444" strokeWidth="0.5"/>
              
              {/* Simplified Spirit of Ecstasy silhouette */}
              <g transform="scale(0.15)" fill="#c0c0c0">
                {/* Wings */}
                <path d="M-15,-8 Q-12,-12 -8,-10 Q-4,-8 0,-6 Q4,-8 8,-10 Q12,-12 15,-8 Q10,-4 8,-2 Q4,0 0,2 Q-4,0 -8,-2 Q-10,-4 -15,-8 Z" />
                {/* Body/dress flowing */}
                <path d="M-3,-6 Q0,-8 3,-6 Q2,-2 1,4 Q0,8 -1,4 Q-2,-2 -3,-6 Z" />
                {/* Head */}
                <circle cx="0" cy="-8" r="2" />
                {/* Hair flowing back */}
                <path d="M-2,-10 Q-4,-12 -6,-10 Q-4,-8 -2,-8 Z" />
                <path d="M2,-10 Q4,-12 6,-10 Q4,-8 2,-8 Z" />
              </g>
              
              {/* RR initials below */}
              <g transform="translate(0, 3)" fill="#888" fontSize="3" fontFamily="serif" textAnchor="middle">
                <text x="-1.5" y="1" fontWeight="bold">R</text>
                <text x="1.5" y="1" fontWeight="bold">R</text>
              </g>
            </g>
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
