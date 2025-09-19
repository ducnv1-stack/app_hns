// Centralized tour data with country keys for filtering

export const tours = [
  // Combo Đà Nẵng
  {
    id: 1,
    title: 'Combo Đà Nẵng 4N3Đ/3N2Đ 2025 siêu rẻ',
    location: 'Đà Nẵng, Việt Nam',
    country: 'vietnam',
    continent: 'domestic',
    price: 4750000,
    originalPrice: 4850000,
    duration: '3-4 ngày',
    groupSize: '2 người trở lên',
    rating: 4.9,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1200&q=80',
    category: 'combo',
    isPopular: true,
    isOnSale: true,
    highlights: ['Vé máy bay khứ hồi Vietnam Airlines', 'Khách sạn 4* trung tâm', 'Buffet sáng', 'Tiện ích hồ bơi & gym'],
    discount: 5,
    departureDate: '2025-10-26',
    availability: 'Nhiều ngày khởi hành',
    availableDates: [
      // 4N3Đ
      '2025-10-26', '2025-11-09', '2025-11-23', '2025-11-24', '2025-12-29',
      // 3N2Đ
      '2025-10-27', '2025-10-29', '2025-11-10', '2025-11-26', '2025-11-30'
    ],
    pricing: { adult: 4750000, child: 3562500, infant: 0 },
    description: 'Combo máy bay + khách sạn Đà Nẵng tiêu chuẩn 4* vị trí trung tâm, bao gồm buffet sáng và sử dụng tiện ích.',
    introduction: 'Combo linh hoạt 3N2Đ hoặc 4N3Đ dành cho 2 pax trở lên. Bay Vietnam Airlines 23kg hành lý ký gửi mỗi chiều.',
    schedules: [
      {
        title: '4N3Đ',
        options: [
          { range: '26/10-29/10', time: '(11H45-13H45)', price: 4750000 },
          { range: '09/11-12/11', time: '(11H45-13H45)', price: 4850000 },
          { range: '23/11-26/11', time: '(11H45-13H45)', price: 4850000 },
          { range: '24/11-27/11', time: '(11H45-13H45)', price: 4850000 },
          { range: '29/12-1/1/2026', time: '(11H45-13H45)', price: 4850000 }
        ]
      },
      {
        title: '3N2Đ',
        options: [
          { range: '27/10-29/10', time: '(7H45-17H00)', price: 4200000 },
          { range: '29/10-31/10', time: '(7H45-17H00)', price: 4200000 },
          { range: '10/11-12/11', time: '(7H45-17H00)', price: 4290000 },
          { range: '26/11-28/11', time: '(7H45-17H00)', price: 4290000 },
          { range: '30/11-2/12', time: '(7H45-17H00)', price: 4290000 }
        ]
      }
    ],
    itinerary: [
      { day: 1, title: 'Hà Nội – Đà Nẵng', summary: 'Bay Vietnam Airlines, nhận phòng khách sạn 4* trung tâm.' },
      { day: 2, title: 'Tự do tham quan', summary: 'Ngũ Hành Sơn – Phố cổ Hội An – Bà Nà Hills (tự túc).' },
      { day: 3, title: 'Biển Mỹ Khê – đặc sản', summary: 'Tắm biển, thưởng thức hải sản. Trả phòng.' },
      { day: 4, title: 'Đà Nẵng – Hà Nội', summary: 'Trả phòng – ra sân bay (áp dụng gói 4N3Đ).' }
    ]
  },

  // Hang Ngọc Rồng – Hành trình huyền thoại (Quảng Ninh)
  {
    id: 2,
    title: 'Hang Ngọc Rồng – Hành trình huyền thoại',
    location: 'Cẩm Phả, Quảng Ninh',
    country: 'vietnam',
    continent: 'domestic',
    price: 590000,
    originalPrice: 690000,
    duration: '1 ngày',
    groupSize: 'Mọi lứa tuổi',
    rating: 4.8,
    reviews: 512,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: 'combo',
    isPopular: true,
    isOnSale: true,
    highlights: ['Vé tham quan + check-in', 'Show “Đi tìm dấu ngọc”', 'Ẩm thực Quảng Ninh', 'Không phụ thu cuối tuần*'],
    discount: 15,
    departureDate: '2025-10-15',
    availability: 'Áp dụng đến 15/10/2025',
    availableDates: ['2025-09-20', '2025-09-27', '2025-10-04', '2025-10-11'],
    pricing: { adult: 590000, child: 590000, infant: 0 },
    description: 'Trọn gói tham quan Hang Ngọc Rồng – hạ Long huyền ảo với show diễn thực cảnh đặc sắc.',
    introduction: 'Địa chỉ: Tổ 63, Khu Diêm Thuỷ, P. Cẩm Đông, TP. Cẩm Phả, Quảng Ninh. Phù hợp gia đình và nhóm bạn.',
    itinerary: [
      { day: 1, title: 'Check-in Hang Ngọc Rồng', summary: 'Tham quan – xem show – thưởng thức đặc sản Quảng Ninh.' }
    ]
  },

  // Combo Quy Nhơn/Tuy Hoà 4N3Đ cuối năm
  {
    id: 3,
    title: 'Combo Vi Vu Quy Nhơn, Tuy Hoà 4N3Đ cuối năm',
    location: 'Quy Nhơn / Tuy Hoà, Việt Nam',
    country: 'vietnam',
    continent: 'domestic',
    price: 4690000,
    originalPrice: 4890000,
    duration: '4 ngày 3 đêm',
    groupSize: '2 người trở lên',
    rating: 4.7,
    reviews: 274,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    category: 'combo',
    isPopular: true,
    isOnSale: true,
    highlights: ['Vé khứ hồi Vietnam Airlines 23kg', 'Nghỉ 4* Sala/4* Lamour', 'Buffet sáng', 'Tiện ích khách sạn'],
    discount: 4,
    departureDate: '2025-10-26',
    availability: 'Nhiều ngày khởi hành',
    availableDates: [
      '2025-10-26', '2025-10-27',
      '2025-11-11', '2025-11-25',
      '2025-12-02', '2025-12-07', '2025-12-08', '2025-12-14', '2025-12-22', '2025-12-28'
    ],
    pricing: { adult: 4690000, child: 3517500, infant: 0 },
    description: 'Combo máy bay + khách sạn 4* Quy Nhơn/Tuy Hoà giá tốt cuối năm, kèm buffet sáng.',
    introduction: 'Hãng bay Vietnam Airlines tiêu chuẩn 23kg ký gửi. Lịch khởi hành dày, linh hoạt theo nhu cầu.',
    schedules: [
      {
        title: 'Lịch trình 4N3Đ',
        options: [
          { range: '26/10-29/10', time: '(11H50-13H30)', price: 4890000 },
          { range: '27/10-30/10', time: '(11H50-13H30)', price: 4890000 },
          { range: '11/11-14/11', time: '(11H50-13H30)', price: 4890000 },
          { range: '25/11-28/11', time: '(11H50-13H30)', price: 4890000 },
          { range: '02/12-05/12', time: '(11H50-13H30)', price: 4890000 },
          { range: '07/12-10/12', time: '(11H50-13H30)', price: 4690000 },
          { range: '08/12-11/12', time: '(11H50-13H30)', price: 4890000 },
          { range: '14/12-17/12', time: '(11H50-13H30)', price: 4690000 },
          { range: '22/12-25/12', time: '(11H50-13H30)', price: 4890000 },
          { range: '28/12-31/12', time: '(11H50-13H30)', price: 4690000 }
        ]
      }
    ],
    itinerary: [
      { day: 1, title: 'Hà Nội – Quy Nhơn/Tuy Hoà', summary: 'Bay Vietnam Airlines – nhận phòng khách sạn 4*.' },
      { day: 2, title: 'Tham quan tự do', summary: 'Eo Gió – Kỳ Co – Ghềnh Ráng (tự túc).' },
      { day: 3, title: 'Biển đảo – Ẩm thực', summary: 'Tắm biển – ẩm thực miền Trung.' },
      { day: 4, title: 'Trả phòng – ra sân bay', summary: 'Kết thúc hành trình 4N3Đ.' }
    ]
  }
  ,
  // Combo Nha Trang cuối năm VNA
  {
    id: 4,
    title: 'Combo Nha Trang cuối năm bay VNA xịn xò',
    location: 'Nha Trang, Khánh Hòa',
    country: 'vietnam',
    continent: 'domestic',
    price: 4590000,
    originalPrice: 4590000,
    duration: '3-4 ngày',
    groupSize: '2 người trở lên',
    rating: 4.8,
    reviews: 168,
    image: '/hero/Combo_Nha_Trang/nha-trang-2.jpg',
    category: 'combo',
    isPopular: true,
    isOnSale: true,
    highlights: [
      'VMB khứ hồi Vietnam Airlines + 23kg ký gửi',
      '02 hoặc 03 đêm tại Xavia 4* trung tâm bên biển',
      'Miễn phí buffet sáng hàng ngày',
      'Miễn phí nước uống trong phòng mỗi ngày',
      'Sử dụng hồ bơi, phòng tập gym'
    ],
    discount: 0,
    departureDate: '2025-11-02',
    availability: 'Nhiều ngày khởi hành',
    availableDates: [
      '2025-11-02', '2025-11-17', // 4N3Đ
      '2025-11-09', '2025-11-16', '2025-11-26' // 3N2Đ
    ],
    pricing: { adult: 4590000, child: 3442500, infant: 0 },
    description: 'Combo bay Vietnam Airlines và lưu trú 4* Xavia ngay trung tâm Nha Trang, bao gồm buffet sáng và tiện ích.',
    introduction: 'Giờ bay tham khảo: 10:15 - 12:45 (4N3Đ) và 10:15 - 15:50 (3N2Đ). Lịch có thể thay đổi tùy ngày.',
    // Hotel gallery uses exact filenames as provided in public/hero/Combo_Nha_Trang
    gallery: [
      '/hero/Combo_Nha_Trang/6221737016110990168.jpg',
      '/hero/Combo_Nha_Trang/6221737016110990169.jpg',
      '/hero/Combo_Nha_Trang/6221737016110990170.jpg',
      '/hero/Combo_Nha_Trang/6221737016110990171.jpg',
      '/hero/Combo_Nha_Trang/6221737016110990172.jpg',
      '/hero/Combo_Nha_Trang/6221737016110990173.jpg'
    ],
    schedules: [
      {
        title: '4N3Đ',
        options: [
          { range: '2/11-5/11', time: '(10H15-12H45)', price: 4590000 },
          { range: '17/11-20/11', time: '(10H15-12H45)', price: 4590000 }
        ]
      },
      {
        title: '3N2Đ',
        options: [
          { range: '9/11-11/11', time: '(10H15-15H50)', price: 4190000 },
          { range: '16/11-18/11', time: '(10H15-15H50)', price: 4190000 },
          { range: '26/11-28/11', time: '(10H15-15H50)', price: 4190000 }
        ]
      }
    ],
    itinerary: [
      { day: 1, title: 'Hà Nội – Nha Trang', summary: 'Bay Vietnam Airlines, nhận phòng khách sạn Xavia 4* khu trung tâm.' },
      { day: 2, title: 'Khám phá biển đảo', summary: 'Tự do tắm biển, VinWonders, đảo Hòn Mun/Hòn Tằm (tự túc).' },
      { day: 3, title: 'Ẩm thực Nha Trang', summary: 'Thưởng thức hải sản, cà phê biển, spa (tự túc).' },
      { day: 4, title: 'Nha Trang – Hà Nội', summary: 'Trả phòng – ra sân bay. (Áp dụng gói 4N3Đ)'}
    ]
  }
];

export const countries = [
  { key: 'vietnam', name: 'Việt Nam' }
];

export const getToursByCountry = (countryKey) => {
  return tours.filter(t => (t.country || '').toLowerCase() === (countryKey || '').toLowerCase());
};

export const getTourById = (id) => tours.find(t => t.id === Number(id));


