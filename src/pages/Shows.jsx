import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const [filters, setFilters] = useState({
    movie: '',
    venue: query.get('venueId') || '',
    date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showsResponse, moviesResponse, venuesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/shows`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/movies`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/venues`)
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
        <h1 className="text-2xl font-medium text-[#1E1E1E]">Shows</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Movie
              </label>
              <select
                value={filters.movie}
                onChange={(e) => setFilters({ ...filters, movie: e.target.value })}
                className="w-full h-12 p-3 border border-[#D6D6D6] rounded-lg focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] bg-white text-gray-700 text-sm font-medium shadow-sm outline-0"
              >
                <option value="">All Movies</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id} className="text-gray-700">
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
                className="w-full h-12 p-3 border border-[#D6D6D6] rounded-lg focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] bg-white text-gray-700 text-sm font-medium shadow-sm outline-0"
              >
                <option value="">All Venues</option>
                {venues.map((venue) => (
                  <option key={venue._id} value={venue._id} className="text-gray-700">
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
                className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F84464] focus:border-transparent shadow-sm text-gray-700 text-sm font-medium outline-0"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
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
              <div key={show._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="h-24 w-16 bg-[#F5F5F5] rounded-lg overflow-hidden flex-shrink-0">
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
                      <div>
                        <h3 className="text-lg font-medium text-[#1E1E1E]">{show.movie.title}</h3>
                        <p className="text-gray-600">{show.venue.name}</p>
                        <p className="text-sm text-gray-500">{show.venue.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-[#1E1E1E]">₹{show.price}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(show.date).toLocaleDateString()} at {show.time}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {show.availableSeats} seats available
                    </p>
                    <Link
                      to={`/booking/${show._id}`}
                      className="inline-block px-6 py-2 bg-[#F84464] text-white rounded font-medium hover:bg-[#E03454] transition-colors"
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
    </div>
  );
};

export default Shows; 