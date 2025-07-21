import React, { useState } from "react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const ReviewSection = () => {
  const { axios, isLoggedIn, user, setShowLogin } = useAppContext();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill customer name if user is logged in
  React.useEffect(() => {
    if (isLoggedIn() && user?.name && !customerName) {
      setCustomerName(user.name);
    }
  }, [isLoggedIn, user, customerName]);

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoveredRating(starValue);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in first
    if (!isLoggedIn()) {
      toast.error("Please login to submit a review");
      setShowLogin(true);
      return;
    }
    
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        customerName: customerName.trim(),
        rating,
        reviewText: reviewText.trim()
      };

      // Add user ID if logged in
      if (isLoggedIn() && user?._id) {
        reviewData.userId = user._id;
      }

      console.log("Submitting review:", reviewData);
      console.log("API URL:", `${axios.defaults.baseURL}/api/reviews/submit`);

      const { data } = await axios.post('/api/reviews/submit', reviewData);
      
      console.log("Review response:", data);
      
      if (data.success) {
        toast.success(data.message || "Thank you for your review! We appreciate your feedback.");
        
        // Reset form
        setRating(0);
        setReviewText("");
        setCustomerName("");
      } else {
        toast.error(data.message || "Failed to submit review. Please try again.");
      }
      
    } catch (error) {
      console.error("Review submission error:", error);
      console.error("Error details:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit review. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (stars) => {
    switch (stars) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Rate our service";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col items-center justify-center text-center space-y-6 max-md:px-4 my-10 mb-40 bg-gradient-to-b from-gray-50 to-white py-20"
      style={{ minHeight: '500px' }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="md:text-4xl text-2xl font-semibold text-gray-800"
      >
        Share Your Experience
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="md:text-lg text-gray-600 pb-4 max-w-2xl"
      >
        We value your feedback! Tell us about your experience with our car delivery services and help us serve you better.
      </motion.p>

      {!isLoggedIn() ? (
        // Show login prompt for non-logged-in users
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl w-full text-center"
        >
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">
              Please login to your account to share your experience and write a review. 
              Your feedback helps us improve our services for all customers.
            </p>
            <motion.button
              onClick={() => setShowLogin(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login to Write Review</span>
            </motion.button>
          </div>
        </motion.div>
      ) : (
        // Show review form for logged-in users
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 w-full mb-6"
          >
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Welcome, {user?.name}! Share your experience below.</span>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-6 w-full"
          >
            {/* Name Input */}
            <div className="w-full">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-gray-700 placeholder-gray-400 ${
                  isLoggedIn() && user?.name ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                placeholder={isLoggedIn() ? "Your name (from account)" : "Your Name"}
                required
                readOnly={isLoggedIn() && user?.name}
              />
              {isLoggedIn() && user?.name && (
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Using your account name
                </p>
              )}
            </div>

            {/* Star Rating */}
            <div className="flex flex-col items-center space-y-3">
              <h3 className="text-lg font-medium text-gray-700">Rate Our Service</h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="focus:outline-none transition-transform duration-200 hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className={`w-8 h-8 transition-colors duration-200 ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </motion.button>
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {getRatingText(hoveredRating || rating)}
              </p>
            </div>

            {/* Review Text Area */}
            <div className="w-full">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-gray-700 placeholder-gray-400 resize-none"
                placeholder="Write your review about our car delivery service, punctuality, vehicle condition, customer service, etc."
                rows="5"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-w-[150px]"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </motion.button>
          </motion.form>
        </div>
      )}
    </motion.div>
  );
};

export default ReviewSection;
