import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    movie: '',
    venue: '',
    date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showsResponse, moviesResponse, venuesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/shows'),
          axios.get('http://localhost:5000/api/movies'),
          axios.get('http://localhost:5000/api/venues')
        ]);
        
        setShows(showsResponse.data.data);
        setMovies(moviesResponse.data.data);
        setVenues(venuesResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shows:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredShows = shows.filter(show => {
    if (filters.movie && show.movie._id !== filters.movie) return false;
    if (filters.venue && show.venue._id !== filters.venue) return false;
    if (filters.date) {
      const showDate = new Date(show.date).toISOString().split('T')[0];
      if (showDate !== filters.date) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shows</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movie
            </label>
            <select
              value={filters.movie}
              onChange={(e) => setFilters({ ...filters, movie: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Movies</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue
            </label>
            <select
              value={filters.venue}
              onChange={(e) => setFilters({ ...filters, venue: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Venues</option>
              {venues.map((venue) => (
                <option key={venue._id} value={venue._id}>
                  {venue.name} - {venue.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        Showing {filteredShows.length} of {shows.length} shows
      </div>

      {/* Shows List */}
      {filteredShows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-xl text-gray-500">No shows found</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredShows.map((show) => (
            <div key={show._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
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
                      <h3 className="text-lg font-semibold">{show.movie.title}</h3>
                      <p className="text-gray-600">{show.venue.name}</p>
                      <p className="text-gray-500 text-sm">{show.venue.address}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">₹{show.price}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(show.date).toLocaleDateString()} at {show.time}
                  </p>
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
      )}
    </div>
  );
};

export default Shows; 