import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/venues');
        setVenues(response.data.data);
        setFilteredVenues(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  useEffect(() => {
    let filtered = venues;

    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(venue =>
        venue.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    setFilteredVenues(filtered);
  }, [venues, searchTerm, selectedCity]);

  const cities = [...new Set(venues.map(venue => venue.city))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Venues</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Venues
            </label>
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        Showing {filteredVenues.length} of {venues.length} venues
      </div>

      {/* Venues Grid */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-xl text-gray-500">No venues found</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div key={venue._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <div>{venue.name}</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{venue.name}</h3>
                <p className="text-gray-600 mb-2">{venue.address}</p>
                <p className="text-gray-500 text-sm mb-2">{venue.city}</p>
                <p className="text-gray-500 text-sm mb-4">
                  {venue.screens?.length || 0} screens • {venue.venueType}
                </p>
                
                {venue.screens && venue.screens.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Screens:</h4>
                    <div className="space-y-1">
                      {venue.screens.slice(0, 3).map((screen, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          {screen.name} - {screen.capacity} seats
                        </div>
                      ))}
                      {venue.screens.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{venue.screens.length - 3} more screens
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {venue.contactNumber && (
                      <div>📞 {venue.contactNumber}</div>
                    )}
                  </div>
                  <Link
                    to={`/shows/venue/${venue._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Shows
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

export default Venues; 