import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SeatTypeIndicator = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-7 h-7 rounded-t-lg ${color}`}></div>
    <span className="text-sm text-gray-600">{label}</span>
  </div>
);

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
  const lockIdRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchShowAndSeats = async () => {
      try {
        const [showResponse, seatsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/shows/${showId}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/show/${showId}/seats`)
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

  // Helper to lock seats
  const lockSeats = async (seatsToLock) => {
    try {
      const lockResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/lock-seats`, {
        showId,
        seats: seatsToLock.map(seat => ({ row: seat.row, seatNumber: seat.seatNumber }))
      });
      lockIdRef.current = lockResponse.data.data.lockId;
      return lockResponse.data.data.lockId;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to lock seats');
      return null;
    }
  };

  // Helper to unlock seats
  const unlockSeats = async () => {
    if (lockIdRef.current) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/unlock-seats`, {
          lockId: lockIdRef.current
        });
        lockIdRef.current = null;
      } catch (error) {
        // Ignore unlock errors
      }
    }
  };

  // Lock seats on select, unlock on unselect
  const handleSeatClick = async (seat) => {
    if (!seat.isAvailable) return;
    const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);
    if (isSelected) {
      // Unselect: unlock seats
      await unlockSeats();
      setSelectedSeats(prev => prev.filter(s => s.seatId !== seat.seatId));
    } else {
      // Select: lock seats
      const newSelection = [...selectedSeats, { ...seat, price: show.price }];
      const lockId = await lockSeats(newSelection);
      if (lockId) {
        setSelectedSeats(newSelection);
      }
    }
  };

  // Unlock seats on unmount or navigation
  useEffect(() => {
    return () => {
      unlockSeats();
    };
  }, []);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }
    setBookingLoading(true);
    setError('');
    try {
      // Use the current lockId for booking
      const seatsToBook = selectedSeats.map(seat => ({
        row: seat.row,
        seatNumber: seat.seatNumber,
        price: seat.price || show.price
      }));
      const bookingResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        showId,
        seats: seatsToBook,
        paymentMethod: 'card',
        lockId: lockIdRef.current
      });
      lockIdRef.current = null;
      navigate('/booking-history');
    } catch (error) {
      setError(error.response?.data?.error || 'Booking failed');
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F84464] border-t-transparent"></div>
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Show Details */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="h-32 w-24 bg-[#F5F5F5] rounded-lg overflow-hidden flex-shrink-0">
            {show.movie.posterUrl ? (
              <img 
                src={show.movie.posterUrl} 
                alt={show.movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-medium text-[#1E1E1E]">{show.movie.title}</h1>
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              <span>{show.movie.duration} min</span>
              <span>•</span>
              <span>{show.movie.language}</span>
              <span>•</span>
              <span>{show.movie.genre.join(', ')}</span>
            </div>
            <div className="pt-2">
              <h2 className="font-medium text-[#1E1E1E]">{show.venue.name}</h2>
              <p className="text-gray-600 text-sm">{show.venue.address}</p>
              <p className="text-gray-600 text-sm mt-1">
                {new Date(show.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} | {show.time}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* How to Book */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-[#1E1E1E] mb-4">How to Book</h3>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-gray-600 font-medium">
                1
              </div>
              <span className="text-sm text-gray-600">Select your seats</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-gray-600 font-medium">
                2
              </div>
              <span className="text-sm text-gray-600">Enter payment details</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-gray-600 font-medium">
                3
              </div>
              <span className="text-sm text-gray-600">Receive confirmation</span>
            </div>
          </div>
        </div>

        {/* Screen */}
        <div className="text-center mb-12">
          <div className="w-4/5 mx-auto h-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-sm mb-3"></div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">All eyes this way please!</p>
        </div>

        {/* Seats Grid */}
        <div className="flex justify-center mb-8">
          <div className="inline-grid grid-cols-10 gap-2">
            {seats.map((seat) => (
              <button
                key={seat.seatId}
                onClick={() => handleSeatClick(seat)}
                disabled={!seat.isAvailable}
                className={`
                  w-8 h-8 rounded-t-lg relative transition-all duration-200
                  ${!seat.isAvailable 
                    ? 'bg-[#F84464] cursor-not-allowed' 
                    : selectedSeats.find(s => s.seatId === seat.seatId)
                    ? 'bg-[#1AAE9E] text-white transform -translate-y-1 shadow-lg'
                    : 'bg-[#D6D6D6] hover:bg-[#BDBDBD]'
                  }
                `}
                title={`${seat.row}${seat.seatNumber} - ₹${seat.price}`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {seat.row}{seat.seatNumber}
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 rounded-b"></span>
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
          <SeatTypeIndicator color="bg-[#D6D6D6]" label="Available" />
          <SeatTypeIndicator color="bg-[#1AAE9E]" label="Selected" />
          <SeatTypeIndicator color="bg-[#F84464]" label="Sold" />
        </div>
      </div>

      {/* Booking Summary */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{selectedSeats.length} Ticket(s)</span>
                <span>•</span>
                <span>{selectedSeats.map(s => `${s.row}${s.seatNumber}`).join(', ')}</span>
              </div>
              <p className="font-medium text-lg mt-1">Amount: ₹{totalAmount}</p>
            </div>
            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className={`
                px-8 py-3 rounded text-white font-medium
                ${bookingLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#F84464] hover:bg-[#E03454] transform hover:-translate-y-0.5 transition-all duration-200'
                }
              `}
            >
              {bookingLoading ? 'Processing...' : 'Proceed'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking; 