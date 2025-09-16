import React from 'react';
import { Crown, Briefcase, Mail, Phone } from 'lucide-react';

const Leadership = () => {
  const leaders = [
    {
      name: 'Bà Vũ Thị Thảo Phương',
      position: 'Chủ tịch HĐQT',
      icon: Crown,
      description: 'Với tầm nhìn chiến lược và kinh nghiệm dày dặn trong ngành du lịch, bà Phương đã dẫn dắt công ty phát triển bền vững qua nhiều năm.',
      achievements: [
        'Hơn 15 năm kinh nghiệm trong ngành du lịch',
        'Dẫn dắt công ty qua các giai đoạn phát triển',
        'Xây dựng mạng lưới đối tác quốc tế rộng khắp'
      ],
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Ông Nguyễn Văn Dũng',
      position: 'Giám đốc',
      icon: Briefcase,
      description: 'Ông Dũng chịu trách nhiệm điều hành hoạt động kinh doanh hàng ngày và phát triển các sản phẩm du lịch chất lượng cao.',
      achievements: [
        'Chuyên gia về phát triển sản phẩm du lịch',
        'Quản lý vận hành hiệu quả',
        'Xây dựng đội ngũ chuyên nghiệp'
      ],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ban Lãnh Đạo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Đội ngũ lãnh đạo giàu kinh nghiệm, tận tâm và có tầm nhìn xa, 
            luôn đặt khách hàng làm trung tâm trong mọi quyết định
          </p>
        </div>

        {/* Leadership Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {leaders.map((leader, index) => {
            const IconComponent = leader.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-3 bg-primary-600 rounded-full">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{leader.name}</h3>
                        <p className="text-blue-200 font-medium">{leader.position}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {leader.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Thành tựu nổi bật:</h4>
                    <ul className="space-y-2">
                      {leader.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200 transition-colors">
                      <Mail className="h-4 w-4" />
                      <span>Liên hệ</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <Phone className="h-4 w-4" />
                      <span>Gọi điện</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leadership Philosophy */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">Triết Lý Lãnh Đạo</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
            "Chúng tôi tin rằng thành công của công ty đến từ sự hài lòng của khách hàng và sự phát triển 
            của đội ngũ nhân viên. Mỗi chuyến đi không chỉ là một sản phẩm mà còn là những kỷ niệm đáng nhớ 
            mà chúng tôi tạo ra cho khách hàng."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12+</div>
              <div className="text-blue-100">Năm kinh nghiệm</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Khách hàng tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">9</div>
              <div className="text-blue-100">Văn phòng toàn quốc</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;