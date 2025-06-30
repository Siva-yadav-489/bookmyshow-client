import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password, formData.role);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 space-y-8 relative">
        <Link to="/" className="absolute top-4 right-4 text-[#F84464] hover:text-[#E03454] text-sm font-medium transition-colors">Skip</Link>
        <div>
          <h2 className="text-center text-2xl font-bold text-[#1E1E1E]">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-[#F84464] hover:text-[#E03454]">
              create a new account
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-[#D6D6D6] placeholder-gray-400 text-[#1E1E1E] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] sm:text-sm shadow-sm outline-0"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-[#D6D6D6] placeholder-gray-400 text-[#1E1E1E] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] sm:text-sm shadow-sm outline-0"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Login as</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-[#D6D6D6] bg-white rounded-lg shadow-sm text-gray-700 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] sm:text-sm outline-0"
              >
                <option value="user" className="text-gray-700">User</option>
                <option value="admin" className="text-gray-700">Admin</option>
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#F84464] hover:bg-[#E03454] focus:outline-none focus:ring-2 focus:ring-[#F84464] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Demo Credentials:</p>
            <p className="text-xs text-gray-500 mt-1">User: john@example.com / password</p>
            <p className="text-xs text-gray-500">Admin: admin@bookmyshow.com / password</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 