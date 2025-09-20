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
    introduction: `Đà Nẵng Vẫy Gọi: Trải Nghiệm Kỳ Nghỉ 4 Sao Trọn Gói Với Combo Bay Vietnam Airlines Siêu Hời 2025\n\nBạn có đang mơ về một kỳ nghỉ thảnh thơi vào cuối năm 2025, được đắm mình trong làn nước biển trong xanh, thưởng thức ẩm thực đặc sắc và khám phá thành phố đáng sống nhất Việt Nam? Hãy tạm gác lại những bộn bề và để chúng tôi mang đến cho bạn một hành trình hoàn hảo với “Combo Đà Nẵng Siêu Rẻ 2025” – nơi sự đẳng cấp và tiện lợi kết hợp trong một mức giá không thể tốt hơn.\n\nHành Trình Tiện Lợi, Trải Nghiệm Đẳng Cấp\nNgay từ khi bắt đầu, chuyến đi của bạn đã được đảm bảo sự thoải mái và tin cậy khi đồng hành cùng Hãng hàng không Quốc gia Vietnam Airlines. Với chuyến bay khứ hồi từ Hà Nội, bạn sẽ có một hành trình êm ái, dịch vụ chuyên nghiệp cùng 23kg hành lý ký gửi miễn cước mỗi chiều để thỏa sức mua sắm quà cáp.\n\nNơi Lưu Trú Sang Trọng – Khách Sạn 4 Sao\nĐiểm nhấn đắt giá của kỳ nghỉ chính là những đêm nghỉ dưỡng tại khách sạn 4 sao sang trọng. Phòng Deluxe trang nhã, tiện nghi đầy đủ, vị trí trung tâm gần biển giúp bạn di chuyển thuận tiện. Đừng bỏ lỡ khu hồ bơi view cao – nơi ngắm hoàng hôn Đà Nẵng tuyệt đẹp và check-in “cháy máy”.\n\nTất Cả Đã Sẵn Sàng Trong Gói Combo Của Bạn\n- Vé máy bay khứ hồi Hà Nội – Đà Nẵng của Vietnam Airlines (đã bao gồm 23kg hành lý ký gửi).\n- 2 hoặc 3 đêm nghỉ tại phòng Deluxe sang trọng của khách sạn 4 sao trung tâm, gần biển.\n- Buffet sáng đa dạng và hấp dẫn tại nhà hàng của khách sạn.\n- Miễn phí sử dụng các tiện ích chung đẳng cấp như hồ bơi, phòng gym...\n- Lưu ý: Combo áp dụng cho nhóm từ 2 khách trở lên.\n\nLựa Chọn Lịch Trình Linh Hoạt\nBạn có thể tuỳ chọn 3N2Đ hoặc 4N3Đ với nhiều ngày khởi hành linh hoạt suốt mùa cao điểm cuối năm. Chúng tôi luôn sẵn sàng tư vấn lộ trình phố cổ Hội An – Bà Nà Hills – biển Mỹ Khê… để chuyến đi của bạn thật “đủ vị”.\n\nGợi Ý Trải Nghiệm Tại Đà Nẵng\n• Sáng: đạp xe ven biển, cà phê ngắm bình minh Mỹ Khê.\n• Trưa: ẩm thực miền Trung – mì Quảng, bún chả cá, hải sản tươi.\n• Chiều: ngắm hoàng hôn từ bán đảo Sơn Trà hoặc cầu Tình Yêu.\n• Tối: dạo phố, xem Cầu Rồng phun lửa (cuối tuần), dạo chợ đêm.\n\nCơ hội tuyệt vời để lên kế hoạch trước cho một kỳ nghỉ cuối năm trọn vẹn đã ở đây. Đừng chần chừ – chọn ngay lịch phù hợp và liên hệ để giữ chỗ cho chuyến đi đáng mong đợi nhất năm 2025!`,
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
      {
        day: 1,
        title: 'Hà Nội – Đà Nẵng',
        summary: 'Đến Đà Nẵng – nhận phòng – dạo phố ven sông Hàn, ngắm Cầu Rồng.',
        activities: [
          'Đoàn khởi hành từ Hà Nội đến Đà Nẵng – thành phố biển năng động và hiện đại bậc nhất miền Trung.',
          'Xe đưa đoàn về khách sạn nghỉ ngơi, chuẩn bị cho những ngày khám phá.',
          'Buổi tối: Tự do dạo phố ven sông Hàn, ngắm Cầu Rồng phun lửa/phun nước (cuối tuần) và các cây cầu rực rỡ ánh đèn.'
        ]
      },
      {
        day: 2,
        title: 'Tự do tham quan',
        summary: 'Tuỳ chọn Bà Nà Hills – Ngũ Hành Sơn – bán đảo Sơn Trà.',
        activities: [
          'Gợi ý 1: Chinh phục Bà Nà Hills – Cầu Vàng nổi tiếng, làng Pháp và công viên giải trí.',
          'Gợi ý 2: Viếng Ngũ Hành Sơn – quần thể núi đá vôi linh thiêng, làng đá mỹ nghệ Non Nước.',
          'Gợi ý 3: Tắm biển và khám phá bán đảo Sơn Trà – không khí trong lành, cảnh biển xanh ngọc.'
        ]
      },
      {
        day: 3,
        title: 'Biển Mỹ Khê – đặc sản Đà Nẵng',
        summary: 'Thư giãn trên bãi biển Mỹ Khê – khám phá ẩm thực Đà Nẵng.',
        activities: [
          'Buổi sáng: Tận hưởng thời gian thư giãn trên bãi biển Mỹ Khê – một trong những bãi biển đẹp nhất hành tinh.',
          'Buổi chiều: Thưởng thức đặc sản Đà Nẵng: mì Quảng, bánh tráng cuốn thịt heo, hải sản tươi ngon…'
        ]
      },
      {
        day: 4,
        title: 'Đà Nẵng – Hà Nội',
        summary: 'Chợ Hàn/Chợ Cồn – ra sân bay về Hà Nội.',
        activities: [
          'Buổi sáng: Tham quan chợ Hàn hoặc chợ Cồn mua đặc sản và quà lưu niệm.',
          'Sau đó, xe đưa đoàn ra sân bay – làm thủ tục bay về Hà Nội. Kết thúc hành trình (áp dụng gói 4N3Đ).'
        ]
      }
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
    introduction: `HÀNH TRÌNH HUYỀN THOẠI: Khám Phá Hang Ngọc Rồng - Nơi Kỳ Quan, Nghệ Thuật Và Ẩm Thực Hội Tụ\n\nBạn đã bao giờ tưởng tượng về một buổi tối diệu kỳ, nơi bạn không chỉ tham quan một kỳ quan thiên nhiên mà còn được đắm chìm trong những huyền thoại sống động và thưởng thức một bữa tiệc tinh hoa ngay giữa lòng đất? “Hành Trình Huyền Thoại” tại Hang Ngọc Rồng sẽ mang đến cho bạn một cuộc phiêu lưu của các giác quan, một trải nghiệm độc nhất vô nhị tại vùng đất mỏ Quảng Ninh.\n\nBước Vào Thế Giới Kỳ Vĩ Của Tạo Hóa\nNgay khi đặt chân trước cửa hang, một không gian kỳ vĩ mở ra trước mắt. Theo những lối đi được chiếu sáng nghệ thuật, bạn sẽ chiêm ngưỡng vòm hang rộng lớn, các khối thạch nhũ hàng triệu năm tuổi lấp lánh – tuyệt tác của thiên nhiên. Mỗi bước chân là một khám phá mới, mỗi góc nhìn là một lần trầm trồ trước sự hùng vĩ của tạo hóa.\n\nSân Khấu Của Những Huyền Thoại\nKhông gian huyền ảo bỗng hóa sân khấu thực cảnh hoành tráng. Bạn sẽ thưởng thức hai vở diễn đặc sắc: “Đi tìm dấu ngọc” và “Truyền thuyết Hang Ngọc Rồng”. Kết hợp âm thanh – ánh sáng – nghệ thuật trình diễn, lịch sử và văn hóa vùng đất Quảng Ninh được kể lại sống động, đưa bạn lạc vào thế giới vừa chân thực, vừa huyền ảo.\n\nĐỉnh Cao Cảm Xúc: Bữa Tối Tinh Hoa Giữa Lòng Hang Động\nKhoảnh khắc đắt giá của hành trình là khi bạn thưởng thức bữa tối tinh hoa ngay trong không gian tráng lệ của hang. Thực đơn đặc sản trứ danh xứ mỏ: hàu Vân Đồn tươi rói, chả mực Cô Tô giã tay, cá vược nướng thơm lừng, tôm hùm sốt tiến vua… kết hợp cùng trà hoa vàng Yên Tử tạo nên bản giao hưởng vị giác khó quên.\n\nTrọn Gói Trải Nghiệm Cao Cấp Chỉ Với 590.000 VNĐ\n• Vé tham quan Hang Ngọc Rồng và tự do check-in tại những góc đẹp nhất.\n• Thưởng thức 2 show thực cảnh: “Đi tìm dấu ngọc” & “Truyền thuyết Hang Ngọc Rồng”.\n• Một bữa tối tinh hoa với các món đặc sản Quảng Ninh.\n\nThông Tin Dành Cho Bạn\nĐịa chỉ: Tổ 63, Khu Diêm Thuỷ, Phường Cẩm Đông, TP. Cẩm Phả, Quảng Ninh.\nThời gian áp dụng ưu đãi: Đến hết ngày 15/10/2025.\nLưu ý: Giá áp dụng cho cả người lớn và trẻ em, không phụ thu cuối tuần (trừ ngày có show đặc biệt).\n\nGợi Ý Trải Nghiệm\n• Check-in các góc ảnh “triệu like” với hệ thống chiếu sáng nghệ thuật.\n• Kết hợp tham quan Vịnh Hạ Long/ Yên Tử trong cùng chuyến đi.\n• Đặt trước khung giờ xem show để chọn vị trí đẹp.\n\nHãy đặt chỗ sớm để tận hưởng một đêm diệu kỳ tại Hang Ngọc Rồng – nơi kỳ quan, nghệ thuật và ẩm thực hội tụ!`,
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
    introduction: `Một Hành Trình, Hai Miền Di Sản: Vi Vu Quy Nhơn - Tuy Hòa Cuối Năm Với Combo Siêu Chất!\n\nBạn có hẹn với biển xanh, cát trắng và nắng vàng của xứ Nẫu vào cuối năm nay? Nếu từng phân vân giữa vẻ đẹp hoang sơ, bình yên của Tuy Hòa và nét quyến rũ, sôi động của Quy Nhơn, đây chính là câu trả lời hoàn hảo. Combo Vi Vu Quy Nhơn - Tuy Hòa 4N3Đ là một hành trình kép độc đáo, đưa bạn khám phá trọn vẹn vẻ đẹp của hai thành phố biển hot nhất miền Trung – tiện lợi, đẳng cấp, trọn gói.\n\nHành Trình Kép Đẳng Cấp, Trải Nghiệm Nhân Đôi\nChuyến phiêu lưu bắt đầu êm ái cùng Vietnam Airlines – dịch vụ chuyên nghiệp, tiêu chuẩn 23kg hành lý ký gửi/chiều. Mọi thứ được chuẩn bị để kỳ nghỉ trọn vẹn ngay từ phút đầu.\n\nĐiểm Dừng Chân Đầu Tiên: Tuy Hòa – Bình yên của “xứ hoa vàng cỏ xanh”\n• Lưu trú tại Sala Tuy Hòa Beach 4*.\n• Phòng nghỉ sang trọng, thiết kế hiện đại, sát biển.\n• Thư giãn hồ bơi, tận hưởng “floating breakfast” đậm chất nghỉ dưỡng.\n\nĐiểm Dừng Chân Thứ Hai: Quy Nhơn – Thành phố thi ca đầy quyến rũ\n• Lưu trú tại L'amour Boutique Hotel 4* phong cách châu Âu tân cổ điển.\n• Phòng boutique tinh tế, ban công nhìn phố.\n• Hồ bơi vô cực tầng thượng – view thành phố biển sôi động.\n\nTrọn Gói “Siêu Chất” Bao Gồm\n- Vé máy bay khứ hồi Vietnam Airlines (đã gồm 23kg hành lý ký gửi).\n- 01 đêm Sala Tuy Hòa Beach & 02 đêm L'amour Boutique Quy Nhơn (hoặc tương đương) – tiêu chuẩn 4*.\n- Buffet sáng mỗi ngày tại khách sạn.\n- Miễn phí sử dụng tiện ích chung: hồ bơi, phòng gym…\n\nLịch Trình Cuối Năm – Giá không đổi 4.890.000đ/người\nTháng 10: 26/10-29/10, 27/10-30/10\nTháng 11: 11/11-14/11, 25/11-28/11\nTháng 12: 02/12-05/12, 07/12-10/12, 08/12-11/12, 14/12-17/12, 22/12-25/12, 28/12-31/12\n\nGợi ý trải nghiệm\n• Tuy Hòa: Mũi Điện – Gành Đá Đĩa – Bãi Xép – hải sản Đầm Ô Loan.\n• Quy Nhơn: Eo Gió – Kỳ Co – Hòn Khô – Tháp Đôi – phố ẩm thực đêm.\n\nĐừng bỏ lỡ cơ hội khám phá “một cung đường, hai điểm đến” đầy cảm hứng và khác biệt. Liên hệ để giữ chỗ ngay hôm nay!`,
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
      {
        day: 1,
        title: 'Hà Nội – Quy Nhơn | Chào phố biển dịu êm',
        summary: 'Bay HAN → UIH, nhận phòng, tham quan Tháp Đôi – Ghềnh Ráng, tối dạo biển Xuân Diệu.',
        activities: [
          'Sáng: Đáp chuyến bay sớm từ Hà Nội (HAN) đến sân bay Phù Cát (UIH). Di chuyển 30–40 phút vào trung tâm Quy Nhơn (taxi/xe buýt/xe dịch vụ).',
          'Trưa: Nhận phòng – nghỉ ngơi; ăn trưa với bún chả cá, bánh hỏi lòng heo.',
          'Chiều: Tham quan Tháp Đôi (kiến trúc Chăm độc đáo) – Ghềnh Ráng Tiên Sa, mộ thi sĩ Hàn Mặc Tử – Bãi tắm Hoàng Hậu (Bãi Đá Trứng).',
          'Tối: Hải sản tươi ngon trên đường Xuân Diệu; dạo quảng trường, cà phê bên bờ biển.'
        ]
      },
      {
        day: 2,
        title: 'Khám phá “Maldives của Việt Nam” | Tham quan tự do',
        summary: 'Tuỳ chọn Eo Gió – Kỳ Co (cano) hoặc đảo Hòn Khô – lặn san hô; chiều về khách sạn, tối di chuyển Tuy Hoà.',
        activities: [
          'Lựa chọn 1: Eo Gió – cung đường ven biển tuyệt đẹp; cano qua Kỳ Co – nước trong hai màu, bãi cát trắng, lặn san hô Bãi Dứa.',
          'Lựa chọn 2: Đảo Hòn Khô – con đường xuyên biển (tuỳ thuỷ triều), lặn ngắm san hô, thưởng thức hải sản dân địa.',
          'Trưa: Ăn hải sản tại nhà hàng đảo/khu vực Eo Gió.',
          'Chiều: Trở về nghỉ ngơi. 17:30 trả phòng, di chuyển tới Tuy Hoà (~2 giờ). 19:30 nhận phòng; ăn tối đặc sản: mắt cá ngừ đại dương, gỏi sứa.'
        ]
      },
      {
        day: 3,
        title: 'Biển đảo Phú Yên – Tuyệt tác của đá và nước',
        summary: 'Ghềnh Đá Đĩa – Nhà thờ Mằng Lăng – Đầm Ô Loan; chiều Mũi Điện – Bãi Môn – Bãi Xép/Ghềnh Ông.',
        activities: [
          'Sáng: Ghé Ghềnh Đá Đĩa – kiệt tác bazan lục/ngũ giác; tham quan Nhà thờ Mằng Lăng – nơi lưu giữ sách quốc ngữ đầu tiên.',
          'Trưa: Đầm Ô Loan – sò huyết trứ danh cùng hải sản tươi ngon.',
          'Chiều: Mũi Điện (Đại Lãnh) – điểm cực Đông trên đất liền, ngắm toàn cảnh Bãi Môn từ hải đăng; check‑in Bãi Xép – Ghềnh Ông (phim “Tôi thấy hoa vàng trên cỏ xanh”).',
          'Tối: Về trung tâm Tuy Hoà – khám phá ẩm thực đường phố khu Tháp Nghinh Phong.'
        ]
      },
      {
        day: 4,
        title: 'Cà phê – tạm biệt Tuy Hoà',
        summary: 'Thưởng thức cà phê sáng, mua đặc sản – ra sân bay TBB về Hà Nội.',
        activities: [
          'Sáng: Bữa sáng cuối tại Phú Yên; ghé quán cà phê không gian đẹp ở Tuy Hoà.',
          'Mua đặc sản: bò một nắng, muối kiến vàng, hải sản khô…',
          'Trưa: Trả phòng – xe đưa ra sân bay Tuy Hoà (TBB).',
          'Chiều: Bay về Hà Nội – kết thúc hành trình 4N3Đ đáng nhớ.'
        ]
      }
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
    introduction: `Chào Thu Nha Trang: Kỳ Nghỉ Cuối Năm "Xịn Xò" Với Combo Bay VNA & Ở Khách Sạn 4 Sao\n\nKhi những cơn gió heo may đầu mùa ghé thăm, còn gì tuyệt hơn là “trốn nắng” đến vịnh Nha Trang – một trong những vịnh biển đẹp nhất thế giới. Combo cuối năm siêu hấp dẫn này mang đến cho bạn một kỳ nghỉ đẳng cấp, tiện lợi và tràn đầy năng lượng để khép lại năm thật ý nghĩa.\n\nTrải Nghiệm Đẳng Cấp Từ Trên Không Tới Mặt Đất\n• Bay khứ hồi Vietnam Airlines – dịch vụ chuyên nghiệp, êm ái, đã bao gồm 23kg hành lý ký gửi mỗi chiều.\n\nNghỉ Dưỡng 4 Sao Trung Tâm – Chạm Biển Chỉ Một Bước Chân\n• Check-in Xavia Hotel 4*: vị trí đắc địa ngay trung tâm, sang đường là tới biển. Không gian kiến trúc hiện đại, sảnh sang trọng và đội ngũ nhân viên hiếu khách.\n\nPhòng Nghỉ Riêng Tư – Tiện Nghi – View Thành Phố/ Biển\n• Phòng trang nhã, nội thất ấm cúng, tiện nghi đầy đủ.\n• Một số hạng phòng có ban công lộng gió – nơi ngắm thành phố và vịnh biển xanh ngắt.\n• Điểm nhấn “must-try”: hồ bơi vô cực tầng cao – thả mình thư giãn, ngắm toàn cảnh Nha Trang lúc hoàng hôn.\n\nTrọn Gói Combo Đã Bao Gồm\n• Vé máy bay khứ hồi Hà Nội – Nha Trang của Vietnam Airlines (kèm 23kg hành lý).\n• 02 hoặc 03 đêm nghỉ tại khách sạn Xavia 4* sang trọng, vị trí trung tâm.\n• Buffet sáng tự chọn đa dạng mỗi ngày.\n• Miễn phí trà, cafe, nước suối trong phòng hàng ngày.\n• Miễn phí tiện ích: hồ bơi vô cực, phòng gym…\n\nGợi Ý Lịch Trình – Ăn Chơi “Chuẩn Nha Trang”\n• Sáng: tắm biển Trần Phú – cà phê view biển.\n• Trưa: hải sản tươi sống – bún chả cá – nem nướng Ninh Hòa.\n• Chiều: VinWonders/đảo Hòn Mun – lặn ngắm san hô.\n• Tối: dạo chợ đêm – ngắm thành phố từ SkyBar.\n\nLên Kế Hoạch Cho Chuyến Đi Tháng 11 Ngay Hôm Nay!\nSố chỗ có hạn vào mùa cao điểm cuối năm – hãy giữ chỗ sớm để có mức giá tốt và lựa chọn phòng/giờ bay đẹp.`,
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
      {
        day: 1,
        title: 'Hà Nội – Nha Trang',
        summary: 'Bay Vietnam Airlines đến Cam Ranh – nhận phòng khách sạn Xavia 4* khu trung tâm – dạo biển Trần Phú.',
        activities: [
          'Buổi sáng: Khởi hành từ Hà Nội tới Nha Trang – “viên ngọc xanh của Biển Đông”.',
          'Xe đưa đoàn về khách sạn nhận phòng và nghỉ ngơi.',
          'Buổi tối: Dạo bước ven biển Trần Phú, thưởng thức hải sản hoặc lắng nghe tiếng sóng trong ánh đèn lung linh.'
        ]
      },
      {
        day: 2,
        title: 'Khám phá biển đảo',
        summary: 'Cano tham quan Hòn Mun – Hòn Một – Hòn Tằm; lặn ngắm san hô, thể thao biển.',
        activities: [
          'Khởi động ngày mới với bữa sáng tại khách sạn.',
          'Cano đưa đoàn ra khơi: Hòn Mun – khu bảo tồn san hô rực rỡ; Hòn Một yên bình; Hòn Tằm – thiên đường nghỉ dưỡng.',
          'Trải nghiệm: lặn ngắm san hô, tắm biển nước trong vắt, tham gia các trò chơi thể thao biển (tuỳ chọn).'
        ]
      },
      {
        day: 3,
        title: 'Ẩm thực Nha Trang & văn hoá đặc sắc',
        summary: 'Thưởng thức đặc sản – thăm Tháp Bà Ponagar – tắm bùn khoáng thư giãn.',
        activities: [
          'Buổi sáng: Thưởng thức đặc sản địa phương: bún chả cá, nem nướng…',
          'Buổi chiều: Tham quan Tháp Bà Ponagar – di tích Chăm Pa linh thiêng.',
          'Trải nghiệm tắm bùn khoáng – liệu pháp thư giãn tái tạo năng lượng.',
          'Buổi tối: Tự do dạo chợ đêm, mua sắm quà lưu niệm, tận hưởng không khí biển.'
        ]
      },
      {
        day: 4,
        title: 'Nha Trang – Hà Nội',
        summary: 'Tự do tắm biển – cà phê bình minh – mua đặc sản – ra sân bay Cam Ranh về Hà Nội.',
        activities: [
          'Sáng tự do tắm biển hoặc nhâm nhi cà phê ngắm bình minh trên vịnh Nha Trang.',
          'Mua đặc sản địa phương (yến sào, hải sản khô) làm quà.',
          'Xe đưa đoàn ra sân bay Cam Ranh – đáp chuyến bay về Hà Nội, kết thúc hành trình.'
        ]
      }
    ]
  }
  ,
  // Tour quốc tế: Tây An - Lạc Dương - Khai Phong (Trung Quốc)
  {
    id: 5,
    title: 'Tây An - Lạc Dương - Khai Phong 6N5Đ | Bay thẳng Vietjet',
    location: 'Tây An – Lạc Dương – Khai Phong, Trung Quốc',
    country: 'china',
    continent: 'asia',
    price: 18990000,
    originalPrice: 19990000,
    duration: '6 ngày 5 đêm',
    groupSize: '20-25 người',
    rating: 4.8,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    category: 'cultural',
    isPopular: true,
    isOnSale: true,
    highlights: [
      'Bay thẳng Vietjet Air, tiết kiệm thời gian',
      'Trải nghiệm 2 chặng tàu cao tốc hiện đại',
      'Khách sạn 4 sao suốt hành trình',
      'HDV tiếng Việt am hiểu lịch sử',
      'Ẩm thực đặc trưng Tây An – Hà Nam'
    ],
    discount: 5,
    departureDate: '2025-10-22',
    availability: 'Nhiều ngày khởi hành',
    availableDates: ['2025-10-22','2025-10-29','2025-11-05','2025-11-19','2025-12-03','2025-12-17'],
    pricing: { adult: 18990000, child: 14242500, infant: 0 },
    description: 'Hành trình “xuyên không” qua bốn triều đại Tần – Hán – Đường – Minh, khám phá di sản thế giới và tinh hoa văn hoá Trung Hoa.',
    introduction: `HÀNH TRÌNH TÂY AN - LẠC DƯƠNG: Bước Vào Sử Thi Trung Hoa Hùng Vĩ 6N5Đ\n\nMột hành trình – bốn triều đại vang bóng. Chuyến đi đưa bạn “xuyên không” trở về hoàng kim Tần – Hán – Đường – Minh: kỳ quan Binh Mã Dũng, chùa Thiếu Lâm – tinh hoa võ học, Long Môn Thạch Động, Phủ Khai Phong – Đền Bao Công…\n\nĐiểm nhấn\n- Bay thẳng Vietjet Air: di chuyển nhanh, tối ưu thời gian.\n- 2 chặng tàu cao tốc hiện đại: ngắm Trung Hoa rộng lớn thoải mái.\n- Khách sạn 4 sao suốt hành trình.\n- Cam kết không ghé điểm mua sắm chỉ định.\n- HDV tiếng Việt chuyên nghiệp, am hiểu lịch sử.\n- Ẩm thực địa phương đặc sắc.`,
    itinerary: [
      {
        day: 1,
        title: 'Hà Nội – Tây An',
        summary: 'Buổi sáng xuất phát từ Hà Nội, chiều nhận phòng và dạo khu phố cổ; trải nghiệm ẩm thực đường phố Tây An.',
        activities: [
          'Buổi sáng: Xuất phát từ Hà Nội, đáp chuyến bay đến thành phố Tây An – cố đô của 13 triều đại Trung Hoa.',
          'Buổi chiều: Nhận phòng khách sạn, nghỉ ngơi và dạo quanh khu phố cổ.',
          'Trải nghiệm đặc sắc: Thưởng thức ẩm thực đường phố Tây An với món Mì Biang Biang trứ danh.'
        ]
      },
      {
        day: 2,
        title: 'Tây An – Binh Mã Dũng – Tháp Đại Nhạn',
        summary: 'Khám phá Binh Mã Dũng, ăn trưa địa phương và viếng Tháp Đại Nhạn; tối dạo Muslim Street.',
        activities: [
          'Buổi sáng: Tham quan Binh Mã Dũng – kỳ quan thứ 8 của thế giới, nơi lưu giữ đội quân đất nung hơn 2.000 năm tuổi.',
          'Buổi trưa: Ăn trưa tại nhà hàng địa phương, thưởng thức bánh bao hấp Tây An.',
          'Buổi chiều: Viếng thăm Tháp Đại Nhạn – biểu tượng văn hóa Phật giáo lâu đời.',
          'Buổi tối: Dạo phố Muslim Street, thưởng thức đồ ăn vặt độc đáo.'
        ]
      },
      {
        day: 3,
        title: 'Tây An – Lạc Dương',
        summary: 'Tàu cao tốc tới Lạc Dương, tham quan Long Môn Thạch Quật; tối tự do khám phá phố đêm.',
        activities: [
          'Buổi sáng: Lên tàu cao tốc đi Lạc Dương – cố đô hoa lệ.',
          'Buổi chiều: Tham quan Long Môn Thạch Quật – quần thể tượng Phật đá khổng lồ được UNESCO công nhận.',
          'Buổi tối: Tự do khám phá phố đêm Lạc Dương, trải nghiệm văn hóa dân gian.'
        ]
      },
      {
        day: 4,
        title: 'Thiếu Lâm Tự – Kungfu Show',
        summary: 'Chiêm bái Thiếu Lâm Tự – cái nôi võ thuật Trung Hoa; dự khán Kungfu Show hoành tráng.',
        activities: [
          'Buổi sáng: Khởi hành đi Tung Sơn, ghé thăm Thiếu Lâm Tự – cái nôi của võ thuật Trung Hoa.',
          'Buổi chiều: Dự khán Kungfu Show hoành tráng, nơi các võ tăng trình diễn kỹ năng tuyệt đỉnh.',
          'Trải nghiệm đặc sắc: Tìm hiểu thiền định và văn hóa Phật giáo tại chùa.'
        ]
      },
      {
        day: 5,
        title: 'Khai Phong – Đền Bao Công – Phủ Khai Phong',
        summary: 'Đến Khai Phong – kinh đô Bắc Tống xưa; thăm Đền Bao Công và Phủ Khai Phong; tối tản bộ hồ Long Đình.',
        activities: [
          'Buổi sáng: Đến thành phố Khai Phong – kinh đô Bắc Tống xưa. Tham quan Đền Bao Công, chiêm ngưỡng tượng Bao Chửng – biểu tượng công lý.',
          'Buổi chiều: Ghé Phủ Khai Phong – nơi tái hiện triều chính thời Tống.',
          'Buổi tối: Tản bộ quanh Hồ Long Đình thơ mộng.'
        ]
      },
      {
        day: 6,
        title: 'Khai Phong – Hà Nội',
        summary: 'Sáng tự do, trưa trả phòng ra sân bay; chiều bay về Hà Nội, kết thúc hành trình.',
        activities: [
          'Buổi sáng: Tự do mua sắm đặc sản Trung Hoa về làm quà.',
          'Buổi trưa: Trả phòng, di chuyển ra sân bay.',
          'Chiều: Đáp chuyến bay về Hà Nội, kết thúc hành trình.'
        ]
      }
    ]
  }
  ,
  // Hành Trình Khám Phá Trung Hoa: Bắc Kinh – Hàng Châu – Ô Trấn – Thượng Hải 7N6Đ
  {
    id: 6,
    title: 'Bắc Kinh – Hàng Châu – Ô Trấn – Thượng Hải 7N6Đ | Air China',
    location: 'Bắc Kinh – Hàng Châu – Ô Trấn – Thượng Hải, Trung Quốc',
    country: 'china',
    continent: 'asia',
    price: 21990000,
    originalPrice: 23990000,
    duration: '7 ngày 6 đêm',
    groupSize: '20-30 người',
    rating: 4.7,
    reviews: 72,
    image: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=1200&q=80',
    category: 'cultural',
    isPopular: true,
    isOnSale: true,
    highlights: [
      'Bay Air China – hành lý ký gửi tiêu chuẩn',
      'Bắc Kinh: Thiên An Môn, Tử Cấm Thành, Vạn Lý Trường Thành, Di Hoà Viên',
      'Giang Nam: Hàng Châu thơ mộng – du thuyền Tây Hồ',
      'Ô Trấn cổ kính – Venice phương Đông',
      'Thượng Hải hiện đại: The Bund, Phố Nam Kinh'
    ],
    discount: 8,
    departureDate: '2025-10-14',
    availability: 'Nhiều ngày khởi hành',
    availableDates: ['2025-10-14','2025-10-28','2025-10-31','2025-11-21','2025-11-28'],
    pricing: { adult: 21990000, child: 16492500, infant: 0 },
    description: 'Một hành trình – ba miền cảm xúc: Bắc Kinh oai hùng, Giang Nam thơ mộng, Thượng Hải năng động.',
    introduction: `Hành Trình Khám Phá Trung Hoa: Từ Đế Đô Bắc Kinh Ngàn Năm Đến Thượng Hải Hiện Đại\n\nChuyến đi 7N6Đ được thiết kế để đưa bạn qua ba miền cảm xúc khác biệt: phương Bắc uy nghiêm – Giang Nam thơ mộng – Thượng Hải hiện đại. Sáng đứng trên Vạn Lý Trường Thành hùng vĩ, tối hòa mình vào nhịp sống sầm uất Phố Nam Kinh. Đây là cơ hội để chiêm ngưỡng một Trung Hoa đa sắc màu và trọn vẹn nhất.\n\nChương 1: Bắc Kinh – vang vọng hơi thở đế đô\n- Thiên An Môn – Tử Cấm Thành: mê cung cung điện nguy nga, mái ngói lưu ly vàng óng.\n- Vạn Lý Trường Thành: “con rồng đá” uốn lượn qua núi non hùng vĩ.\n- Di Hòa Viên: cung điện mùa hè xa hoa, vườn cảnh tinh tế bên hồ Côn Minh.\n\nChương 2: Giang Nam mộng mơ – Hàng Châu, Ô Trấn\n- Hàng Châu: du thuyền Tây Hồ – cầu đá cong, hàng liễu rủ, chuyện tình thi ca.\n- Ô Trấn: cổ trấn sông nước yên bình – mái gỗ soi bóng kênh xanh, nhịp sống chậm rãi.\n\nChương 3: Thượng Hải năng động – nhịp đập tương lai\n- The Bund: đối lập ngoạn mục giữa kiến trúc Âu cổ và skyline Phố Đông.\n- Phố Nam Kinh: thiên đường mua sắm sầm uất, nhịp sống không ngủ.\n\nThời điểm lý tưởng: cuối tháng 10 – tháng 11 với tiết trời thu dịu mát. Liên hệ để giữ chỗ sớm cho các ngày khởi hành đã mở.`,
    itinerary: [
      {
        day: 1,
        title: 'Hà Nội – Bắc Kinh',
        summary: 'Khởi hành từ Hà Nội, đáp xuống thủ đô Bắc Kinh.',
        activities: [
          'Khởi hành từ Hà Nội, bạn sẽ đáp xuống thủ đô Bắc Kinh – trung tâm chính trị, văn hóa và lịch sử của Trung Quốc.',
          'Chuyến đi mở đầu với sự háo hức, chuẩn bị khám phá những điều kỳ thú phía trước.'
        ]
      },
      {
        day: 2,
        title: 'Bắc Kinh cổ kính',
        summary: 'Thiên An Môn – Tử Cấm Thành – Vạn Lý Trường Thành.',
        activities: [
          'Quảng trường Thiên An Môn rộng lớn, biểu tượng lịch sử của Trung Hoa.',
          'Tử Cấm Thành uy nghiêm – mê cung cung điện ngàn năm.',
          'Vạn Lý Trường Thành hùng vĩ – kỳ quan nhân loại, điểm check‑in không thể bỏ lỡ.'
        ]
      },
      {
        day: 3,
        title: 'Bắc Kinh – Hàng Châu',
        summary: 'Tàu cao tốc tới Hàng Châu – “thiên đường nơi hạ giới”.',
        activities: [
          'Di chuyển tới Hàng Châu bằng tàu cao tốc.',
          'Không khí thanh bình, sông hồ thơ mộng làm say mê du khách.'
        ]
      },
      {
        day: 4,
        title: 'Hàng Châu – văn hoá trà và lụa',
        summary: 'Văn hoá trà lâu đời và làng lụa nổi tiếng.',
        activities: [
          'Khám phá văn hoá trà lâu đời, thưởng thức trà Long Tỉnh.',
          'Thăm làng lụa, tìm hiểu nghề tơ lụa trứ danh của Hàng Châu.'
        ]
      },
      {
        day: 5,
        title: 'Ô Trấn – Venice phương Đông',
        summary: 'Cổ trấn sông nước – cầu đá – thuyền kênh đào.',
        activities: [
          'Dạo bước qua cầu đá, ngắm nhà gỗ soi bóng nước giữa dòng kênh uốn lượn.',
          'Ngồi thuyền giữa dòng, cảm giác như lạc vào bức tranh thuỷ mặc sống động.'
        ]
      },
      {
        day: 6,
        title: 'Thượng Hải hiện đại',
        summary: 'The Bund – Phố Nam Kinh – tháp Đông Phương Minh Châu – Tân Thiên Địa.',
        activities: [
          'Dạo The Bund về đêm – một bên Âu cổ, một bên skyline Phố Đông rực rỡ.',
          'Hòa mình vào dòng người trên Phố Nam Kinh sầm uất.',
          'Ngắm Tháp Đông Phương Minh Châu, khám phá khu Tân Thiên Địa sôi động.'
        ]
      },
      {
        day: 7,
        title: 'Thượng Hải – Hà Nội',
        summary: 'Kết thúc hành trình trở về Hà Nội.',
        activities: [
          'Tự do thời gian phù hợp, sau đó ra sân bay đáp chuyến bay về Hà Nội.',
          'Kết thúc hành trình với những kỷ niệm khó quên về Trung Hoa cổ kính và hiện đại.'
        ]
      }
    ]
  }
  ,
  // Giang Nam Mộng Mơ: Thượng Hải – Hàng Châu – Ô Trấn 5N4Đ
  {
    id: 7,
    title: 'Giang Nam Mộng Mơ 5N4Đ | Thượng Hải – Hàng Châu – Ô Trấn | Air China',
    location: 'Thượng Hải – Hàng Châu – Ô Trấn, Trung Quốc',
    country: 'china',
    continent: 'asia',
    price: 20990000,
    originalPrice: 21990000,
    duration: '5 ngày 4 đêm',
    groupSize: '20-30 người',
    rating: 4.7,
    reviews: 54,
    image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1200&q=80',
    category: 'cultural',
    isPopular: true,
    isOnSale: true,
    highlights: [
      'Bay Air China – hành lý ký gửi tiêu chuẩn',
      'Thượng Hải hiện đại: The Bund – Phố Nam Kinh',
      'Hàng Châu thơ mộng – du thuyền Tây Hồ',
      'Ô Trấn cổ kính – trải nghiệm dân gian',
      'Khách sạn 4* suốt hành trình'
    ],
    discount: 5,
    departureDate: '2025-10-21',
    availability: 'Nhiều ngày khởi hành',
    availableDates: ['2025-10-21','2025-10-28','2025-11-15','2025-11-22'],
    pricing: { adult: 20990000, child: 15742500, infant: 0 },
    description: 'Bản tình ca Giang Nam 5N4Đ: Thượng Hải năng động – Hàng Châu lãng mạn – Ô Trấn cổ kính.',
    introduction: `GIANG NAM MỘNG MƠ: Hành Trình 5N4Đ Khám Phá Thượng Hải - Hàng Châu - Ô Trấn\n\nNếu có một nơi chốn trong thi ca và hội họa Trung Hoa khiến lòng người say đắm nhất, đó hẳn là Giang Nam – miền đất của cầu đá cong, liễu rủ ven hồ và cổ trấn yên bình. Hành trình 5N4Đ đưa bạn rời xa thực tại để sống chậm giữa không gian lãng mạn ấy; khởi hành tiện lợi cùng Air China.\n\nChương 1: Thượng Hải – cánh cửa mở ra miền Giang Nam\n- Dạo bước The Bund, chiêm ngưỡng bức tranh đối lập giữa kiến trúc Âu cổ điển và skyline Phố Đông.\n- Hòa mình vào nhịp sống sầm uất Phố Nam Kinh – đại lộ mua sắm không ngủ.\n\nChương 2: Hàng Châu – “thiên đường hạ giới”\n- Du thuyền Tây Hồ, ngắm Tháp Lôi Phong từ xa, đi qua cầu đá, đê liễu.\n- Dừng chân uống trà Long Tỉnh, để tâm hồn lắng đọng giữa non nước.\n\nChương 3: Ô Trấn – trăm năm tĩnh tại\n- Cổ trấn sông nước bảo tồn nguyên vẹn: nhà gỗ, ngõ đá, cầu nhỏ xinh.\n- Đêm đèn lồng đỏ bên bờ kênh, nhịp chèo khua nước chậm rãi, bình yên.\n\nThời điểm lý tưởng: cuối tháng 10 – tháng 11, tiết trời thu dịu mát. Các ngày khởi hành: 21/10, 28/10, 15/11, 22/11. Giá chỉ từ 20.990.000đ/người.`,
    itinerary: [
      { day: 1, title: 'Hà Nội – Thượng Hải', summary: 'Bay Air China – nhận phòng – dạo The Bund và Phố Nam Kinh.' },
      { day: 2, title: 'Thượng Hải', summary: 'Khám phá The Bund – Phố Nam Kinh – các biểu tượng Phố Đông.' },
      { day: 3, title: 'Thượng Hải – Hàng Châu', summary: 'Tàu cao tốc – du thuyền Tây Hồ – thưởng trà Long Tỉnh.' },
      { day: 4, title: 'Hàng Châu – Ô Trấn', summary: 'Di chuyển Ô Trấn – khám phá cổ trấn ven kênh – đêm đèn lồng.' },
      { day: 5, title: 'Ô Trấn – Thượng Hải – Hà Nội', summary: 'Trở lại Thượng Hải – ra sân bay – kết thúc hành trình.' }
    ]
  }
  ,
  // Cáp Nhĩ Tân – Yabuli – Làng Tuyết Hương 5N4Đ (Harbin Ice & Snow)
  {
    id: 8,
    title: 'Cáp Nhĩ Tân 5N4Đ | Charter Vietjet – Yabuli – Làng Tuyết Hương',
    location: 'Harbin (Cáp Nhĩ Tân) – Yabuli – Làng Tuyết Hương, Hắc Long Giang, Trung Quốc',
    country: 'china',
    continent: 'asia',
    price: 31990000,
    originalPrice: 33990000,
    duration: '5 ngày 4 đêm',
    groupSize: 'Từ 2 khách trở lên',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    category: 'adventure',
    isPopular: true,
    isOnSale: true,
    highlights: [
      'Bay charter Vietjet Air – giờ bay đẹp, tiết kiệm thời gian',
      'Tặng 3 giờ trượt tuyết tại Yabuli (bao gồm dụng cụ cơ bản)',
      'Trải nghiệm xe ngựa kéo – Thập Lý Họa Lang',
      'Lễ hội băng đăng Harbin – thành phố băng rực rỡ ánh sáng',
      '01 bữa lẩu + 01 bữa nướng chất lượng cao',
      'Lưu trú khách sạn 4* + Homestay ngay Làng Tuyết Hương'
    ],
    discount: 6,
    departureDate: '2025-12-24',
    availability: 'Noel & tháng 1 – số chỗ charter có hạn',
    availableDates: ['2025-12-24','2026-01-07','2026-01-21'],
    pricing: { adult: 31990000, child: 23992500, infant: 0 },
    description: 'Nhật ký 5 ngày ở xứ sở băng tuyết: Harbin – Yabuli – Làng Tuyết Hương. Trải nghiệm trượt tuyết, xe ngựa trong rừng tuyết và lễ hội băng đăng choáng ngợp.',
    introduction: `NHẬT KÝ 5 NGÀY Ở XỨ SỞ BĂNG TUYẾT\n\nCáp Nhĩ Tân không chỉ là một điểm đến, mà là thế giới cổ tích giữa mùa đông. Hành trình 5N4Đ đưa bạn chạm vào tuyết trắng xốp, ngủ giữa Làng Tuyết Hương, trượt tuyết ở Yabuli và sững sờ trước “thành phố băng” Harbin rực rỡ ánh đèn. Bay charter Vietjet – giờ bay đẹp, hành trình gọn nhẹ cho mùa Noel và tháng 1.\n\nĐiểm nổi bật\n- Bay charter Vietjet Air – tiết kiệm thời gian, trọn vẹn trải nghiệm.\n- 3 giờ trượt tuyết tại Yabuli (bao gồm dụng cụ cơ bản).\n- Trải nghiệm xe ngựa kéo – Thập Lý Họa Lang.\n- Lễ hội băng đăng Harbin – tuyệt tác ánh sáng & băng đá.\n- 01 bữa lẩu + 01 bữa nướng chất lượng, khẩu phần phong phú.\n- Lưu trú khách sạn 4* & homestay ngay Làng Tuyết Hương.`,
    itinerary: [
      {
        day: 1,
        title: 'Hà Nội – Cáp Nhĩ Tân',
        summary: 'Chuyến bay charter đêm – đến Harbin, bắt đầu hành trình tuyết trắng.',
        activities: [
          'Chuyến bay charter thẳng buổi đêm, nghỉ ngơi trên máy bay.',
          'Đến Cáp Nhĩ Tân, cảm nhận cái lạnh khô trong lành của xứ tuyết – khởi đầu cuộc phiêu lưu.'
        ]
      },
      {
        day: 2,
        title: 'Làng Tuyết Hương',
        summary: 'Ở homestay làng tuyết – đêm đèn lồng đỏ ấm áp giữa mùa đông.',
        activities: [
          'Di chuyển đến Làng Tuyết Hương – mái nhà gỗ phủ tuyết như nấm.',
          'Tản bộ trong làng, chụp ảnh giữa khung cảnh tuyết trắng xốp, đêm đèn lồng rực rỡ.'
        ]
      },
      {
        day: 3,
        title: 'Yabuli – trượt tuyết & Thập Lý Họa Lang',
        summary: '3 giờ trượt tuyết Yabuli – xe ngựa kéo qua rừng tuyết.',
        activities: [
          'Trải nghiệm trượt tuyết lần đầu tại Yabuli – phấn khích và đầy tiếng cười.',
          'Buổi chiều: xe ngựa kéo thong dong qua “Thập Lý Họa Lang” lãng mạn.'
        ]
      },
      {
        day: 4,
        title: 'Harbin – Lễ hội băng đăng',
        summary: 'Choáng ngợp trước thành phố băng – thưởng thức bữa lẩu ấm nóng.',
        activities: [
          'Tham quan Lễ hội băng đăng Harbin – những lâu đài băng rực rỡ ánh sáng.',
          'Bữa tối: lẩu nóng hổi – kết thúc ngày trọn vẹn giữa mùa đông.'
        ]
      },
      {
        day: 5,
        title: 'Cáp Nhĩ Tân – Hà Nội',
        summary: 'Tự do – mua quà – ra sân bay về Hà Nội.',
        activities: [
          'Buổi sáng: dạo phố Cáp Nhĩ Tân, mua quà lưu niệm.',
          'Ra sân bay, kết thúc hành trình – mang theo ký ức về mùa đông đẹp nhất.'
        ]
      }
    ]
  }
  ,
  // Bản Giao Hưởng Mùa Đông: Cáp Nhĩ Tân 6N5Đ – Charter Vietjet
  {
    id: 9,
    title: 'Cáp Nhĩ Tân 6N5Đ | Charter Vietjet – Làng Tuyết Hương – Yabuli – Lễ hội băng đăng',
    location: 'Harbin (Cáp Nhĩ Tân) – Yabuli – Làng Tuyết Hương, Hắc Long Giang, Trung Quốc',
    country: 'china',
    continent: 'asia',
    price: 29990000,
    originalPrice: 35990000,
    duration: '6 ngày 5 đêm',
    groupSize: 'Từ 2 khách trở lên',
    rating: 4.9,
    reviews: 86,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    category: 'adventure',
    isPopular: true,
    isOnSale: true,
    highlights: [
      'Bay charter Vietjet Air – giờ bay đẹp, thuận tiện',
      'Ở homestay ngay Làng Tuyết Hương – sống giữa cổ tích tuyết trắng',
      '3 giờ trượt tuyết tại Yabuli (bao gồm dụng cụ cơ bản)',
      'Xe ngựa kéo xuyên “Thập Lý Họa Lang” lãng mạn',
      'Lễ hội băng đăng Harbin – thành phố băng rực rỡ',
      'Ẩm thực mùa đông: lẩu nóng, BBQ nướng – suất ăn phong phú',
      'Lưu trú khách sạn 4* & homestay bản địa'
    ],
    discount: 5,
    departureDate: '2025-12-14',
    availability: 'Noel & tháng 1 – số chỗ charter có hạn',
    availableDates: ['2025-12-14','2025-12-19','2025-12-28','2026-01-02','2026-01-11','2026-01-16','2026-01-25','2026-01-30'],
    pricing: { adult: 29990000, child: 22492500, infant: 0 },
    description: 'Bản giao hưởng mùa đông 6N5Đ: ở Làng Tuyết Hương, trượt tuyết Yabuli, lễ hội băng đăng Harbin – hành trình cổ tích giữa xứ tuyết.',
    introduction: `BẢN GIAO HƯỞNG MÙA ĐÔNG: Cáp Nhĩ Tân 6N5Đ\n\nGiấc mơ về một mùa đông trắng muốt được chạm đến trong hành trình 6N5Đ: ngủ giữa Làng Tuyết Hương, trượt tuyết ở Yabuli, choáng ngợp trước “thành phố băng” Harbin. Khởi hành thuận tiện bằng charter Vietjet Air.\n\nChương 1: Làng Tuyết Hương – nơi cổ tích bước ra đời thực\n- Những mái nhà gỗ phủ tuyết như nấm khổng lồ, đêm đèn lồng đỏ ấm áp.\n- Nghỉ homestay ngay trong làng để sống trọn vẹn giữa biển tuyết trắng.\n\nChương 2: Yabuli & Thập Lý Họa Lang – giai điệu phiêu lưu và lãng mạn\n- 3 giờ trượt tuyết tại Yabuli – đánh thức năng lượng và tiếng cười.\n- Xe ngựa kéo chầm chậm xuyên rừng tuyết “Thập Lý Họa Lang”.\n\nChương 3: Cáp Nhĩ Tân – bữa tiệc của băng đăng và ánh sáng\n- Lễ hội băng đăng Harbin – những lâu đài băng và ánh sáng kỳ ảo.\n- Ẩm thực mùa đông: lẩu nóng – BBQ nướng ấm cúng.\n\nThời điểm đẹp: Noel và tháng 1 – các chuyến charter dễ hết chỗ, nên giữ chỗ sớm.`,
    schedules: [
      {
        title: 'Lịch 6N5Đ',
        options: [
          { range: '14/12', time: '', price: 29990000 },
          { range: '19/12', time: '', price: 33990000 },
          { range: '28/12 [Tết Dương Lịch]', time: '', price: 35990000 },
          { range: '02/01', time: '', price: 33990000 },
          { range: '11/01', time: '', price: 33990000 },
          { range: '16/01', time: '', price: 33990000 },
          { range: '25/01', time: '', price: 33990000 },
          { range: '30/01', time: '', price: 29990000 }
        ]
      }
    ],
    itinerary: [
      { day: 1, title: 'Hà Nội – Cáp Nhĩ Tân', summary: 'Charter Vietjet – đến Harbin, bắt đầu câu chuyện tuyết trắng.' },
      { day: 2, title: 'Làng Tuyết Hương', summary: 'Ở homestay, tản bộ giữa làng tuyết – đêm đèn lồng.' },
      { day: 3, title: 'Yabuli – trượt tuyết', summary: '3 giờ trượt tuyết – chiều xe ngựa Thập Lý Họa Lang.' },
      { day: 4, title: 'Harbin – Lễ hội băng đăng', summary: 'Choáng ngợp trước thành phố băng – lẩu nóng/BBQ.' },
      { day: 5, title: 'Harbin – tự do', summary: 'Dạo phố, mua quà – thưởng thức ẩm thực địa phương.' },
      { day: 6, title: 'Cáp Nhĩ Tân – Hà Nội', summary: 'Ra sân bay – kết thúc hành trình mùa đông tuyệt đẹp.' }
    ]
  }
];

export const countries = [
  { key: 'vietnam', name: 'Việt Nam' },
  { key: 'china', name: 'Trung Quốc' }
];

export const getToursByCountry = (countryKey) => {
  return tours.filter(t => (t.country || '').toLowerCase() === (countryKey || '').toLowerCase());
};

export const getTourById = (id) => tours.find(t => t.id === Number(id));


