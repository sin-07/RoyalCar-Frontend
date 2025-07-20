import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = ({ onClose, onBackToLogin }) => {
  const { axios } = useAppContext();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationToken, setVerificationToken] = useState("");
  
  // Use ref as backup for verification token
  const verificationTokenRef = useRef("");

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace in OTP inputs
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle paste in OTP inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
  };

  // Step 1: Send OTP to email
  const sendResetOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/user/forgot-password', { email });
      
      if (data.success) {
        toast.success("Reset code sent to your email!");
        setStep(2);
        setCountdown(60); // 60 seconds countdown
      } else {
        toast.error(data.message || "Failed to send reset code");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and move to password reset
  const verifyResetOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/user/verify-password-reset-otp', { 
        email, 
        otp: otpString
      });
      
      const { data } = response;
      
      if (data.success) {
        const receivedToken = data.verificationToken;
        
        if (!receivedToken) {
          toast.error("Server error: No verification token received. Please try again.");
          return;
        }
        
        setVerificationToken(receivedToken);
        verificationTokenRef.current = receivedToken;
        
        toast.success("Code verified! Please set your new password.");
        
        // Add a small delay before changing step to ensure state update
        setTimeout(() => {
          setStep(3);
        }, 150);
      } else {
        toast.error(data.message || "Invalid or expired code");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const resetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Use ref as fallback if state is undefined
    const currentToken = verificationToken || verificationTokenRef.current;
    
    if (!currentToken) {
      toast.error("Verification token missing. Please verify OTP again.");
      setStep(2);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/user/reset-password', { 
        email, 
        verificationToken: currentToken, 
        newPassword 
      });
      
      if (data.success) {
        toast.success("Password reset successfully!");
        // Clear the verification token
        setVerificationToken("");
        verificationTokenRef.current = "";
        onBackToLogin();
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (countdown > 0) return;
    
    setCountdown(60);
    await sendResetOtp();
  };

  return (
    <motion.div
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-80 sm:w-[400px] m-auto"
      >
        <motion.div
          className="flex flex-col gap-4 items-start p-8 py-12 rounded-lg shadow-xl border border-gray-200 bg-white"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-200 z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="w-full text-center mb-6">
            <h2 className="text-2xl font-medium">
              <span className="text-green-600">Forgot</span> Password
            </h2>
            <div className="flex items-center justify-center mt-4 mb-2">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-0.5 ${step > stepNum ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {step === 1 && "Enter your email address"}
              {step === 2 && "Enter the verification code"}
              {step === 3 && "Set your new password"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Email Input */}
            {step === 1 && (
              <motion.div
                key="step1"
                className="w-full space-y-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="mb-2 font-medium">Email Address</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="border border-gray-200 rounded w-full p-3 outline-green-600 focus:border-green-600 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && sendResetOtp()}
                  />
                </div>
                
                <button
                  onClick={sendResetOtp}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all text-white w-full py-3 rounded-md cursor-pointer transform hover:scale-105 focus:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 2: OTP Input */}
            {step === 2 && (
              <motion.div
                key="step2"
                className="w-full space-y-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="mb-2 font-medium">Verification Code</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Enter the 6-digit code sent to {email}
                  </p>
                  
                  <div className="flex gap-2 justify-center mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none transition-colors"
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={verifyResetOtp}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all text-white w-full py-3 rounded-md cursor-pointer transform hover:scale-105 focus:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </button>

                <div className="text-center">
                  <button
                    onClick={resendOtp}
                    disabled={countdown > 0}
                    className="text-green-600 hover:text-green-700 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <motion.div
                key="step3"
                className="w-full space-y-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="mb-2 font-medium">New Password</p>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="border border-gray-200 rounded w-full p-3 outline-green-600 focus:border-green-600 transition-colors"
                  />
                </div>

                <div>
                  <p className="mb-2 font-medium">Confirm New Password</p>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className={`border rounded w-full p-3 outline-green-600 transition-colors ${
                      confirmPassword && newPassword !== confirmPassword 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-green-600'
                    }`}
                    onKeyPress={(e) => e.key === 'Enter' && resetPassword()}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>

                <button
                  onClick={resetPassword}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all text-white w-full py-3 rounded-md cursor-pointer transform hover:scale-105 focus:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Login */}
          <div className="w-full text-center mt-4">
            <button
              onClick={onBackToLogin}
              className="text-green-600 hover:text-green-700 text-sm hover:underline transition-all"
            >
              ← Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
