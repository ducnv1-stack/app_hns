import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Minh Anh',
      location: 'Hà Nội',
      tour: 'Tour Hạ Long 2N1Đ',
      rating: 5,
      comment: 'Chuyến đi tuyệt vời! Dịch vụ chuyên nghiệp, hướng dẫn viên nhiệt tình. Du thuyền sang trọng, ẩm thực ngon. Gia đình tôi rất hài lòng và sẽ quay lại.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      date: '15/11/2024'
    },
    {
      id: 2,
      name: 'Trần Văn Hùng',
      location: 'TP.HCM',
      tour: 'Tour Nhật Bản 7N6Đ',
      rating: 5,
      comment: 'Mùa hoa anh đào tuyệt đẹp! Lịch trình hợp lý, khách sạn tốt, HDV am hiểu văn hóa Nhật. Giá cả hợp lý so với chất lượng dịch vụ.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      date: '28/10/2024'
    },
    {
      id: 3,
      name: 'Lê Thị Mai',
      location: 'Đà Nẵng',
      tour: 'Tour Sapa 3N2Đ',
      rating: 5,
      comment: 'Ruộng bậc thang mùa lúa chín đẹp như tranh! Homestay sạch sẽ, người dân địa phương thân thiện. Trải nghiệm trekking tuyệt vời.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      date: '05/11/2024'
    },
    {
      id: 4,
      name: 'Phạm Đức Thành',
      location: 'Hải Phòng',
      tour: 'Tour Singapore - Malaysia',
      rating: 5,
      comment: 'Lần đầu đi tour nước ngoài, rất lo lắng nhưng team HST đã hỗ trợ tận tình. Mọi thứ đều được sắp xếp chu đáo, không phải lo lắng gì.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      date: '20/10/2024'
    },
    {
      id: 5,
      name: 'Hoàng Thị Lan',
      location: 'Cần Thơ',
      tour: 'Tour Phú Quốc 4N3Đ',
      rating: 5,
      comment: 'Resort 5 sao tuyệt vời! Bãi biển đẹp, hoạt động phong phú. Đặc biệt ấn tượng với Safari và cáp treo Hòn Thơm. Sẽ giới thiệu cho bạn bè.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      date: '12/11/2024'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những chia sẻ chân thực từ khách hàng đã trải nghiệm dịch vụ của Hà Nội Sun Travel
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-primary-100">
              <Quote className="h-16 w-16" />
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].location} • {testimonials[currentTestimonial].date}
                  </p>
                  <p className="text-primary-600 font-medium">
                    {testimonials[currentTestimonial].tour}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-6">
                {renderStars(testimonials[currentTestimonial].rating)}
              </div>

              <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                "{testimonials[currentTestimonial].comment}"
              </blockquote>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white shadow-lg rounded-full text-gray-600 hover:text-primary-600 hover:shadow-xl transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white shadow-lg rounded-full text-gray-600 hover:text-primary-600 hover:shadow-xl transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentTestimonial ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h5 className="font-semibold text-gray-900">{testimonial.name}</h5>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-3">
                {renderStars(testimonial.rating)}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                "{testimonial.comment.substring(0, 100)}..."
              </p>

              <p className="text-primary-600 text-sm font-medium mt-3">
                {testimonial.tour}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Bạn Cũng Muốn Có Trải Nghiệm Tuyệt Vời?
          </h3>
          <p className="text-gray-600 mb-8">
            Hãy để chúng tôi tạo nên những kỷ niệm đáng nhớ cho chuyến du lịch của bạn
          </p>
          <button className="btn-primary">
            Đặt Tour Ngay
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;