import React, { useState, useEffect } from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";

const Testimonial = () => {
  const { axios } = useAppContext();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get('/api/reviews/testimonials?limit=6');
      
      if (data.success) {
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
      } else {
        // Use static testimonials if backend fails
        setTestimonials(staticTestimonials);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      // Use static testimonials as fallback
      setTestimonials(staticTestimonials);
    } finally {
      setLoading(false);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
          {testimonials.map((testimonial, index) => (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              key={testimonial._id || index}
              className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.customerName}
                />
                <div>
                  <p className="text-xl font-medium">{testimonial.customerName}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  {!testimonial.isStatic && (
                    <p className="text-green-600 text-xs font-medium">✓ Verified Review</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 max-w-90 mt-4 font-light leading-relaxed">
                "{testimonial.reviewText || testimonial.testimonial}"
              </p>
              {testimonial.createdAt && (
                <p className="text-gray-400 text-xs mt-3">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonial;
