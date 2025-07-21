import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import ReviewSection from '../components/Newsletter'
import CarWheelLoader from '../components/CarWheelLoader'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const Home = () => {
  const { cars, fetchCars } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setDataLoaded(false);
      
      try {
        // Fetch cars if not already loaded
        if (cars.length === 0) {
          await fetchCars();
        }
        
        // Add a minimum loading time for smooth UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDataLoaded(true);
        setLoading(false);
      } catch (error) {
        console.log("Could not load initial data:", error.message);
        // Still show the page even if data fails to load
        setLoading(false);
        setDataLoaded(true);
      }
    };

    loadInitialData();
  }, [cars.length, fetchCars]);

  // Show loading screen until all data is ready
  if (loading || !dataLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-50 flex flex-col items-center justify-center">
        <CarWheelLoader />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center max-w-lg mx-auto px-6"
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Welcome to Royal Cars
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-gray-600 mb-4"
          >
            Loading your premium car rental experience...
          </motion.p>
          
          {/* Loading progress indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center space-x-2"
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-sm text-gray-500 mt-4"
          >
            Fetching latest vehicles and offers...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Hero />
      <main className="w-full bg-white">
        {/* <FeaturedSection /> */}
        <Banner />
        <Testimonial />
        <ReviewSection />
      </main>
    </motion.div>
  )
}

export default Home
