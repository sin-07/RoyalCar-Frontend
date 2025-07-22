import React, { useEffect, useState } from 'react'
import { assets} from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {

  const {isOwner, axios, currency} = useAppContext()

  const [cars, setCars] = useState([])
  const [carBookings, setCarBookings] = useState([])
  const [search, setSearch] = useState("")
  const [selectedCar, setSelectedCar] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const fetchOwnerCars = async ()=>{
    try {
      const {data} = await axios.get('/api/owner/cars')
      if(data.success){
        setCars(data.cars)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Fetch booking status for all cars
  const fetchCarBookings = async () => {
    try {
      const { data } = await axios.get('/api/owner/car-bookings');
      if (data.success) {
        setCarBookings(data.carBookings);
      }
    } catch (error) {
      // Silent fail
    }
  }

  const toggleAvailability = async (carId)=>{
    try {
      const {data} = await axios.post('/api/owner/toggle-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async (carId)=>{
    try {

      const confirm = window.confirm('Are you sure you want to delete this car?')

      if(!confirm) return null

      const {data} = await axios.post('/api/owner/delete-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isOwner) {
      fetchOwnerCars();
      fetchCarBookings();
    }
  }, [isOwner]);

  // --- SEARCH/FILTER ---
  const filteredCars = cars.filter(car => {
    const q = search.toLowerCase();
    return (
      car.brand.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      car.category.toLowerCase().includes(q)
    );
  });

  // --- STATUS BADGE LOGIC ---
  const getStatusBadge = (car) => {
    const bookingInfo = carBookings.find(b => b.carId === car._id);
    if (bookingInfo?.isBookedNow) {
      return <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow">Booked</span>;
    }
    if (car.isAvailable) {
      return <span className="absolute -top-2 -right-2 bg-green-400 text-white text-[10px] px-2 py-0.5 rounded-full shadow">Available</span>;
    }
    return <span className="absolute -top-2 -right-2 bg-red-400 text-white text-[10px] px-2 py-0.5 rounded-full shadow">Off</span>;
  };

  // --- MODALS (View/Edit/Delete) ---
  // ...modal code will be added here...

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform." />

      {/* Search/filter bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4 mb-2">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm w-full md:w-80">
          <img src={assets.search_icon} alt="search" className="h-4 w-4 mr-2 opacity-60" />
          <input
            type="text"
            placeholder="Search by brand, model, or category..."
            className="outline-none bg-transparent w-full text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* The rest of your JSX (table, modals, etc.) follows here, inside the main return block */}
        <div className="w-full bg-gradient-to-r from-blue-400/80 to-purple-500/80 py-5 px-6 flex items-center gap-3">
          <img src={assets.carIconColored} alt="Car" className="h-8 w-8" />
          <h2 className="text-xl font-bold text-white tracking-wide">Your Listed Cars</h2>
        </div>
        {filteredCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <img src={assets.empty || assets.carIconColored} alt="No cars" className="h-24 w-24 opacity-60 mb-4" />
            <p className="text-lg text-gray-500 font-medium">No cars found.</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search or add a car.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-700 min-w-[600px]">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-600">
                <tr>
                  <th className="p-4 font-semibold">Car</th>
                  <th className="p-4 font-semibold max-md:hidden">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold max-md:hidden">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car, index) => {
                  const bookingInfo = carBookings.find(b => b.carId === car._id);
                  return (
                    <tr
                      key={index}
                      className="relative border-t border-borderColor transition-all duration-200 hover:scale-[1.015] hover:shadow-lg hover:bg-blue-50/60 group"
                    >
                      <td className="p-4 flex items-center gap-4 overflow-visible">
                        <div className="relative group/car">
                          <img
                            src={car.image}
                            alt="car"
                            className="h-16 w-16 aspect-square rounded-xl object-cover border-2 border-blue-100 shadow group-hover/car:scale-110 transition-all duration-200"
                          />
                          {getStatusBadge(car)}
                          <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 scale-0 group-hover/car:scale-100 transition-all duration-200 bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-30 min-w-[180px] text-xs text-gray-700">
                            <div className="font-semibold text-base text-gray-800 mb-1">{car.brand} {car.model}</div>
                            <div className="mb-1">Year: <span className="font-medium">{car.year}</span></div>
                            <div className="mb-1">Seats: <span className="font-medium">{car.seating_capacity}</span></div>
                            <div className="mb-1">Fuel: <span className="font-medium">{car.fuel_type}</span></div>
                            <div>Trans: <span className="font-medium">{car.transmission}</span></div>
                            {bookingInfo?.isBookedNow && (
                              <div className="mt-2 text-yellow-600 font-semibold text-xs">Booked until {new Date(bookingInfo.nextAvailableAt).toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                        <div className="max-md:hidden">
                          <p className="font-semibold text-base text-gray-800">{car.brand} {car.model}</p>
                          <p className="text-xs text-gray-500 mt-1">{car.seating_capacity} seats • {car.transmission}</p>
                        </div>
                      </td>
                      <td className="p-4 max-md:hidden">
                        <span className="inline-block bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                          {car.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-blue-700">{currency}{car.pricePerDay}/day</td>
                      <td className="p-4 max-md:hidden">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow ${bookingInfo?.isBookedNow ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : car.isAvailable ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-red-100 text-red-500 border border-red-200'}`}>
                          {bookingInfo?.isBookedNow ? 'Booked' : car.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="flex items-center gap-2 p-4">
                        <button
                          onClick={() => { setSelectedCar(car); setShowViewModal(true); }}
                          className="group/action relative p-2 rounded-full hover:bg-blue-100 transition"
                          title="View Details"
                        >
                          <img src={assets.eye_icon} alt="View" className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => { setSelectedCar(car); setShowEditModal(true); }}
                          className="group/action relative p-2 rounded-full hover:bg-green-100 transition"
                          title="Edit Car"
                        >
                          <img src={assets.edit_icon} alt="Edit" className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => { setSelectedCar(car); setShowDeleteModal(true); }}
                          className="group/action relative p-2 rounded-full hover:bg-red-100 transition"
                          title="Delete Car"
                        >
                          <img src={assets.delete_icon} alt="Delete Car" className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => toggleAvailability(car._id)}
                          className="group/action relative p-2 rounded-full hover:bg-purple-100 transition"
                          title={car.isAvailable ? "Mark as Unavailable" : "Mark as Available"}
                        >
                          <img
                            src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon}
                            alt={car.isAvailable ? "Mark as Unavailable" : "Mark as Available"}
                            className="h-5 w-5"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      {/* --- MODALS (View/Edit/Delete) --- */}
      {/* View Modal */}
      {showViewModal && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fadeIn">
            <button className="absolute top-2 right-2 p-1" onClick={() => setShowViewModal(false)}>
              <img src={assets.close_icon} alt="Close" className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedCar.brand} {selectedCar.model}</h3>
            <img src={selectedCar.image} alt="car" className="w-full h-40 object-cover rounded-lg mb-3" />
            <div className="text-sm text-gray-700 mb-2">Category: <b>{selectedCar.category}</b></div>
            <div className="text-sm text-gray-700 mb-2">Year: <b>{selectedCar.year}</b></div>
            <div className="text-sm text-gray-700 mb-2">Seats: <b>{selectedCar.seating_capacity}</b></div>
            <div className="text-sm text-gray-700 mb-2">Fuel: <b>{selectedCar.fuel_type}</b></div>
            <div className="text-sm text-gray-700 mb-2">Transmission: <b>{selectedCar.transmission}</b></div>
            <div className="text-sm text-gray-700 mb-2">Price: <b>{currency}{selectedCar.pricePerDay}/day</b></div>
            <div className="text-xs text-gray-500 mt-2">ID: {selectedCar._id}</div>
            {/* Show booking info if available */}
            {carBookings.find(b => b.carId === selectedCar._id)?.isBookedNow && (
              <div className="mt-2 text-yellow-700 font-semibold text-sm">Currently Booked</div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal (skeleton, for demo) */}
      {showEditModal && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fadeIn">
            <button className="absolute top-2 right-2 p-1" onClick={() => setShowEditModal(false)}>
              <img src={assets.close_icon} alt="Close" className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Car (Coming Soon)</h3>
            <div className="text-gray-500">Edit functionality can be implemented here.</div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs relative animate-fadeIn">
            <button className="absolute top-2 right-2 p-1" onClick={() => setShowDeleteModal(false)}>
              <img src={assets.close_icon} alt="Close" className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold mb-2 text-red-600">Delete Car?</h3>
            <div className="text-gray-700 mb-4">Are you sure you want to delete <b>{selectedCar.brand} {selectedCar.model}</b>?</div>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                onClick={() => setShowDeleteModal(false)}
              >Cancel</button>
              <button
                className="flex-1 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
                onClick={async () => {
                  await deleteCar(selectedCar._id);
                  setShowDeleteModal(false);
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCars
