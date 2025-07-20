import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CarWheelLoader from './CarWheelLoader';

// Component for protecting routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { token, user, setShowLogin, setIntendedRoute, isLoading } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !token) {
      // Only show login modal after loading is complete and no token found
      setIntendedRoute(location.pathname + location.search);
      setShowLogin(true);
    }
  }, [token, setShowLogin, setIntendedRoute, location, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return <CarWheelLoader />;
  }

  if (!token) {
    // Show login prompt instead of redirecting
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-blue-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-500 mb-4">
              Please login to access this page.
            </p>
            <button
              onClick={() => {
                setIntendedRoute(location.pathname + location.search);
                setShowLogin(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Show loading state while user data is being fetched
    return <CarWheelLoader />;
  }

  return children;
};

// Component for protecting owner-only routes
const OwnerRoute = ({ children }) => {
  const { token, user, isOwner, setShowLogin, setIntendedRoute, isLoading, setIsOwner } = useAppContext();
  const location = useLocation();

  // Debug logging for owner route
  console.log("OwnerRoute Debug:");
  console.log("- token:", !!token);
  console.log("- user:", !!user);
  console.log("- isOwner:", isOwner);
  console.log("- isLoading:", isLoading);
  console.log("- localStorage isAdmin:", localStorage.getItem("isAdmin"));
  console.log("- current path:", location.pathname);

  useEffect(() => {
    if (!isLoading && !token) {
      setIntendedRoute(location.pathname + location.search);
      setShowLogin(true);
    }
  }, [token, setShowLogin, setIntendedRoute, location, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    console.log("OwnerRoute: Showing loader - still loading");
    return <CarWheelLoader />;
  }

  if (!token) {
    console.log("OwnerRoute: No token - showing login prompt");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Owner Access Required
            </h3>
            <p className="text-gray-500 mb-4">
              Please login with owner credentials to access this page.
            </p>
            <button
              onClick={() => {
                setIntendedRoute(location.pathname + location.search);
                setShowLogin(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Login as Owner
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Show loading state while user data is being fetched
    console.log("OwnerRoute: No user data - showing loader");
    return <CarWheelLoader />;
  }

  if (!isOwner) {
    // Check localStorage as backup for admin status
    const isAdminFromStorage = localStorage.getItem("isAdmin") === "true";
    const hasToken = !!token;
    
    // If user has token and is marked as admin in localStorage, allow access
    if (hasToken && isAdminFromStorage) {
      console.log("OwnerRoute: Allowing access via localStorage admin flag");
      // Force set isOwner if localStorage says admin but state doesn't
      setIsOwner(true);
      return children;
    }
    
    // Show access denied for non-owners
    console.log("OwnerRoute: Not owner - showing access denied");
    console.log("- isOwner:", isOwner);
    console.log("- user.role:", user?.role);
    console.log("- localStorage isAdmin:", localStorage.getItem("isAdmin"));
    console.log("- hasToken:", hasToken);
    console.log("- isAdminFromStorage:", isAdminFromStorage);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-500 mb-4">
              You don't have permission to access the owner dashboard.
            </p>
            <div className="text-xs text-gray-400 mb-4">
              Debug: isOwner={isOwner ? 'true' : 'false'}, role={user?.role || 'none'}
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("OwnerRoute: All checks passed - rendering children");
  return children;
};

// Component for public routes that should redirect if user is already logged in
const PublicRoute = ({ children, redirectTo = "/" }) => {
  const { token, user } = useAppContext();

  // If user is authenticated, redirect to specified route
  if (token && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export { ProtectedRoute, OwnerRoute, PublicRoute };
