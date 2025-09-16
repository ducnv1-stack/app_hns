import React from 'react';
import { Shield, Award, Users, Clock, MapPin, Headphones, Star, ThumbsUp } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: 'Đảm Bảo An Toàn',
      description: 'Bảo hiểm du lịch toàn diện, hướng dẫn viên chuyên nghiệp và các biện pháp an toàn nghiêm ngặt.',
      stats: '100% An toàn'
    },
    {
      icon: Award,
      title: 'Chất Lượng Đẳng Cấp',
      description: 'Được chứng nhận bởi các tổ chức du lịch uy tín, cam kết chất lượng dịch vụ 5 sao.',
      stats: '15+ Giải thưởng'
    },
    {
      icon: Users,
      title: 'Đội Ngũ Chuyên Nghiệp',
      description: 'Hướng dẫn viên giàu kinh nghiệm, am hiểu văn hóa địa phương và thành thạo ngoại ngữ.',
      stats: '200+ HDV'
    },
    {
      icon: Clock,
      title: 'Hỗ Trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.',
      stats: '24/7 Hỗ trợ'
    },
    {
      icon: MapPin,
      title: 'Điểm Đến Đa Dạng',
      description: 'Hơn 100 điểm đến trong và ngoài nước với các tour được thiết kế độc đáo.',
      stats: '100+ Điểm đến'
    },
    {
      icon: ThumbsUp,
      title: 'Khách Hàng Hài Lòng',
      description: 'Tỷ lệ khách hàng hài lòng cao, nhiều đánh giá tích cực và giới thiệu bạn bè.',
      stats: '98% Hài lòng'
    }
  ];

  const achievements = [
    {
      number: '50,000+',
      label: 'Khách hàng đã phục vụ',
      icon: Users
    },
    {
      number: '15+',
      label: 'Năm kinh nghiệm',
      icon: Award
    },
    {
      number: '100+',
      label: 'Điểm đến',
      icon: MapPin
    },
    {
      number: '4.9/5',
      label: 'Đánh giá trung bình',
      icon: Star
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tại Sao Chọn Hà Nội Sun Travel?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến những trải nghiệm du lịch tuyệt vời nhất với dịch vụ chuyên nghiệp và tận tâm
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
              >
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-primary-100 rounded-2xl group-hover:bg-primary-600 transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-primary-600">{feature.stats}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Thành Tựu Của Chúng Tôi</h3>
            <p className="text-xl text-blue-100">
              Những con số ấn tượng khẳng định chất lượng dịch vụ
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-blue-100 font-medium">
                    {achievement.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Sẵn Sàng Khám Phá Cùng Chúng Tôi?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Hãy để Hà Nội Sun Travel đồng hành cùng bạn trong những chuyến du lịch đáng nhớ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Khám Phá Tours
            </button>
            <button className="btn-secondary">
              Liên Hệ Tư Vấn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;