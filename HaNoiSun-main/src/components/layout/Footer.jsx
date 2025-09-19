import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Copy } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const pathname = location.pathname || '/';
  const showOffices = (
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/tours' ||
    pathname.startsWith('/tours/country/') ||
    pathname.startsWith('/tours/') ||
    pathname.startsWith('/booking/')
  );
  const handleCopy = (text) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {
      // no-op
    }
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://hanoisuntravel.com/upload/Image/Logo/logo-hanoisun-mobile.png"
                alt="Hanoi Sun Travel Logo"
                className="w-10 h-10 rounded-lg object-contain"
                loading="lazy"
              />
              <div>
                <h3 className="text-lg font-bold">Hà Nội Sun Travel</h3>
                <p className="text-sm text-gray-400">Khám phá thế giới cùng chúng tôi</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Chúng tôi cam kết mang đến những trải nghiệm du lịch tuyệt vời nhất 
              với dịch vụ chuyên nghiệp và giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-gray-400 hover:text-white transition-colors">
                  Tours Du Lịch
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Dịch Vụ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Tour Trong Nước</li>
              <li>Tour Quốc Tế</li>
              <li>Đặt Vé Máy Bay</li>
              <li>Đặt Khách Sạn</li>
              <li>Thuê Xe Du Lịch</li>
              <li>Visa & Hộ Chiếu</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Thông Tin Liên Hệ</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-400 text-sm">
                  Km số 2 - Cao tốc Nội Bài - Điền Xá - Quang Tiến - Sóc Sơn - Hà Nội
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400" />
                <p className="text-gray-400">Homephone: (024) 6663.44.55 | Hotline: 0945 53 2939</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <p className="text-gray-400">cskh@hanoisuntravel.com - dungnv@hanoisuntravel.com</p>
              </div>
            </div>
          </div>
        </div>

        {showOffices && (
          <div className="mt-10 ">
            <h4 className="text-xl font-semibold mb-4">Các Văn Phòng Đại Diện</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Miền Bắc */}
              <div>
                <div className="text-lg font-semibold mb-3">Miền Bắc</div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-white">VP Hà Nội</div>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-primary-400 mr-2" />
                      <span className="text-gray-400">0982.461.485</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('0982.461.485')}
                        className="ml-1 inline-flex items-center p-1 text-[10px] rounded text-gray-400 hover:text-white"
                        title="Sao chép"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 text-primary-400 mr-2 mt-0.5" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('276 Đường Láng - Phường Thịnh Quang - Hà Nội')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        276 Đường Láng - Phường Thịnh Quang - Hà Nội
                      </a>
                    </div>
                  </div>
                  <div>
                  <div className="mt-6">
                    <div className="font-medium text-white">VP Bắc Ninh</div>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-primary-400 mr-2" />
                      <span className="text-gray-400">0945.532.939</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('0945.532.939')}
                        className="ml-1 inline-flex items-center p-1 text-[10px] rounded text-gray-400 hover:text-white"
                        title="Sao chép"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 text-primary-400 mr-2 mt-0.5" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Thôn Lò - Phường Đa Mai - Bắc Ninh')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        Thôn Lò - Phường Đa Mai - Bắc Ninh
                      </a>
                    </div>
                  </div>
                  </div>
                  <div>
                  <div className="mt-6">
                    <div className="font-medium text-white">VP Phú Thọ</div>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-primary-400 mr-2" />
                      <span className="text-gray-400">0986.686.809</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('0986.686.809')}
                        className="ml-1 inline-flex items-center p-1 text-[10px] rounded text-gray-400 hover:text-white"
                        title="Sao chép"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 text-primary-400 mr-2 mt-0.5" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Tầng 3, tòa nhà Mobifone, số 414 đường Mê Linh, phường Khai Quang, Phú Thọ')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        Tầng 3, tòa nhà Mobifone, số 414 đường Mê Linh, phường Khai Quang, Phú Thọ
                      </a>
                    </div>
                  </div>
                  </div>
                  <div>
                  <div className="mt-6">
                    <div className="font-medium text-white">VP Thái Nguyên</div>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 text-primary-400 mr-2 mt-0.5" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Số nhà 499, tổ 1, phường Phổ Yên, tỉnh Thái Nguyên')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        Số nhà 499, tổ 1, phường Phổ Yên, tỉnh Thái Nguyên
                      </a>
                    </div>
                  </div>
                  </div>
                </div>
              </div>

              {/* Miền Trung */}
              <div>
                <div className="text-lg font-semibold mb-3">Miền Trung</div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-white">VP Miền Trung (Đà Nẵng)</div>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-primary-400 mr-2" />
                      <span className="text-gray-400">0935.527.246</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('0935.527.246')}
                        className="ml-1 inline-flex items-center p-1 text-[10px] rounded text-gray-400 hover:text-white"
                        title="Sao chép"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 text-primary-400 mr-2 mt-0.5" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('216 Nguyễn Tri Phương, phường Thanh Khê, TP Đà Nẵng')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        216 Nguyễn Tri Phương, phường Thanh Khê, TP Đà Nẵng
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Miền Nam */}
              <div>
                <div className="text-lg font-semibold mb-3">Miền Nam</div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-white">VP Miền Nam (TP.HCM)</div>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-primary-400 mr-2" />
                      <span className="text-gray-400">0945.532.3939</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('0945.532.3939')}
                        className="ml-1 inline-flex items-center p-1 text-[10px] rounded text-gray-400 hover:text-white"
                        title="Sao chép"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 text-primary-400 mr-2 mt-0.5" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('7-9 Nguyễn Bỉnh Khiêm, phường Sài Gòn, TP Hồ Chí Minh')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        7-9 Nguyễn Bỉnh Khiêm, phường Sài Gòn, TP Hồ Chí Minh
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Hà Nội Sun Travel. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;