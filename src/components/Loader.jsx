import React from 'react'

const Loader = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[80vh] bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden'>
      {/* Road Surface Background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 via-gray-700 to-transparent opacity-30"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-900 opacity-60"></div>
      
      {/* Enhanced Car Wheel with Ultra-Realistic Effects */}
      <div className='relative'>
        {/* Multiple Smoke Layers for Realism */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 z-0">
          {/* Ground Dust Cloud */}
          <div className="absolute w-16 h-4 bg-gradient-radial from-yellow-200/30 via-gray-300/20 to-transparent rounded-full blur-md animate-dust-cloud"></div>
          
          {/* Tire Smoke Particles */}
          <div className="relative">
            {/* Dense Smoke */}
            <div className="absolute w-3 h-3 bg-gray-500 rounded-full opacity-70 animate-smoke-dense-1 blur-sm"></div>
            <div className="absolute w-2.5 h-2.5 bg-gray-400 rounded-full opacity-60 animate-smoke-dense-2 blur-sm"></div>
            <div className="absolute w-4 h-4 bg-gray-600 rounded-full opacity-50 animate-smoke-dense-3 blur-md"></div>
            
            {/* Light Smoke */}
            <div className="absolute w-2 h-2 bg-gray-300 rounded-full opacity-40 animate-smoke-light-1 blur-md"></div>
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full opacity-30 animate-smoke-light-2 blur-lg"></div>
            <div className="absolute w-2.5 h-2.5 bg-gray-100 rounded-full opacity-20 animate-smoke-light-3 blur-xl"></div>
            
            {/* Heat Distortion Effect */}
            <div className="absolute w-8 h-6 bg-gradient-to-t from-orange-200/20 to-transparent rounded-full animate-heat-wave blur-lg"></div>
          </div>
        </div>

        {/* Main Wheel Container with Ultra-Realistic Design */}
        <div className='relative z-10'>
          {/* Tire with Advanced Details */}
          <div className='wheel-container w-20 h-20 rounded-full relative overflow-hidden shadow-2xl' style={{
            background: 'linear-gradient(135deg, #111827 0%, #000000 50%, #1f2937 100%)',
            border: '3px solid #374151'
          }}>
            {/* Tire Rubber with Realistic Texture */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-600" style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #000000 30%, #111827 70%, #1f2937 100%)'
            }}>
              {/* Tire Sidewall Text and Patterns */}
              <div className="absolute inset-1 rounded-full border border-gray-600">
                {/* Brand Text Simulation */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs font-bold opacity-60 whitespace-nowrap overflow-hidden">ROYAL</div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs opacity-50">P225/60R16</div>
                
                {/* Tire Pattern Lines */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-0.5 h-1.5 bg-gray-600 rounded"
                    style={{
                      top: '4px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${i * 30}deg)`,
                      transformOrigin: '50% 32px'
                    }}
                  ></div>
                ))}
              </div>

              {/* Alloy Rim with Chrome Effect - Enhanced Visibility */}
              <div className='absolute inset-3 rounded-full shadow-2xl border-2 border-white rim-reflection' style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 20%, #cbd5e1 40%, #94a3b8 60%, #64748b 80%, #475569 100%)',
                boxShadow: 'inset 0 4px 12px rgba(255,255,255,0.8), inset 0 -4px 12px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.5)'
              }}>
                {/* 5-Spoke Premium Design */}
                <div className='absolute inset-1 rounded-full flex items-center justify-center' style={{
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)'
                }}>
                  {/* Realistic Spokes with Depth */}
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-1.5 h-3/4 rounded-full shadow-lg spoke-shadow"
                      style={{
                        background: 'linear-gradient(to bottom, #f1f5f9 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f1f5f9 100%)',
                        transform: `rotate(${i * 72}deg)`,
                        transformOrigin: '50% 50%',
                        boxShadow: '2px 2px 4px rgba(0,0,0,0.3), -1px -1px 2px rgba(255,255,255,0.8)'
                      }}
                    ></div>
                  ))}
                  
                  {/* Spoke Bolts - More Visible */}
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={`bolt-${i}`}
                      className="absolute w-2 h-2 rounded-full shadow-lg border-2 border-gray-300"
                      style={{
                        background: 'radial-gradient(circle, #64748b 0%, #374151 70%, #1f2937 100%)',
                        top: '25%',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${i * 72}deg)`,
                        transformOrigin: '50% 100%',
                        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    ></div>
                  ))}
                  
                  {/* Center Hub with Brand Logo - Enhanced */}
                  <div className='w-7 h-7 rounded-full shadow-2xl z-20 border-3 border-white flex items-center justify-center relative hub-glow' style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%)',
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)'
                  }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center border border-blue-300" style={{
                      background: 'linear-gradient(135deg, #60a5fa 0%, #1e40af 100%)'
                    }}>
                      <div className="text-white text-sm font-bold tracking-wider drop-shadow-sm">R</div>
                    </div>
                    {/* Chrome Ring Effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-gray-200 shadow-lg chrome-ring"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Tire Treads with Realistic Pattern */}
              {/* Main Treads */}
              <div className="absolute top-0 left-1/2 w-1.5 h-3 bg-gray-800 transform -translate-x-1/2 rounded-b-lg shadow-md"></div>
              <div className="absolute bottom-0 left-1/2 w-1.5 h-3 bg-gray-800 transform -translate-x-1/2 rounded-t-lg shadow-md"></div>
              <div className="absolute left-0 top-1/2 h-1.5 w-3 bg-gray-800 transform -translate-y-1/2 rounded-r-lg shadow-md"></div>
              <div className="absolute right-0 top-1/2 h-1.5 w-3 bg-gray-800 transform -translate-y-1/2 rounded-l-lg shadow-md"></div>
              
              {/* Diagonal Tread Pattern */}
              {[...Array(8)].map((_, i) => (
                <div 
                  key={`tread-${i}`}
                  className="absolute w-0.5 h-2 bg-gray-700 rounded"
                  style={{
                    top: '12px',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${i * 45 + 22.5}deg)`,
                    transformOrigin: '50% 28px'
                  }}
                ></div>
              ))}
              
              {/* Inner Tread Details */}
              {[...Array(16)].map((_, i) => (
                <div 
                  key={`inner-tread-${i}`}
                  className="absolute w-0.5 h-1 bg-gray-600 rounded opacity-60"
                  style={{
                    top: '18px',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${i * 22.5}deg)`,
                    transformOrigin: '50% 22px'
                  }}
                ></div>
              ))}
            </div>

            {/* Wheel Motion Blur Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse blur-sm"></div>
            
            {/* Reflection and Glare Effects */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full blur-sm wheel-glare"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          </div>
        </div>
        
        {/* Advanced Road Effects */}
        <div className='absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent opacity-50 blur-sm z-0'></div>
        <div className='absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-0.5 bg-gradient-to-r from-transparent via-black to-transparent opacity-70 z-0'></div>
        
        {/* Tire Skid Marks */}
        <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-gradient-to-t from-gray-900 to-transparent opacity-40 blur-sm skid-mark'></div>
      </div>
      
      {/* Loading text with enhanced styling */}
      <div className='mt-12 text-center z-10'>
        <h3 className='text-xl font-semibold text-gray-700 mb-2 tracking-wide'>Loading...</h3>
        <p className='text-sm text-gray-500 animate-pulse font-medium'>Preparing your premium ride</p>
      </div>
      
      {/* Enhanced animated dots */}
      <div className='flex space-x-2 mt-4 z-10'>
        <div className='w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce shadow-lg'></div>
        <div className='w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce shadow-lg' style={{animationDelay: '0.1s'}}></div>
        <div className='w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce shadow-lg' style={{animationDelay: '0.2s'}}></div>
      </div>

      {/* Ultra-Realistic CSS Animation Styles */}
      <style jsx>{`
        /* Advanced Wheel Animations - Fixed Rotation */
        .wheel-container {
          animation: spin-slow 4s linear infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes wheel-shake {
          0% { transform: translateY(0px); }
          100% { transform: translateY(0.3px); }
        }
        
        /* Rim Reflection Effect */
        .rim-reflection {
          position: relative;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.1), inset 0 -2px 8px rgba(255,255,255,0.8);
        }
        
        .rim-reflection::before {
          content: '';
          position: absolute;
          top: 15%;
          left: 20%;
          width: 25%;
          height: 25%;
          background: linear-gradient(45deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4));
          border-radius: 50%;
          filter: blur(1px);
          animation: reflection-shine 3s ease-in-out infinite;
        }
        
        .rim-reflection::after {
          content: '';
          position: absolute;
          top: 10%;
          right: 15%;
          width: 15%;
          height: 40%;
          background: linear-gradient(90deg, rgba(255,255,255,0.6), transparent);
          border-radius: 50%;
          filter: blur(2px);
          animation: reflection-shine 3s ease-in-out infinite reverse;
        }
        
        @keyframes reflection-shine {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        
        /* Spoke Shadow Effects */
        .spoke-shadow {
          filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
        }
        
        /* Hub Glow Effect - Slower for Better Visibility */
        .hub-glow {
          animation: hub-pulse 3s ease-in-out infinite;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
        }
        
        @keyframes hub-pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }
          50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.9), 0 0 35px rgba(147, 51, 234, 0.4); }
        }
        
        /* Chrome Ring Effect - Slower Animation */
        .chrome-ring {
          background: linear-gradient(45deg, #e5e7eb, #f9fafb, #e5e7eb);
          animation: chrome-gleam 6s linear infinite;
        }
        
        @keyframes chrome-gleam {
          0%, 100% { border-color: #d1d5db; }
          25% { border-color: #f3f4f6; }
          50% { border-color: #ffffff; }
          75% { border-color: #f3f4f6; }
        }
        
        /* Wheel Glare Effect */
        .wheel-glare {
          animation: glare-move 2.5s ease-in-out infinite;
        }
        
        @keyframes glare-move {
          0% { opacity: 0.3; transform: translate(0, 0); }
          25% { opacity: 0.6; transform: translate(10px, -5px); }
          50% { opacity: 0.8; transform: translate(15px, -10px); }
          75% { opacity: 0.4; transform: translate(5px, -15px); }
          100% { opacity: 0.3; transform: translate(0, 0); }
        }
        
        /* Advanced Smoke Animations */
        @keyframes smoke-dense-1 {
          0% {
            transform: translateY(0) translateX(-2px) scale(0.6);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-12px) translateX(-6px) scale(0.9);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-25px) translateX(-12px) scale(1.4);
            opacity: 0;
          }
        }
        
        @keyframes smoke-dense-2 {
          0% {
            transform: translateY(0) translateX(2px) scale(0.5);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-15px) translateX(7px) scale(0.8);
            opacity: 0.4;
          }
          100% {
            transform: translateY(-30px) translateX(15px) scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes smoke-dense-3 {
          0% {
            transform: translateY(0) translateX(0) scale(0.7);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-10px) translateX(-3px) scale(1.0);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-20px) translateX(-6px) scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes smoke-light-1 {
          0% {
            transform: translateY(0) translateX(3px) scale(0.3);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-18px) translateX(9px) scale(0.7);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-35px) translateX(18px) scale(1.1);
            opacity: 0;
          }
        }
        
        @keyframes smoke-light-2 {
          0% {
            transform: translateY(0) translateX(-4px) scale(0.4);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(-10px) scale(0.8);
            opacity: 0.15;
          }
          100% {
            transform: translateY(-40px) translateX(-20px) scale(1.3);
            opacity: 0;
          }
        }
        
        @keyframes smoke-light-3 {
          0% {
            transform: translateY(0) translateX(1px) scale(0.2);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-25px) translateX(4px) scale(0.9);
            opacity: 0.1;
          }
          100% {
            transform: translateY(-50px) translateX(8px) scale(1.6);
            opacity: 0;
          }
        }
        
        /* Dust Cloud Animation */
        @keyframes dust-cloud {
          0% {
            transform: scale(0.8) translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2) translateY(-5px);
            opacity: 0.1;
          }
          100% {
            transform: scale(1.5) translateY(-10px);
            opacity: 0;
          }
        }
        
        /* Heat Wave Effect */
        @keyframes heat-wave {
          0%, 100% {
            transform: scaleY(0.8) scaleX(1);
            opacity: 0.2;
          }
          25% {
            transform: scaleY(1.2) scaleX(0.9);
            opacity: 0.1;
          }
          50% {
            transform: scaleY(0.9) scaleX(1.1);
            opacity: 0.15;
          }
          75% {
            transform: scaleY(1.1) scaleX(0.95);
            opacity: 0.08;
          }
        }
        
        /* Skid Mark Animation */
        @keyframes skid-mark {
          0% {
            height: 0;
            opacity: 0;
          }
          50% {
            height: 8px;
            opacity: 0.4;
          }
          100% {
            height: 12px;
            opacity: 0.6;
          }
        }
        
        /* Apply Animations */
        .animate-smoke-dense-1 {
          animation: smoke-dense-1 2.2s infinite ease-out;
          animation-delay: 0s;
        }
        
        .animate-smoke-dense-2 {
          animation: smoke-dense-2 2.8s infinite ease-out;
          animation-delay: 0.3s;
        }
        
        .animate-smoke-dense-3 {
          animation: smoke-dense-3 2.5s infinite ease-out;
          animation-delay: 0.6s;
        }
        
        .animate-smoke-light-1 {
          animation: smoke-light-1 3.2s infinite ease-out;
          animation-delay: 0.9s;
        }
        
        .animate-smoke-light-2 {
          animation: smoke-light-2 3.5s infinite ease-out;
          animation-delay: 1.2s;
        }
        
        .animate-smoke-light-3 {
          animation: smoke-light-3 4s infinite ease-out;
          animation-delay: 1.5s;
        }
        
        .animate-dust-cloud {
          animation: dust-cloud 2s infinite ease-out;
          animation-delay: 0.2s;
        }
        
        .animate-heat-wave {
          animation: heat-wave 1.5s infinite ease-in-out;
        }
        
        .skid-mark {
          animation: skid-mark 3s ease-out forwards;
        }
        
        /* Gradient Radial Utility */
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}

export default Loader
