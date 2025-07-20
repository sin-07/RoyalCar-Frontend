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
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    // Wait for exit animation to complete before actually closing
    setTimeout(() => {
      setShowLogin(false);
      setIsExiting(false);
    }, 600); // Match the animation duration
  };

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      // Check for admin credentials
      if (email === "aniket.singh9322@gmail.com" && password === "Vicky@123") {
        console.log("Admin credentials detected, attempting admin login...");
        console.log("Using endpoint: /api/user/admin-login");
        console.log("Axios base URL:", axios.defaults.baseURL);
        
        // Use dedicated admin login endpoint
        try {
          console.log("Making admin login request...");
          const { data } = await axios.post(`/api/user/admin-login`, {
            email,
            password,
          });

          console.log("Admin login response:", data);

          if (data.success) {
            console.log("Admin login successful, setting up session...");
            
            // Set token first
            setToken(data.token);
            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", "true");

            // Set axios headers - try without Bearer prefix for deployed backend
            axios.defaults.headers.common["Authorization"] = data.token;

            // Set admin status and ensure it's persisted
            setIsOwner(true);
            console.log("isOwner set to true");

            // Fetch user data for admin and wait for completion
            try {
              await fetchUser();
              console.log("Admin user data fetched successfully");
            } catch (fetchError) {
              console.error("Failed to fetch admin user data:", fetchError);
              // Even if fetchUser fails, we can still proceed as admin since we have the token
            }

            // Debug logging
            console.log("Admin login successful");
            console.log("Token set:", data.token);
            console.log("Authorization header:", `Bearer ${data.token}`);
            console.log("localStorage isAdmin set to true");

            // Close login modal
            setShowLogin(false);
            toast.success("Admin login successful! Redirecting to dashboard...");

            // Force a hard redirect to bypass React state issues
            console.log("Using window.location for forced redirect");
            window.location.href = "/owner";
            
            return;
          } else {
            console.error("Admin login failed with message:", data.message);
            toast.error(data.message || "Admin authentication failed");
            return;
          }
        } catch (adminError) {
          console.error("Admin login error (full error):", adminError);
          console.error("Admin login error response:", adminError.response);
          console.error("Admin login error status:", adminError.response?.status);
          console.error("Admin login error data:", adminError.response?.data);
          
          const errorMessage = adminError.response?.data?.message || 
                              adminError.message || 
                              "Admin authentication failed. Please try again.";
          
          console.error("Final error message:", errorMessage);
          toast.error(errorMessage);
          return;
        }
      }

      // Regular user login/register
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        // Set token and headers for regular users
        setToken(data.token);
        localStorage.setItem("token", data.token);
        
        // Set axios headers for future requests - use direct token format
        const authHeader = data.token;
        axios.defaults.headers.common["Authorization"] = authHeader;
        
        console.log("Setting authorization header:", authHeader);
        console.log("axios.defaults.headers.common:", axios.defaults.headers.common);
        
        // Clear any admin status for regular users
        setIsOwner(false);
        localStorage.removeItem("isAdmin");
        
        // Fetch user data to ensure user state is updated
        try {
          await fetchUser();
          console.log("User data fetched successfully after login");
          
          // Double-check if user data was actually set
          setTimeout(() => {
            const userFromContext = JSON.parse(localStorage.getItem("userData") || "null");
            console.log("User data verification:", userFromContext);
          }, 100);
          
        } catch (fetchError) {
          console.error("Failed to fetch user data:", fetchError);
          // Force a page reload to refresh the app state
          console.log("Forcing page reload due to user fetch error");
          window.location.reload();
        }
        
        // Close login modal
        setShowLogin(false);
        toast.success(
          state === "login"
            ? "Login successful!"
            : "Account created successfully!"
        );

        // Debug logging for regular users
        console.log("Regular user login successful");
        console.log("Token set:", data.token);
        console.log("User can now access protected routes");

        // Navigate after user data is fetched
        const redirectTo = intendedRoute || "/";
        setIntendedRoute(null);
        navigate(redirectTo);
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
        className="relative w-80 sm:w-[352px] h-[500px] m-auto perspective-1000"
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence mode="wait">
          <motion.form
            key={state} // This ensures re-render on state change
            onSubmit={onSubmitHandler}
            className="absolute inset-0 flex flex-col gap-4 items-start p-8 py-12 rounded-lg shadow-xl border border-gray-200 bg-white"
            initial={{ rotateY: state === "login" ? 180 : -180, opacity: 0, scale: 0.8 }}
            animate={{ 
              rotateY: isExiting ? (state === "login" ? -360 : 360) : 0, 
              opacity: isExiting ? 0 : 1,
              scale: isExiting ? 0.5 : 1,
              y: isExiting ? -50 : 0
            }}
            exit={{ 
              rotateY: state === "login" ? -180 : 180, 
              opacity: 0,
              scale: 0.8,
              y: 50
            }}
            transition={{ 
              duration: isExiting ? 0.6 : 0.6, 
              ease: isExiting ? "easeIn" : "easeInOut",
              opacity: { duration: isExiting ? 0.4 : 0.3 }
            }}
            style={{ 
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
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
                rotate: isExiting ? 180 : 0
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
                <span className="text-primary">User</span>{" "}
                {state === "login" ? "Login" : "Sign Up"}
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
                  className="w-full"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>Name</p>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Enter your name"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:border-primary transition-colors"
                    type="text"
                    required
                  />
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
                    className="text-primary cursor-pointer hover:underline transition-all"
                  >
                    click here
                  </span>
                </p>
              ) : (
                <p className="text-center">
                  Create an account?{" "}
                  <span
                    onClick={() => setState("register")}
                    className="text-primary cursor-pointer hover:underline transition-all"
                  >
                    click here
                  </span>
                </p>
              )}
            </motion.div>

            <motion.button 
              className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all text-white w-full py-2 rounded-md cursor-pointer transform hover:scale-105 focus:scale-95"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
