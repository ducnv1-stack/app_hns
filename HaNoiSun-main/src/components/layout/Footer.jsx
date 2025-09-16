import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
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

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Hà Nội Sun Travel. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;