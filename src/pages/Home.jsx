import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, citiesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/movies'),
          axios.get('http://localhost:5000/api/venues/cities/all')
        ]);
        
        setMovies(moviesResponse.data.data.slice(0, 6)); // Show first 6 movies
        setCities(citiesResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Book Your Movie Tickets Online
          </h1>
          <p className="text-xl mb-8">
            Discover the latest movies and book tickets for the best seats
          </p>
          
          {/* City Selection */}
          <div className="max-w-md mx-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 rounded text-gray-800"
            >
              <option value="">Select your city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {selectedCity && (
              <Link
                to={`/movies/search/city/${selectedCity}`}
                className="block mt-4 bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors"
              >
                Find Movies in {selectedCity}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Featured Movies */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Movies</h2>
          <Link 
            to="/movies" 
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            View All Movies →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
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
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{movie.genre.join(', ')}</p>
                <p className="text-gray-600 text-sm mb-4">{movie.duration} min • {movie.language}</p>
                <Link
                  to={`/movies/${movie._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/movies" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Browse Movies</h3>
          <p className="text-gray-600">Discover the latest releases and classics</p>
        </Link>
        
        <Link 
          to="/shows" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Find Shows</h3>
          <p className="text-gray-600">Check show timings and availability</p>
        </Link>
        
        <Link 
          to="/venues" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Explore Venues</h3>
          <p className="text-gray-600">Find theaters near you</p>
        </Link>
      </div>
    </div>
  );
};

export default Home; 