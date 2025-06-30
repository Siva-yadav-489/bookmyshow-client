import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieResponse, citiesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/movies/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/venues/cities/all`)
        ]);
        
        setMovie(movieResponse.data.data);
        setCities(citiesResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedCity) {
      const fetchShows = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shows/movie/${id}`);
          const cityShows = response.data.data.filter(show => 
            show.venue.city.toLowerCase().includes(selectedCity.toLowerCase())
          );
          setShows(cityShows);
        } catch (error) {
          console.error('Error fetching shows:', error);
        }
      };

      fetchShows();
    } else {
      setShows([]);
    }
  }, [id, selectedCity]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F84464] border-t-transparent"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-500">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Movie Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 flex-shrink-0">
          <div className="h-80 md:h-full bg-[#F5F5F5] flex items-center justify-center">
            {movie.posterUrl ? (
              <img 
                src={movie.posterUrl} 
                alt={movie.title}
                className="w-full h-full object-cover rounded-l-xl"
              />
            ) : (
              <div className="text-gray-400">No Image</div>
            )}
          </div>
        </div>
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E1E] mb-4">{movie.title}</h1>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600"><span className="font-semibold">Genre:</span> {movie.genre.join(', ')}</p>
              <p className="text-gray-600"><span className="font-semibold">Duration:</span> {movie.duration} minutes</p>
              <p className="text-gray-600"><span className="font-semibold">Language:</span> {movie.language}</p>
              <p className="text-gray-600"><span className="font-semibold">Certificate:</span> {movie.certificate}</p>
              <p className="text-gray-600"><span className="font-semibold">Rating:</span> {movie.rating}/10</p>
              {movie.director && (
                <p className="text-gray-600"><span className="font-semibold">Director:</span> {movie.director}</p>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <p className="text-gray-600"><span className="font-semibold">Cast:</span> {movie.cast.join(', ')}</p>
              )}
            </div>
            <p className="text-gray-700 mb-4">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4">Book Tickets</h2>
        {/* City Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full md:w-64 p-2 border border-[#D6D6D6] rounded-lg focus:ring-2 focus:ring-[#F84464] focus:border-[#F84464] bg-white text-gray-700 text-sm font-medium shadow-sm"
          >
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        {/* Shows List */}
        {selectedCity ? (
          shows.length > 0 ? (
            <div className="space-y-4">
              {shows.map((show) => (
                <div key={show._id} className="border border-[#F5F5F5] rounded-lg p-4 hover:shadow-md transition-shadow bg-[#F5F5F5]">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-[#1E1E1E]">{show.venue.name}</h3>
                      <p className="text-gray-600">{show.venue.address}</p>
                      <p className="text-sm text-gray-500">{new Date(show.date).toLocaleDateString()} at {show.time}</p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="font-semibold text-[#F84464] text-lg">₹{show.price}</p>
                      <p className="text-sm text-gray-500">{show.availableSeats} seats available</p>
                      <Link
                        to={`/booking/${show._id}`}
                        className="inline-block mt-2 bg-[#F84464] text-white px-5 py-2 rounded-lg hover:bg-[#E03454] transition-colors font-medium shadow-sm"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">No shows available in {selectedCity}</div>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">Please select a city to view available shows</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail; 