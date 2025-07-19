import React from 'react'

const LoaderRealistic = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[80vh] bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 relative overflow-hidden'>
      {/* Realistic Road Surface */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gray-900"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 opacity-20"></div>
      
      {/* Enhanced Car Wheel with Ultra-Realistic Effects */}
      <div className='relative'>
        {/* Advanced Smoke and Heat Effects */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 z-0">
          {/* Tire Smoke - Multiple Layers */}
          <div className="relative">
            {/* Dense White Smoke */}
            <div className="absolute w-4 h-4 bg-white rounded-full opacity-80 animate-realistic-smoke-1 blur-sm"></div>
            <div className="absolute w-3 h-3 bg-gray-100 rounded-full opacity-70 animate-realistic-smoke-2 blur-sm"></div>
            <div className="absolute w-5 h-5 bg-gray-200 rounded-full opacity-60 animate-realistic-smoke-3 blur-md"></div>
            <div className="absolute w-2 h-2 bg-white rounded-full opacity-90 animate-realistic-smoke-4 blur-sm"></div>
            <div className="absolute w-3 h-3 bg-gray-50 rounded-full opacity-50 animate-realistic-smoke-5 blur-lg"></div>
            
            {/* Rubber Burn Particles */}
            <div className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-80 animate-spark-1"></div>
            <div className="absolute w-0.5 h-0.5 bg-red-500 rounded-full opacity-90 animate-spark-2"></div>
          </div>
          
          {/* Ground Contact Heat Distortion */}
          <div className="absolute w-12 h-3 bg-gradient-to-t from-orange-300/30 to-transparent rounded-full animate-heat-distortion blur-md"></div>
        </div>

        {/* Realistic Car Wheel */}
        <div className='relative z-10'>
          {/* Main Wheel Container - Premium Sports Car Style */}
          <div className='wheel-container w-24 h-24 rounded-full relative shadow-2xl' style={{
            background: 'radial-gradient(circle at 30% 30%, #1a1a1a 0%, #000000 40%, #0a0a0a 100%)',
            border: '4px solid #2a2a2a',
            boxShadow: '0 0 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.1)'
          }}>
            
            {/* Tire Sidewall with Real Branding */}
            <div className="absolute inset-1 rounded-full border border-gray-700" style={{
              background: 'radial-gradient(circle at 40% 40%, #2a2a2a 0%, #1a1a1a 50%, #000000 100%)'
            }}>
              {/* Realistic Tire Brand Text */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs font-bold opacity-80">ROYAL</div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs opacity-70">SPORT 255/35ZR19</div>
              
              {/* DOT Compliance Markings */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-xs opacity-50 rotate-90">DOT</div>
              
              {/* Tire Tread Pattern - Realistic */}
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-0.5 h-2 bg-gray-600 rounded opacity-80"
                  style={{
                    top: '6px',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${i * 22.5}deg)`,
                    transformOrigin: '50% 42px'
                  }}
                ></div>
              ))}
            </div>

            {/* Premium Alloy Rim - Sport Car Style */}
            <div className='absolute inset-4 rounded-full shadow-2xl border-2 border-gray-300' style={{
              background: 'radial-gradient(circle at 30% 30%, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)',
              boxShadow: 'inset 0 6px 20px rgba(255,255,255,0.9), inset 0 -6px 20px rgba(0,0,0,0.3), 0 0 25px rgba(255,255,255,0.4)'
            }}>
              
              {/* Sport Rim Design with Y-Spoke Pattern */}
              <div className='absolute inset-1 rounded-full' style={{
                background: 'radial-gradient(circle at 35% 35%, #f1f5f9 0%, #e2e8f0 40%, #cbd5e1 100%)'
              }}>
                
                {/* 5-Spoke Y-Design (Sports Car Style) */}
                {[...Array(5)].map((_, i) => (
                  <div key={`spoke-group-${i}`} style={{ transform: `rotate(${i * 72}deg)`, transformOrigin: '50% 50%', position: 'absolute', width: '100%', height: '100%' }}>
                    {/* Main Spoke */}
                    <div 
                      className="absolute w-1.5 h-4/5 rounded-full shadow-lg"
                      style={{
                        background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 60%, #94a3b8 100%)',
                        left: '50%',
                        top: '10%',
                        transform: 'translateX(-50%)',
                        boxShadow: '2px 2px 6px rgba(0,0,0,0.4), -1px -1px 3px rgba(255,255,255,0.8)'
                      }}
                    ></div>
                    {/* Y-Fork Left */}
                    <div 
                      className="absolute w-1 h-3 rounded-full shadow-md"
                      style={{
                        background: 'linear-gradient(to bottom, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)',
                        left: '40%',
                        top: '65%',
                        transform: 'translateX(-50%) rotate(-25deg)',
                        transformOrigin: 'top center'
                      }}
                    ></div>
                    {/* Y-Fork Right */}
                    <div 
                      className="absolute w-1 h-3 rounded-full shadow-md"
                      style={{
                        background: 'linear-gradient(to bottom, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)',
                        left: '60%',
                        top: '65%',
                        transform: 'translateX(-50%) rotate(25deg)',
                        transformOrigin: 'top center'
                      }}
                    ></div>
                  </div>
                ))}
                
                {/* Lug Nuts - High-End Style */}
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={`lug-${i}`}
                    className="absolute w-2.5 h-2.5 rounded-full shadow-lg border border-gray-400"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #64748b 0%, #374151 60%, #1f2937 100%)',
                      top: '30%',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${i * 72}deg)`,
                      transformOrigin: '50% 70%',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 3px 6px rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* Lug Nut Detail */}
                    <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                  </div>
                ))}
                
                {/* Center Cap - Premium Brand Logo */}
                <div className='w-8 h-8 rounded-full shadow-2xl z-30 border-3 border-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hub-glow' style={{
                  background: 'radial-gradient(circle at 30% 30%, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), inset 0 3px 6px rgba(255,255,255,0.4)'
                }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-blue-300" style={{
                    background: 'radial-gradient(circle at 40% 40%, #60a5fa 0%, #2563eb 50%, #1e40af 100%)'
                  }}>
                    <div className="text-white text-sm font-bold tracking-wider drop-shadow-lg">R</div>
                  </div>
                  {/* Chrome Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-gray-200 shadow-lg chrome-ring"></div>
                </div>
              </div>
            </div>

            {/* Realistic Tire Tread Pattern */}
            {/* Main Directional Treads */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={`main-tread-${i}`}
                className="absolute w-1 h-4 bg-gray-800 rounded shadow-md"
                style={{
                  top: '8px',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                  transformOrigin: '50% 40px'
                }}
              ></div>
            ))}
            
            {/* Secondary Tread Pattern */}
            {[...Array(24)].map((_, i) => (
              <div 
                key={`sec-tread-${i}`}
                className="absolute w-0.5 h-2 bg-gray-700 rounded opacity-80"
                style={{
                  top: '12px',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${i * 15}deg)`,
                  transformOrigin: '50% 36px'
                }}
              ></div>
            ))}

            {/* Wheel Glare and Reflection Effects */}
            <div className="absolute top-3 left-3 w-4 h-4 bg-white rounded-full opacity-40 blur-sm wheel-glare"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
          </div>
        </div>
        
        {/* Enhanced Road Contact and Effects */}
        <div className='absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-36 h-2 bg-gradient-to-r from-transparent via-gray-900 to-transparent opacity-60 blur-sm z-0'></div>
        <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-black to-transparent opacity-80 z-0'></div>
        
        {/* Tire Contact Patch */}
        <div className='absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full opacity-70 z-0'></div>
        
        {/* Skid Marks */}
        <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-12 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent opacity-50 blur-sm skid-mark'></div>
      </div>
      
      {/* Loading text with enhanced styling */}
      <div className='mt-16 text-center z-10'>
        <h3 className='text-2xl font-bold text-white mb-3 tracking-wide'>Loading...</h3>
        <p className='text-sm text-gray-300 animate-pulse font-medium'>Preparing your premium ride</p>
      </div>
      
      {/* Enhanced animated dots */}
      <div className='flex space-x-3 mt-6 z-10'>
        <div className='w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg'></div>
        <div className='w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg' style={{animationDelay: '0.1s'}}></div>
        <div className='w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg' style={{animationDelay: '0.2s'}}></div>
      </div>

      {/* Ultra-Realistic CSS Animation Styles */}
      <style jsx>{`
        /* Realistic Wheel Animations */
        .wheel-container {
          animation: spin-realistic 3s linear infinite;
        }
        
        @keyframes spin-realistic {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Realistic Smoke Animations */
        @keyframes realistic-smoke-1 {
          0% {
            transform: translateY(0) translateX(-3px) scale(0.7);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-15px) translateX(-8px) scale(1.0);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-30px) translateX(-15px) scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes realistic-smoke-2 {
          0% {
            transform: translateY(0) translateX(3px) scale(0.5);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-18px) translateX(8px) scale(0.9);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-35px) translateX(16px) scale(1.3);
            opacity: 0;
          }
        }
        
        @keyframes realistic-smoke-3 {
          0% {
            transform: translateY(0) translateX(0) scale(0.8);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-12px) translateX(-3px) scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: translateY(-25px) translateX(-6px) scale(1.6);
            opacity: 0;
          }
        }
        
        @keyframes realistic-smoke-4 {
          0% {
            transform: translateY(0) translateX(4px) scale(0.3);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-20px) translateX(10px) scale(0.7);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-40px) translateX(20px) scale(1.1);
            opacity: 0;
          }
        }
        
        @keyframes realistic-smoke-5 {
          0% {
            transform: translateY(0) translateX(-5px) scale(0.6);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-25px) translateX(-12px) scale(1.0);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-50px) translateX(-25px) scale(1.8);
            opacity: 0;
          }
        }
        
        /* Spark Animations */
        @keyframes spark-1 {
          0% {
            transform: translateY(0) translateX(-2px) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-8px) translateX(-5px) scale(0.7);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-15px) translateX(-10px) scale(0.3);
            opacity: 0;
          }
        }
        
        @keyframes spark-2 {
          0% {
            transform: translateY(0) translateX(2px) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-6px) translateX(4px) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-12px) translateX(8px) scale(0.4);
            opacity: 0;
          }
        }
        
        /* Heat Distortion */
        @keyframes heat-distortion {
          0%, 100% {
            transform: scaleY(0.9) scaleX(1.1);
            opacity: 0.3;
          }
          25% {
            transform: scaleY(1.1) scaleX(0.9);
            opacity: 0.2;
          }
          50% {
            transform: scaleY(0.8) scaleX(1.2);
            opacity: 0.25;
          }
          75% {
            transform: scaleY(1.2) scaleX(0.8);
            opacity: 0.15;
          }
        }
        
        /* Hub Glow Effect */
        .hub-glow {
          animation: hub-pulse-realistic 2.5s ease-in-out infinite;
        }
        
        @keyframes hub-pulse-realistic {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), inset 0 3px 6px rgba(255,255,255,0.4);
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 1), 0 0 40px rgba(147, 51, 234, 0.5), inset 0 3px 6px rgba(255,255,255,0.6);
          }
        }
        
        /* Chrome Ring Effect */
        .chrome-ring {
          animation: chrome-gleam-realistic 4s linear infinite;
        }
        
        @keyframes chrome-gleam-realistic {
          0%, 100% { border-color: #e5e7eb; }
          25% { border-color: #f9fafb; }
          50% { border-color: #ffffff; }
          75% { border-color: #f3f4f6; }
        }
        
        /* Wheel Glare Effect */
        .wheel-glare {
          animation: glare-move-realistic 3s ease-in-out infinite;
        }
        
        @keyframes glare-move-realistic {
          0% { opacity: 0.4; transform: translate(0, 0) scale(1); }
          25% { opacity: 0.7; transform: translate(8px, -4px) scale(1.1); }
          50% { opacity: 0.9; transform: translate(12px, -8px) scale(1.2); }
          75% { opacity: 0.5; transform: translate(4px, -12px) scale(1.1); }
          100% { opacity: 0.4; transform: translate(0, 0) scale(1); }
        }
        
        /* Apply Animations */
        .animate-realistic-smoke-1 {
          animation: realistic-smoke-1 2.5s infinite ease-out;
          animation-delay: 0s;
        }
        
        .animate-realistic-smoke-2 {
          animation: realistic-smoke-2 3s infinite ease-out;
          animation-delay: 0.4s;
        }
        
        .animate-realistic-smoke-3 {
          animation: realistic-smoke-3 2.8s infinite ease-out;
          animation-delay: 0.8s;
        }
        
        .animate-realistic-smoke-4 {
          animation: realistic-smoke-4 3.2s infinite ease-out;
          animation-delay: 1.2s;
        }
        
        .animate-realistic-smoke-5 {
          animation: realistic-smoke-5 3.5s infinite ease-out;
          animation-delay: 1.6s;
        }
        
        .animate-spark-1 {
          animation: spark-1 1.5s infinite ease-out;
          animation-delay: 0.3s;
        }
        
        .animate-spark-2 {
          animation: spark-2 1.8s infinite ease-out;
          animation-delay: 0.7s;
        }
        
        .animate-heat-distortion {
          animation: heat-distortion 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default LoaderRealistic
