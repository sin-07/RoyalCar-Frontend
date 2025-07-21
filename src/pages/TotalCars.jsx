import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import CarCard from "../components/CarCard";
import Title from "../components/Title";
import { motion, AnimatePresence } from "motion/react";
import CarWheelLoader from "../components/CarWheelLoader";

const TotalCars = () => {
  const navigate = useNavigate();
  const { cars: globalCars, fetchCars, axios } = useAppContext();
  const hasLoadedRef = useRef(false);
  const timeoutRef = useRef(null);

  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [enhancedCars, setEnhancedCars] = useState([]);
  const [availabilityCheckComplete, setAvailabilityCheckComplete] = useState(false);

  // Get unique categories from cars
  const categories = ["All", ...new Set(enhancedCars.map((car) => car.category))];

  // Function to check real-time availability of cars
  const checkCarsAvailability = async () => {
    try {
      console.log("🔄 Starting availability check...");
      // Use current time as pickup/return to check immediate availability
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      
      const { data } = await axios.post("/api/bookings/check-availability", {
        pickupDateTime: now.toISOString(),
        returnDateTime: nextHour.toISOString(),
      });

      if (data.success) {
        // Map the availability data to our cars
        const carsWithAvailability = globalCars.map(globalCar => {
          const availabilityInfo = data.cars.find(ac => ac.car._id === globalCar._id);
          return {
            ...globalCar,
            isAvailable: availabilityInfo ? availabilityInfo.available : globalCar.isAvailable,
            nextAvailableAt: availabilityInfo?.availableAt || null
          };
        });
        
        setEnhancedCars(carsWithAvailability);
        setAvailabilityCheckComplete(true);
        console.log("✅ Real-time availability updated for", carsWithAvailability.length, "cars");
      } else {
        // Fallback to global cars if availability check fails
        setEnhancedCars(globalCars.map(car => ({ ...car, nextAvailableAt: null })));
        setAvailabilityCheckComplete(true);
        console.log("⚠️ Availability check failed, using base car data");
      }
    } catch (error) {
      console.warn("⚠️ Availability check failed, using base car data:", error.message);
      // Fallback to global cars
      setEnhancedCars(globalCars.map(car => ({ ...car, nextAvailableAt: null })));
      setAvailabilityCheckComplete(true);
    }
  };

  // Simple data fetching on mount
  useEffect(() => {
    const loadCars = async () => {
      // If we already have cars and availability is complete, we're done
      if (globalCars.length > 0 && availabilityCheckComplete) {
        console.log("✅ Cars and availability already loaded:", globalCars.length, "cars");
        setIsInitialLoad(false);
        return;
      }

      // Only fetch if we haven't loaded yet
      if (hasLoadedRef.current) return;
      hasLoadedRef.current = true;
      
      console.log("� Fetching cars from backend...");
      try {
        await fetchCars();
        console.log("✅ fetchCars() completed");
      } catch (error) {
        console.error("❌ Error fetching cars:", error.message);
        toast.error("Unable to load cars. Please check your connection or try again later.");
        hasLoadedRef.current = false; // Reset to allow retry
      }
    };

    loadCars();
  }, [fetchCars, availabilityCheckComplete]);

  // Monitor globalCars and complete initial load when data arrives AND availability check is done
  useEffect(() => {
    if (globalCars.length > 0 && availabilityCheckComplete && isInitialLoad) {
      console.log("✅ Cars loaded and availability complete:", globalCars.length, "cars");
      setIsInitialLoad(false);
    }
  }, [globalCars.length, availabilityCheckComplete, isInitialLoad]);

  // Check real-time availability when cars are loaded
  useEffect(() => {
    if (globalCars.length > 0 && !availabilityCheckComplete) {
      console.log("🔄 Checking real-time availability for", globalCars.length, "cars");
      checkCarsAvailability();
    }
  }, [globalCars.length, availabilityCheckComplete]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Filter cars based on search input and category
  useEffect(() => {
    // Only filter if we have enhanced cars available (not during initial load)
    if (isInitialLoad || enhancedCars.length === 0) {
      setFilteredCars([]);
      return;
    }

    let filtered = enhancedCars;

    // Filter by search input
    if (input.trim()) {
      const searchTerm = input.toLowerCase().trim();
      filtered = filtered.filter((car) => {
        const brandMatch = car.brand?.toLowerCase().includes(searchTerm);
        const modelMatch = car.model?.toLowerCase().includes(searchTerm);
        const brandModelMatch = `${car.brand} ${car.model}`
          .toLowerCase()
          .includes(searchTerm);
        const categoryMatch = car.category?.toLowerCase().includes(searchTerm);
        const fuelTypeMatch = car.fuel_type?.toLowerCase().includes(searchTerm);
        const transmissionMatch = car.transmission
          ?.toLowerCase()
          .includes(searchTerm);
        const yearMatch = car.year?.toString().includes(searchTerm);
        const priceMatch = car.pricePerDay?.toString().includes(searchTerm);

        return (
          brandMatch ||
          modelMatch ||
          brandModelMatch ||
          categoryMatch ||
          fuelTypeMatch ||
          transmissionMatch ||
          yearMatch ||
          priceMatch
        );
      });
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((car) => car.category === selectedCategory);
    }

    // Filter by availability
    if (availabilityFilter !== "All") {
      if (availabilityFilter === "Available") {
        filtered = filtered.filter((car) => car.isAvailable);
      } else if (availabilityFilter === "Booked") {
        filtered = filtered.filter((car) => !car.isAvailable);
      }
    }

    setFilteredCars(filtered);
  }, [input, selectedCategory, availabilityFilter, enhancedCars, isInitialLoad]);

  const handleCarClick = (carId) => {
    navigate(`/car-details/${carId}`);
    window.scrollTo(0, 0);
  };

  // Show loading wheel until we have cars loaded AND availability checked
  if (isInitialLoad || globalCars.length === 0 || !availabilityCheckComplete) {
    const loadingMessage = globalCars.length === 0 
      ? "Fetching cars from backend..." 
      : !availabilityCheckComplete 
        ? "Checking real-time availability..." 
        : "Processing car data...";
        
    console.log("🔄 Showing loader - isInitialLoad:", isInitialLoad, "globalCars.length:", globalCars.length, "availabilityCheckComplete:", availabilityCheckComplete);
    
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <CarWheelLoader />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading Premium Cars...
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {loadingMessage}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 scroll-container"
    >
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white py-16"
      >
        <Title
          title="Elegance on Wheels: Our Prestige Car Collection"
          subTitle={`Explore all ${enhancedCars.length} available vehicles in our premium fleet with real-time availability`}
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-6 max-w-7xl mx-auto"
      >
        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8 -mt-8 z-20 relative"
        >
          {[
            { value: enhancedCars.length, label: "Total Cars", color: "blue", delay: 0.1 },
            { 
              value: enhancedCars.filter(car => car.isAvailable).length, 
              label: "Available", 
              color: "green", 
              delay: 0.2 
            },
            { 
              value: enhancedCars.filter(car => !car.isAvailable).length, 
              label: "Booked", 
              color: "red", 
              delay: 0.25 
            },
            { value: categories.length - 1, label: "Categories", color: "purple", delay: 0.3 },
            { value: filteredCars.length, label: "Showing", color: "orange", delay: 0.4 }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + stat.delay }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 cursor-pointer"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + stat.delay, type: "spring", stiffness: 200 }}
                className={`text-3xl font-bold text-${stat.color}-600 mb-2`}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
              {(stat.label === "Available" || stat.label === "Booked") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    opacity: { delay: 1 + stat.delay },
                    scale: { 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }
                  }}
                  className={`mt-2 w-3 h-3 mx-auto rounded-full ${
                    stat.label === "Available" ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
                placeholder="Search by brand, model, category..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none focus:bg-white transition-all duration-200 text-lg placeholder-gray-400"
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
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

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none focus:bg-white transition-all duration-200 text-lg appearance-none cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none focus:bg-white transition-all duration-200 text-lg appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Available">Available Only</option>
                <option value="Booked">Booked Only</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Results Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing{" "}
                <span className="font-semibold text-blue-600">
                  {filteredCars.length}
                </span>{" "}
                of <span className="font-semibold">{enhancedCars.length}</span>{" "}
                cars
                {input.trim() && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Search: "{input}"
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {selectedCategory}
                  </span>
                )}
                {availabilityFilter !== "All" && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    availabilityFilter === "Available" 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {availabilityFilter}
                  </span>
                )}
              </span>
              {(input.trim() || selectedCategory !== "All" || availabilityFilter !== "All") && (
                <button
                  onClick={() => {
                    setInput("");
                    setSelectedCategory("All");
                    setAvailabilityFilter("All");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Cars Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredCars.map((car, index) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.5),
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.15 }
                }}
                className="group relative cursor-pointer"
                onClick={() => handleCarClick(car._id)}
              >
                {/* Main Card */}
                <motion.div 
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 transform overflow-hidden border border-gray-100 ${
                    !car.isAvailable ? 'opacity-75' : ''
                  }`}
                >
                  <div className="relative">
                    <CarCard car={car} />
                    
                    {/* Unavailable Overlay */}
                    {!car.isAvailable && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.5 }}
                        className="absolute inset-0 bg-black bg-opacity-25 flex flex-col items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.05 + 0.7, type: "spring", stiffness: 200 }}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs transform -rotate-12 shadow-lg mb-2"
                        >
                          CURRENTLY BOOKED
                        </motion.div>
                        {car.nextAvailableAt && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.9 }}
                            className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-center shadow-lg"
                          >
                            <p className="text-xs text-gray-700 font-semibold mb-1">
                              Available from:
                            </p>
                            <p className="text-xs text-gray-900 font-bold">
                              {new Date(car.nextAvailableAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-gray-700">
                              {new Date(car.nextAvailableAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Car Details Overlay */}
                  <motion.div 
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {car.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{car.year}</span>
                        {/* Availability Status Badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.3, type: "spring", stiffness: 200 }}
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                            car.isAvailable 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          <motion.div
                            animate={{ 
                              scale: car.isAvailable ? [1, 1.2, 1] : [1, 0.8, 1],
                              opacity: car.isAvailable ? [1, 0.7, 1] : [1, 0.5, 1]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                            className={`w-2 h-2 rounded-full ${
                              car.isAvailable ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <span>
                            {car.isAvailable ? 'Available' : 'Booked'}
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {car.location}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        {car.fuel_type}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Hover Effect Border */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 rounded-2xl -z-10 blur-xl"
                ></motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results Message */}
        <AnimatePresence>
          {filteredCars.length === 0 && !isInitialLoad && enhancedCars.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto"
              >
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 115.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </motion.svg>
                <motion.h3 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl font-semibold text-gray-700 mb-2"
                >
                  No cars found
                </motion.h3>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500 mb-4"
                >
                  Try adjusting your search terms or filter criteria.
                </motion.p>
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setInput("");
                    setSelectedCategory("All");
                    setAvailabilityFilter("All");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Show All Cars
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TotalCars;
