import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const {
    setShowLogin,
    axios,
    setToken,
    navigate,
    setIsOwner,
    intendedRoute,
    setIntendedRoute,
    fetchUser,
  } = useAppContext();
  const location = useLocation();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [drivingLicense, setDrivingLicense] = React.useState("");
  const [isExiting, setIsExiting] = React.useState(false);

  // Handle successful registration callback from OTP verification
  React.useEffect(() => {
    if (location.state?.showLogin && location.state?.registrationSuccess) {
      setState("login");
      if (location.state?.userEmail) {
        setEmail(location.state.userEmail);
      }
      toast.success("Registration successful! Please login with your credentials.");
    }
  }, [location.state]);

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    // Get the current scroll position
    const scrollY = window.scrollY;
    
    // Disable scroll on mount - more comprehensive approach
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Re-enable scroll on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Handle browser back button
  React.useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      handleClose();
    };

    // Add a dummy state to history to capture back button press
    window.history.pushState({ modalOpen: true }, '');
    
    // Listen for popstate (back button)
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Validation functions
  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validatePasswords = () => {
    return password === confirmPassword && password.length >= 6;
  };

  // Send OTP and redirect to verification page
  const sendOtpAndRedirect = async () => {
    try {
      if (!email) {
        toast.error("Please enter your email first");
        return;
      }

      const { data } = await axios.post('/api/user/send-otp', { email });
      
      if (data.success) {
        toast.success("OTP sent to your email!");
        
        // Prepare user data for OTP verification page
        const userData = {
          name,
          email,
          password,
          mobile,
          drivingLicense
        };
        
        // Navigate to OTP verification page with user data
        navigate('/verify-otp', { 
          state: { userData } 
        });
        
        // Close the login modal
        handleClose();
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    
    // Get current scroll position before restoring
    const scrollY = parseInt(document.body.style.top || '0') * -1;
    
    // Re-enable background scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Restore scroll position
    window.scrollTo(0, scrollY);
    
    // Wait for exit animation to complete before actually closing
    setTimeout(() => {
      setShowLogin(false);
      setIsExiting(false);
    }, 600); // Match the animation duration
  };

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      // Additional validation for signup
      if (state === "register") {
        if (!validateMobile(mobile)) {
          toast.error("Please enter a valid 10-digit mobile number");
          return;
        }
        
        if (!validatePasswords()) {
          toast.error("Passwords do not match or password is too short (minimum 6 characters)");
          return;
        }
        
        if (!drivingLicense.trim()) {
          toast.error("Driving license number is required");
          return;
        }

        // Check if all fields are filled
        if (!name || !email || !password || !confirmPassword || !mobile || !drivingLicense) {
          toast.error("All fields are required");
          return;
        }

        // Send OTP and redirect to verification page
        await sendOtpAndRedirect();
        return;
      }

      // Check for admin credentials
      if (email === "aniket.singh9322@gmail.com" && password === "Vicky@123") {
        // Use dedicated admin login endpoint
        try {
          const { data } = await axios.post(`/api/user/admin-login`, {
            email,
            password,
          });

          if (data.success) {
            // Set token first
            setToken(data.token);
            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", "true");

            // Set axios headers - try without Bearer prefix for deployed backend
            axios.defaults.headers.common["Authorization"] = data.token;

            // Set admin status and ensure it's persisted
            setIsOwner(true);

            // Fetch user data for admin and wait for completion
            try {
              await fetchUser();
            } catch (fetchError) {
              // Even if fetchUser fails, we can still proceed as admin since we have the token
            }

            // Close login modal
            setShowLogin(false);
            toast.success(
              "Admin login successful! Redirecting to dashboard..."
            );

            // Force a hard redirect to bypass React state issues
            window.location.href = "/owner";

            return;
          } else {
            toast.error(data.message || "Admin authentication failed");
            return;
          }
        } catch (adminError) {
          const errorMessage =
            adminError.response?.data?.message ||
            adminError.message ||
            "Admin authentication failed. Please try again.";

          toast.error(errorMessage);
          return;
        }
      }

      // Regular user login/register
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
        mobile,
        drivingLicense,
      });

      if (data.success) {
        // Set token and headers for regular users
        setToken(data.token);
        localStorage.setItem("token", data.token);

        // Set axios headers for future requests - use direct token format
        const authHeader = data.token;
        axios.defaults.headers.common["Authorization"] = authHeader;

        // Clear any admin status for regular users
        setIsOwner(false);
        localStorage.removeItem("isAdmin");

        // Fetch user data to ensure user state is updated
        try {
          await fetchUser();

          // Double-check if user data was actually set
          setTimeout(() => {
            const userFromContext = JSON.parse(
              localStorage.getItem("userData") || "null"
            );
          }, 100);
        } catch (fetchError) {
          // Don't reload the page, continue with navigation
        }

        // Close login modal
        setShowLogin(false);
        toast.success(
          state === "login"
            ? "Login successful!"
            : "Account created successfully!"
        );

        // Navigate after user data is fetched
        let redirectTo;

        // Regular users always redirect to home page regardless of intendedRoute
        redirectTo = "/";

        // Clear intended route
        setIntendedRoute(null);

        // Use setTimeout to ensure state is fully updated before navigation
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 100);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      onClick={handleClose}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-80 sm:w-[352px] m-auto perspective-1000 ${
          state === "register" ? "h-[750px]" : "h-[500px]"
        }`}
        style={{ perspective: "1000px" }}
      >
        <AnimatePresence mode="wait">
          <motion.form
            key={state} // This ensures re-render on state change
            onSubmit={onSubmitHandler}
            className="absolute inset-0 flex flex-col gap-4 items-start p-8 py-12 rounded-lg shadow-xl border border-gray-200 bg-white"
            initial={{
              rotateY: state === "login" ? 180 : -180,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              rotateY: isExiting ? (state === "login" ? -360 : 360) : 0,
              opacity: isExiting ? 0 : 1,
              scale: isExiting ? 0.5 : 1,
              y: isExiting ? -50 : 0,
            }}
            exit={{
              rotateY: state === "login" ? -180 : 180,
              opacity: 0,
              scale: 0.8,
              y: 50,
            }}
            transition={{
              duration: isExiting ? 0.6 : 0.6,
              ease: isExiting ? "easeIn" : "easeInOut",
              opacity: { duration: isExiting ? 0.4 : 0.3 },
            }}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Close Button */}
            <motion.button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-200 z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isExiting ? 0 : 1,
                scale: isExiting ? 0 : 1,
                rotate: isExiting ? 180 : 0,
              }}
              transition={{ delay: isExiting ? 0 : 0.8, duration: 0.3 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full"
            >
              <p className="text-2xl font-medium m-auto text-center">
                <span className="text-primary text-green-600">User</span>{" "}
                {state === "login" ? "Login" : "SignUp"}
              </p>
              <p className="text-xs text-gray-500 text-center w-full mt-2">
                Admin access: Use admin email and password
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full flex flex-col gap-4"
            >
              {state === "register" && (
                <motion.div
                  className="w-full space-y-4"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <p>Name</p>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      placeholder="Enter your name"
                      className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:border-primary transition-colors"
                      type="text"
                      required
                    />
                  </div>
                  
                  <div>
                    <p>Mobile Number</p>
                    <input
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                        if (value.length <= 10) {
                          setMobile(value);
                        }
                      }}
                      value={mobile}
                      placeholder="Enter 10-digit mobile number"
                      className={`border rounded w-full p-2 mt-1 outline-primary transition-colors ${
                        mobile && !validateMobile(mobile) ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                      }`}
                      type="tel"
                      maxLength="10"
                      required
                    />
                    {mobile && !validateMobile(mobile) && (
                      <p className="text-red-500 text-xs mt-1">Mobile number must be exactly 10 digits</p>
                    )}
                  </div>
                  
                  <div>
                    <p>Driving License Number</p>
                    <input
                      onChange={(e) => setDrivingLicense(e.target.value)}
                      value={drivingLicense}
                      placeholder="Enter your driving license number"
                      className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:border-primary transition-colors"
                      type="text"
                      required
                    />
                  </div>
                </motion.div>
              )}

              <div className="w-full">
                <p>Email</p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Enter your email"
                  className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:border-primary transition-colors"
                  type="email"
                  required
                />
              </div>

              <div className="w-full">
                <p>Password</p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Enter your password"
                  className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:border-primary transition-colors"
                  type="password"
                  required
                />
              </div>

              {state === "register" && (
                <motion.div
                  className="w-full"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>Confirm Password</p>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    placeholder="Confirm your password"
                    className={`border rounded w-full p-2 mt-1 outline-primary transition-colors ${
                      confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    type="password"
                    required
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full"
            >
              {state === "register" ? (
                <p className="text-center">
                  Already have account?{" "}
                  <span
                    onClick={() => setState("login")}
                    className="text-primary cursor-pointer hover:underline transition-all text-green-600 font-bold"
                  >
                    click here
                  </span>
                </p>
              ) : (
                <p className="text-center">
                  Create an account?{" "}
                  <span
                    onClick={() => setState("register")}
                    className="text-primary cursor-pointer hover:underline transition-all text-green-600 font-bold"
                  >
                    click here
                  </span>
                </p>
              )}
            </motion.div>

            <motion.button
              className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all text-white w-full py-2 rounded-md cursor-pointer transform hover:scale-105 focus:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={false}
            >
              {state === "register" ? "Create Account" : "Login"}
            </motion.button>
          </motion.form>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Login;
