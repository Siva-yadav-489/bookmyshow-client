import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function Layout({ children }) {
  const location = useLocation();
  const hideNavFooter = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/booking/:showId" element={<PrivateRoute><Booking /></PrivateRoute>} />
            <Route path="/booking-history" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/movies" element={<PrivateRoute><AdminMovies /></PrivateRoute>} />
            <Route path="/admin/shows" element={<PrivateRoute><AdminShows /></PrivateRoute>} />
            <Route path="/admin/venues" element={<PrivateRoute><AdminVenues /></PrivateRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
