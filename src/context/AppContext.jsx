import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Set base URL with fallback
const baseURL =
  import.meta.env.VITE_BASE_URL || "https://royalcar-backend-2lg9.onrender.com";
axios.defaults.baseURL = baseURL;

// Debug logging
console.log("Environment Variables:");
console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);
console.log("VITE_CURRENCY:", import.meta.env.VITE_CURRENCY);
console.log("Final baseURL:", baseURL);
console.log("axios.defaults.baseURL:", axios.defaults.baseURL);

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

  // Function to check if user is logged in
  // Test API connection on app load
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing backend connection...");

        // Test with hardcoded URL first
        const hardcodedTest = await fetch(
          "https://royalcar-backend-2lg9.onrender.com/"
        );
        const hardcodedResponse = await hardcodedTest.text();
        console.log("Hardcoded URL test successful:", hardcodedResponse);

        // Test with axios configuration
        const response = await axios.get("/");
        console.log("Axios configuration test successful:", response.data);
      } catch (error) {
        console.error("Backend connection failed:", error.message);
        console.error("Error details:", error.response?.data || error);

        // If axios fails, try to reconfigure it with hardcoded URL
        console.log("Reconfiguring axios with hardcoded URL...");
        axios.defaults.baseURL = "https://royalcar-backend-2lg9.onrender.com";
      }
    };
    testConnection();
  }, []);

  const fetchUser = async () => {
    try {
      console.log("Fetching user data with token:", token);
      console.log("Authorization header:", axios.defaults.headers.common["Authorization"]);
      
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        // Store user data in localStorage for persistence
        localStorage.setItem("userData", JSON.stringify(data.user));
        
        // Set isOwner based on user role or localStorage admin flag
        const isAdmin = localStorage.getItem("isAdmin");
        const shouldBeOwner = data.user.role === "owner" || isAdmin === "true";
        setIsOwner(shouldBeOwner);

        // Debug logging
        console.log("User data fetched successfully:", data.user);
        console.log("User role:", data.user.role);
        console.log("Is admin from localStorage:", isAdmin);
        console.log("Setting isOwner to:", shouldBeOwner);
        console.log("User state should now be available in components");
      } else {
        console.error("fetchUser failed with message:", data.message);
        
        // If we have admin flag in localStorage, create a fallback admin user
        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin === "true" && token) {
          console.log("Creating fallback admin user due to fetchUser failure");
          const fallbackAdmin = {
            _id: "admin-fallback",
            name: "Admin",
            email: "aniket.singh9322@gmail.com",
            role: "owner"
          };
          setUser(fallbackAdmin);
          setIsOwner(true);
          localStorage.setItem("userData", JSON.stringify(fallbackAdmin));
          console.log("Fallback admin user created successfully");
          return; // Don't clear token if we have admin fallback
        }
        
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common["Authorization"] = "";
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      
      // If we have admin flag in localStorage, create a fallback admin user
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin === "true" && token) {
        console.log("Creating fallback admin user due to fetchUser error");
        const fallbackAdmin = {
          _id: "admin-fallback",
          name: "Admin", 
          email: "aniket.singh9322@gmail.com",
          role: "owner"
        };
        setUser(fallbackAdmin);
        setIsOwner(true);
        localStorage.setItem("userData", JSON.stringify(fallbackAdmin));
        console.log("Fallback admin user created successfully");
      } else {
        // Clear invalid token on error
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common["Authorization"] = "";
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
      console.error("Error fetching cars:", error);
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

    console.log("User logged out, all data cleared");

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
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");
    const userData = localStorage.getItem("userData");

    if (token) {
      setToken(token);
      // Try both Bearer and direct token format for compatibility
      axios.defaults.headers.common["Authorization"] = token;
      console.log("Token loaded from localStorage:", token);
      console.log("Authorization header set:", token);
      
      // Restore user data if available
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log("User data restored from localStorage:", parsedUser);
        } catch (e) {
          console.error("Failed to parse user data from localStorage:", e);
          localStorage.removeItem("userData");
        }
      }
      
      if (isAdmin === "true") {
        setIsOwner(true);
        console.log("Admin status restored from localStorage");
      }
    } else {
      // No token found, set loading to false immediately
      setIsLoading(false);
      console.log("No token found in localStorage");
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
    axios,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
