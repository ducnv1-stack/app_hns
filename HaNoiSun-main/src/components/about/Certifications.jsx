import React from 'react';
import { Award, Shield, Star, CheckCircle, Globe, Users } from 'lucide-react';

const Certifications = () => {
  const certifications = [
    {
      icon: Award,
      title: 'Giấy Phép Kinh Doanh Lữ Hành',
      number: '0107128299',
      issuer: 'Sở KH & ĐT Hà Nội',
      date: '20/11/2015',
      description: 'Giấy phép kinh doanh dịch vụ lữ hành quốc tế và nội địa',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Chứng Nhận ISO 9001:2015',
      number: 'ISO-2023-HST',
      issuer: 'Tổ chức Tiêu chuẩn Quốc tế',
      date: '2023',
      description: 'Hệ thống quản lý chất lượng dịch vụ du lịch',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Star,
      title: 'Thành Viên VITA',
      number: 'VITA-2020-001',
      issuer: 'Hiệp hội Du lịch Việt Nam',
      date: '2020',
      description: 'Thành viên chính thức Hiệp hội Du lịch Việt Nam',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Globe,
      title: 'Chứng Nhận IATA',
      number: 'IATA-HST-2021',
      issuer: 'Hiệp hội Vận tải Hàng không Quốc tế',
      date: '2021',
      description: 'Đại lý bán vé máy bay quốc tế được ủy quyền',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: CheckCircle,
      title: 'Chứng Nhận An Toàn Du Lịch',
      number: 'SAFE-2023-HST',
      issuer: 'Bộ Văn hóa, Thể thao và Du lịch',
      date: '2023',
      description: 'Đáp ứng tiêu chuẩn an toàn trong hoạt động du lịch',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Users,
      title: 'Giải Thưởng Dịch Vụ Xuất Sắc',
      number: 'AWARD-2023',
      issuer: 'Tổng cục Du lịch Việt Nam',
      date: '2023',
      description: 'Công nhận chất lượng dịch vụ du lịch xuất sắc',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const partnerships = [
    {
      name: 'Vietnam Airlines',
      logo: '✈️',
      description: 'Đối tác chiến lược về vận chuyển hàng không'
    },
    {
      name: 'Saigon Tourist',
      logo: '🏨',
      description: 'Hợp tác trong dịch vụ khách sạn và resort'
    },
    {
      name: 'Agoda',
      logo: '🌐',
      description: 'Đối tác đặt phòng trực tuyến toàn cầu'
    },
    {
      name: 'Booking.com',
      logo: '📱',
      description: 'Nền tảng đặt phòng quốc tế hàng đầu'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Chứng Nhận & Giải Thưởng
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Được công nhận bởi các tổ chức uy tín trong và ngoài nước, 
            khẳng định chất lượng dịch vụ và uy tín thương hiệu
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {certifications.map((cert, index) => {
            const IconComponent = cert.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div className={`${cert.bgColor} p-6 text-center`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${cert.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {cert.title}
                  </h3>
                  <div className="text-sm font-medium text-gray-600">
                    Số: {cert.number}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cấp bởi:</span>
                      <span className="font-medium text-gray-900">{cert.issuer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ngày cấp:</span>
                      <span className="font-medium text-gray-900">{cert.date}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className={`h-1 bg-gradient-to-r ${cert.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </div>
            );
          })}
        </div>

        {/* Partnerships Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Đối Tác Chiến Lược
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hợp tác với các thương hiệu uy tín hàng đầu để mang đến 
              dịch vụ tốt nhất cho khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerships.map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{partner.logo}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{partner.name}</h4>
                <p className="text-gray-600 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">Cam Kết Chất Lượng</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
            Với đầy đủ giấy phép và chứng nhận từ các cơ quan có thẩm quyền, 
            chúng tôi cam kết mang đến dịch vụ du lịch an toàn, chất lượng và uy tín
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Hợp pháp</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">6+</div>
              <div className="text-blue-100">Chứng nhận</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Đối tác lớn</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Hỗ trợ</div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => window.location.href = '#/contact'}
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Liên Hệ Ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;