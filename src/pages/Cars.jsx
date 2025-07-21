import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import CarCard from "../components/CarCard";
import Title from "../components/Title";
import CarWheelLoader from "../components/CarWheelLoader";
import { motion, AnimatePresence } from "motion/react";
import moment from "moment";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDateTime = searchParams.get("pickupDateTime");
  const returnDateTime = searchParams.get("returnDateTime");

  const { axios, token, user, setShowLogin, setIntendedRoute } = useAppContext();

  const [input, setInput] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    setDataFetched(false);
    
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        pickupDateTime,
        returnDateTime,
      });

      if (data.success) {
        setCars(data.cars || []);
        setDataFetched(true);
        
        if (data.cars.length === 0) {
          // Only show this toast after data is fetched
          setTimeout(() => {
            toast("No cars available for selected time.", {
              icon: "ℹ️",
              duration: 3000,
            });
          }, 500);
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
      setDataFetched(true); // Mark as fetched even on error
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async (carId) => {
    // Check if user is authenticated
    if (!token || !user) {
      // Set intended route to current page with search params
      const currentRoute = `/cars?pickupLocation=${pickupLocation}&pickupDateTime=${pickupDateTime}&returnDateTime=${returnDateTime}`;
      setIntendedRoute(currentRoute);
      
      // Show login modal
      setShowLogin(true);
      toast.error("Please login to book a car.");
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Creating your booking...");

      const { data } = await axios.post("/api/bookings/create", {
        car: carId,
        pickupDateTime,
        returnDateTime,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.success && data.bookingId) {
        toast.success("Booking created successfully! Redirecting to payment...");
        // Navigate to payment page
        navigate(`/payment/${data.bookingId}`);
      } else {
        // Handle specific error cases
        if (data.message?.includes("future")) {
          toast.error("Please select a pickup time in the future.");
        } else if (data.message?.includes("1 hour")) {
          toast.error("Booking must be at least 1 hour long.");
        } else if (data.message?.includes("already booked")) {
          toast.error("This car is no longer available for your selected time. Please refresh and try again.");
          // Refresh the car list
          fetchCars();
        } else {
          toast.error(data.message || "Booking failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Booking error:", err);
      
      // Handle network errors
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.code === 'NETWORK_ERROR') {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("Server error. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (pickupDateTime && returnDateTime) {
      fetchCars();
    } else {
      if (!pickupDateTime || !returnDateTime) {
        toast.error(
          "Please select pickup and return dates from the home page."
        );
      }
    }
  }, [pickupDateTime, returnDateTime]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white py-16"
      >
        <Title
          title="Available Cars"
          subTitle="Choose your perfect ride for your journey"
        />
      </motion.div>

      {!pickupDateTime || !returnDateTime ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 sm:p-6 max-w-7xl mx-auto"
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <motion.div 
              initial={{ scale: 0.8, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto transform transition-all duration-500 hover:shadow-2xl"
            >
              <motion.svg
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                className="w-16 h-16 text-blue-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </motion.svg>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="text-xl font-semibold text-gray-700 mb-2"
              >
                Booking Details Required
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="text-gray-500 mb-4"
              >
                Please select your pickup and return dates from the home page to
                view available cars.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform focus:ring-4 focus:ring-blue-300"
              >
                Go to Home Page
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-4 sm:p-6 max-w-7xl mx-auto"
        >
          {/* Show loading screen while fetching data */}
          {loading && (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <CarWheelLoader />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 text-center max-w-lg mx-auto px-6"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Searching Available Cars...
                </h3>
                <p className="text-gray-600 mb-4">
                  Please wait while we check car availability for your selected dates and time.
                </p>
                
                {/* Loading progress dots */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Connecting to backend services...
                </p>
              </motion.div>
            </div>
          )}

          {/* Search Bar - Only show when not loading */}
          {!loading && (
            <motion.div 
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mb-6 sm:mb-8 -mt-6 sm:-mt-8 z-20 mx-4 sm:mx-0"
            >
              <motion.div 
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                  transition: { duration: 0.3 }
                }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-4 sm:p-6 border border-gray-100 transform transition-all duration-300"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search by brand or model..."
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring-2 sm:focus:ring-4 focus:ring-blue-200/50 focus:outline-none focus:bg-white transition-all duration-300 text-base sm:text-lg placeholder-gray-400 hover:border-gray-300 hover:shadow-md hover:bg-white"
                  />
                  {input && (
                    <button
                      onClick={() => setInput("")}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center group"
                    >
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-all duration-200 group-hover:scale-110 group-hover:rotate-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Car Grid - Only show when not loading */}
          {!loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0"
            >
              <AnimatePresence>
                {cars
                  .filter(({ car }) =>
                    `${car.brand} ${car.model}`
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  )
                  .map(({ car, available, availableAt }, index) => (
                    <motion.div 
                      key={car._id} 
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.9 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ 
                        y: -10,
                        scale: 1.02,
                        transition: { duration: 0.3 }
                      }}
                      className="group relative"
                    >
                    {/* Main Card */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden border border-gray-100">
                      {/* Car Card Component */}
                      <div className="relative">
                        <CarCard car={car} />

                        {/* Status Badge */}
                        {!available && (
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                              Not Available
                            </span>
                          </div>
                        )}
                        {available && (
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
                            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 sm:px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                              Available
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Additional Info Section */}
                      <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white">
                        {!available && availableAt && (
                          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-orange-800 mb-1">
                                  Currently Booked
                                </p>
                                <p className="text-xs sm:text-sm text-orange-700 break-words">
                                  Next available: {moment(availableAt).format("MMM DD, YYYY [at] HH:mm")}
                                </p>
                                <p className="text-xs text-orange-600 mt-1">
                                  This car will be free {moment(availableAt).fromNow()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {available && (
                          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="text-xs sm:text-sm font-medium text-green-800">
                                Available for your selected dates
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        {available ? (
                          <button
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-green-200 focus:outline-none"
                            onClick={() => handleBookNow(car._id)}
                          >
                            <span className="flex items-center justify-center">
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {token && user ? "Book Now" : "Login to Book"}
                            </span>
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <button
                              className="w-full bg-gray-400 text-gray-700 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg cursor-not-allowed opacity-75"
                              disabled
                            >
                              <span className="flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                                  />
                                </svg>
                                Currently Booked
                              </span>
                            </button>
                            {availableAt && (
                              <p className="text-xs text-center text-gray-600 break-words">
                                Try booking after {moment(availableAt).format("MMM DD, HH:mm")}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Floating Gradient Border */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.2 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl opacity-0 transition-opacity duration-300 -z-10 blur-xl"
                    ></motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* No Results Message - Only show when not loading and data has been fetched */}
          <AnimatePresence>
            {!loading && dataFetched && cars.filter(({ car }) =>
              `${car.brand} ${car.model}`
                .toLowerCase()
                .includes(input.toLowerCase())
            ).length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="text-center py-16"
              >
                <motion.div 
                  initial={{ rotateY: -30, scale: 0.9 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto"
                >
                  <motion.svg
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring" }}
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 115.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                    />
                  </motion.svg>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="text-xl font-semibold text-gray-700 mb-2"
                  >
                    No cars found
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="text-gray-500"
                  >
                    Try adjusting your search terms or check back later.
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Cars;
