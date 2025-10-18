import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loginResponse = await login(formData);
      console.log('🚀 Login response received:', loginResponse);
      
      // Navigate based on user roles
      const user = loginResponse.data.user;
      console.log('👤 User data for navigation:', user);
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        console.log('🚀 Navigation decision:', {
          userRoles: user.roles,
          isAdmin: user.roles && user.roles.includes('admin'),
          from: from
        });
        
        // Check if user has admin role
        const isAdmin = user.roles && user.roles.includes('admin');
        console.log('🔍 Role check result:', { isAdmin, userRoles: user.roles });
        
        if (isAdmin) {
          console.log('🔑 Admin user detected - Redirecting to /admin/dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else {
          console.log('👤 Regular user detected - Redirecting to /dashboard');
          navigate('/dashboard', { replace: true });
        }
      }, 100);
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
          <p className="text-gray-600">Nhập thông tin để truy cập tài khoản</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang đăng nhập...
              </div>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>


        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <Link 
            to="/forgot-password" 
            className="text-sm text-primary-600 hover:text-primary-700 underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{' '}
            <Link 
              to="/register" 
              className="text-primary-600 hover:text-primary-700 font-medium underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;




