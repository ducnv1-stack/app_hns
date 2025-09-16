import React, { useState } from 'react';
import { MapPin, Phone, Mail, Building, Users, Clock } from 'lucide-react';

const OfficeNetwork = () => {
  const [selectedOffice, setSelectedOffice] = useState(0);

  const offices = [
    {
      name: 'Trụ Sở Kinh Doanh',
      type: 'headquarters',
      address: 'Km2 – Cao Tốc Nội Bài – Điền Xá – Quang Tiến - Sóc Sơn - Hà Nội',
      phone: '04.666.34455',
      email: 'info@hanoisuntravel.com',
      description: 'Trụ sở chính với đầy đủ các phòng ban và cơ sở vật chất hiện đại',
      services: ['Tư vấn tour', 'Đặt vé máy bay', 'Visa & Hộ chiếu', 'Dịch vụ khách sạn'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Văn Phòng Cầu Giấy',
      type: 'branch',
      address: '276 Đường Láng - Phường Ngã Tư Sở - Quận Đống Đa - Hà Nội',
      phone: '04.666.34455',
      email: 'caugiay@hanoisuntravel.com',
      description: 'Văn phòng trung tâm Hà Nội, thuận tiện cho khách hàng nội thành',
      services: ['Tư vấn tour', 'Đặt tour nhanh', 'Hỗ trợ khách hàng'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Văn Phòng Hà Đông',
      type: 'branch',
      address: 'V5-B08 phố Nguyễn Thanh Bình, KĐT The Terra An Hưng, P.La Khê, Q.Hà Đông, TP.Hà Nội',
      phone: '0986.414.175',
      email: 'hadong@hanoisuntravel.com',
      description: 'Phục vụ khách hàng khu vực phía Tây Hà Nội',
      services: ['Tư vấn tour', 'Đặt tour gia đình', 'Tour nội địa'],
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Văn Phòng Vĩnh Phúc',
      type: 'representative',
      address: 'Số 469 Đường Mê Linh, Phường Khai Quang, Thành Phố Vĩnh Yên, Tỉnh Vĩnh Phúc',
      phone: '0986.414.175',
      email: 'vinhphuc@hanoisuntravel.com',
      description: 'Văn phòng đại diện khu vực Vĩnh Phúc và các tỉnh lân cận',
      services: ['Tư vấn tour', 'Tour địa phương', 'Dịch vụ vận chuyển'],
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Văn Phòng Thái Nguyên',
      type: 'branch',
      address: 'Số nhà 499, Tổ 1, Phường Ba Hàng, Thị xã Phổ Yên, Thái Nguyên',
      phone: '0986.414.175',
      email: 'thainguyen@hanoisuntravel.com',
      description: 'Phục vụ khách hàng khu vực Thái Nguyên và miền núi phía Bắc',
      services: ['Tour miền núi', 'Eco-tourism', 'Tour văn hóa dân tộc'],
      image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Văn Phòng Phú Thọ',
      type: 'branch',
      address: 'Tổ 25 - Cao Đại - Minh Phương - Việt Trì - Phú Thọ',
      phone: '0986.414.175',
      email: 'phutho@hanoisuntravel.com',
      description: 'Trung tâm phục vụ khu vực Phú Thọ - vùng đất Tổ',
      services: ['Tour lịch sử', 'Tour tâm linh', 'Tour sinh thái'],
      image: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Văn Phòng TP. Hồ Chí Minh',
      type: 'regional',
      address: 'Tầng 7 - Số 37 - Hoàng Diệu - Phường 12 - Quận 4 - TP. Hồ Chí Minh',
      phone: '0986.414.175',
      email: 'hcm@hanoisuntravel.com',
      description: 'Trung tâm điều phối khu vực miền Nam',
      services: ['Tour miền Nam', 'Tour quốc tế', 'Dịch vụ cao cấp', 'MICE Tourism'],
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Văn Phòng Miền Trung',
      type: 'regional',
      address: '216 Nguyễn Tri Phương - Thanh Khê - Đà Nẵng',
      phone: '0986.414.175',
      email: 'danang@hanoisuntravel.com',
      description: 'Trung tâm phục vụ khu vực miền Trung và Tây Nguyên',
      services: ['Tour miền Trung', 'Tour biển đảo', 'Tour di sản', 'Adventure tours'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Văn Phòng Sóc Sơn',
      type: 'branch',
      address: 'Đường Cảnh Sát - xã Tiên Dược - huyện Sóc Sơn - TP. Hà Nội',
      phone: '0986.414.175',
      email: 'socson@hanoisuntravel.com',
      description: 'Văn phòng hỗ trợ khu vực ngoại thành Hà Nội',
      services: ['Tour ngoại thành', 'Tour sinh thái', 'Team building'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const getOfficeTypeInfo = (type) => {
    const types = {
      headquarters: { label: 'Trụ Sở Chính', color: 'bg-red-100 text-red-800', icon: '🏢' },
      regional: { label: 'Văn Phòng Vùng', color: 'bg-blue-100 text-blue-800', icon: '🌆' },
      branch: { label: 'Chi Nhánh', color: 'bg-green-100 text-green-800', icon: '🏪' },
      representative: { label: 'Văn Phòng Đại Diện', color: 'bg-purple-100 text-purple-800', icon: '🏛️' }
    };
    return types[type] || types.branch;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hệ Thống Văn Phòng
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Với mạng lưới 9 văn phòng trên toàn quốc, chúng tôi luôn sẵn sàng phục vụ 
            khách hàng mọi lúc, mọi nơi
          </p>
        </div>

        {/* Office Network Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl">
            <div className="text-3xl font-bold text-primary-600 mb-2">9</div>
            <div className="text-gray-600">Văn Phòng</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <div className="text-3xl font-bold text-green-600 mb-2">3</div>
            <div className="text-gray-600">Miền</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Hỗ Trợ</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
            <div className="text-gray-600">Nhân Viên</div>
          </div>
        </div>

        {/* Office List and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Office List */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Danh Sách Văn Phòng</h3>
            <div className="space-y-3">
              {offices.map((office, index) => {
                const typeInfo = getOfficeTypeInfo(office.type);
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedOffice(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedOffice === index
                        ? 'bg-primary-50 border-2 border-primary-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{office.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${typeInfo.color}`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{office.address}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Office Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-64">
                <img
                  src={offices[selectedOffice].image}
                  alt={offices[selectedOffice].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getOfficeTypeInfo(offices[selectedOffice].type).icon}</span>
                    <h3 className="text-2xl font-bold">{offices[selectedOffice].name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getOfficeTypeInfo(offices[selectedOffice].type).color} bg-white`}>
                    {getOfficeTypeInfo(offices[selectedOffice].type).label}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {offices[selectedOffice].description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                      Địa Chỉ
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {offices[selectedOffice].address}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-primary-600" />
                      Liên Hệ
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Điện thoại:</strong> {offices[selectedOffice].phone}</p>
                      <p><strong>Email:</strong> {offices[selectedOffice].email}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary-600" />
                    Dịch Vụ Chính
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {offices[selectedOffice].services.map((service, idx) => (
                      <span
                        key={idx}
                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                    <Phone className="h-4 w-4" />
                    <span>Gọi Ngay</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>Gửi Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Bất kể bạn ở đâu, chúng tôi luôn có văn phòng gần nhất để phục vụ bạn tốt nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '#/contact'}
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Tìm Văn Phòng Gần Nhất
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
              Hotline: 04.666.34455
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfficeNetwork;