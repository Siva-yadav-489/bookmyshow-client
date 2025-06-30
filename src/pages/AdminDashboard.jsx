import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaFilm, FaMapMarkerAlt, FaTheaterMasks, FaTicketAlt, FaUsers } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    movies: 0,
    venues: 0,
    shows: 0,
    bookings: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      return;
    }

    const fetchStats = async () => {
      try {
        const [moviesRes, venuesRes, showsRes, bookingsRes, usersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/movies`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/venues`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/shows`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/bookings`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`)
        ]);

        setStats({
          movies: moviesRes.data.data.length,
          venues: venuesRes.data.data.length,
          shows: showsRes.data.data.length,
          bookings: bookingsRes.data.data.length,
          users: usersRes.data.data.length
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
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
        <h1 className="text-2xl font-bold text-[#1E1E1E]">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back, {user?.name}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FaFilm className="text-2xl text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Movies</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.movies}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 bg-green-100 rounded-lg">
            <FaMapMarkerAlt className="text-2xl text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Venues</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.venues}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg">
            <FaTheaterMasks className="text-2xl text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Shows</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.shows}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <FaTicketAlt className="text-2xl text-yellow-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Bookings</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.bookings}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 bg-red-100 rounded-lg">
            <FaUsers className="text-2xl text-red-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Users</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.users}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#F5F5F5] rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1E1E1E]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/movies"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center flex flex-col items-center"
          >
            <FaFilm className="text-2xl mb-2" />
            <div className="font-semibold">Manage Movies</div>
            <div className="text-sm opacity-90">Add, edit, or remove movies</div>
          </Link>
          <Link
            to="/admin/venues"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center flex flex-col items-center"
          >
            <FaMapMarkerAlt className="text-2xl mb-2" />
            <div className="font-semibold">Manage Venues</div>
            <div className="text-sm opacity-90">Add, edit, or remove venues</div>
          </Link>
          <Link
            to="/admin/shows"
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center flex flex-col items-center"
          >
            <FaTheaterMasks className="text-2xl mb-2" />
            <div className="font-semibold">Manage Shows</div>
            <div className="text-sm opacity-90">Schedule and manage shows</div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#F5F5F5] rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1E1E1E]">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white rounded">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">System Overview</p>
              <p className="text-xs text-gray-500">Dashboard loaded successfully</p>
            </div>
            <div className="text-xs text-gray-400">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Statistics Updated</p>
              <p className="text-xs text-gray-500">All metrics refreshed</p>
            </div>
            <div className="text-xs text-gray-400">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 