import React from 'react';
import { motion } from 'motion/react';

const RoyalCarBill = ({ bookingData, onDownload, onPrint }) => {
  // Sample booking data structure - replace with actual props
  const booking = bookingData || {
    invoiceNumber: "RC-2025-001",
    invoiceDate: "January 22, 2025",
    customerName: "John Doe",
    customerEmail: "john.doe@email.com",
    customerPhone: "+1 (555) 123-4567",
    customerAddress: "123 Main Street, New York, NY 10001",
    
    carDetails: {
      brand: "Rolls Royce",
      model: "Phantom",
      year: "2024",
      licensePlate: "RR-2024-PHT",
      category: "Ultra Luxury"
    },
    
    rentalPeriod: {
      pickupDate: "January 25, 2025",
      pickupTime: "10:00 AM",
      returnDate: "January 28, 2025", 
      returnTime: "10:00 AM",
      duration: "3 days",
      pickupLocation: "Airport Parking"
    },
    
    pricing: {
      baseRate: 1200.00,
      days: 3,
      subtotal: 3600.00,
      insurance: 180.00,
      serviceFee: 120.00,
      tax: 380.00,
      total: 4280.00,
      currency: "$"
    },
    
    paymentMethod: "Credit Card ****1234",
    transactionId: "TXN-RC-789654123",
    status: "Confirmed"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
        </div>
        
        <div className="relative z-10 flex justify-between items-start">
          {/* Company Logo & Info */}
          <div>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center mb-4"
            >
              {/* Crown Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6L9 9L12 12L15 9L12 6Z M5 14L8 11L12 15L16 11L19 14L12 21L5 14Z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-wide">ROYAL CARS</h1>
                <p className="text-gray-300 text-sm">Premium Luxury Vehicle Rentals</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-300 space-y-1"
            >
              <p>📍 123 Royal Street, Premium District</p>
              <p>📞 +1 (800) ROYAL-CAR</p>
              <p>✉️ bookings@royalcars.com</p>
            </motion.div>
          </div>
          
          {/* Invoice Info */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-right"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-300">Invoice #:</span> <span className="font-mono">{booking.invoiceNumber}</span></p>
                <p><span className="text-gray-300">Date:</span> {booking.invoiceDate}</p>
                <p><span className="text-gray-300">Status:</span> 
                  <span className="ml-2 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                    {booking.status}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Customer & Car Details */}
      <div className="p-8 grid md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">👤</span>
            Customer Details
          </h3>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold">Name:</span> {booking.customerName}</p>
            <p><span className="font-semibold">Email:</span> {booking.customerEmail}</p>
            <p><span className="font-semibold">Phone:</span> {booking.customerPhone}</p>
            <p><span className="font-semibold">Address:</span> {booking.customerAddress}</p>
          </div>
        </motion.div>

        {/* Vehicle Information */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-xl p-6 border-l-4 border-purple-500"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">🚗</span>
            Vehicle Details
          </h3>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold">Vehicle:</span> {booking.carDetails.brand} {booking.carDetails.model}</p>
            <p><span className="font-semibold">Year:</span> {booking.carDetails.year}</p>
            <p><span className="font-semibold">Category:</span> {booking.carDetails.category}</p>
            <p><span className="font-semibold">License Plate:</span> <span className="font-mono bg-gray-200 px-2 py-1 rounded">{booking.carDetails.licensePlate}</span></p>
          </div>
        </motion.div>
      </div>

      {/* Rental Period */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-8 pb-6"
      >
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">📅</span>
            Rental Period
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-gray-700">
            <div>
              <p className="font-semibold text-green-700 mb-2">PICKUP</p>
              <p>{booking.rentalPeriod.pickupDate}</p>
              <p className="text-sm text-gray-600">{booking.rentalPeriod.pickupTime}</p>
              <p className="text-sm text-gray-600">📍 {booking.rentalPeriod.pickupLocation}</p>
            </div>
            <div>
              <p className="font-semibold text-blue-700 mb-2">RETURN</p>
              <p>{booking.rentalPeriod.returnDate}</p>
              <p className="text-sm text-gray-600">{booking.rentalPeriod.returnTime}</p>
              <p className="text-sm text-gray-600">📍 {booking.rentalPeriod.pickupLocation}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-purple-700 mb-2">DURATION</p>
              <p className="text-2xl font-bold text-purple-700">{booking.rentalPeriod.duration}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pricing Breakdown */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="px-8 pb-8"
      >
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-800 text-white p-4">
            <h3 className="text-xl font-bold">💰 Pricing Breakdown</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Base Rate ({booking.pricing.currency}{booking.pricing.baseRate.toFixed(2)} × {booking.pricing.days} days)</span>
                <span className="font-semibold">{booking.pricing.currency}{booking.pricing.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Insurance Coverage</span>
                <span className="font-semibold">{booking.pricing.currency}{booking.pricing.insurance.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Service Fee</span>
                <span className="font-semibold">{booking.pricing.currency}{booking.pricing.serviceFee.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Tax & Fees</span>
                <span className="font-semibold">{booking.pricing.currency}{booking.pricing.tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t-2 border-gray-800 bg-gray-50 rounded-lg px-4">
                <span className="text-xl font-bold text-gray-800">TOTAL AMOUNT</span>
                <span className="text-2xl font-bold text-green-600">{booking.pricing.currency}{booking.pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Information */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-8 pb-8"
      >
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">💳</span>
            Payment Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Payment Method:</span> {booking.paymentMethod}</p>
            <p><span className="font-semibold">Transaction ID:</span> <span className="font-mono text-sm">{booking.transactionId}</span></p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="px-8 pb-8 flex justify-center space-x-4"
      >
        <button
          onClick={onPrint}
          className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <span>🖨️</span>
          <span>Print Invoice</span>
        </button>
        
        <button
          onClick={onDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <span>⬇️</span>
          <span>Download PDF</span>
        </button>
      </motion.div>

      {/* Footer */}
      <div className="bg-gray-100 p-6 text-center border-t">
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-semibold">Thank you for choosing Royal Cars!</p>
          <p>For support, contact us at support@royalcars.com or +1 (800) ROYAL-CAR</p>
          <p className="text-xs">This is a computer-generated invoice. Terms & conditions apply.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RoyalCarBill;
