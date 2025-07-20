import React, { useEffect, useState } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Dashboard = () => {

  const {axios, isOwner, currency} = useAppContext()

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  const dashboardCards = [
    {
      title: "Total Cars", 
      value: data.totalCars, 
      icon: assets.carIconColored,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Total Bookings", 
      value: data.totalBookings, 
      icon: assets.listIconColored,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Pending", 
      value: data.pendingBookings, 
      icon: assets.cautionIconColored,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      title: "Confirmed", 
      value: data.completedBookings, 
      icon: assets.listIconColored,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
  ]

  const fetchDashboardData = async ()=>{
    try {
       const { data } = await axios.get('/api/owner/dashboard')
       if (data.success){
        setData(data.dashboardData)
       }else{
        toast.error(data.message)
       }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(isOwner){
      fetchDashboardData()
    }
  },[isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title title="Admin Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"/>

        {/* Dashboard Cards */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8'>
          {dashboardCards.map((card, index)=>(
            <motion.div 
              key={index} 
              className={`relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 group`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className='relative p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-600 mb-1'>{card.title}</p>
                    <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                  </div>
                  <div className={`${card.bgColor} rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300`}>
                    <img src={card.icon} alt="" className='h-8 w-8'/>
                  </div>
                </div>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className='grid lg:grid-cols-3 gap-8 mb-8'>
          {/* Recent Bookings */}
          <motion.div 
            className='lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white'>
              <div className='flex items-center gap-3'>
                <div className='bg-white/20 rounded-lg p-2'>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className='text-xl font-bold'>Recent Bookings</h2>
                  <p className='text-blue-100 text-sm'>Latest customer bookings</p>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className='p-6'>
              {data.recentBookings.length === 0 ? (
                <div className='text-center py-8'>
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className='text-gray-500'>No recent bookings</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {data.recentBookings.map((booking, index)=>(
                    <motion.div 
                      key={index} 
                      className='flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200'
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className='flex items-center gap-4'>
                        <div className='bg-blue-100 rounded-xl p-3'>
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className='font-semibold text-gray-800'>{booking.car.brand} {booking.car.model}</p>
                          <p className='text-sm text-gray-500'>{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className='flex items-center gap-3'>
                        <div className='text-right'>
                          <p className='font-bold text-green-600'>{currency}{booking.price}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Monthly Revenue */}
          <motion.div 
            className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {/* Header */}
            <div className='bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white'>
              <div className='flex items-center gap-3'>
                <div className='bg-white/20 rounded-lg p-2'>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h2 className='text-xl font-bold'>Monthly Revenue</h2>
                  <p className='text-green-100 text-sm'>Current month earnings</p>
                </div>
              </div>
            </div>

            {/* Revenue Display */}
            <div className='p-6'>
              <div className='text-center'>
                <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-4'>
                  <p className='text-4xl font-bold text-green-600 mb-2'>{currency}{data.monthlyRevenue}</p>
                  <p className='text-sm text-gray-600'>Total Revenue</p>
                </div>
                
                {/* Stats */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-gray-50 rounded-xl p-4'>
                    <p className='text-lg font-bold text-gray-800'>{data.totalBookings}</p>
                    <p className='text-xs text-gray-600'>Total Bookings</p>
                  </div>
                  <div className='bg-gray-50 rounded-xl p-4'>
                    <p className='text-lg font-bold text-gray-800'>{data.totalCars}</p>
                    <p className='text-xs text-gray-600'>Active Cars</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
