
import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);
  const [carBookings, setCarBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [manualBookingStart, setManualBookingStart] = useState('');
  const [manualBookingEnd, setManualBookingEnd] = useState('');
  const [manualBookingPayment, setManualBookingPayment] = useState('');
  const [manualBookingName, setManualBookingName] = useState('');
  const [manualBookingEmail, setManualBookingEmail] = useState('');
  const [manualBookingLoading, setManualBookingLoading] = useState(false);
  const [manualBookingError, setManualBookingError] = useState('');

  // Fetch cars owned by the user
  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owner/cars');
      if (data.success) setCars(data.cars);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch booking status for all cars
  const fetchCarBookings = async () => {
    try {
      const { data } = await axios.get('/api/owner/car-bookings');
      if (data.success) {
        setCarBookings(data.carBookings);
        if (!data.carBookings || data.carBookings.length === 0) {
          toast.error('No booking status data received. Please check backend.');
        }
      } else {
        toast.error(data.message || 'Failed to fetch booking status.');
      }
    } catch (error) {
      toast.error('Error fetching booking status.');
    }
  };

  // Manual Booking Handler
  const handleManualBooking = async () => {
    if (!selectedCar || !manualBookingStart || !manualBookingEnd || !manualBookingName || !manualBookingEmail) {
      setManualBookingError('All fields are required.');
      return;
    }
    setManualBookingLoading(true);
    setManualBookingError('');
    try {
      const { data } = await axios.post('/api/bookings/manual-booking', {
        carId: selectedCar._id,
        startDateTime: manualBookingStart,
        endDateTime: manualBookingEnd,
        name: manualBookingName,
        email: manualBookingEmail,
        payment: manualBookingPayment ? Number(manualBookingPayment) : 0,
      });
      if (data.success) {
        toast.success('Manual booking created!');
        setShowManualBookingModal(false);
        setManualBookingStart('');
        setManualBookingEnd('');
        setManualBookingPayment('');
        setManualBookingName('');
        setManualBookingEmail('');
        setTimeout(() => {
          fetchCarBookings();
          setSelectedCar(null);
        }, 300);
      } else {
        setManualBookingError(data.message || 'Failed to create booking.');
      }
    } catch (err) {
      setManualBookingError('Server error. Please try again.');
    } finally {
      setManualBookingLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchOwnerCars();
      fetchCarBookings();
    }
    // Also force fetch on mount in case isOwner is already true
    // eslint-disable-next-line
  }, []);

  // Filtered cars
  const filteredCars = cars.filter(car => {
    const q = search.toLowerCase();
    return (
      car.brand.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      car.category.toLowerCase().includes(q)
    );
  });

  // Get booking info for a car
  const getBookingInfo = car => carBookings.find(b => String(b.carId) === String(car._id));

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <div className="flex justify-end mb-2">
        <button
          className="py-1 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold border border-green-600 shadow transition"
          onClick={() => {
            fetchCarBookings();
            toast.success('Booking status refreshed!');
          }}
        >
          Refresh Status
        </button>
      </div>
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
                    <input type="datetime-local" className="w-full border border-green-400 rounded-lg px-3 py-2" value={manualBookingStart} onChange={e => setManualBookingStart(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-600">End Date & Time</label>
                    <input type="datetime-local" className="w-full border border-green-400 rounded-lg px-3 py-2" value={manualBookingEnd} onChange={e => setManualBookingEnd(e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-600">Customer Name</label>
                    <input type="text" className="w-full border border-green-400 rounded-lg px-3 py-2" value={manualBookingName} onChange={e => setManualBookingName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-600">Customer Email</label>
                    <input type="email" className="w-full border border-green-400 rounded-lg px-3 py-2" value={manualBookingEmail} onChange={e => setManualBookingEmail(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">Payment Amount <span className="text-gray-400">({currency})</span></label>
                  <input type="number" min="0" className="w-full border border-green-400 rounded-lg px-3 py-2" value={manualBookingPayment} onChange={e => setManualBookingPayment(e.target.value)} />
                </div>
                {manualBookingError && <div className="text-red-600 text-sm font-medium">{manualBookingError}</div>}
                <div className="flex gap-3 pt-2">
                  <button type="button" className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-green-100 text-green-700 font-semibold border border-green-300" onClick={() => setShowManualBookingModal(false)}>Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold border border-green-600" disabled={manualBookingLoading}>
                    {manualBookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform." />
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
      ) : carBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <img src={assets.empty || assets.carIconColored} alt="No bookings" className="h-24 w-24 opacity-60 mb-4" />
          <p className="text-lg text-red-500 font-medium">No booking status data received.</p>
          <p className="text-sm text-gray-400 mt-1">Check backend /api/owner/car-bookings endpoint.</p>
        </div>
      ) : (
        <div className="w-full">
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
                  const bookingInfo = getBookingInfo(car);
                  // Debug output
                  console.log('[DEBUG] Car:', car);
                  console.log('[DEBUG] bookingInfo:', bookingInfo);
                  console.log('[DEBUG] carBookings:', carBookings);
                  return (
                    <tr key={index} className="relative border-t border-borderColor group hover:bg-blue-50/60">
                      <td className="p-4 flex items-center gap-4">
                        <img src={car.image} alt="car" className="h-16 w-16 rounded-xl object-cover border-2 border-blue-100 shadow" />
                        <div>
                          <p className="font-semibold text-base text-gray-800">{car.brand} {car.model}</p>
                          <p className="text-xs text-gray-500 mt-1">{car.seating_capacity} seats • {car.transmission}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">{car.category}</span>
                      </td>
                      <td className="p-4 font-semibold text-blue-700">{currency}{car.pricePerDay}/day</td>
                      <td className="p-4">
                        {bookingInfo === undefined ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-300" title="No booking status data for this car. Check backend response.">
                            No Status
                          </span>
                        ) : bookingInfo.isBookedNow ? (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 cursor-help"
                            title="This car is currently booked for the present time window."
                          >
                            Booked
                          </span>
                        ) : (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300 cursor-help"
                            title="This car is available for the present time window."
                          >
                            Not Booked
                          </span>
                        )}
                        {/* Debug info: show current time and booking window */}
                        {process.env.NODE_ENV === 'development' && bookingInfo?.currentBooking && (
                          <div className="mt-1 text-[10px] text-gray-500">
                            <div>Now: {new Date().toISOString()}</div>
                            <div>Start: {bookingInfo.currentBooking.startDateTime}</div>
                            <div>End: {bookingInfo.currentBooking.endDateTime}</div>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <button className="px-3 py-1 rounded bg-green-500 text-white font-semibold mr-2" onClick={() => { setSelectedCar(car); setShowManualBookingModal(true); }}>Manual Book</button>
                        {/* Add more actions as needed */}
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
              const bookingInfo = getBookingInfo(car);
              return (
                <div key={index} className="relative bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img src={car.image} alt="car" className="h-16 w-16 rounded-lg object-cover border-2 border-blue-100 shadow" />
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
                    <button onClick={() => { setSelectedCar(car); setShowManualBookingModal(true); }} className="flex-1 py-2 rounded-lg bg-green-500 text-white font-semibold text-xs">Manual Book</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;
