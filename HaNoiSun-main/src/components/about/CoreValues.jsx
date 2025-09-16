import React from 'react';
import { Heart, Shield, Users, Zap, Globe, Award } from 'lucide-react';

const CoreValues = () => {
  const values = [
    {
      icon: Heart,
      title: 'Tận Tâm Phục Vụ',
      description: 'Chúng tôi luôn đặt khách hàng làm trung tâm, lắng nghe và thấu hiểu nhu cầu để mang đến trải nghiệm tốt nhất.',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      icon: Shield,
      title: 'Uy Tín & Chất Lượng',
      description: 'Cam kết cung cấp dịch vụ chất lượng cao với giá cả hợp lý, đảm bảo quyền lợi và sự an toàn cho khách hàng.',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Đội Ngũ Chuyên Nghiệp',
      description: 'Đầu tư vào con người, xây dựng đội ngũ nhân viên có trình độ cao, nhiệt tình và giàu kinh nghiệm.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Đổi Mới Sáng Tạo',
      description: 'Không ngừng cải tiến, ứng dụng công nghệ hiện đại để nâng cao chất lượng dịch vụ và trải nghiệm khách hàng.',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      icon: Globe,
      title: 'Tầm Nhìn Toàn Cầu',
      description: 'Mở rộng tầm nhìn, kết nối với thế giới để mang đến những điểm đến và trải nghiệm đa dạng, phong phú.',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Trách Nhiệm Xã Hội',
      description: 'Góp phần phát triển du lịch bền vững, bảo vệ môi trường và văn hóa địa phương nơi chúng tôi đến.',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Giá Trị Cốt Lõi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những giá trị định hướng mọi hoạt động của chúng tôi, 
            tạo nên nền tảng vững chắc cho sự phát triển bền vững
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Header with Icon */}
                <div className={`${value.bgColor} p-8 text-center`}>
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${value.textColor} group-hover:text-gray-900 transition-colors`}>
                    {value.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className={`h-1 bg-gradient-to-r ${value.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Sứ Mệnh</h3>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed text-center">
              "Mang đến những trải nghiệm du lịch tuyệt vời, an toàn và đáng nhớ cho mọi khách hàng. 
              Chúng tôi cam kết kết nối con người với thế giới thông qua những chuyến đi ý nghĩa, 
              góp phần làm phong phú thêm cuộc sống và mở rộng tầm nhìn của mỗi người."
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Tầm Nhìn</h3>
            </div>
            <p className="text-green-100 text-lg leading-relaxed text-center">
              "Trở thành công ty du lịch hàng đầu Đông Nam Á, được khách hàng tin tưởng và lựa chọn 
              bởi chất lượng dịch vụ xuất sắc, sự đổi mới không ngừng và trách nhiệm với cộng đồng. 
              Chúng tôi hướng tới việc tạo ra những giá trị bền vững cho xã hội."
            </p>
          </div>
        </div>

        {/* Company Culture */}
        <div className="mt-16 bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Văn Hóa Doanh Nghiệp
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Môi trường làm việc tích cực, sáng tạo và đoàn kết
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Đoàn Kết</h4>
              <p className="text-gray-600 text-sm">Cùng nhau vượt qua thử thách</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sáng Tạo</h4>
              <p className="text-gray-600 text-sm">Luôn tìm kiếm giải pháp mới</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Xuất Sắc</h4>
              <p className="text-gray-600 text-sm">Phấn đấu vì chất lượng tốt nhất</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Tận Tâm</h4>
              <p className="text-gray-600 text-sm">Đặt khách hàng lên hàng đầu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;