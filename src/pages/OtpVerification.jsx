import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { axios } = useAppContext();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  
  // Get user data from location state
  const userData = location.state?.userData;
  const email = userData?.email;

  // Redirect if no user data
  useEffect(() => {
    if (!userData || !email) {
      toast.error('Invalid access. Please start the signup process again.');
      navigate('/');
    }
  }, [userData, email, navigate]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => {
          if (timer <= 1) {
            setCanResend(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Paste handler
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const { data } = await axios.post('/api/user/verify-otp', {
        email,
        otp: otpString
      });

      if (data.success) {
        toast.success('Email verified successfully!');
        
        // Register the user after OTP verification
        const registerResponse = await axios.post('/api/user/register', {
          ...userData,
          otpVerified: true
        });

        if (registerResponse.data.success) {
          toast.success('Account created successfully! Please login to continue.');
          // Clear user data from location state to prevent re-use
          navigate('/', { 
            state: { 
              showLogin: true, 
              registrationSuccess: true,
              userEmail: email 
            },
            replace: true // Replace the current history entry
          });
        } else {
          toast.error(registerResponse.data.message || 'Registration failed');
        }
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      const { data } = await axios.post('/api/user/send-otp', { email });
      
      if (data.success) {
        toast.success('New OTP sent to your email!');
        setOtpTimer(300); // Reset timer to 5 minutes
        setCanResend(false);
        setOtp(['', '', '', '', '', '']); // Clear current OTP
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 p-2"
          >
            <img src={assets.royalcarslogo} alt="Royal Cars Logo" className="w-full h-full object-contain" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-blue-600">{email}</p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter Verification Code
          </label>
          <div className="flex justify-center gap-1 sm:gap-3 mb-4">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-8 h-8 sm:w-12 sm:h-12 text-center text-sm sm:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          {!canResend ? (
            <p className="text-sm text-gray-500">
              Resend code in <span className="font-semibold text-blue-600">{formatTime(otpTimer)}</span>
            </p>
          ) : (
            <button
              onClick={resendOtp}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Resend Verification Code
            </button>
          )}
        </div>

        {/* Verify Button */}
        <motion.button
          onClick={verifyOtp}
          disabled={isVerifying || otp.join('').length !== 6}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isVerifying ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </div>
          ) : (
            'Verify Email'
          )}
        </motion.button>

        {/* Back to Signup */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 mx-auto"
          >
            <img src={assets.arrow_icon} alt="" className="w-4 h-4 rotate-180" />
            Back to Signup
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            Didn't receive the code? Check your spam folder or try resending after the timer expires.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerification;
