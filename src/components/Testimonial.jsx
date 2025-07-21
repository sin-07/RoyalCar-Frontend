import React, { useState, useEffect } from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/AppContext";

const Testimonial = () => {
  const { axios } = useAppContext();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Static testimonials as fallback
  const staticTestimonials = [
    {
      customerName: "Emma Rodriguez",
      location: "Barcelona, Spain",
      image: assets.testimonial_image_1,
      reviewText: "I've rented cars from various companies, but the experience with Royal Car was exceptional.",
      rating: 5,
      isStatic: true
    },
    {
      customerName: "John Smith",
      location: "New York, USA", 
      image: assets.testimonial_image_2,
      reviewText: "Royal Car made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!",
      rating: 5,
      isStatic: true
    },
    {
      customerName: "Ava Johnson",
      location: "Sydney, Australia",
      image: assets.testimonial_image_1,
      reviewText: "I highly recommend Royal Car! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
      rating: 5,
      isStatic: true
    },
  ];

  useEffect(() => {
    // Show static testimonials immediately for better UX
    setTestimonials(staticTestimonials);
    setLoading(false);
    
    // Then try to fetch backend testimonials in the background
    fetchTestimonials();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const fetchTestimonials = async () => {
    try {
      // Shorter timeout for testimonials since it's not critical
      const { data } = await axios.get('/api/reviews/testimonials?limit=6', {
        timeout: 5000 // 5 second timeout for testimonials
      });
      
      if (data.success && data.testimonials.length > 0) {
        // Combine backend testimonials with static ones
        const backendTestimonials = data.testimonials.map(testimonial => ({
          ...testimonial,
          image: assets.user_profile, // Use default user profile image
          location: "Verified Customer", // Default location for backend reviews
          isStatic: false
        }));
        
        // Show backend testimonials first, then fill with static ones if needed
        const allTestimonials = [...backendTestimonials, ...staticTestimonials].slice(0, 6);
        setTestimonials(allTestimonials);
      }
      // If no backend testimonials or empty response, keep static testimonials
    } catch (error) {
      console.warn("Could not fetch testimonials from server, using static testimonials:", error.message);
      // Keep static testimonials that are already loaded
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <img 
          key={index} 
          src={assets.star_icon} 
          alt="star-icon"
          className={index < rating ? 'opacity-100' : 'opacity-30'}
        />
      ));
  };

  return (
    <div
      className="py-28 px-6 md:px-16 lg:px-24 xl:px-44 bg-gray-50"
      style={{ minHeight: "400px" }}
    >
      <Title
        title="What Our Customers Say"
        subTitle="Discover why discerning travelers choose Royal Car for their luxury car rental and delivery services around the world."
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <motion.div
            className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <div className="relative max-w-4xl mx-auto mt-16">
          {/* Slider Container */}
          <div 
            className="relative overflow-hidden rounded-2xl bg-white shadow-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="p-8 md:p-12 lg:p-16"
              >
                {testimonials.length > 0 && (
                  <div className="flex flex-col items-center text-center">
                    {/* Customer Image */}
                    <div className="relative mb-6">
                      <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-lg ring-4 ring-white ring-offset-4 ring-offset-gray-100"
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].customerName}
                      />
                      {!testimonials[currentIndex].isStatic && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                          ✓ Verified
                        </div>
                      )}
                    </div>

                    {/* Rating Stars */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="flex items-center gap-1 mb-6"
                    >
                      {renderStars(testimonials[currentIndex].rating)}
                    </motion.div>

                    {/* Review Text */}
                    <motion.blockquote
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="text-lg md:text-xl lg:text-2xl text-gray-700 font-light leading-relaxed mb-6 max-w-3xl italic"
                    >
                      "{testimonials[currentIndex].reviewText || testimonials[currentIndex].testimonial}"
                    </motion.blockquote>

                    {/* Customer Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="text-center"
                    >
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                        {testimonials[currentIndex].customerName}
                      </h4>
                      <p className="text-gray-500 text-sm md:text-base">
                        {testimonials[currentIndex].location}
                      </p>
                      {testimonials[currentIndex].createdAt && (
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(testimonials[currentIndex].createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Auto-play Control */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2 transition-colors duration-200"
              >
                {isAutoPlaying ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Pause Auto-play
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Resume Auto-play
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Testimonial;
