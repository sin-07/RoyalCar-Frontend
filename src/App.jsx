import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import TotalCars from './pages/TotalCars'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import ManageReviews from './pages/owner/ManageReviews'
import Login from './components/Login'
import OtpVerification from './pages/OtpVerification'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import PaymentForm from './pages/PaymentForm'
import { ProtectedRoute, OwnerRoute, PublicRoute } from './components/RouteProtection'
import CarWheelLoader from './components/CarWheelLoader'
import { LoadingProvider, useLoading } from './context/LoadingContext'

const AppContent = () => {
  const { showLogin } = useAppContext()
  const { isLoading } = useLoading()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  // Show comprehensive loader during initial loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-50 flex flex-col items-center justify-center">
        <CarWheelLoader />
        <div className="mt-8 text-center max-w-lg mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Royal Cars
          </h1>
          <p className="text-gray-600 mb-4">
            Initializing your premium car rental experience...
          </p>
          
          {/* Loading steps indicator */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          <p className="text-sm text-gray-500">
            Setting up backend connections and loading data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      {!isOwnerPath && <Navbar />}

      <div className={!isOwnerPath ? "pt-[73px]" : ""}>
        <Routes>
          {/* Public routes - Home page needs special handling for Hero section */}
          <Route path='/' element={
            <div className="-mt-[73px]">
              <Home />
            </div>
          } />
          <Route path='/total-cars' element={<TotalCars />} />
          <Route path='/cars' element={<Cars />} />
          <Route path='/car-details/:id' element={<CarDetails />} />
          <Route path='/verify-otp' element={<OtpVerification />} />
        
        {/* Protected routes - require authentication */}
        <Route 
          path='/my-bookings' 
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/payment/:bookingId' 
          element={
            <ProtectedRoute>
              <PaymentForm />
            </ProtectedRoute>
          } 
        />

        {/* Owner routes - require owner authentication */}
        <Route 
          path='/owner' 
          element={
            <OwnerRoute>
              <Layout />
            </OwnerRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="manage-reviews" element={<ManageReviews />} />
        </Route>
        </Routes>
      </div>

      {!isOwnerPath && <Footer />}
    </>
  )
}

const App = () => {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  )
}

export default App
