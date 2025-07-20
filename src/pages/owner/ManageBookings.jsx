import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen'>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."/>

        <motion.div 
          className='max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-8'
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Header Stats */}
          <div className='bg-gradient-to-r from-green-400 to-green-500 p-6 text-white'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold'>{bookings.length}</div>
                <div className='text-white text-sm'>Total Bookings</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>{bookings.filter(b => b.status === 'confirmed').length}</div>
                <div className='text-white text-sm'>Confirmed</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>{bookings.filter(b => b.status === 'pending').length}</div>
                <div className='text-white text-sm'>Pending</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>{bookings.filter(b => b.status === 'cancelled').length}</div>
                <div className='text-white text-sm'>Cancelled</div>
              </div>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className='p-12 text-center'>
              <svg className='w-16 h-16 text-gray-300 mx-auto mb-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Bookings Yet</h3>
              <p className='text-gray-500'>Customer bookings will appear here once they start booking your cars.</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse text-left text-sm'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className="p-4 font-semibold text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Car Details
                    </th>
                    <th className="p-4 font-semibold text-gray-700 max-lg:hidden">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Date Range
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Total
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-gray-700 max-lg:hidden">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index)=>(
                    <motion.tr 
                      key={index} 
                      className='border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >

                      <td className='p-4'>
                        <div className='flex items-center gap-4'>
                          <div className='relative'>
                            <img 
                              src={booking.car.image} 
                              alt={`${booking.car.brand} ${booking.car.model}`}
                              className='h-16 w-16 aspect-square rounded-lg object-cover shadow-md border-2 border-white'
                            />
                            <div className='absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white'></div>
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='font-semibold text-gray-800 truncate'>{booking.car.brand} {booking.car.model}</p>
                            <p className='text-sm text-gray-500'>{booking.car.year} • {booking.car.category}</p>
                            <p className='text-xs text-gray-400 max-lg:block hidden mt-1'>
                              {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className='p-4 max-lg:hidden'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2 text-sm'>
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className='text-gray-600'>{new Date(booking.pickupDate).toLocaleDateString()}</span>
                          </div>
                          <div className='flex items-center gap-2 text-sm'>
                            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className='text-gray-600'>{new Date(booking.returnDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>

                      <td className='p-4'>
                        <div className='font-bold text-lg text-green-600'>{currency}{booking.price}</div>
                        <div className='text-xs text-gray-500'>
                          {Math.ceil((new Date(booking.returnDate) - new Date(booking.pickupDate)) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </td>

                      <td className='p-4 max-lg:hidden'>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          booking.payment === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {booking.payment === 'paid' ? (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Online
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Pending
                            </div>
                          )}
                        </span>
                      </td>

                      <td className='p-4'>
                        {booking.payment === 'paid' ? (
                          // Auto-confirmed paid bookings - only allow cancellation
                          booking.status === 'confirmed' ? (
                            <div className="space-y-2">
                              <span className='px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1 w-fit'>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Confirmed
                              </span>
                              <button
                                onClick={() => changeBookingStatus(booking._id, 'cancelled')}
                                className="w-full px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Booking
                              </button>
                            </div>
                          ) : (
                            <span className='px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700'>Cancelled</span>
                          )
                        ) : (
                          // Unpaid bookings - only allow cancellation (payment will auto-confirm)
                          booking.status === 'pending' ? (
                            <div className="space-y-2">
                              <span className='px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit'>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Pending
                              </span>
                              <button
                                onClick={() => changeBookingStatus(booking._id, 'cancelled')}
                                className="w-full px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Booking
                              </button>
                            </div>
                          ) : (
                            <span className='px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700'>Cancelled</span>
                          )
                        )}
                      </td>

                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </motion.div>
      </motion.div>

    </div>
  )
}

export default ManageBookings
