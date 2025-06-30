import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/history`);
        setBookings(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking history:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = selectedStatus 
    ? bookings.filter(booking => booking.bookingStatus === selectedStatus)
    : bookings;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F84464] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <h1 className="text-2xl font-medium text-[#1E1E1E]">My Bookings</h1>

        {/* Filter */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 border border-[#D6D6D6] rounded-lg focus:ring-2 focus:ring-[#F84464] focus:border-[#F84464] bg-white text-gray-700 text-sm font-medium shadow-sm"
            >
              <option value="">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">No bookings found</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="h-24 w-16 bg-[#F5F5F5] rounded-lg overflow-hidden flex-shrink-0">
                      {booking.movie.posterUrl ? (
                        <img 
                          src={booking.movie.posterUrl} 
                          alt={booking.movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#1E1E1E]">{booking.movie.title}</h3>
                      <p className="text-gray-600">{booking.venue.name}</p>
                      <p className="text-sm text-gray-500">{booking.venue.address}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="inline-block w-5 text-gray-400">📅</span>
                          {new Date(booking.showDate).toLocaleDateString()} at {booking.showTime}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="inline-block w-5 text-gray-400">🎬</span>
                          Screen: {booking.screenName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                      {booking.bookingStatus.toUpperCase()}
                    </span>
                    <p className="text-lg font-medium text-[#1E1E1E] mt-2">₹{booking.totalAmount}</p>
                    <p className="text-sm text-gray-600">
                      {booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Seats: {booking.seats.map(seat => `${seat.row}${seat.seatNumber}`).join(', ')}
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>
                        <span className="text-gray-400">Booking Code:</span> {booking.bookingCode}
                      </p>
                      <p>
                        <span className="text-gray-400">Booked on:</span> {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory; 