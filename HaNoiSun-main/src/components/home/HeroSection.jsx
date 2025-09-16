import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchData, setSearchData] = useState({
    destination: '',
    date: '',
    guests: '2 người'
  });

  const heroSlides = [
    {
      id: 1,
      image: '/hero/halong.jpg',
      fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alternatives: ['/hero/halong.jpeg', '/hero/halong.png'],
      title: 'Khám Phá Vẻ Đẹp Hạ Long',
      subtitle: 'Trải nghiệm kỳ quan thiên nhiên thế giới',
      description: 'Du thuyền sang trọng, ẩm thực đặc sắc và dịch vụ 5 sao',
      source: 'https://www.istockphoto.com/vi/b%E1%BB%A9c-%E1%BA%A3nh/h%E1%BA%A1-long-bay'
    },
    {
      id: 2,
      image: '/hero/hoian.jpg',
      fallback: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2096&q=80',
      alternatives: ['/hero/hoian.jpeg', '/hero/hoian.png'],
      title: 'Phố Cổ Hội An Thơ Mộng',
      subtitle: 'Nơi giao thoa văn hóa Đông Tây',
      description: 'Khám phá kiến trúc cổ kính và ẩm thực đường phố độc đáo',
      source: 'https://vinwonders.com/vi/wonderpedia/news/9-nha-co-hoi-an-dep-co-kinh-kien-truc-doc-dao-hut-khach/'
    },
    {
      id: 3,
      image: '/hero/sapa.jpg',
      fallback: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alternatives: ['/hero/sapa.jpeg', '/hero/sapa.png'],
      title: 'Sapa Mùa Lúa Chín',
      subtitle: 'Ruộng bậc thang đẹp nhất Việt Nam',
      description: 'Trekking, khám phá văn hóa dân tộc và ngắm hoàng hôn tuyệt đẹp',
      source: 'https://mia.vn/cam-nang-du-lich/kinh-nghiem-san-lua-o-sapa-mua-lua-chin-vang-uom-959'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching with:', searchData);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Hero Slides */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              data-alt-index="0"
              onError={(e) => {
                const img = e.currentTarget;
                const idx = Number(img.dataset.altIndex || '0');
                const alts = slide.alternatives || [];
                if (idx < alts.length) {
                  img.src = alts[idx];
                  img.dataset.altIndex = String(idx + 1);
                } else if (slide.fallback && img.src !== slide.fallback) {
                  img.src = slide.fallback;
                }
              }}
            />
            <div className="gradient-overlay" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {heroSlides[currentSlide].subtitle}
          </p>
          <p className="text-lg mb-8 text-gray-200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {heroSlides[currentSlide].description}
          </p>
          {heroSlides[currentSlide].source && (
            <p className="text-sm text-gray-300">
              Nguồn ảnh: <a href={heroSlides[currentSlide].source} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Xem chi tiết</a>
            </p>
          )}
        </div>
      </div>

      {/* Search Form */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Điểm đến"
                value={searchData.destination}
                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={searchData.guests}
                onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none"
              >
                <option value="1 người">1 người</option>
                <option value="2 người">2 người</option>
                <option value="3-4 người">3-4 người</option>
                <option value="5+ người">5+ người</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Tìm Kiếm</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;