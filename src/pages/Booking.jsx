import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Booking = () => {
  const { showId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchShowAndSeats = async () => {
      try {
        const [showResponse, seatsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/shows/${showId}`),
          axios.get(`http://localhost:5000/api/bookings/show/${showId}/seats`)
        ]);
        
        setShow(showResponse.data.data);
        setSeats(seatsResponse.data.data.seats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching show details:', error);
        setError('Failed to load show details');
        setLoading(false);
      }
    };

    fetchShowAndSeats();
  }, [showId, user, navigate]);

  const handleSeatClick = (seat) => {
    if (!seat.isAvailable) return;

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.seatId === seat.seatId);
      if (isSelected) {
        return prev.filter(s => s.seatId !== seat.seatId);
      } else {
        return [...prev, { ...seat, price: show.price }];
      }
    });
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      // Lock seats first
      const lockResponse = await axios.post('http://localhost:5000/api/bookings/lock-seats', {
        showId,
        seats: selectedSeats.map(seat => ({
          row: seat.row,
          seatNumber: seat.seatNumber
        }))
      });

      // Create booking
      const bookingResponse = await axios.post('http://localhost:5000/api/bookings', {
        showId,
        seats: selectedSeats,
        paymentMethod: 'card',
        lockId: lockResponse.data.data.lockId
      });

      navigate('/booking-history');
    } catch (error) {
      setError(error.response?.data?.error || 'Booking failed');
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-500">Show not found</div>
      </div>
    );
  }

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Book Tickets</h1>

      {/* Show Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-16 bg-gray-200 rounded flex items-center justify-center">
            {show.movie.posterUrl ? (
              <img 
                src={show.movie.posterUrl} 
                alt={show.movie.title}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="text-gray-500 text-xs">No Image</div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{show.movie.title}</h2>
            <p className="text-gray-600">{show.venue.name}</p>
            <p className="text-gray-500 text-sm">{show.venue.address}</p>
            <p className="text-gray-500 text-sm">
              {new Date(show.date).toLocaleDateString()} at {show.time}
            </p>
          </div>
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Select Seats</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Screen */}
        <div className="text-center mb-6">
          <div className="bg-gray-300 h-2 rounded-full mb-2"></div>
          <p className="text-sm text-gray-600">SCREEN</p>
        </div>

        {/* Seats Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-10 gap-1">
            {seats.map((seat) => (
              <button
                key={seat.seatId}
                onClick={() => handleSeatClick(seat)}
                disabled={!seat.isAvailable}
                className={`
                  w-8 h-8 text-xs rounded flex items-center justify-center
                  ${!seat.isAvailable 
                    ? 'bg-red-500 text-white cursor-not-allowed' 
                    : selectedSeats.find(s => s.seatId === seat.seatId)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                  }
                `}
                title={`${seat.row}${seat.seatNumber} - ₹${seat.price}`}
              >
                {seat.row}{seat.seatNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      {selectedSeats.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Selected Seats:</span>
              <span>{selectedSeats.map(seat => `${seat.row}${seat.seatNumber}`).join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of Seats:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per Seat:</span>
              <span>₹{show.price}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookingLoading ? 'Processing...' : `Pay ₹${totalAmount}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking; 