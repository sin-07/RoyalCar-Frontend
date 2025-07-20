import React, { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const AddCar = () => {
  const { axios, currency, fetchCars } = useAppContext();

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 2024,
    pricePerDay: 100,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 4,
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (!image) {
        toast.error("Please upload an image.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success("Car listed successfully!");
        
        // Refresh the cars data globally
        await fetchCars();
        
        // Reset form
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: 2024,
          pricePerDay: 100,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 4,
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title
          title="Add New Car"
          subTitle="Fill in details to list a new car for booking, including specs, pricing & availability."
        />

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 mt-8 max-w-4xl mx-auto border border-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <form
            onSubmit={onSubmitHandler}
            className="space-y-8"
          >
            {/* Car Image Upload */}
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4 w-full">
                <label htmlFor="car-image" className="cursor-pointer group">
                  <div className="relative">
                    <img
                      src={image ? URL.createObjectURL(image) : assets.upload_icon}
                      alt="Upload"
                      className="h-20 w-20 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300 border-4 border-white"
                    />
                    {!image && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="car-image"
                    accept="image/*"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Upload Car Image</h3>
                  <p className="text-sm text-gray-600">Choose a high-quality image that showcases your car</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended: JPG, PNG • Max size: 5MB</p>
                </div>
              </div>
            </motion.div>

            {/* Car Basic Info */}
            <motion.div 
              className="bg-gray-50 rounded-xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Brand
                  </label>
                  <input
                    required
                    type="text"
                    value={car.brand}
                    onChange={(e) => setCar({ ...car, brand: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white"
                    placeholder="e.g. Toyota"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Model
                  </label>
                  <input
                    required
                    type="text"
                    value={car.model}
                    onChange={(e) => setCar({ ...car, model: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white"
                    placeholder="e.g. Corolla"
                  />
                </div>
              </div>
            </motion.div>

            {/* Specs Section */}
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Specifications & Pricing
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Year
                  </label>
                  <input
                    required
                    type="number"
                    value={car.year}
                    onChange={(e) => setCar({ ...car, year: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white"
                    min="1990"
                    max="2025"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Daily Price ({currency})
                  </label>
                  <input
                    required
                    type="number"
                    value={car.pricePerDay}
                    onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2m0 0V9a2 2 0 012-2h14a2 2 0 012 2v2M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" />
                    </svg>
                    Category
                  </label>
                  <select
                    required
                    value={car.category}
                    onChange={(e) => setCar({ ...car, category: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white"
                  >
                    <option value="">Select Category</option>
                    <option>SUV</option>
                    <option>Sedan</option>
                    <option>Van</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Transmission
                  </label>
                  <select
                    required
                    value={car.transmission}
                    onChange={(e) => setCar({ ...car, transmission: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white"
                  >
                    <option value="">Select Transmission</option>
                    <option>Automatic</option>
                    <option>Manual</option>
                    <option>Semi-Automatic</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Fuel Type
                  </label>
                  <select
                    required
                    value={car.fuel_type}
                    onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white"
                  >
                    <option value="">Select Fuel</option>
                    <option>Gas</option>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Hybrid</option>
                    <option>Electric</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Seating Capacity
                  </label>
                  <input
                    required
                    type="number"
                    value={car.seating_capacity}
                    onChange={(e) =>
                      setCar({ ...car, seating_capacity: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white"
                    min="1"
                    max="15"
                  />
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div 
              className="bg-purple-50 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Description & Details
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Describe your vehicle in detail
                </label>
                <textarea
                  required
                  rows={5}
                  value={car.description}
                  onChange={(e) => setCar({ ...car, description: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white resize-none"
                  placeholder="Describe your vehicle's features, condition, and any special amenities..."
                ></textarea>
                <p className="text-xs text-gray-500">Help customers understand what makes your car special</p>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="flex justify-center pt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Listing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>List Your Car</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddCar;
