import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

// Debug logging
console.log('Environment Variables:');
console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
console.log('VITE_CURRENCY:', import.meta.env.VITE_CURRENCY);
console.log('axios.defaults.baseURL:', axios.defaults.baseURL);

export const AppContext = createContext();

export const AppProvider = ({ children })=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')
    const [intendedRoute, setIntendedRoute] = useState(null) // For post-login redirect
    const [isLoading, setIsLoading] = useState(true) // Add loading state

    const [cars, setCars] = useState([])

    // Function to check if user is logged in
    const fetchUser = async ()=>{
        try {
           const {data} = await axios.get('/api/user/data')
           if (data.success) {
            setUser(data.user)
            // Set isOwner based on user role or localStorage admin flag
            const isAdmin = localStorage.getItem('isAdmin')
            const shouldBeOwner = data.user.role === 'owner' || isAdmin === 'true'
            setIsOwner(shouldBeOwner)
            
            // Debug logging
            console.log('User data fetched:', data.user)
            console.log('User role:', data.user.role)
            console.log('Is admin from localStorage:', isAdmin)
            console.log('Setting isOwner to:', shouldBeOwner)
           } else {
            // Clear invalid token
            localStorage.removeItem('token')
            localStorage.removeItem('isAdmin')
            setToken(null)
            setUser(null)
            setIsOwner(false)
            axios.defaults.headers.common['Authorization'] = ''
           }
        } catch (error) {
            // Clear invalid token on error
            localStorage.removeItem('token')
            localStorage.removeItem('isAdmin')
            setToken(null)
            setUser(null)
            setIsOwner(false)
            axios.defaults.headers.common['Authorization'] = ''
            console.error('Error fetching user:', error)
        } finally {
            setIsLoading(false) // Set loading to false after fetch attempt
        }
    }
    // Function to fetch all cars from the server

    const fetchCars = async () =>{
        try {
            const {data} = await axios.get('/api/user/cars')
            if (data.success) {
                setCars(data.cars);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching cars:", error);
            // Only show toast error if user is logged in (to avoid errors on public pages)
            if (token) {
                toast.error('Failed to load cars. Please try again.');
            }
        }
    }

    // Function to log out the user
    const logout = ()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('isAdmin') // Remove admin status
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ''
        
        // Show success message first
        toast.success('You have been logged out successfully!', {
            duration: 3000,
            position: 'top-center',
        })
        
        // Small delay to ensure toast is visible before navigation
        setTimeout(() => {
            navigate('/')
        }, 500)
    }

    // Function to handle login requirement
    const requireLogin = (message = 'Please login to continue', redirectTo = null) => {
        if (redirectTo) {
            setIntendedRoute(redirectTo)
        }
        setShowLogin(true)
        toast.error(message)
    }


    // useEffect to retrieve the token from localStorage
    useEffect(()=>{
        const token = localStorage.getItem('token')
        const isAdmin = localStorage.getItem('isAdmin')
        
        if (token) {
            setToken(token)
            axios.defaults.headers.common['Authorization'] = `${token}`
            if (isAdmin === 'true') {
                setIsOwner(true)
            }
        } else {
            // No token found, set loading to false immediately
            setIsLoading(false)
        }
        
        fetchCars()
    },[])

    // useEffect to fetch user data when token is available
    useEffect(()=>{
        if(token){
            fetchUser()
        }
    },[token])

    const value = {
        navigate, currency, axios, user, setUser,
        token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, requireLogin, fetchCars, cars, setCars, 
        pickupDate, setPickupDate, returnDate, setReturnDate, intendedRoute, setIntendedRoute, isLoading
    }

    return (
    <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}