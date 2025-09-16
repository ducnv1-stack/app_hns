import React from 'react';
import { Users, MapPin, Award, TrendingUp, Clock, Star, Globe, Shield } from 'lucide-react';

const CompanyStats = () => {
  const stats = [
    {
      icon: Users,
      number: '50,000+',
      label: 'Khách Hàng Đã Phục Vụ',
      description: 'Tin tưởng và lựa chọn dịch vụ của chúng tôi',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      number: '9',
      label: 'Văn Phòng Toàn Quốc',
      description: 'Phủ sóng từ Bắc đến Nam',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Award,
      number: '12+',
      label: 'Năm Kinh Nghiệm',
      description: 'Trong lĩnh vực du lịch và dịch vụ',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: TrendingUp,
      number: '98%',
      label: 'Khách Hàng Hài Lòng',
      description: 'Đánh giá tích cực về chất lượng dịch vụ',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Clock,
      number: '24/7',
      label: 'Hỗ Trợ Khách Hàng',
      description: 'Luôn sẵn sàng phục vụ mọi lúc',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Star,
      number: '4.9/5',
      label: 'Đánh Giá Trung Bình',
      description: 'Từ các nền tảng đánh giá uy tín',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Globe,
      number: '100+',
      label: 'Điểm Đến',
      description: 'Trong và ngoài nước',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Shield,
      number: '100%',
      label: 'Bảo Hiểm Du Lịch',
      description: 'Đảm bảo an toàn cho mọi chuyến đi',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Thành Tựu Nổi Bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những con số ấn tượng khẳng định vị thế và chất lượng dịch vụ 
            của Hà Nội Sun Travel trong suốt hành trình phát triển
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>

                {/* Number */}
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {stat.number}
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.description}
                </p>

                {/* Hover Effect Border */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </div>
            );
          })}
        </div>

        {/* Additional Achievements */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Chứng Nhận & Giải Thưởng
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Được công nhận bởi các tổ chức uy tín trong và ngoài nước
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Top 10 Công Ty Du Lịch</h4>
              <p className="text-gray-600 text-sm">Được bình chọn bởi Hiệp hội Du lịch Việt Nam</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Chứng Nhận ISO 9001</h4>
              <p className="text-gray-600 text-sm">Hệ thống quản lý chất lượng quốc tế</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Thương Hiệu Tin Cậy</h4>
              <p className="text-gray-600 text-sm">Giải thưởng Thương hiệu Việt Nam uy tín</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Trở Thành Một Phần Của Thành Công
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Hãy để chúng tôi đồng hành cùng bạn trong những chuyến du lịch đáng nhớ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '#/tours'}
              className="btn-primary"
            >
              Khám Phá Tours
            </button>
            <button 
              onClick={() => window.location.href = '#/contact'}
              className="btn-secondary"
            >
              Liên Hệ Tư Vấn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStats;