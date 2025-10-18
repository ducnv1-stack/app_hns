import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Phone, Mail, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import MegaDropdown from './MegaDropdown';
import { useAuth } from '../../context/AuthContext';

const HeaderSimple = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaDropdownOpen, setIsMegaDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
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
                <span>Hotline: 0945 532 939</span>
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
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'}`}>
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
                    className={`font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === item.href
                        ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                        : 'text-gray-700 hover:text-primary-600'
                      }`}
                  >
                    <span>{item.name}</span>
                    {item.hasMegaMenu && (
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMegaDropdownOpen ? 'rotate-180' : ''}`} />
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

            {/* Search & User Menu & CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              
              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to={user?.roles?.includes('admin') ? "/admin/dashboard" : "/dashboard"}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Hồ sơ</span>
                      </Link>
                      <Link
                        to="/my-bookings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Đơn đặt chỗ</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to="/register"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
              
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
                  className={`block py-2 font-medium transition-colors ${location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</div>
                      </div>
                    </div>
                    <Link to={user?.roles?.includes('admin') ? "/admin/dashboard" : "/dashboard"} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">
                      Hồ sơ
                    </Link>
                    <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">
                      Đơn đặt chỗ
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600 hover:text-red-700">
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">
                      Đăng nhập
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">
                      Đăng ký
                    </Link>
                  </>
                )}
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

export default HeaderSimple;
