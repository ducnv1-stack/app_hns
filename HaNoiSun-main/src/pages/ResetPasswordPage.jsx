import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Mật khẩu không đáp ứng yêu cầu bảo mật');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!token) {
      setError('Link đặt lại mật khẩu không hợp lệ');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Call API to reset password
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setIsSuccess(true);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đặt lại mật khẩu thành công!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Mật khẩu của bạn đã được cập nhật thành công. 
              Bây giờ bạn có thể đăng nhập với mật khẩu mới.
            </p>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full btn-primary"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h1>
          <p className="text-gray-600">
            {email ? `Đặt lại mật khẩu cho ${email}` : 'Tạo mật khẩu mới cho tài khoản của bạn'}
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-3">Yêu cầu mật khẩu:</h3>
              <div className="space-y-2 text-sm">
                <div className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordValidation.minLength ? 'bg-green-600 border-green-600' : 'border-gray-300'
                  }`}>
                    {passwordValidation.minLength && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span>Ít nhất 8 ký tự</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordValidation.hasUpperCase ? 'bg-green-600 border-green-600' : 'border-gray-300'
                  }`}>
                    {passwordValidation.hasUpperCase && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span>Có chữ hoa (A-Z)</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordValidation.hasLowerCase ? 'bg-green-600 border-green-600' : 'border-gray-300'
                  }`}>
                    {passwordValidation.hasLowerCase && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span>Có chữ thường (a-z)</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordValidation.hasNumbers ? 'bg-green-600 border-green-600' : 'border-gray-300'
                  }`}>
                    {passwordValidation.hasNumbers && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span>Có số (0-9)</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordValidation.hasSpecialChar ? 'bg-green-600 border-green-600' : 'border-gray-300'
                  }`}>
                    {passwordValidation.hasSpecialChar && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span>Có ký tự đặc biệt (!@#$%^&*)</span>
                </div>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors ${
                    error ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Nhập mật khẩu mới"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors ${
                    error ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !passwordValidation.isValid}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Đang cập nhật...</span>
                </div>
              ) : (
                'Cập nhật mật khẩu'
              )}
            </button>
          </form>
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-primary-600 hover:text-primary-700 font-medium underline"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
