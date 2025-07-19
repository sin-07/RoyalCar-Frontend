import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

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
            setIsOwner(data.user.role === 'owner' || isAdmin === 'true')
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
            toast.error(error.message)
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
        navigate('/')
        toast.success('You have been logged out')
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