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
    } else {
      if (!pickupDateTime || !returnDateTime) {
        toast.error(
          "Please select pickup and return dates from the home page."
        );
      }
    }
  }, [pickupDateTime, returnDateTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white py-16 animate-fade-in">
        <Title
          title="Available Cars"
          subTitle="Choose your perfect ride for your journey"
        />
      </div>

      {!pickupDateTime || !returnDateTime ? (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in-up">
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <svg
                className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Booking Details Required
              </h3>
              <p className="text-gray-500 mb-4">
                Please select your pickup and return dates from the home page to
                view available cars.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-blue-300"
              >
                Go to Home Page
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in-up">
          {/* Search Bar */}
          <div className="relative mb-8 -mt-8 z-20 animate-slide-down">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Search by brand or model..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:outline-none focus:bg-white transition-all duration-300 text-lg placeholder-gray-400 hover:border-gray-300 hover:shadow-md hover:bg-white"
                />
                {input && (
                  <button
                    onClick={() => setInput("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center group"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-all duration-200 group-hover:scale-110 group-hover:rotate-90"
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
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Car Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars
              .filter(({ car }) =>
                `${car.brand} ${car.model}`
                  .toLowerCase()
                  .includes(input.toLowerCase())
              )
              .map(({ car, available, availableAt }) => (
                <div key={car._id} className="group relative">
                  {/* Main Card */}
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                    {/* Car Card Component */}
                    <div className="relative">
                      <CarCard car={car} />

                      {/* Status Badge */}
                      {!available && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg">
                            Booked
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Additional Info Section */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                      {availableAt && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700 font-medium flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Available after:{" "}
                            {moment(availableAt).format("MMM DD, YYYY HH:mm")}
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      {available ? (
                        <button
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-green-200 focus:outline-none"
                          onClick={() => handleBookNow(car._id)}
                        >
                          <span className="flex items-center justify-center">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Book Now
                          </span>
                        </button>
                      ) : (
                        <button
                          className="w-full bg-gray-400 hover:bg-gray-500 text-gray-700 py-4 rounded-xl font-semibold text-lg cursor-not-allowed opacity-75"
                          disabled
                        >
                          <span className="flex items-center justify-center">
                            <svg
                              className="w-5 h-5 mr-2"
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
                            Already Booked
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Floating Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>
              ))}
          </div>

          {/* No Results Message */}
          {cars.filter(({ car }) =>
            `${car.brand} ${car.model}`
              .toLowerCase()
              .includes(input.toLowerCase())
          ).length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 115.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No cars found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or check back later.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cars;
