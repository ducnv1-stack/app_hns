import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  const benefits = [
    'Nhận thông tin tour mới nhất',
    'Ưu đãi độc quyền dành riêng cho subscriber',
    'Tips du lịch hữu ích từ chuyên gia',
    'Thông báo flash sale sớm nhất'
  ];

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12">
            <CheckCircle className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Cảm Ơn Bạn Đã Đăng Ký!
            </h2>
            <p className="text-xl text-green-100 mb-6">
              Chúng tôi sẽ gửi những thông tin du lịch hấp dẫn nhất đến email của bạn
            </p>
            <button
              onClick={() => setIsSubscribed(false)}
              className="bg-white text-green-600 font-semibold py-3 px-8 rounded-lg hover:bg-green-50 transition-colors"
            >
              Đăng Ký Email Khác
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
                <Mail className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Đăng Ký Nhận Tin
                </h2>
                <p className="text-xl text-blue-100">
                  Cập nhật thông tin du lịch mới nhất
                </p>
              </div>
            </div>

            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Hãy để chúng tôi gửi đến bạn những thông tin về các tour du lịch mới, 
              ưu đãi đặc biệt và những tips du lịch hữu ích từ các chuyên gia.
            </p>

            {/* Benefits */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                  <span className="text-blue-100">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Đăng Ký Miễn Phí
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ email của bạn
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Đăng Ký Ngay</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-4">
              Chúng tôi cam kết bảo mật thông tin và không spam. 
              Bạn có thể hủy đăng ký bất cứ lúc nào.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;