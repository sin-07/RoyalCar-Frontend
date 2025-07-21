// 📁 src/pages/PaymentForm.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import CarWheelLoader from "../components/CarWheelLoader";
import { motion, AnimatePresence } from "motion/react";

const PaymentForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, axios } = useAppContext(); // Use axios from context

  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        toast.error("Invalid booking ID");
        navigate("/");
        return;
      }

      try {
        // Use the correct endpoint
        const { data } = await axios.get(`/api/bookings/${bookingId}`);
        if (data.success && data.booking) {
          setBookingDetails(data.booking);
        } else {
          throw new Error("Booking not found");
        }
      } catch (error) {
        console.error("Failed to fetch booking details:", error);
        toast.error("Could not load booking details. Please check your booking ID.");
        
        // If booking details can't be fetched, redirect back
        setTimeout(() => {
          navigate("/my-bookings");
        }, 2000);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, axios, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      // ⏳ Step 1: Create Razorpay Order using bookingId with hardcoded amount for testing
      const { data } = await axios.post("/api/payment/create-order", {
        bookingId,
        customer: form,
        testAmount: 100, // ₹1 in paise (Razorpay uses paise as base unit)
      });

      if (!data.success) {
        toast.error(data.message || "Failed to create order");
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount, // from backend
        currency: data.order.currency,
        name: "Royal Cars",
        description: "Car Rental Payment",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            toast.success("Payment Successful ✅");

            // Step 2: Save Payment Info with timeout handling
            const savePromise = axios.post("/api/payment/save-transaction", {
              bookingId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Set a shorter timeout for save transaction
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Save timeout')), 5000)
            );

            try {
              await Promise.race([savePromise, timeoutPromise]);
              toast.success("Booking confirmed! 🎉");
            } catch (saveError) {
              if (saveError.message === 'Save timeout' || saveError.code === 'ECONNABORTED') {
                console.warn("Save timeout, but payment was successful");
                toast.success("Payment completed! Booking details will be updated shortly.");
              } else {
                console.error("Save error:", saveError);
                toast.success("Payment successful! Your booking will be confirmed shortly.");
              }
            }

            // Step 3: Redirect after a short delay
            setTimeout(() => {
              navigate("/my-bookings");
            }, 1500);
            
          } catch (err) {
            console.error("Handler error:", err);
            toast.success("Payment completed! Redirecting to bookings...");
            setTimeout(() => navigate("/my-bookings"), 2000);
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#10b981",
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.error("Payment cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading overlay during payment processing
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      >
        <CarWheelLoader />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Processing Payment...
          </h3>
          <p className="text-gray-600">
            Please don't close this window
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8 mt-16"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Just one step away from booking your perfect ride
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Summary */}
          {bookingDetails ? (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Booking Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {bookingDetails.car?.brand} {bookingDetails.car?.model}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {bookingDetails.car?.category}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-600 font-medium">Pickup</p>
                    <p className="text-gray-800">
                      {new Date(bookingDetails.pickupDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">{bookingDetails.pickupTime}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-orange-600 font-medium">Return</p>
                    <p className="text-gray-800">
                      {new Date(bookingDetails.returnDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">{bookingDetails.returnTime}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-800">Original Amount:</span>
                    <span className="text-gray-400 line-through">₹{bookingDetails.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold mt-2">
                    <span className="text-gray-800">Test Amount:</span>
                    <span className="text-green-600">₹1</span>
                  </div>
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-3">
                    <p className="text-yellow-800 text-sm font-medium">
                      🧪 Test Mode: Payment amount is set to ₹1 for testing
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payment Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-blue-800 font-medium">Test Payment Mode</p>
                      <p className="text-blue-700 text-sm mt-1">
                        Payment amount is set to ₹1 for testing purposes. Complete your details below to proceed with the test payment.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <p className="text-green-800 font-medium">Secure Payment</p>
                      <p className="text-green-700 text-sm">
                        Your payment is protected by Razorpay's secure payment gateway
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-yellow-800 font-medium">Test Amount</span>
                    </div>
                    <span className="text-yellow-800 font-bold">₹1</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Form */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handlePayment}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 h-fit"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`w-full border-2 px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                      formErrors.firstName 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-green-500'
                    }`}
                    required
                  />
                  <AnimatePresence>
                    {formErrors.firstName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {formErrors.firstName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`w-full border-2 px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                      formErrors.lastName 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-green-500'
                    }`}
                    required
                  />
                  <AnimatePresence>
                    {formErrors.lastName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {formErrors.lastName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full border-2 px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                    formErrors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  required
                />
                <AnimatePresence>
                  {formErrors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      handleChange({ target: { name: 'phone', value } });
                    }
                  }}
                  className={`w-full border-2 px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                    formErrors.phone 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  maxLength="10"
                  required
                />
                <AnimatePresence>
                  {formErrors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.phone}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-lg transition-all duration-300 transform shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Pay with Razorpay</span>
                </>
              )}
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="mt-4 text-center"
            >
              <p className="text-xs text-gray-500">
                🔒 Your payment information is secured with 256-bit SSL encryption
              </p>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentForm;
