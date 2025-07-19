// This is a backup of the original Cars.jsx file before replacement
// Created on 2025-07-20 for safety

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import CarCard from "../components/CarCard";
import Title from "../components/Title";
import moment from "moment";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDateTime = searchParams.get("pickupDateTime");
  const returnDateTime = searchParams.get("returnDateTime");

  const { axios } = useAppContext();

  const [input, setInput] = useState("");
  const [cars, setCars] = useState([]);

  const fetchCars = async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        pickupDateTime,
        returnDateTime,
      });

      if (data.success) {
        setCars(data.cars || []);
        if (data.cars.length === 0) {
          toast("No cars available for selected time.");
        }
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  const handleBookNow = async (carId) => {
    try {
      const { data } = await axios.post("/api/bookings/create", {
        car: carId,
        pickupDateTime,
        returnDateTime,
      });

      if (data.success && data.bookingId) {
        toast.success("Booking Created.");
        navigate(`/payment/${data.bookingId}`);
      } else {
        toast.error(data.message || "Booking failed.");
      }
    } catch (err) {
      toast.error("Server error.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (pickupDateTime && returnDateTime) {
      fetchCars();
    }
  }, []);

  // Original Cars.jsx content was here - saved as backup
};

export default Cars;
