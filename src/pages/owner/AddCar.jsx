import React, { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddCar = () => {
  const { axios, currency, fetchCars } = useAppContext();

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 2024,
    pricePerDay: 100,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 4,
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (!image) {
        toast.error("Please upload an image.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success("Car listed successfully!");
        
        // Refresh the cars data globally
        await fetchCars();
        
        // Reset form
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: 2024,
          pricePerDay: 100,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 4,
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including specs, pricing & availability."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* Car Image Upload */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="Upload"
              className="h-14 w-14 rounded cursor-pointer object-cover"
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="text-sm text-gray-500">Upload a picture of your car</p>
        </div>

        {/* Car Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label>Brand</label>
            <input
              required
              type="text"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
              className="input-style"
              placeholder="e.g. Toyota"
            />
          </div>
          <div>
            <label>Model</label>
            <input
              required
              type="text"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
              className="input-style"
              placeholder="e.g. Corolla"
            />
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label>Year</label>
            <input
              required
              type="number"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
              className="input-style"
            />
          </div>
          <div>
            <label>Daily Price ({currency})</label>
            <input
              required
              type="number"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
              className="input-style"
            />
          </div>
          <div>
            <label>Category</label>
            <select
              required
              value={car.category}
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              className="input-style"
            >
              <option value="">Select Category</option>
              <option>SUV</option>
              <option>Sedan</option>
              <option>Van</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label>Transmission</label>
            <select
              required
              value={car.transmission}
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              className="input-style"
            >
              <option value="">Select Transmission</option>
              <option>Automatic</option>
              <option>Manual</option>
              <option>Semi-Automatic</option>
            </select>
          </div>
          <div>
            <label>Fuel Type</label>
            <select
              required
              value={car.fuel_type}
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              className="input-style"
            >
              <option value="">Select Fuel</option>
              <option>Gas</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Hybrid</option>
              <option>Electric</option>
            </select>
          </div>
          <div>
            <label>Seating Capacity</label>
            <input
              required
              type="number"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({ ...car, seating_capacity: e.target.value })
              }
              className="input-style"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            required
            rows={4}
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
            className="input-style"
            placeholder="Describe your vehicle..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn-primary flex items-center gap-2 mt-4"
        >
          <img src={assets.tick_icon} alt="submit" />
          {isLoading ? "Listing..." : "List Your Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
