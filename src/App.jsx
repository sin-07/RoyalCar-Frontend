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
import Login from './components/Login'
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

  // Show loader during initial loading
  if (isLoading) {
    return <CarWheelLoader />
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
        
        {/* Protected routes - require authentication */}
        <Route 
          path='/car-details/:id' 
          element={
            <ProtectedRoute>
              <CarDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/cars' 
          element={
            <ProtectedRoute>
              <Cars />
            </ProtectedRoute>
          } 
        />
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
