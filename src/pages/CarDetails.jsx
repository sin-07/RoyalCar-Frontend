import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import CarWheelLoader from '../components/CarWheelLoader'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const CarDetails = () => {

  const { id } = useParams()

  const { cars, axios } = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [carAvailability, setCarAvailability] = useState({ available: true, availableAt: null })
  const [loadingAvailability, setLoadingAvailability] = useState(true)
  const currency = import.meta.env.VITE_CURRENCY

  useEffect(() => {
    setCar(cars.find(car => car._id === id))
  }, [cars, id])

  // Check car availability when car is loaded
  useEffect(() => {
    const checkCarAvailability = async () => {
      if (!car || !id) return;
      
      setLoadingAvailability(true);
      try {
        // Use current time as pickup/return to check immediate availability
        const now = new Date();
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour
        
        const { data } = await axios.post("/api/bookings/check-availability", {
          pickupDateTime: now.toISOString(),
          returnDateTime: nextHour.toISOString(),
        });

        if (data.success) {
          const carInfo = data.cars.find(c => c.car._id === id);
          if (carInfo) {
            setCarAvailability({
              available: carInfo.available,
              availableAt: carInfo.availableAt
            });
          }
        }
      } catch (error) {
        console.warn("⚠️ Availability check failed:", error.message);
        // Keep default availability status
      } finally {
        setLoadingAvailability(false);
      }
    };

    if (car) {
      checkCarAvailability();
    }
  }, [car, id, axios]);

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen'>

      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate(-1)} 
        className='flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
        <span className='font-medium'>Back to all cars</span>
      </motion.button>

      <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
        {/* Left: Car Image & Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='flex-1 lg:flex-[2]'>
          
          <motion.img
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={car.image} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-2xl mb-8 shadow-xl border border-gray-200' />
          
          <motion.div className='space-y-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-100'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div>
              <h1 className='text-4xl font-bold text-gray-900 mb-2'>{car.brand} {car.model}</h1>
              <p className='text-gray-600 text-xl font-medium'>{car.category} • {car.year}</p>
            </div>
            
            <hr className='border-gray-200 my-8' />

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={text} className='flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition-shadow duration-200'>
                  <img src={icon} alt="" className='h-6 mb-3 opacity-80' />
                  <span className='text-gray-700 font-medium text-center'>{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Description</h2>
              <p className='text-gray-600 leading-relaxed text-lg'>{car.description}</p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Features</h2>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {
                  ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item, index) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                      key={item} className='flex items-center text-gray-700 bg-green-50 px-4 py-3 rounded-lg border border-green-100'>
                      <img src={assets.check_icon} className='h-5 mr-3 opacity-80' alt="" />
                      <span className='font-medium'>{item}</span>
                    </motion.li>
                  ))
                }
              </ul>
            </motion.div>

          </motion.div>
        </motion.div>

        {/* Right: Booking Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className='flex-1 lg:max-w-md'>
          
          <div className='bg-white rounded-2xl p-8 shadow-xl border border-gray-200'>
            {/* Availability Status */}
            <div className='text-center mb-6'>
              {loadingAvailability ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-xl'
                >
                  <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                  <span className='text-gray-600 text-sm'>Checking availability...</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`p-4 rounded-xl border-2 ${
                    carAvailability.available 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className='flex items-center justify-center gap-2 mb-2'>
                    <motion.div
                      animate={{ 
                        scale: carAvailability.available ? [1, 1.2, 1] : [1, 0.8, 1],
                        opacity: carAvailability.available ? [1, 0.7, 1] : [1, 0.5, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className={`w-3 h-3 rounded-full ${
                        carAvailability.available ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className={`font-bold text-lg ${
                      carAvailability.available ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {carAvailability.available ? 'Available Now' : 'Currently Booked'}
                    </span>
                  </div>
                  
                  {!carAvailability.available && carAvailability.availableAt && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className='bg-white/80 p-3 rounded-lg'
                    >
                      <p className='text-red-600 font-semibold text-sm mb-1'>
                        🕒 Available from:
                      </p>
                      <p className='text-red-800 font-bold'>
                        {new Date(carAvailability.availableAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className='text-red-700 font-medium'>
                        {new Date(carAvailability.availableAt).toLocaleTimeString('en-US', {
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

            {/* Price Section */}
            <div className='text-center mb-8'>
              <div className='bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-4 rounded-xl mb-4'>
                <p className='text-3xl font-bold mb-1'>{currency}{car.pricePerDay}</p>
                <p className='text-blue-100 text-sm font-medium'>per day</p>
              </div>
              
            </div>

            {/* Booking Instructions */}
            <div className='text-center mb-8'>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                {carAvailability.available ? 'Ready to Book?' : 'Book for Later'}
              </h3>
              <p className='text-gray-600 mb-6 leading-relaxed'>
                {carAvailability.available 
                  ? 'Kindly select your pickup location, date and time to check availability and proceed with booking.'
                  : carAvailability.availableAt 
                    ? `This car is currently booked. You can book it from ${new Date(carAvailability.availableAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${new Date(carAvailability.availableAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} onwards.`
                    : 'This car is currently booked. Please check back later or select a different time.'
                }
              </p>
              
              <div className='space-y-3 mb-6'>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className='flex items-center justify-center gap-3 text-blue-700'>
                  <img src={assets.location_icon} alt="location" className='h-5' />
                  <span className='font-medium'>Choose Pickup Location</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className='flex items-center justify-center gap-3 text-blue-700'>
                  <img src={assets.calendar_icon_colored} alt="calendar" className='h-5' />
                  <span className='font-medium'>Select Date & Time</span>
                </motion.div>
              </div>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                onClick={() => {
                  // Navigate to home page with state to indicate we want to focus on booking form
                  navigate('/', { 
                    state: { 
                      focusBookingForm: true,
                      fromCarDetails: true 
                    } 
                  });
                }}
                whileHover={{ scale: carAvailability.available ? 1.02 : 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full transition-all duration-300 py-4 font-bold text-white text-lg rounded-xl cursor-pointer shadow-lg hover:shadow-xl mb-6 ${
                  carAvailability.available 
                    ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600'
                    : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600'
                }`}>
                {carAvailability.available ? 'Select Date & Location' : 'Book for Future Date'}
              </motion.button>

              <p className='text-center text-sm text-gray-600 font-medium mb-6'>
                🔒 Secure booking • No hidden fees • 
                {carAvailability.available ? ' Free cancellation' : ' Reserve for later'}
              </p>
            </div>

            {/* Why Choose Us */}
            
          </div>
        </motion.div>
      </div>

    </div>
  ) : <CarWheelLoader />
}

export default CarDetails
