// Add dropdown-fall animation globally (outside component, before imports)
if (typeof window !== 'undefined' && !document.getElementById('dropdown-fall-style')) {
  var style = document.createElement('style');
  style.id = 'dropdown-fall-style';
  style.innerHTML = '@keyframes dropdown-fall { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }';
  document.head.appendChild(style);
}

import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
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
  // Dropdown portal state
  const dropdownBtnRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  // Manual booking modal
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [manualBookingStart, setManualBookingStart] = useState("");
  const [manualBookingEnd, setManualBookingEnd] = useState("");
  const [manualBookingPayment, setManualBookingPayment] = useState("");
  const [manualBookingName, setManualBookingName] = useState("");
  const [manualBookingEmail, setManualBookingEmail] = useState("");
  const [manualBookingLoading, setManualBookingLoading] = useState(false);
  const [manualBookingError, setManualBookingError] = useState("");

  // --- Manual Booking Handler ---
  const handleManualBooking = async () => {
    if (!selectedCar || !manualBookingStart || !manualBookingEnd || !manualBookingName || !manualBookingEmail) {
      setManualBookingError("All fields are required.");
      return;
    }
    setManualBookingLoading(true);
    setManualBookingError("");
    try {
      const { data } = await axios.post('/api/owner/manual-booking', {
        carId: selectedCar._id,
        startDateTime: manualBookingStart,
        endDateTime: manualBookingEnd,
        name: manualBookingName,
        email: manualBookingEmail,
        payment: manualBookingPayment ? Number(manualBookingPayment) : 0,
      });
      if (data.success) {
        toast.success("Manual booking created!");
        setShowManualBookingModal(false);
        setManualBookingStart("");
        setManualBookingEnd("");
        setManualBookingPayment("");
        setManualBookingName("");
        setManualBookingEmail("");
        setSelectedCar(null);
        // Refresh bookings so UI updates immediately
        fetchCarBookings();
      } else {
        setManualBookingError(data.message || "Failed to create booking.");
      }
    } catch (err) {
      setManualBookingError("Server error. Please try again.");
    } finally {
      setManualBookingLoading(false);
    }
  };

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
      return <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full shadow font-bold">Booked</span>;
    }
    return null;
  };

  // --- MODALS (View/Edit/Delete) ---

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      {/* Manual Booking Modal (must be inside return to render) */}
      {showManualBookingModal && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg relative animate-dropdown-fall border border-blue-200">
            <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                <img src={assets.carIconColored} alt="Car" className="h-6 w-6" />
                Manual Booking
              </h3>
              <button className="p-1 hover:bg-gray-100 rounded" onClick={() => setShowManualBookingModal(false)}>
                <img src={assets.close_icon} alt="Close" className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 pb-6 pt-2">
              <div className="mb-4 text-base font-semibold text-gray-700">{selectedCar.brand} {selectedCar.model}</div>
              <form onSubmit={e => { e.preventDefault(); handleManualBooking(); }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-600">Start Date & Time</label>
                    <input type="datetime-local" className="w-full border border-green-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition" value={manualBookingStart} onChange={e => setManualBookingStart(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-600">End Date & Time</label>
                    <input type="datetime-local" className="w-full border border-green-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition" value={manualBookingEnd} onChange={e => setManualBookingEnd(e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-600">Customer Name</label>
                    <input type="text" className="w-full border border-green-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition" value={manualBookingName} onChange={e => setManualBookingName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-600">Customer Email</label>
                    <input type="email" className="w-full border border-green-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition" value={manualBookingEmail} onChange={e => setManualBookingEmail(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">Payment Amount <span className="text-gray-400">({currency})</span></label>
                  <input type="number" min="0" className="w-full border border-green-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition" value={manualBookingPayment} onChange={e => setManualBookingPayment(e.target.value)} />
                </div>
                {manualBookingError && <div className="text-red-600 text-sm font-medium">{manualBookingError}</div>}
                <div className="flex gap-3 pt-2">
                  <button type="button" className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-green-100 text-green-700 font-semibold border border-green-300 transition" onClick={() => setShowManualBookingModal(false)}>Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold shadow transition border border-green-600" disabled={manualBookingLoading}>
                    {manualBookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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
        <div className="w-full">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-700 min-w-[600px]">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-600">
                <tr>
                  <th className="p-4 font-semibold">Car</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car, index) => {
                  const bookingInfo = carBookings.find(b => b.carId === car._id);
                  return (
                    <tr
                      key={index}
                      className={`relative border-t border-borderColor transition-all duration-200 group hover:scale-[1.015] hover:shadow-lg hover:bg-blue-50/60`}
                    >
                      <td className="p-4 flex items-center gap-4 overflow-visible">
                        <div className="relative group/car">
                          <img
                            src={car.image}
                            alt="car"
                            className="h-16 w-16 aspect-square rounded-xl object-cover border-2 border-blue-100 shadow"
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
                      <td className="p-4">
                        <span className="inline-block bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                          {car.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-blue-700">{currency}{car.pricePerDay}/day</td>
                      <td className="p-4">
                        {bookingInfo?.isBookedNow ? (
                          <span className="flex items-center justify-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold tracking-wide shadow bg-red-100 text-red-700 border border-red-300 min-w-0 w-full max-w-[120px] text-center break-words whitespace-nowrap">
                            Booked
                          </span>
                        ) : (
                          <span className="flex items-center justify-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold tracking-wide shadow bg-green-100 text-green-700 border border-green-300 min-w-0 w-full max-w-[120px] text-center break-words whitespace-nowrap">
                            Not Booked
                          </span>
                        )}
                      </td>
                      <td className="p-4 relative">
                        <div className="relative">
                          <button
                            className="py-1 px-2 rounded-lg bg-gray-100 hover:bg-green-100 text-green-700 font-semibold text-xs border border-green-300 transition flex items-center gap-1"
                            onClick={e => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setDropdownPos({
                                top: rect.bottom + window.scrollY,
                                left: rect.left + window.scrollX,
                                width: rect.width
                              });
                              setSelectedCar(car);
                              // setDropdownBtnRef is not needed
                              setShowDropdown(true);
                            }}
                            ref={dropdownBtnRef}
                          >
                            Actions
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </button>
                          {showDropdown && selectedCar && selectedCar._id === car._id && ReactDOM.createPortal(
                            <div
                              className="w-44 bg-white border border-green-200 rounded-lg shadow-xl z-[9999] animate-dropdown-fall origin-top-right"
                              style={{
                                position: 'absolute',
                                top: dropdownPos.top,
                                left: dropdownPos.left,
                                minWidth: dropdownPos.width
                              }}
                              onMouseLeave={() => setShowDropdown(false)}
                            >
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-700 font-semibold rounded-t-lg transition"
                                onClick={e => { e.stopPropagation(); setShowViewModal(true); setShowDropdown(false); }}
                              >View</button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-700 font-semibold transition"
                                onClick={e => { e.stopPropagation(); setShowManualBookingModal(true); setManualBookingStart(""); setManualBookingEnd(""); setManualBookingPayment(""); setManualBookingName(""); setManualBookingEmail(""); setManualBookingError(""); setShowDropdown(false); }}
                              >Mark as Booked</button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-700 font-semibold transition"
                                onClick={e => { e.stopPropagation(); setShowEditModal(true); setShowDropdown(false); }}
                              >Edit</button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-red-600 font-semibold transition"
                                onClick={e => { e.stopPropagation(); setShowDeleteModal(true); setShowDropdown(false); }}
                              >Delete</button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-purple-700 font-semibold rounded-b-lg transition"
                                onClick={e => { e.stopPropagation(); toggleAvailability(car._id); setSelectedCar(null); setShowDropdown(false); }}
                              >{car.isAvailable ? 'Hide' : 'Show'}</button>
                            </div>,
                            document.body
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mobile/Tablet Card Layout */}
          <div className="block md:hidden space-y-5 mt-4">
            {filteredCars.map((car, index) => {
              const bookingInfo = carBookings.find(b => b.carId === car._id);
              return (
                <div key={index} className="relative bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={car.image} alt="car" className="h-16 w-16 rounded-lg object-cover border-2 border-blue-100 shadow" />
                      {getStatusBadge(car)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-base text-gray-800">{car.brand} {car.model}</div>
                      <div className="text-xs text-gray-500 mt-1">{car.seating_capacity} seats • {car.transmission}</div>
                      <div className="mt-1">
                        <span className="inline-block bg-blue-100 text-blue-600 px-1.5 py-0 rounded-full text-[10px] md:text-xs font-medium mr-2 md:px-2 md:py-0.5">{car.category}</span>
                        <span className="font-semibold text-blue-700">{currency}{car.pricePerDay}/day</span>
                      </div>
                      <div className="mt-1">
                        {bookingInfo?.isBookedNow ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">Booked</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300">Not Booked</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={e => { e.stopPropagation(); setShowViewModal(true); setSelectedCar(car); }}
                      className="flex-1 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-all duration-200 shadow"
                    >View</button>
                    <button
                      onClick={e => { e.stopPropagation(); setShowManualBookingModal(true); setSelectedCar(car); setManualBookingStart(""); setManualBookingEnd(""); setManualBookingPayment(""); setManualBookingName(""); setManualBookingEmail(""); setManualBookingError(""); }}
                      className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-xs transition-all duration-200 shadow animate-pulse"
                    >Mark as Booked</button>
                    <button
                      onClick={e => { e.stopPropagation(); setShowEditModal(true); setSelectedCar(car); }}
                      className="flex-1 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-xs transition-all duration-200 shadow"
                    >Edit</button>
                    <button
                      onClick={e => { e.stopPropagation(); setShowDeleteModal(true); setSelectedCar(car); }}
                      className="flex-1 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs transition-all duration-200 shadow"
                    >Delete</button>
                    <button
                      onClick={e => { e.stopPropagation(); toggleAvailability(car._id); setSelectedCar(null); }}
                      className="flex-1 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs transition-all duration-200 shadow"
                    >{car.isAvailable ? 'Hide' : 'Show'}</button>
                  </div>
                </div>
              );
            })}
          </div>
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
