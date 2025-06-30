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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/venues`);
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
        <h1 className="text-2xl font-medium text-[#1E1E1E]">Venues</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Venues
              </label>
              <input
                type="text"
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F84464] focus:border-transparent shadow-sm text-gray-700 text-sm font-medium outline-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-12 p-3 border border-[#D6D6D6] rounded-lg focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] bg-white text-gray-700 text-sm font-medium shadow-sm outline-0"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city} className="text-gray-700">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredVenues.length} of {venues.length} venues
        </div>

        {/* Venues Grid */}
        {filteredVenues.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">No venues found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <div key={venue._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-[#F5F5F5] flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <div className="text-lg font-medium">{venue.name}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-[#1E1E1E] mb-2">{venue.name}</h3>
                  <p className="text-gray-600 mb-2">{venue.address}</p>
                  <p className="text-sm text-gray-500 mb-2">{venue.city}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {venue.screens?.length || 0} screens • {venue.venueType}
                  </p>
                  
                  {venue.screens && venue.screens.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Screens:</h4>
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
                      to={`/shows?venueId=${venue._id}`}
                      className="text-sm px-4 py-2 rounded text-[#F84464] hover:bg-[#F84464] hover:text-white transition-colors"
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
    </div>
  );
};

export default Venues; 