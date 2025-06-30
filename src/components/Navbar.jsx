import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaChevronDown, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src="https://cdn.prod.website-files.com/600ee75084e3fe0e5731624c/65b6384089ec9e265952391f_bookmyshow-logo-vector-removebg-preview%20(1).png"
                alt="BookMyShow Logo"
                className="h-8 w-auto"
                style={{ minWidth: 140 }}
              />
            </Link>

            {/* Search Bar */}
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="w-[400px] bg-gray-100 text-gray-800 text-sm rounded-sm px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#F84464]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* City Selector */}
            <div className="hidden md:block relative">
              <button
                type="button"
                className="flex items-center text-gray-700 text-sm focus:outline-none"
                onClick={() => setCityDropdownOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={cityDropdownOpen}
              >
                <span>{selectedCity}</span>
                <FaChevronDown className={`w-3 h-3 text-gray-500 ml-2 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {cityDropdownOpen && (
                <ul
                  className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-fade-in"
                  tabIndex={-1}
                  role="listbox"
                  onBlur={() => setCityDropdownOpen(false)}
                >
                  {cities.map((city) => (
                    <li
                      key={city}
                      className={`px-4 py-2 cursor-pointer text-sm hover:bg-[#F84464]/10 transition rounded ${selectedCity === city ? 'bg-[#F84464]/10 text-[#F84464]' : 'text-gray-700'}`}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      role="option"
                      aria-selected={selectedCity === city}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Profile Icon and Greeting (only when logged in) */}
            {user && (
              <div className="hidden md:flex items-center space-x-2 pl-2">
                <Link to="#" className="text-gray-400 hover:text-[#F84464] text-2xl focus:outline-none">
                  <FaUserCircle />
                </Link>
                <span className="text-gray-700 text-sm">Hi, {user.name?.split(' ')[0] || 'User'}</span>
              </div>
            )}
            {/* My Bookings and Admin (only when logged in) */}
            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/booking-history" className="text-gray-700 text-sm hover:text-[#F84464]">
                  My Bookings
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-gray-700 text-sm hover:text-[#F84464]">
                    Admin
                  </Link>
                )}
              </div>
            )}
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="text-sm px-6 py-1 rounded text-[#F84464] hover:bg-[#F84464] hover:text-white transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-sm px-6 py-1 rounded text-[#F84464] hover:bg-[#F84464] hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:block py-2 border-t border-gray-200">
          <div className="flex space-x-8">
            <Link to="/movies" className="text-gray-700 hover:text-[#F84464] text-sm">Movies</Link>
            <Link to="/shows" className="text-gray-700 hover:text-[#F84464] text-sm">Shows</Link>
            <Link to="/venues" className="text-gray-700 hover:text-[#F84464] text-sm">Venues</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} border-t border-gray-200`}>
        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center border rounded">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="px-3 py-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <Link to="/movies" className="block px-3 py-2 text-gray-700 hover:text-[#F84464] text-sm">Movies</Link>
          <Link to="/shows" className="block px-3 py-2 text-gray-700 hover:text-[#F84464] text-sm">Shows</Link>
          <Link to="/venues" className="block px-3 py-2 text-gray-700 hover:text-[#F84464] text-sm">Venues</Link>
          
          {user && (
            <>
              <Link to="/booking-history" className="block px-3 py-2 text-gray-700 hover:text-[#F84464] text-sm">
                My Bookings
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:text-[#F84464] text-sm">
                  Admin
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 