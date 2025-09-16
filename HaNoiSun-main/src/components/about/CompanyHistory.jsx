import React from 'react';
import { Calendar, Award, TrendingUp, Users } from 'lucide-react';

const CompanyHistory = () => {
  const milestones = [
    {
      year: '2012',
      title: 'Thành Lập Công Ty',
      description: 'Công ty được thành lập ngày 08/11/2012 với giấy phép kinh doanh số 0106031209',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      year: '2013-2014',
      title: 'Phát Triển Đầu Tiên',
      description: 'Mở rộng dịch vụ và xây dựng đội ngũ chuyên nghiệp đầu tiên',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      year: '2015',
      title: 'Tái Cấu Trúc',
      description: 'Điều chỉnh giấy phép kinh doanh số 0107128299 và đổi tên thành Công ty Truyền Thông Du lịch',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      year: '2016-2018',
      title: 'Mở Rộng Mạng Lưới',
      description: 'Thành lập các văn phòng chi nhánh tại các tỉnh thành lớn',
      icon: Award,
      color: 'bg-orange-500'
    },
    {
      year: '2019-2021',
      title: 'Chuyển Đổi Số',
      description: 'Đầu tư công nghệ, phát triển nền tảng đặt tour trực tuyến',
      icon: TrendingUp,
      color: 'bg-indigo-500'
    },
    {
      year: '2022-2024',
      title: 'Phát Triển Bền Vững',
      description: 'Mở rộng ra 9 văn phòng toàn quốc, phục vụ hơn 50,000 khách hàng',
      icon: Award,
      color: 'bg-red-500'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Lịch Sử Phát Triển
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hành trình 12 năm xây dựng và phát triển, từ một công ty khởi nghiệp 
            đến thương hiệu du lịch uy tín hàng đầu Việt Nam
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300 hidden lg:block" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-primary-600 rounded-full z-10 hidden lg:block" />

                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    isEven ? '' : 'lg:grid-flow-col-dense'
                  }`}>
                    {/* Content */}
                    <div className={`${isEven ? 'lg:text-right lg:pr-12' : 'lg:pl-12'}`}>
                      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
                        <div className={`flex items-center space-x-4 mb-4 ${
                          isEven ? 'lg:justify-end' : ''
                        }`}>
                          <div className={`p-3 ${milestone.color} rounded-full`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-3xl font-bold text-primary-600">
                            {milestone.year}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {milestone.title}
                        </h3>
                        
                        <p className="text-gray-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="relative">
                        <div className={`w-full h-64 ${milestone.color} rounded-2xl opacity-10`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`p-8 ${milestone.color} rounded-full`}>
                            <IconComponent className="h-16 w-16 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Future Vision */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">Tầm Nhìn Tương Lai</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
            Đến năm 2030, Hà Nội Sun Travel sẽ trở thành công ty du lịch hàng đầu Đông Nam Á, 
            mang đến những trải nghiệm du lịch đẳng cấp thế giới cho khách hàng Việt Nam
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2030</div>
              <div className="text-blue-100">Mục tiêu dài hạn</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100,000+</div>
              <div className="text-blue-100">Khách hàng/năm</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">20</div>
              <div className="text-blue-100">Văn phòng toàn cầu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyHistory;