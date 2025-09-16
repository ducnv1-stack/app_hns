import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Phone, Mail, ChevronDown } from 'lucide-react';
import MegaDropdown from './MegaDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaDropdownOpen, setIsMegaDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Trang Chủ', href: '/' },
    { name: 'Tours', href: '/tours', hasMegaMenu: true },
    { name: 'Về Chúng Tôi', href: '/about' },
    { name: 'Liên Hệ', href: '/contact' },
  ];

  const handleToursHover = () => {
    setIsMegaDropdownOpen(true);
  };

  const handleToursLeave = () => {
    setIsMegaDropdownOpen(false);
  };

  const closeMegaDropdown = () => {
    setIsMegaDropdownOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-800 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Hotline: 1900 1234</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@hanoisuntravel.com</span>
              </div>
            </div>
            <div className="text-sm">
              Chào mừng đến với Hà Nội Sun Travel
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://hanoisuntravel.com/upload/Image/Logo/logo-hanoisun-mobile.png"
                alt="Hanoi Sun Travel Logo"
                className="w-12 h-12 rounded-lg object-contain"
                loading="lazy"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hà Nội Sun Travel</h1>
                <p className="text-sm text-gray-600">Khám phá thế giới cùng chúng tôi</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={item.hasMegaMenu ? handleToursHover : undefined}
                  onMouseLeave={item.hasMegaMenu ? handleToursLeave : undefined}
                >
                  <Link
                    to={item.href}
                    className={`font-medium transition-colors duration-200 flex items-center space-x-1 ${
                      location.pathname === item.href
                        ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasMegaMenu && (
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        isMegaDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>
                  
                  {/* Mega Dropdown */}
                  {item.hasMegaMenu && (
                    <MegaDropdown 
                      isOpen={isMegaDropdownOpen} 
                      onClose={closeMegaDropdown}
                    />
                  )}
                </div>
              ))}
            </nav>

            {/* Search & CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <Link to="/tours" className="btn-primary">
                Đặt Tour Ngay
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link to="/tours" onClick={() => setIsMenuOpen(false)} className="w-full btn-primary inline-flex items-center justify-center">
                  Đặt Tour Ngay
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;