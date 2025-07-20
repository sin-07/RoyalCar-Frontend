// 📁 src/pages/Hero.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import ci2Image from "../assets/ci2.jpg";

const Hero = () => {
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [returnDateTime, setReturnDateTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!pickupDateTime || !returnDateTime || !pickupLocation) {
      alert("Please fill all fields.");
      return;
    }

    const pickupDT = new Date(pickupDateTime);
    const returnDT = new Date(returnDateTime);
    const now = new Date();

    const hoursToPickup = (pickupDT - now) / (1000 * 60 * 60);
    const durationHours = (returnDT - pickupDT) / (1000 * 60 * 60);

    if (hoursToPickup < 24) {
      alert("Pickup must be at least 24 hours from now.");
      return;
    }

    if (durationHours < 24) {
      alert("Booking must be at least 24 hours long.");
      return;
    }

    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDateTime=${pickupDateTime}&returnDateTime=${returnDateTime}`
    );
  };

  return (
    <>
      <motion.div 
        className="hero-container relative bg-cover bg-center bg-no-repeat min-h-screen w-full"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          backgroundImage: `url(${ci2Image})`,
          animation: 'backgroundZoom 15s ease-in-out infinite',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 z-5"></div>
        
        <style jsx>{`
          @keyframes backgroundZoom {
            0%, 100% {
              background-size: 120%;
              transform: scale(1);
            }
            50% {
              background-size: 125%;
              transform: scale(1.02);
            }
          }
          
          .hero-container {
            background-attachment: scroll; /* Better for mobile */
            background-position: center center;
            background-size: cover;
            transition: all 0.3s ease-in-out;
            width: 100vw;
            height: 100vh;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
          }

          /* Mobile optimizations - Full screen coverage */
          @media (max-width: 768px) {
            .hero-container {
              background-position: center 20%; /* Focus on car area */
              background-size: cover;
              height: 100vh;
              min-height: 100vh;
              width: 100vw;
              margin: 0;
              padding: 0;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
            }
            
            @keyframes backgroundZoom {
              0%, 100% {
                background-size: 120%;
                background-position: center 20%;
              }
              50% {
                background-size: 125%;
                background-position: center 15%;
              }
            }

            /* Ensure full viewport coverage */
            body, html {
              margin: 0;
              padding: 0;
              overflow-x: hidden;
            }
          }

          /* Tablet optimizations */
          @media (min-width: 769px) and (max-width: 1024px) {
            .hero-container {
              background-position: center 30%;
              background-size: cover;
              height: 100vh;
              min-height: 100vh;
              width: 100vw;
            }
            
            @keyframes backgroundZoom {
              0%, 100% {
                background-size: 115%;
                background-position: center 30%;
              }
              50% {
                background-size: 120%;
                background-position: center 25%;
              }
            }
          }

          /* Large screens */
          @media (min-width: 1025px) {
            .hero-container {
              background-attachment: fixed;
              background-position: center center;
              height: 100vh;
              min-height: 100vh;
            }
          }
        `}</style>
        
        <motion.div 
          className="relative z-10 h-full w-full flex flex-col justify-center items-center gap-4 md:gap-6 lg:gap-10 text-center px-2 md:px-4 py-safe"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          style={{ 
            minHeight: '100vh',
            height: '100vh',
            width: '100%'
          }}
        >
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white bg-black/70 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-2xl border border-white/20 mx-2"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            Book Your Premium Car
          </motion.h1>

          <motion.form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-sm p-3 md:p-4 lg:p-6 shadow-2xl rounded-xl flex flex-col md:flex-row gap-3 md:gap-4 max-w-4xl w-full mx-2 md:mx-4 border border-white/30"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)" }}
            style={{ maxHeight: '70vh', overflowY: 'auto' }}
          >
            <div className="flex flex-col w-full">
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Pickup Location</label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400 text-sm md:text-base"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" disabled className="text-gray-400">Select Location</option>
                <option value="Airport Parking" className="text-gray-700">Airport Parking</option>
                <option value="Royal Car Parking" className="text-gray-700">Royal Car Parking</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 flex items-center gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Pickup Date & Time
              </label>
              <input
                type="datetime-local"
                value={pickupDateTime}
                onChange={(e) => setPickupDateTime(e.target.value)}
                required
                className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-400 cursor-pointer text-sm md:text-base"
                style={{
                  colorScheme: 'light',
                }}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 flex items-center gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Return Date & Time
              </label>
              <input
                type="datetime-local"
                value={returnDateTime}
                onChange={(e) => setReturnDateTime(e.target.value)}
                required
                className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-400 cursor-pointer text-sm md:text-base"
                style={{
                  colorScheme: 'light',
                }}
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-lg hover:shadow-xl mt-2 md:mt-6 md:self-end text-sm md:text-base"
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
