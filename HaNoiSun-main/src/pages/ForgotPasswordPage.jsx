import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Call API to send reset password email
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setIsSubmitted(true);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email đã được gửi!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi link đặt lại mật khẩu đến địa chỉ email{' '}
              <span className="font-medium text-gray-900">{email}</span>.
              Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full btn-primary"
              >
                Quay lại đăng nhập
              </button>
              
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full btn-secondary"
              >
                Gửi lại email
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Không nhận được email? Kiểm tra thư mục spam hoặc{' '}
              <Link 
                to="/contact" 
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                liên hệ hỗ trợ
              </Link>
            </p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h1>
          <p className="text-gray-600">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors ${
                    error ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Nhập địa chỉ email của bạn"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Đang gửi...</span>
                </div>
              ) : (
                'Gửi link đặt lại mật khẩu'
              )}
            </button>
          </form>
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại đăng nhập</span>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Nhớ mật khẩu?{' '}
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-700 font-medium underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
