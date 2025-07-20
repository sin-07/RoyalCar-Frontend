import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars } = useAppContext();

  // Debug: Log cars data
  console.log("FeaturedSection - Cars data:", cars);
  console.log("FeaturedSection - Cars length:", cars?.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-white"
      style={{ minHeight: '500px' }} // Ensure minimum height for visibility
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
              <CarCard car={car} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8">
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
