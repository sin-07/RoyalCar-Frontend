import React, { useEffect, useState } from 'react'
import { assets} from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyBookings = async ()=>{
    try {
      setLoading(true)
      console.log('🔄 Fetching bookings from:', axios.defaults.baseURL + '/api/bookings/user')
      console.log('🔑 Auth token exists:', !!localStorage.getItem('token'))
      
      const { data } = await axios.get('/api/bookings/user')
      console.log('✅ Bookings response:', data)
      
      if (data.success){
        setBookings(data.bookings)
        console.log('📝 Bookings set:', data.bookings.length, 'items')
      }else{
        console.error('❌ Bookings fetch failed:', data.message)
        toast.error(data.message)
      }
    } catch (error) {
      console.error('💥 Bookings fetch error:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      })
      toast.error(`Connection error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    user && fetchMyBookings()
  },[user])

  // Loading skeleton component
  const BookingSkeleton = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'
    >
      <div className='md:col-span-1'>
        <div className='rounded-md overflow-hidden mb-3 bg-gray-200 animate-pulse h-32'></div>
        <div className='h-4 bg-gray-200 animate-pulse rounded mb-2'></div>
        <div className='h-3 bg-gray-200 animate-pulse rounded w-3/4'></div>
      </div>
      <div className='md:col-span-2 space-y-3'>
        <div className='h-4 bg-gray-200 animate-pulse rounded w-1/2'></div>
        <div className='h-3 bg-gray-200 animate-pulse rounded w-full'></div>
        <div className='h-3 bg-gray-200 animate-pulse rounded w-3/4'></div>
      </div>
      <div className='md:col-span-1'>
        <div className='h-4 bg-gray-200 animate-pulse rounded w-1/2 ml-auto'></div>
        <div className='h-6 bg-gray-200 animate-pulse rounded w-3/4 ml-auto mt-2'></div>
      </div>
    </motion.div>
  )

  // Enhanced status badge component
  const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
      switch(status) {
        case 'confirmed':
          return {
            bg: 'bg-green-100',
            text: 'text-green-700',
            border: 'border-green-200',
            icon: '✓'
          }
        case 'pending':
          return {
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
            border: 'border-yellow-200',
            icon: '⏳'
          }
        case 'cancelled':
          return {
            bg: 'bg-red-100',
            text: 'text-red-700',
            border: 'border-red-200',
            icon: '✕'
          }
        default:
          return {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            border: 'border-gray-200',
            icon: '●'
          }
      }
    }

    const config = getStatusConfig(status)

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className={`px-3 py-1 text-xs rounded-full border ${config.bg} ${config.text} ${config.border} font-medium flex items-center gap-1`}
      >
        <span>{config.icon}</span>
        <span className='capitalize'>{status}</span>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'
    >
      <Title title='My Bookings'
       subTitle='View and manage your all car bookings'
       align="left"/>

      <AnimatePresence>
        {loading ? (
          <div>
            {[1, 2, 3].map((item) => (
              <BookingSkeleton key={item} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className='text-center py-16'
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className='w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center'
            >
              <img src={assets.car_icon} alt="" className='w-12 h-12 opacity-50'/>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className='text-xl font-semibold text-gray-700 mb-2'
            >
              No bookings yet
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className='text-gray-500'
            >
              Start exploring our amazing car collection!
            </motion.p>
          </motion.div>
        ) : (
          <div>
            {bookings.map((booking, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}
                key={booking._id} 
                className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-xl mt-5 first:mt-12 bg-white hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden relative'
              >
                {/* Animated background gradient */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, delay: index * 0.1, repeat: Infinity, repeatDelay: 5 }}
                  className='absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent'
                />

                {/* Car Image + Info */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className='md:col-span-1 relative z-10'
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className='rounded-xl overflow-hidden mb-3 shadow-lg'
                  >
                    <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover'/>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <p className='text-lg font-semibold mt-2 text-gray-800'>{booking.car.brand} {booking.car.model}</p>
                    <p className='text-gray-500 text-sm flex items-center gap-1'>
                      <span>{booking.car.year}</span> • 
                      <span>{booking.car.category}</span> • 
                      <span className='flex items-center gap-1'>
                        <img src={assets.location_icon} alt="" className='w-3 h-3'/>
                        {booking.car.location}
                      </span>
                    </p>
                  </motion.div>
                </motion.div>

                {/* Booking Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className='md:col-span-2 relative z-10'
                >
                  <div className='flex items-center gap-3 mb-4'>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                      className='px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20'
                    >
                      <p className='font-semibold text-primary'>Booking #{index+1}</p>
                    </motion.div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className='mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100'
                  >
                    <div className='flex items-center gap-2 mb-3'>
                      <motion.img 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        src={assets.calendar_icon_colored} 
                        alt="" 
                        className='w-5 h-5'
                      />
                      <p className='text-blue-600 font-semibold text-sm'>Booking Period</p>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {/* Pickup Details */}
                      <div className='bg-white p-3 rounded-lg border border-green-200'>
                        <p className='text-green-600 font-medium text-xs mb-1'>PICKUP</p>
                        <p className='text-gray-800 font-bold text-sm'>
                          {new Date(booking.pickupDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className='text-gray-600 text-xs'>
                          {new Date(booking.pickupDate).toLocaleTimeString('en-US', { 
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>

                      {/* Return Details */}
                      <div className='bg-white p-3 rounded-lg border border-red-200'>
                        <p className='text-red-600 font-medium text-xs mb-1'>RETURN</p>
                        <p className='text-gray-800 font-bold text-sm'>
                          {new Date(booking.returnDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className='text-gray-600 text-xs'>
                          {new Date(booking.returnDate).toLocaleTimeString('en-US', { 
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Duration Display */}
                    <div className='mt-3 text-center'>
                      <div className='inline-flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full border border-purple-200'>
                        <span className='text-purple-600 font-medium text-xs'>Total Duration:</span>
                        <span className='text-purple-800 font-bold text-xs'>
                          {(() => {
                            const pickup = new Date(booking.pickupDate)
                            const returnD = new Date(booking.returnDate)
                            const diffTime = Math.abs(returnD - pickup)
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
                            
                            if (diffDays >= 1) {
                              return `${diffDays} day${diffDays > 1 ? 's' : ''}`
                            } else {
                              return `${diffHours} hour${diffHours > 1 ? 's' : ''}`
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                    className='flex items-start gap-3 p-3 bg-orange-50 rounded-lg'
                  >
                    <motion.img 
                      whileHover={{ scale: 1.2 }}
                      src={assets.location_icon_colored} 
                      alt="" 
                      className='w-5 h-5 mt-0.5'
                    />
                    <div>
                      <p className='text-orange-600 font-medium text-sm'>Pick-up Location</p>
                      <p className='text-gray-800 font-semibold'>{booking.car.location}</p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Price */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className='md:col-span-1 flex flex-col justify-between gap-6 relative z-10'
                >
                  <div className='text-right'>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.6, type: "spring" }}
                      className='mb-2'
                    >
                      <p className='text-gray-500 text-sm'>Total Price</p>
                      <motion.h1 
                        whileHover={{ scale: 1.1 }}
                        className='text-3xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent'
                      >
                        {currency}{booking.price}
                      </motion.h1>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      className='text-xs text-gray-500 bg-gray-50 p-2 rounded-lg'
                    >
                      <p>Booked on</p>
                      <p className='font-medium text-gray-700'>
                        {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </motion.div>
                  </div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.8 }}
                    className='flex gap-2'
                  >
                    {booking.status === 'confirmed' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary/80 transition-colors'
                      >
                        View Details
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MyBookings
