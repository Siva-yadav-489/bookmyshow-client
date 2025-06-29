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
        const response = await axios.get('http://localhost:5000/api/bookings/history');
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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="text-gray-600">
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
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-16 bg-gray-200 rounded flex items-center justify-center">
                    {booking.movie.posterUrl ? (
                      <img 
                        src={booking.movie.posterUrl} 
                        alt={booking.movie.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-gray-500 text-xs">No Image</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{booking.movie.title}</h3>
                    <p className="text-gray-600">{booking.venue.name}</p>
                    <p className="text-gray-500 text-sm">{booking.venue.address}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(booking.showDate).toLocaleDateString()} at {booking.showTime}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Screen: {booking.screenName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus.toUpperCase()}
                  </span>
                  <p className="text-lg font-semibold mt-2">₹{booking.totalAmount}</p>
                  <p className="text-sm text-gray-500">
                    {booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-500">
                    Seats: {booking.seats.map(seat => `${seat.row}${seat.seatNumber}`).join(', ')}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Booking Code: {booking.bookingCode}
                  </p>
                  <p className="text-xs text-gray-400">
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory; 