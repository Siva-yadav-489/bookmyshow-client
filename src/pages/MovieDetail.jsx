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
          axios.get(`http://localhost:5000/api/movies/${id}`),
          axios.get('http://localhost:5000/api/venues/cities/all')
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
          const response = await axios.get(`http://localhost:5000/api/shows/movie/${id}`);
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
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
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
    <div className="space-y-8">
      {/* Movie Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              {movie.posterUrl ? (
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500">No Image</div>
              )}
            </div>
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600">
                <span className="font-semibold">Genre:</span> {movie.genre.join(', ')}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Duration:</span> {movie.duration} minutes
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Language:</span> {movie.language}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Certificate:</span> {movie.certificate}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Rating:</span> {movie.rating}/10
              </p>
              {movie.director && (
                <p className="text-gray-600">
                  <span className="font-semibold">Director:</span> {movie.director}
                </p>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <p className="text-gray-600">
                  <span className="font-semibold">Cast:</span> {movie.cast.join(', ')}
                </p>
              )}
            </div>
            <p className="text-gray-700 mb-6">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Book Tickets</h2>
        
        {/* City Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full md:w-64 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Shows List */}
        {selectedCity ? (
          shows.length > 0 ? (
            <div className="space-y-4">
              {shows.map((show) => (
                <div key={show._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{show.venue.name}</h3>
                      <p className="text-gray-600">{show.venue.address}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(show.date).toLocaleDateString()} at {show.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{show.price}</p>
                      <p className="text-sm text-gray-500">
                        {show.availableSeats} seats available
                      </p>
                      <Link
                        to={`/booking/${show._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
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