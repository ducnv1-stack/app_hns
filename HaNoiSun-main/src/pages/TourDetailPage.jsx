import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Star, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTourById } from '../data/tours';

const TourDetailPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const found = getTourById(tourId);
      if (!found) {
        navigate('/tours');
      } else {
        setTour(found);
      }
      setLoading(false);
    }, 200);
  }, [tourId, navigate]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải chi tiết tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{tour.title}</h1>
          <div className="w-24" />
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow overflow-hidden">
          <img src={tour.image} alt={tour.title} className="w-full h-80 object-cover" />
          <div className="p-6">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{tour.location}</span>
              <span className="flex items-center"><Clock className="h-4 w-4 mr-1" />{tour.duration}</span>
              <span className="flex items-center"><Users className="h-4 w-4 mr-1" />{tour.groupSize}</span>
              <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />{tour.rating} ({tour.reviews})</span>
            </div>

            {/* Introduction / Description */}
            {(tour.introduction || tour.description) && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">Giới thiệu</h3>
                {tour.introduction && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{tour.introduction}</p>
                )}
                {tour.description && tour.introduction && (
                  <div className="h-3" />
                )}
                {tour.description && (
                  <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                )}
              </div>
            )}

            {/* Hotel gallery for Combo Đà Nẵng */}
            {tour.id === 1 && (
              <GalleryDN />
            )}

            {/* Gallery + captions for Hang Ngọc Rồng */}
            {tour.id === 2 && (
              <GalleryNR />
            )}

            {/* Hotel gallery for Combo Quy Nhơn */}
            {tour.id === 3 && (
              <GalleryQN />
            )}

            {/* Hotel gallery for Combo Nha Trang */}
            {tour.id === 4 && (
              <GalleryNT tour={tour} />
            )}

            {/* Itinerary */}
            {Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Lịch trình chi tiết</h3>
                <div className="space-y-3">
                  {tour.itinerary.map((d) => (
                    <div key={d.day} className="p-4 border border-gray-200 rounded-lg">
                      <div className="font-semibold text-gray-900 mb-1">Ngày {d.day}: {d.title}</div>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {(d.activities || []).map((act, idx) => <li key={idx}>{act}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-amber-900">Lưu ý</h3>
              <ul className="list-disc list-inside text-amber-900 space-y-2">
                <li>
                  Cung cấp danh sách đoàn gồm: Họ tên, năm sinh, giới tính, quốc tịch, số chứng minh thư hoặc số hộ chiếu, số điện thoại của khách để làm các thủ tục mua bảo hiểm và chuẩn bị hồ sơ đoàn.
                </li>
                <li>
                  Lịch trình có thể thay đổi theo thực tế chuyến đi nhưng vẫn đảm bảo đầy đủ các cảnh điểm có trong chương trình.
                </li>
                <li>
                  Chính sách trẻ em:
                  <ul className="list-disc list-inside ml-5 space-y-1">
                    <li>Trẻ em dưới 5 tuổi: miễn phí (ăn nghỉ cùng bố mẹ; 02 người lớn chỉ kèm 01 trẻ em, trẻ thứ 02 tính 50%; số lượng trẻ em free trong đoàn không quá 10% số lượng người lớn).</li>
                    <li>Trẻ em từ 5 - dưới 10 tuổi: tính 80% giá vé (nghỉ chung với bố mẹ; 02 người lớn chỉ kèm 01 trẻ em 1/2, trẻ thứ 2 tính như người lớn).</li>
                    <li>Trẻ em từ 10 tuổi trở lên: tính như người lớn.</li>
                  </ul>
                </li>
                <li>Giá trên không áp dụng cho dịp cao điểm và các dịp lễ, tết.</li>
                <li>Giá tour có thể thay đổi khi có biến động về giá nhiên liệu, số lượng khách, ngày khởi hành chính thức và các dịch vụ theo yêu cầu của Quý khách.</li>
              </ul>
            </div>

            {/* International-only Notes */}
            {tour.continent !== 'domestic' && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-900">Lưu ý bổ sung cho tour quốc tế</h3>
                <ul className="list-disc list-inside text-blue-900 space-y-2">
                  <li>Hộ chiếu phải còn thời hạn trên 6 tháng tính đến ngày khởi hành.</li>
                  <li>Giá áp dụng cho khách 12-69 tuổi. Từ 70 tuổi trở lên phụ thu bảo hiểm; từ 75 tuổi trở lên cần giấy chứng nhận đủ sức khỏe và nên có người thân dưới 60 tuổi đi cùng.</li>
                  <li>Trường hợp 1 người lớn đi cùng 1 trẻ em dưới 12 tuổi (không giường riêng), vui lòng thanh toán theo giá người lớn để bé có giường riêng.</li>
                  <li>Nếu Quý khách không được xuất/nhập cảnh vì lý do cá nhân (hình ảnh, thông tin giấy tờ mờ, passport hết hạn/không đúng quy định…), Công ty không chịu trách nhiệm và không hoàn trả tiền tour; HDV sẽ hỗ trợ phương án tốt nhất, chi phí phát sinh do khách tự chi trả.</li>
                  <li>Khách có phẫu thuật thẩm mỹ khuôn mặt cần làm lại hộ chiếu. Nếu không thực hiện, Công ty không chịu trách nhiệm về việc xuất nhập cảnh; mọi chi phí hủy phạt dịch vụ khách tự chịu.</li>
                  <li>Giá có thể thay đổi khi hãng hàng không tăng phụ thu nhiên liệu; lịch bay có thể thay đổi theo ngày khởi hành.</li>
                  <li>Chương trình có thể thay đổi thứ tự nhưng vẫn bảo đảm đầy đủ điểm tham quan; trong các trường hợp khách quan (khủng bố, thiên tai, sự cố phương tiện công cộng…), Công ty được quyền thay đổi lộ trình vì an toàn/thuận tiện và không bồi thường các thiệt hại phát sinh.</li>
                  <li>
                    Trẻ em dưới 18 tuổi (chưa qua sinh nhật): khi làm visa cửa khẩu phải có scan Giấy Khai Sinh; khi nhập cảnh mang theo bản sao có dấu đỏ và giấy ủy quyền (nếu không đi cùng bố mẹ).
                  </li>
                  {tour.country === 'china' ? (
                    <li>Quý khách vui lòng không bỏ qua các điểm shopping chỉ định trong chương trình: Viện bảo tàng chữ cổ Trung Hoa (hoặc cửa hàng ngọc), cửa hàng thuốc.</li>
                  ) : (
                    <li>Quý khách vui lòng tuân thủ các điểm mua sắm/chỉ định (nếu có) theo chương trình của nước sở tại.</li>
                  )}
                </ul>

                {/* Visa requirements */}
                <div className="mt-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Thủ tục xin visa (tham khảo)</h4>
                  <ul className="list-disc list-inside text-blue-900 space-y-1">
                    <li>Scan hộ chiếu rõ nét trang thông tin (đủ 4 góc, không bóng/che tay). Nếu hộ chiếu mới, tránh bị bóng.</li>
                    <li>File gốc ảnh thẻ 4x6 nền trắng, áo màu (không áo trắng), không đeo kính, lộ tai – lộ trán, không đeo trang sức.</li>
                    <li>Đối với trẻ em dưới 18 tuổi: kèm scan Giấy Khai Sinh; khi nhập cảnh mang theo bản sao có dấu đỏ + giấy ủy quyền nếu không đi cùng bố mẹ.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
            <div className="text-2xl font-bold text-primary-600 mb-1">{formatPrice(tour.price)}</div>
            {tour.originalPrice && (
              <div className="text-sm text-gray-500 line-through mb-4">{formatPrice(tour.originalPrice)}</div>
            )}
            <div className="text-sm text-gray-600 flex items-center mb-4">
              <Calendar className="h-4 w-4 mr-1" /> Nhiều ngày khởi hành
            </div>
            <Link to={`/booking/${tour.id}`} className="w-full inline-flex items-center justify-center btn-primary">
              Đặt Tour Ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;

// Small gallery zone dedicated for Combo Đà Nẵng
const GalleryDN = () => {
  const images = useMemo(() => (
    Array.from({ length: 8 }, (_, i) => `/hero/DN${i + 1}.jpg`)
  ), []);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(id);
  }, [images.length]);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Hình ảnh khách sạn</h3>
      <div className="relative rounded-2xl overflow-hidden shadow border border-gray-200">
        <img
          key={index}
          src={images[index]}
          alt={`Khách sạn Đà Nẵng ${index + 1}`}
          className="w-full h-64 object-cover transition-opacity duration-500"
        />
        {/* Controls */}
        <button
          type="button"
          onClick={prev}
          aria-label="Ảnh trước"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Ảnh sau"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/60'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Hang Ngọc Rồng gallery with captions
const GalleryNR = () => {
  const slides = useMemo(() => ([
    {
      src: '/hero/NR1.jpg',
      title: 'Cổng vào Hang Ngọc Rồng',
      lines: [
        'Khởi đầu hành trình khám phá với không gian kỳ vĩ của Cẩm Phả.',
        'Thiết kế lấy cảm hứng từ truyền thuyết dân gian.',
        'Điểm check-in nổi bật được yêu thích nhất.',
        'Không khí biển trong lành, dễ chịu.'
      ]
    },
    {
      src: '/hero/NR2.jpg',
      title: 'Lối đi vào hang',
      lines: [
        'Con đường uốn lượn giữa núi đá vôi và hệ sinh thái tự nhiên.',
        'Ánh sáng phản chiếu tạo nên bức tranh huyền ảo.',
        'Thích hợp cho các nhóm gia đình và bạn bè.',
        'Hành trình an toàn với lối đi rõ ràng, dễ dàng.'
      ]
    },
    {
      src: '/hero/NR3.jpg',
      title: 'Không gian bên trong',
      lines: [
        'Những khối thạch nhũ nhiều hình thù độc đáo.',
        'Nhiệt độ mát lạnh quanh năm giúp thư thái.',
        'Âm vang tự nhiên khiến từng bước chân thêm thú vị.',
        'Khu vực được chiếu sáng nhẹ để đảm bảo trải nghiệm.'
      ]
    },
    {
      src: '/hero/NR4.jpg',
      title: 'Sân khấu thực cảnh',
      lines: [
        'Show “Đi tìm dấu ngọc” kết hợp âm thanh – ánh sáng sống động.',
        'Cốt truyện đậm chất huyền thoại vùng Đông Bắc.',
        'Ghế ngồi thoải mái, tầm nhìn bao quát.',
        'Phù hợp cho cả người lớn và trẻ nhỏ.'
      ]
    },
    {
      src: '/hero/NR5.jpg',
      title: 'Ẩm thực Quảng Ninh',
      lines: [
        'Thưởng thức hải sản tươi ngon sau giờ tham quan.',
        'Món ăn địa phương phong phú: chả mực, sam biển, sá sùng.',
        'Không gian sạch sẽ, phục vụ chu đáo.',
        'Lựa chọn đa dạng cho nhiều khẩu vị.'
      ]
    }
  ]), []);

  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 3000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Khám phá Hang Ngọc Rồng</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <div className="relative rounded-2xl overflow-hidden shadow border border-gray-200">
          <img src={slides[i].src} alt={slides[i].title} className="w-full h-64 object-cover" />
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <span key={idx} className={`h-2 w-2 rounded-full ${idx === i ? 'bg-white' : 'bg-white/60'}`} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow">
          <div className="text-sm text-gray-500 mb-1">DAY {i + 1}</div>
          <div className="text-xl font-semibold mb-3">{slides[i].title}</div>
          <div className="space-y-2 text-gray-700 leading-relaxed">
            {slides[i].lines.map((t, idx) => (
              <p key={idx}>{t}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Quy Nhơn hotel gallery (autoplay 3s + controls)
const GalleryQN = () => {
  const images = useMemo(() => (
    Array.from({ length: 7 }, (_, i) => `/hero/QN${i + 1}.jpg`)
  ), []);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Hình ảnh khách sạn Quy Nhơn</h3>
      <div className="relative rounded-2xl overflow-hidden shadow border border-gray-200">
        <img
          key={index}
          src={images[index]}
          alt={`Khách sạn Quy Nhơn ${index + 1}`}
          className="w-full h-64 object-cover transition-opacity duration-500"
        />
        <button
          type="button"
          onClick={prev}
          aria-label="Ảnh trước"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Ảnh sau"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/60'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Nha Trang hotel gallery (autoplay 3s + controls)
const GalleryNT = ({ tour }) => {
  const images = useMemo(() => (
    Array.isArray(tour?.gallery) ? tour.gallery : []
  ), [tour]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  if (images.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Hình ảnh khách sạn Nha Trang</h3>
        <div className="text-sm text-gray-500">Chưa có ảnh. Vui lòng bổ sung danh sách đường dẫn trong trường gallery của combo Nha Trang.</div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Hình ảnh khách sạn Nha Trang</h3>
      <div className="relative rounded-2xl overflow-hidden shadow border border-gray-200">
        <img
          key={index}
          src={images[index]}
          alt={`Khách sạn Nha Trang ${index + 1}`}
          className="w-full h-64 object-cover transition-opacity duration-500"
        />
        <button
          type="button"
          onClick={prev}
          aria-label="Ảnh trước"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Ảnh sau"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/60'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};


