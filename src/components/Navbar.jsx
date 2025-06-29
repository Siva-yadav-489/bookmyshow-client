import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            BookMyShow
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link to="/movies" className="hover:text-blue-200 transition-colors">
              Movies
            </Link>
            <Link to="/shows" className="hover:text-blue-200 transition-colors">
              Shows
            </Link>
            <Link to="/venues" className="hover:text-blue-200 transition-colors">
              Venues
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">Welcome, {user.name}</span>
                <Link 
                  to="/booking-history" 
                  className="bg-blue-700 px-3 py-2 rounded hover:bg-blue-800 transition-colors"
                >
                  My Bookings
                </Link>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className="bg-green-600 px-3 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-blue-700 px-3 py-2 rounded hover:bg-blue-800 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-600 px-3 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 