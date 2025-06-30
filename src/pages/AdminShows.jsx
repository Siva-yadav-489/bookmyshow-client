import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminShows = () => {
  const { isAdmin } = useAuth();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      return;
    }

    const fetchShows = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shows`);
        setShows(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shows:', error);
        setLoading(false);
      }
    };

    fetchShows();
  }, [isAdmin]);

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-500">Access denied. Admin privileges required.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F84464] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1E1E1E]">Manage Shows</h1>
        <button className="bg-[#F84464] text-white px-4 py-2 rounded-lg hover:bg-[#c72d4d] focus:ring-2 focus:ring-[#F84464] transition-colors">
          Add New Show
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#D6D6D6]">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider">
                  Movie
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider">
                  Venue
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider">
                  Available Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F5F5F5]">
              {shows.map((show) => (
                <tr key={show._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-8 bg-[#F5F5F5] rounded flex items-center justify-center mr-3">
                        {show.movie.posterUrl ? (
                          <img 
                            src={show.movie.posterUrl} 
                            alt={show.movie.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">No Image</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1E1E1E]">{show.movie.title}</div>
                        <div className="text-sm text-gray-500">{show.movie.language}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[#1E1E1E]">{show.venue.name}</div>
                    <div className="text-sm text-gray-500">{show.venue.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#1E1E1E]">
                      {new Date(show.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{show.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1E1E1E]">
                    ₹{show.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1E1E1E]">
                    {show.availableSeats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-[#F84464] hover:text-[#c72d4d] mr-3">Edit</button>
                    <button className="text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminShows; 