import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MovieCard = ({ movie }) => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-lg">
      <div className="aspect-[2/3] bg-[#F5F5F5]">
        {movie.posterUrl ? (
          <img 
            src={movie.posterUrl} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link
            to={`/movies/${movie._id}`}
            className="w-full bg-[#F84464] text-white text-sm py-3 rounded font-medium inline-flex items-center justify-center hover:bg-[#E03454] transition-colors"
          >
            Book tickets
          </Link>
        </div>
      </div>
    </div>
    <div className="mt-2">
      <h3 className="font-medium text-[#1E1E1E] line-clamp-1">{movie.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{movie.genre.join(' • ')}</p>
    </div>
  </div>
);

const QuickLink = ({ to, title, description, gradient }) => (
  <Link 
    to={to} 
    className={`block p-6 rounded-xl ${gradient} text-white transform hover:scale-[1.02] transition-transform duration-300`}
  >
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-sm text-white/80">{description}</p>
  </Link>
);

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, citiesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/movies`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/venues/cities/all`)
        ]);
        
        setMovies(moviesResponse.data.data);
        setCities(citiesResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (movies.length > 3 ? 3 : movies.length));
    }, 5000);

    return () => clearInterval(timer);
  }, [movies.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F84464] border-t-transparent"></div>
      </div>
    );
  }

  const featuredMovies = movies.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Carousel */}
      <div className="relative h-[440px] bg-[#1E1E1E] overflow-hidden">
        <div className="absolute inset-0 flex transition-transform duration-500 ease-out"
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {featuredMovies.map((movie, index) => (
            <div key={movie._id} className="relative w-full h-full flex-shrink-0">
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                <div className="max-w-6xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">{movie.title}</h1>
                  <p className="text-lg text-white/80 mb-6 max-w-2xl line-clamp-2">{movie.description}</p>
                  <Link
                    to={`/movies/${movie._id}`}
                    className="inline-flex items-center px-8 py-3 bg-[#F84464] text-white rounded font-medium hover:bg-[#E03454] transition-colors"
                  >
                    Book tickets
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-[#F84464]' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium text-[#1E1E1E]">Recommended Movies</h2>
          <Link 
            to="/movies" 
            className="text-[#F84464] hover:text-[#E03454] font-medium flex items-center"
          >
            See All
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.slice(0, 10).map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Movies Grid 2 */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium text-[#1E1E1E]">Premieres</h2>
          <Link 
            to="/movies" 
            className="text-[#F84464] hover:text-[#E03454] font-medium flex items-center"
          >
            See All
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.slice(0, 10).map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Movies Grid 3 */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium text-[#1E1E1E]">Best of 2024</h2>
          <Link 
            to="/movies" 
            className="text-[#F84464] hover:text-[#E03454] font-medium flex items-center"
          >
            See All
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.slice(0, 10).map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickLink
            to="/movies"
            title="Browse Movies"
            description="Discover the latest releases and classics"
            gradient="bg-gradient-to-r from-purple-600 to-indigo-600"
          />
          <QuickLink
            to="/shows"
            title="Find Shows"
            description="Check show timings and availability"
            gradient="bg-gradient-to-r from-[#F84464] to-pink-600"
          />
          <QuickLink
            to="/venues"
            title="Explore Venues"
            description="Find theaters near you"
            gradient="bg-gradient-to-r from-teal-500 to-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Home; 