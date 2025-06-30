import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies`);
        setMovies(response.data.data);
        setFilteredMovies(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(movie =>
        movie.genre.includes(selectedGenre)
      );
    }

    if (selectedLanguage) {
      filtered = filtered.filter(movie =>
        movie.language === selectedLanguage
      );
    }

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, selectedLanguage]);

  const genres = [...new Set(movies.flatMap(movie => movie.genre))];
  const languages = [...new Set(movies.map(movie => movie.language))];

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-[#1E1E1E]">Movies</h1>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F84464] focus:border-transparent shadow-sm text-gray-700 text-sm font-medium outline-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full h-12 p-3 border border-[#D6D6D6] rounded-lg focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] bg-white text-gray-700 text-sm font-medium shadow-sm outline-0"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="text-gray-700">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full h-12 p-3 border border-[#D6D6D6] rounded-lg focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] bg-white text-gray-700 text-sm font-medium shadow-sm outline-0"
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language} className="text-gray-700">
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredMovies.length} of {movies.length} movies
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">No movies found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <div key={movie._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
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
                <div className="p-4">
                  <h3 className="text-lg font-medium text-[#1E1E1E] mb-2 line-clamp-1">{movie.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{movie.genre.join(' • ')}</p>
                  <p className="text-sm text-gray-600 mb-2">{movie.duration} min • {movie.language}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{movie.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Rating: {movie.rating}/10</span>
                    <Link
                      to={`/movies/${movie._id}`}
                      className="text-sm px-4 py-2 rounded text-[#F84464] hover:bg-[#F84464] hover:text-white transition-colors"
                    >
                      View Details
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

export default Movies; 