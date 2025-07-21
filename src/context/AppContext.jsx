import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Set base URL with fallback
const baseURL =
  import.meta.env.VITE_BASE_URL || "https://royalcar-backend-2lg9.onrender.com";
console.log("AppContext - Base URL:", baseURL);
console.log("AppContext - Environment VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);

// Set axios defaults
axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 10000; // 10 second timeout

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [intendedRoute, setIntendedRoute] = useState(null); // For post-login redirect
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [cars, setCars] = useState([]);

  // Helper function to handle auth errors consistently
  const handleAuthError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Auth error - clearing session");
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("userData");
      setToken(null);
      setUser(null);
      setIsOwner(false);
      axios.defaults.headers.common["Authorization"] = "";
      return true; // Indicates auth error was handled
    }
    return false; // Not an auth error
  };

  // Note: Removed axios interceptor due to compatibility issues
  // Error handling is now done manually in each API call

  // Function to check if user is logged in
  // Test API connection on app load
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test with axios configuration
        await axios.get("/");
      } catch (error) {
        // If axios fails, try to reconfigure it with hardcoded URL
        axios.defaults.baseURL = "https://royalcar-backend-2lg9.onrender.com";
      }
    };
    testConnection();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        // Store user data in localStorage for persistence
        localStorage.setItem("userData", JSON.stringify(data.user));
        
        // Set isOwner based on user role or localStorage admin flag
        const isAdmin = localStorage.getItem("isAdmin");
        const shouldBeOwner = data.user.role === "owner" || isAdmin === "true";
        setIsOwner(shouldBeOwner);
        
        return true; // Indicate success
      } else {
        // If we have admin flag in localStorage, create a fallback admin user
        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin === "true" && token) {
          const fallbackAdmin = {
            _id: "admin-fallback",
            name: "Admin",
            email: "aniket.singh9322@gmail.com",
            role: "owner"
          };
          setUser(fallbackAdmin);
          setIsOwner(true);
          localStorage.setItem("userData", JSON.stringify(fallbackAdmin));
          return true; // Don't clear token if we have admin fallback
        }
        
        console.warn("User fetch failed but token exists - keeping user logged in");
        return false; // Don't clear token, just return false
      }
    } catch (error) {
      console.error("fetchUser error:", error);
      
      // If we have admin flag in localStorage, create a fallback admin user
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin === "true" && token) {
        const fallbackAdmin = {
          _id: "admin-fallback",
          name: "Admin", 
          email: "aniket.singh9322@gmail.com",
          role: "owner"
        };
        setUser(fallbackAdmin);
        setIsOwner(true);
        localStorage.setItem("userData", JSON.stringify(fallbackAdmin));
        return true;
      } else {
        // Only clear token if it's a 401/403 (unauthorized) error
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Token invalid - clearing authentication");
          localStorage.removeItem("token");
          localStorage.removeItem("isAdmin");
          localStorage.removeItem("userData");
          setToken(null);
          setUser(null);
          setIsOwner(false);
          axios.defaults.headers.common["Authorization"] = "";
        } else {
          console.warn("Network error in fetchUser - keeping user logged in");
        }
        return false;
      }
    } finally {
      setIsLoading(false); // Set loading to false after fetch attempt
    }
  };
  // Function to fetch all cars from the server

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Only show toast error if user is logged in (to avoid errors on public pages)
      if (token) {
        toast.error("Failed to load cars. Please try again.");
      }
    }
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin"); // Remove admin status
    localStorage.removeItem("userData"); // Remove user data
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common["Authorization"] = "";

    // Show success message first
    toast.success("You have been logged out successfully!", {
      duration: 3000,
      position: "top-center",
    });

    // Small delay to ensure toast is visible before navigation
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  // Function to check if user is logged in
  const isLoggedIn = () => {
    return !!(token && user);
  };

  // Function to handle login requirement
  const requireLogin = (
    message = "Please login to continue",
    redirectTo = null
  ) => {
    if (redirectTo) {
      setIntendedRoute(redirectTo);
    }
    setShowLogin(true);
    toast.error(message);
  };

  // useEffect to retrieve the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");
    const userData = localStorage.getItem("userData");

    if (storedToken) {
      setToken(storedToken);
      // Set axios headers with the stored token
      axios.defaults.headers.common["Authorization"] = storedToken;
      
      // Restore user data if available
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (e) {
          localStorage.removeItem("userData");
        }
      }
      
      if (isAdmin === "true") {
        setIsOwner(true);
      }
    } else {
      // No token found, set loading to false immediately
      setIsLoading(false);
    }

    fetchCars();
  }, []);

  // useEffect to fetch user data when token is available
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    axios, // Use the default axios instance
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    requireLogin,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    intendedRoute,
    setIntendedRoute,
    isLoading,
    isLoggedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
