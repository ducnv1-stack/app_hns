import React from 'react';
import { Clock, Gift, Percent, ArrowRight } from 'lucide-react';

const PromotionSection = () => {
  const promotions = [
    {
      id: 1,
      title: 'Flash Sale 48H',
      subtitle: 'Giảm đến 30% cho tất cả tours',
      description: 'Áp dụng cho booking từ hôm nay đến hết 31/12/2024',
      discount: '30%',
      timeLeft: '1 ngày 14 giờ',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-red-500 to-pink-600',
      icon: Clock
    },
    {
      id: 2,
      title: 'Ưu Đại Nhóm',
      subtitle: 'Đặt từ 6 người trở lên',
      description: 'Giảm 15% + Tặng bữa tối cao cấp cho toàn đoàn',
      discount: '15%',
      bonus: 'Tặng bữa tối',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-blue-500 to-cyan-600',
      icon: Gift
    },
    {
      id: 3,
      title: 'Khách Hàng Thân Thiết',
      subtitle: 'Ưu đãi đặc biệt',
      description: 'Tích điểm đổi quà + Giảm giá tours tiếp theo',
      discount: '20%',
      bonus: 'Tích điểm x2',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-purple-500 to-indigo-600',
      icon: Percent
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ưu Đãi Đặc Biệt
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Đừng bỏ lỡ những chương trình khuyến mãi hấp dẫn dành riêng cho bạn
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => {
            const IconComponent = promo.icon;
            return (
              <div
                key={promo.id}
                className={`relative overflow-hidden rounded-2xl shadow-2xl card-hover ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${promo.bgColor} opacity-85`} />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 text-white h-full flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{promo.title}</h3>
                        <p className="text-lg opacity-90">{promo.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-white/90 mb-6 leading-relaxed">
                      {promo.description}
                    </p>

                    {/* Discount Badge */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                        <span className="text-3xl font-bold">{promo.discount}</span>
                        <span className="text-lg ml-1">OFF</span>
                      </div>
                      {promo.bonus && (
                        <div className="bg-yellow-400/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                          <span className="text-sm font-medium">{promo.bonus}</span>
                        </div>
                      )}
                    </div>

                    {/* Time Left (for flash sale) */}
                    {promo.timeLeft && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">Thời gian còn lại:</span>
                        </div>
                        <div className="text-2xl font-bold">{promo.timeLeft}</div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className="bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 group">
                    <span>Khám Phá Ngay</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Đăng Ký Nhận Ưu Đãi
          </h3>
          <p className="text-gray-600 mb-6">
            Nhận thông tin về các chương trình khuyến mãi mới nhất qua email
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <button className="btn-primary whitespace-nowrap">
              Đăng Ký
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;