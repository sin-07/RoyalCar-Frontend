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
  const { cars, fetchCars, user, token } = useAppContext();
  const [dataLoaded, setDataLoaded] = useState(false);

  // Array of beautiful quotes for personalized greeting
  const welcomeQuotes = [
    "Welcome back,",
    "Great to see you again,",
    "Ready for your next adventure,",
    "Your journey awaits,",
    "The road is calling,",
    "Adventure begins with you,",
    "Let's explore together,",
    "Your premium ride awaits,",
    "Time to hit the road,",
    "Luxury meets adventure,"
  ];

  // Get a consistent quote for the user (based on their name)
  const getPersonalizedQuote = (userName) => {
    if (!userName) return welcomeQuotes[0];
    const index = userName.length % welcomeQuotes.length;
    return welcomeQuotes[index];
  };

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
      <Hero user={user} token={token} getPersonalizedQuote={getPersonalizedQuote} />

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
