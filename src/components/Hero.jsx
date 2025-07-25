// 📁 src/pages/Hero.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import ci1Image from "../assets/ci1.jpg";
import ci3Image from "../assets/ci3.jpg";

const Hero = ({ user, token, getPersonalizedQuote }) => {
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [returnDateTime, setReturnDateTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const pickupLocationRef = useRef(null);
  const heroContainerRef = useRef(null);

  // Check if we need to focus on the booking form
  useEffect(() => {
    if (location.state?.focusBookingForm) {
      // Small delay to ensure component is fully rendered
      setTimeout(() => {
        // First scroll to the very top of the page, then to hero section
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Then scroll to hero section specifically
        setTimeout(() => {
          if (heroContainerRef.current) {
            heroContainerRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 300);
        
        // Then focus on the pickup location field
        setTimeout(() => {
          if (pickupLocationRef.current) {
            pickupLocationRef.current.focus();
            
            // Add visual highlight
            pickupLocationRef.current.style.border = '3px solid #3b82f6';
            pickupLocationRef.current.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.2)';
            pickupLocationRef.current.style.transform = 'scale(1.02)';
            pickupLocationRef.current.style.transition = 'all 0.3s ease';
            
            // For mobile, try to open the dropdown
            if (pickupLocationRef.current.tagName === 'SELECT') {
              // Small delay then click to open dropdown on mobile
              setTimeout(() => {
                pickupLocationRef.current.click();
              }, 100);
            }
            
            // Remove highlight after 4 seconds
            setTimeout(() => {
              if (pickupLocationRef.current) {
                pickupLocationRef.current.style.border = '';
                pickupLocationRef.current.style.boxShadow = '';
                pickupLocationRef.current.style.transform = '';
              }
            }, 4000);
            
            console.log('🎯 Successfully focused on pickup location field!');
          }
        }, 1000); // Wait for scroll to complete
      }, 100); // Small initial delay
      
      // Clear the state to prevent re-focusing on subsequent renders
      navigate('/', { 
        state: null, 
        replace: true 
      });
    }
  }, [location.state, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!pickupDateTime || !returnDateTime || !pickupLocation) {
      alert("Please fill all fields.");
      return;
    }

    const pickupDT = new Date(pickupDateTime);
    const returnDT = new Date(returnDateTime);
    const now = new Date();

    // Check if pickup time is in the past
    if (pickupDT < now) {
      alert("Pickup time cannot be in the past.");
      return;
    }

    // Check if booking duration is at least 24 hours
    const durationHours = (returnDT - pickupDT) / (1000 * 60 * 60);
    if (durationHours < 24) {
      alert("Booking must be at least 24 hours long.");
      return;
    }

    // Navigate immediately without delay
    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDateTime=${pickupDateTime}&returnDateTime=${returnDateTime}`,
      { replace: true }
    );
  };

  return (
    <>
      <motion.div 
        id="hero"
        ref={heroContainerRef}
        className="hero-container relative bg-cover bg-center bg-no-repeat"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          backgroundImage: `url(${ci3Image})`,
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          maxWidth: '100%',
          overflow: 'hidden',
          marginTop: '0px', // Ensure no gap with navbar
          paddingTop: '72px', // Add padding to avoid navbar overlap
          position: 'relative',
          zIndex: 1 // Lower z-index than navbar
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 z-2"></div>
        
        {/* Personalized Welcome Overlay for Logged-in Users */}
        {user && token && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-0 left-0 right-0 z-30 pt-20 md:pt-24"
          >
            <div className="max-w-7xl mx-auto px-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 120 }}
                className="mb-40 md:mb-48 lg:mb-56 xl:mb-64"
              >
                {/* Personalized Quote */}
                <motion.h2 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4"
                  style={{ 
                    textShadow: "2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)"
                  }}
                >
                  {getPersonalizedQuote(user.name)}
                </motion.h2>

                {/* User Name */}
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 md:mb-6"
                  style={{ 
                    textShadow: "2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)"
                  }}
                >
                  {user.name}!
                </motion.h1>
           
              </motion.div>
            </div>
          </motion.div>
        )}
        
        <style jsx>{`
          /* Remove background animation on mobile for better performance */
          .hero-container {
            background-attachment: fixed;
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;
            transition: all 0.3s ease-in-out;
            width: 100%;
            height: 100vh;
            min-height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
          }

          .hero-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: inherit;
            background-attachment: inherit;
            background-position: inherit;
            background-size: cover;
            background-repeat: no-repeat;
            animation: backgroundZoom 20s ease-in-out infinite;
            z-index: -1;
          }

          @keyframes backgroundZoom {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          /* Mobile optimizations - Disable animation for performance */
          @media (max-width: 768px) {
            .hero-container {
              background-attachment: scroll;
              background-position: center center;
              background-size: cover;
              min-height: 100vh;
              height: 100vh;
              width: 100vw;
              padding-top: 64px; /* Account for mobile navbar (py-4 = ~64px) */
            }
            
            .hero-container::before {
              animation: none; /* Disable animation on mobile */
              transform: none; /* Remove transforms */
            }
          }

          /* Tablet optimizations - Reduced animation */
          @media (min-width: 769px) and (max-width: 1024px) {
            .hero-container {
              background-attachment: scroll;
              background-position: center center;
              background-size: cover;
              min-height: 100vh;
              height: 100vh;
              width: 100vw;
              padding-top: 72px; /* Account for tablet navbar */
            }
            
            .hero-container::before {
              animation: backgroundZoomTablet 25s ease-in-out infinite;
            }
            
            @keyframes backgroundZoomTablet {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.02);
              }
            }
          }

          /* Large screens - Full animation */
          @media (min-width: 1025px) {
            .hero-container {
              background-attachment: fixed;
              background-position: center center;
              background-size: cover;
              padding-top: 80px; /* Account for desktop navbar */
            }
          }

          /* Ensure content doesn't overlap with navbar */
          .hero-content {
            padding-top: 20px;
            min-height: calc(100vh - 100px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          @media (max-width: 768px) {
            .hero-content {
              min-height: calc(100vh - 64px);
              padding-top: 10px;
            }
          }
        `}</style>
        
        <motion.div 
          className={`hero-content relative z-5 gap-6 md:gap-8 lg:gap-10 text-center px-4 py-4 md:py-0 ${user && token ? 'pt-48 sm:pt-56 md:pt-64 lg:pt-72 xl:pt-80' : ''}`}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          style={{ zIndex: 5 }} // Lower than welcome overlay
        >
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white bg-black/60 backdrop-blur-sm px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl shadow-2xl border border-white/20"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            Reserve Your Luxury Ride Now
          </motion.h1>

          <motion.form
            onSubmit={handleSearch}
            className="bg-white/90 backdrop-blur-md p-4 md:p-6 lg:p-8 shadow-2xl rounded-xl md:rounded-2xl flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-xs sm:max-w-sm md:max-w-4xl lg:max-w-5xl border border-white/40"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            whileHover={{ boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="flex flex-col w-full">
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Pickup Location</label>
              <select
                ref={pickupLocationRef}
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                className="w-full p-2 md:p-3 lg:p-4 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400 text-sm md:text-base"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em',
                  paddingRight: '2rem'
                }}
              >
                <option value="" disabled className="text-gray-400">Select Location</option>
                <option value="Airport Parking" className="text-gray-700">Airport Parking</option>
                <option value="Royal Car Parking" className="text-gray-700">Royal Car Parking</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 flex items-center gap-1 md:gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs md:text-sm">Pickup Date & Time</span>
              </label>
              <input
                type="datetime-local"
                value={pickupDateTime}
                onChange={(e) => setPickupDateTime(e.target.value)}
                required
                className="w-full p-2 md:p-3 lg:p-4 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-400 cursor-pointer text-sm md:text-base"
                style={{
                  colorScheme: 'light',
                }}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 flex items-center gap-1 md:gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs md:text-sm">Return Date & Time</span>
              </label>
              <input
                type="datetime-local"
                value={returnDateTime}
                onChange={(e) => setReturnDateTime(e.target.value)}
                required
                className="w-full p-2 md:p-3 lg:p-4 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-400 cursor-pointer text-sm md:text-base"
                style={{
                  colorScheme: 'light',
                }}
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-102 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-lg hover:shadow-xl mt-4 md:mt-6 lg:mt-0 md:self-end text-sm md:text-base touch-manipulation active:scale-95"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Search Cars
            </button>
          </motion.form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Hero;
