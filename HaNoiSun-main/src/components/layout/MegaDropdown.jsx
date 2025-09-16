import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, MapPin, Globe } from 'lucide-react';

const MegaDropdown = ({ isOpen, onClose }) => {
  const [activeContinent, setActiveContinent] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const destinations = {
    'Châu Á': {
      icon: '🌏',
      countries: [
        'Trung Quốc', 'Nhật Bản', 'Hàn Quốc', 'Thái Lan', 'Campuchia', 
        'Triều Tiên', 'Mông Cổ', 'Ấn Độ', 'Đài Loan', 'Singapore', 
        'Malaysia - Singapore', 'Hong Kong', 'Dubai', 'Israel', 'Lào', 
        'Brunei', 'Nepal', 'Indonesia - Bali', 'Myanmar', 'Iran', 'Bhutan'
      ]
    },
    'Châu Âu': {
      icon: '🏰',
      countries: [
        'Pháp', 'Đức', 'Nga', 'Anh', 'Bắc Âu', 'Hy Lạp', 
        'Ý - Thụy Sĩ - Pháp', 'Monaco', 'Áo', 'Bỉ', 'Tây Âu', 
        'Thổ Nhĩ Kỳ', 'Pháp - Bỉ - Hà Lan - Đức', 
        'Pháp - Luxembourg - Bỉ - Hà Lan - Đức', 
        'Malta - Đảo Sicili - Miền Nam Ý'
      ]
    },
    'Châu Mỹ': {
      icon: '🗽',
      countries: ['Mỹ', 'Canada', 'Brazil', 'Cuba', 'Nam Mỹ']
    },
    'Châu Úc': {
      icon: '🦘',
      countries: ['Úc', 'New Zealand']
    },
    'Châu Phi': {
      icon: '🦁',
      countries: ['Maroc', 'Nam Phi', 'Mauritius']
    }
  };

  const toKeyMap = {
    'Trung Quốc': 'china',
    'Nhật Bản': 'japan',
    'Hàn Quốc': 'south-korea',
    'Thái Lan': 'thailand',
    'Việt Nam': 'vietnam',
    'Pháp': 'france',
    'Mỹ': 'usa',
    'Canada': 'canada',
    'Úc': 'australia',
    'New Zealand': 'new-zealand',
    'Singapore': 'singapore',
    'Malaysia - Singapore': 'singapore',
    'Ý - Thụy Sĩ - Pháp': 'italy',
    'Đức': 'germany',
    'Anh': 'united-kingdom',
    'Nga': 'russia',
    'Campuchia': 'cambodia',
    'Lào': 'laos',
    'Indonesia - Bali': 'indonesia',
    'Israel': 'israel',
    'Nepal': 'nepal',
    'Myanmar': 'myanmar',
    'Ấn Độ': 'india',
    'Đài Loan': 'taiwan',
    'Hong Kong': 'hong-kong',
    'Brunei': 'brunei',
    'Iran': 'iran',
    'Maroc': 'morocco',
    'Nam Phi': 'south-africa',
    'Mauritius': 'mauritius',
    'Bỉ': 'belgium',
    'Áo': 'austria',
    'Tây Âu': 'western-europe',
    'Bắc Âu': 'nordic',
    'Hy Lạp': 'greece',
    'Monaco': 'monaco',
    'Nam Mỹ': 'south-america'
  };

  const slugify = (str) =>
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const goToCountry = (displayName) => {
    const key = toKeyMap[displayName] || slugify(displayName);
    navigate(`/tours/country/${key}`);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 w-screen max-w-6xl bg-white shadow-2xl border border-gray-100 rounded-2xl z-50 animate-fade-in"
      style={{ transform: 'translateX(-20%)' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white p-6 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <Globe className="h-8 w-8" />
          <div>
            <h3 className="text-2xl font-bold">Khám Phá Thế Giới</h3>
            <p className="text-blue-100">Chọn điểm đến yêu thích của bạn</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {Object.entries(destinations).map(([continent, data]) => (
            <div
              key={continent}
              className="group"
              onMouseEnter={() => setActiveContinent(continent)}
              onMouseLeave={() => setActiveContinent(null)}
            >
              {/* Continent Header */}
              <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-gray-50 group-hover:bg-primary-50 transition-colors duration-200">
                <span className="text-2xl">{data.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {continent}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {data.countries.length} điểm đến
                  </p>
                </div>
              </div>

              {/* Countries List */}
              <div className="space-y-2">
                {data.countries.map((country, index) => (
                  <button
                    key={index}
                    onClick={() => goToCountry(country)}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 flex items-center justify-between group/item"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 group-hover/item:text-primary-500" />
                      <span className="text-sm font-medium">{country}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover/item:text-primary-500 opacity-0 group-hover/item:opacity-100 transition-all duration-200" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-600 text-sm">
                Không tìm thấy điểm đến mong muốn?
              </p>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Liên hệ tư vấn miễn phí →
              </button>
            </div>
            
            <div className="flex space-x-4">
              <Link to="/tours" className="btn-secondary text-sm" onClick={onClose}>
                Xem Tất Cả Tours
              </Link>
              <Link to="/contact" className="btn-primary text-sm" onClick={onClose}>
                Tư Vấn Miễn Phí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaDropdown;