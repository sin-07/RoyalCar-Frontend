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
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch cars if not already loaded (without additional loading state)
        if (cars.length === 0) {
          await fetchCars();
        }
        setDataLoaded(true);
      } catch (error) {
        console.log("Could not load initial data:", error.message);
        // Still show the page even if data fails to load
        setDataLoaded(true);
      }
    };

    loadInitialData();
  }, [cars.length, fetchCars]);

  // Simple render without secondary loading screen
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
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
