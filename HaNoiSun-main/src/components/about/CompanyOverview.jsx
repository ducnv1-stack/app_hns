import React from 'react';
import { Building2, Calendar, MapPin, Users, Award, Globe } from 'lucide-react';

const CompanyOverview = () => {
  const companyInfo = [
    {
      icon: Building2,
      title: 'Tên Công Ty',
      content: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ TRUYỀN THÔNG DU LỊCH MẶT TRỜI HÀ NỘI',
      subtitle: 'HANOI SUN TRAVEL MEDIA SERVICES AND TRADE JOINT STOCK COMPANY'
    },
    {
      icon: Calendar,
      title: 'Thành Lập',
      content: '08/11/2012',
      subtitle: 'Hơn 12 năm kinh nghiệm trong ngành du lịch'
    },
    {
      icon: MapPin,
      title: 'Trụ Sở Chính',
      content: 'Km2 – Cao Tốc Nội Bài – Điền Xá – Quang Tiến - Sóc Sơn - Hà Nội',
      subtitle: 'Vị trí thuận lợi, dễ dàng tiếp cận'
    },
    {
      icon: Users,
      title: 'Vốn Pháp Định',
      content: '20.000.000.000 VNĐ',
      subtitle: 'Đảm bảo tài chính vững mạnh'
    },
    {
      icon: Award,
      title: 'Giấy Phép',
      content: 'Số 0107128299',
      subtitle: 'Cấp bởi Sở KH & ĐT Hà Nội ngày 20/11/2015'
    },
    {
      icon: Globe,
      title: 'Mã Số Thuế',
      content: '0107128299',
      subtitle: 'Hoạt động kinh doanh hợp pháp'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Thông Tin Công Ty
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Được thành lập từ năm 2012, Hà Nội Sun Travel đã không ngừng phát triển và khẳng định 
            vị thế trong ngành du lịch Việt Nam
          </p>
        </div>

        {/* Company Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {companyInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
              >
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-primary-100 rounded-2xl group-hover:bg-primary-600 transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {info.title}
                </h3>
                
                <p className="text-gray-900 font-semibold mb-2 leading-relaxed">
                  {info.content}
                </p>
                
                <p className="text-gray-600 text-sm">
                  {info.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Company Description */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Tên Giao Dịch: HANOI SUN TRAVEL
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Công ty Cổ phần Thương Mại và Dịch vụ Du lịch Mặt Trời Hà Nội được thành lập ngày 08/11/2012 
              theo giấy phép kinh doanh số 0106031209 cấp tại thành phố Hà Nội. Cuối năm 2015, Công ty đã 
              điều chỉnh thay đổi một số thông tin trên giấy phép kinh doanh để phù hợp với tình hình kinh doanh 
              hiện tại, và đã lấy tên là Công ty Cổ phần Thương Mại và Dịch vụ Truyền Thông Du lịch Mặt Trời 
              Hà Nội theo giấy phép kinh doanh số 0107128299 ngày 20/11/2015 do Sở KH & ĐT Hà Nội cấp.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h4 className="font-semibold text-gray-900 mb-3">Thông Tin Liên Hệ</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Điện thoại:</strong> 04.666.34455 hoặc 0986.414.175</p>
                  <p><strong>Email:</strong> info@hanoisuntravel.com</p>
                  <p><strong>Website:</strong> https://hanoisuntravel.com/</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h4 className="font-semibold text-gray-900 mb-3">Thông Tin Tài Chính</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Vốn pháp định:</strong> 20.000.000.000 VNĐ</p>
                  <p><strong>Vốn đầu tư:</strong> 20.000.000.000 VNĐ</p>
                  <p><strong>Mã số thuế:</strong> 0107128299</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;