import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Shows from './pages/Shows';
import Venues from './pages/Venues';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminMovies from './pages/AdminMovies';
import AdminShows from './pages/AdminShows';
import AdminVenues from './pages/AdminVenues';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/shows" element={<Shows />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/booking/:showId" element={<Booking />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/movies" element={<AdminMovies />} />
              <Route path="/admin/shows" element={<AdminShows />} />
              <Route path="/admin/venues" element={<AdminVenues />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
