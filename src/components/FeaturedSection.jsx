import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars } = useAppContext();

  // Handle car card click - show toast and scroll to top
  const handleCarCardClick = (car) => {
    toast((t) => (
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 mb-1">
            🚗 Select Your Booking Details First!
          </div>
          <div className="text-xs text-gray-600 leading-relaxed">
            Please choose your pickup date, time, and location before exploring cars
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        color: '#1f2937',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '400px',
        backdropFilter: 'blur(10px)',
      },
      className: 'transform transition-all duration-300 ease-out',
    });
    
    // Scroll to top to show the Hero section booking form
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-white"
      style={{ minHeight: '500px' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Title
          title="Cars we have"
          subTitle="Explore our selection of premium vehicles available for your next adventure."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18"
      >
        {cars && cars.length > 0 ? (
          cars.slice(0, 6).map((car, index) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
            >
              <CarCard car={car} onClick={() => handleCarCardClick(car)} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8">
              {/* Mini Car Wheel Loader */}
              <div className="flex justify-center mb-4">
                <svg 
                  width="40" 
                  height="40" 
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
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Loading Cars...
              </h3>
              <p className="text-gray-500">
                {cars?.length === 0 
                  ? "No cars available at the moment. Please check back later." 
                  : "Please wait while we load our premium vehicle collection."}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        onClick={() => {
          navigate("/total-cars");
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer transition-colors duration-200"
      >
        Explore all cars <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
};

export default FeaturedSection;
