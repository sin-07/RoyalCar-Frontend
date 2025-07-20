import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import CarCard from "../components/CarCard";
import Title from "../components/Title";

const TotalCars = () => {
  const navigate = useNavigate();
  const { cars: globalCars, fetchCars } = useAppContext();

  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Get unique categories from cars
  const categories = ["All", ...new Set(globalCars.map((car) => car.category))];

  // Load cars on component mount
  useEffect(() => {
    const loadCars = async () => {
      if (globalCars.length === 0) {
        try {
          await fetchCars();
        } catch (error) {
          // Handle the case where fetchCars fails (e.g., user not logged in or server down)
          console.log("Could not fetch cars:", error.message);
          toast.error(
            "Unable to load cars. Please check your connection or try again later."
          );
        }
      }
      setLoading(false);
    };

    loadCars();
  }, [globalCars, fetchCars]);

  // Filter cars based on search input and category
  useEffect(() => {
    let filtered = globalCars;

    // Filter by search input - improved search logic
    if (input.trim()) {
      const searchTerm = input.toLowerCase().trim();
      filtered = filtered.filter((car) => {
        // Search in multiple fields
        const brandMatch = car.brand?.toLowerCase().includes(searchTerm);
        const modelMatch = car.model?.toLowerCase().includes(searchTerm);
        const brandModelMatch = `${car.brand} ${car.model}`
          .toLowerCase()
          .includes(searchTerm);
        const categoryMatch = car.category?.toLowerCase().includes(searchTerm);
        const fuelTypeMatch = car.fuel_type?.toLowerCase().includes(searchTerm);
        const transmissionMatch = car.transmission
          ?.toLowerCase()
          .includes(searchTerm);
        const yearMatch = car.year?.toString().includes(searchTerm);
        const priceMatch = car.pricePerDay?.toString().includes(searchTerm);

        return (
          brandMatch ||
          modelMatch ||
          brandModelMatch ||
          categoryMatch ||
          fuelTypeMatch ||
          transmissionMatch ||
          yearMatch ||
          priceMatch
        );
      });
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((car) => car.category === selectedCategory);
    }

    setFilteredCars(filtered);
  }, [input, selectedCategory, globalCars]);

  const handleCarClick = (carId) => {
    navigate(`/car-details/${carId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white py-16">
        <Title
          title="Elegance on Wheels: Our Prestige Car Collection"
          subTitle={`Explore all ${globalCars.length} available vehicles in our premium fleet`}
        />
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 -mt-8 z-20 relative">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {globalCars.length}
            </div>
            <div className="text-gray-600 font-medium">Available Cars</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {categories.length - 1}
            </div>
            <div className="text-gray-600 font-medium">Categories</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {new Set(globalCars.map((car) => car.brand)).size}
            </div>
            <div className="text-gray-600 font-medium">Brands</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {filteredCars.length}
            </div>
            <div className="text-gray-600 font-medium">Showing</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
                placeholder="Search by brand, model, category, fuel type, transmission, year, or price..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none focus:bg-white transition-all duration-200 text-lg placeholder-gray-400"
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
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

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none focus:bg-white transition-all duration-200 text-lg appearance-none cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Results Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing{" "}
                <span className="font-semibold text-blue-600">
                  {filteredCars.length}
                </span>{" "}
                of <span className="font-semibold">{globalCars.length}</span>{" "}
                cars
                {input.trim() && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Search: "{input}"
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {selectedCategory}
                  </span>
                )}
              </span>
              {(input.trim() || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setInput("");
                    setSelectedCategory("All");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <div
              key={car._id}
              className="group relative cursor-pointer"
              onClick={() => handleCarClick(car._id)}
            >
              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <CarCard car={car} />

                {/* Car Details Overlay */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {car.category}
                    </span>
                    <span className="text-xs text-gray-400">{car.year}</span>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      {car.location}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {car.fuel_type}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCars.length === 0 && !loading && (
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
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or filter criteria.
              </p>
              <button
                onClick={() => {
                  setInput("");
                  setSelectedCategory("All");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Show All Cars
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalCars;
