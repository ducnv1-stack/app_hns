# Hướng dẫn Quản lý Loại hình Dịch vụ Động

## Tổng quan

Hệ thống đã được nâng cấp để hỗ trợ 4 loại hình dịch vụ với các trường thông tin riêng biệt:

1. **Tour du lịch** - Thông tin về tour, lịch trình
2. **Vé máy bay** - Thông tin chuyến bay, hãng hàng không
3. **Khách sạn** - Thông tin phòng, tiện nghi
4. **Combo** - Gói kết hợp nhiều dịch vụ

## Database Schema

### Bảng mới được tạo

1. **service_details_tour** - Chi tiết tour
   - `duration_days` - Số ngày
   - `country` - Quốc gia
   - `min_participants` - Số người tối thiểu
   - `max_participants` - Số người tối đa
   - `itinerary` - Lịch trình (JSON)

2. **service_details_flight** - Chi tiết vé máy bay
   - `airline` - Hãng hàng không
   - `flight_number` - Số hiệu chuyến bay
   - `departure_airport` - Sân bay đi
   - `arrival_airport` - Sân bay đến
   - `departure_time` - Giờ khởi hành
   - `arrival_time` - Giờ đến
   - `aircraft_type` - Loại máy bay
   - `baggage_allowance` - Hành lý
   - `seat_class` - Hạng ghế (Economy, Business, First Class)

3. **service_details_hotel** - Chi tiết khách sạn
   - `hotel_name` - Tên khách sạn
   - `hotel_address` - Địa chỉ
   - `star_rating` - Hạng sao (1-5)
   - `room_type` - Loại phòng
   - `bed_type` - Loại giường
   - `room_size` - Diện tích phòng (m²)
   - `max_occupancy` - Sức chứa tối đa
   - `amenities` - Tiện nghi (JSON array)
   - `check_in_time` - Giờ nhận phòng
   - `check_out_time` - Giờ trả phòng
   - `cancellation_policy` - Chính sách hủy

4. **service_details_combo** - Chi tiết combo
   - `includes_tour` - Bao gồm tour
   - `includes_hotel` - Bao gồm khách sạn
   - `includes_flight` - Bao gồm vé máy bay
   - `combo_description` - Mô tả combo
   - `special_offers` - Ưu đãi đặc biệt

## Backend API

### Endpoints mới

#### GET `/api/admin/tours/:id/content`
Lấy thông tin đầy đủ của dịch vụ, bao gồm `type_details` dựa trên `service_type`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 12,
    "name": "Vé máy bay HAN - SGN",
    "service_type": "FLIGHT",
    "type_details": {
      "airline": "Vietnam Airlines",
      "flight_number": "VN123",
      "departure_airport": "Nội Bài (HAN)",
      "arrival_airport": "Tân Sơn Nhất (SGN)",
      "departure_time": "08:00",
      "arrival_time": "10:00",
      "seat_class": "Economy"
    },
    "variants": [...],
    "images": [...],
    "availabilities": [...]
  }
}
```

#### PUT `/api/admin/tours/:id/type-details`
Cập nhật thông tin chi tiết theo loại dịch vụ

**Request body:**
```json
{
  "service_type": "FLIGHT",
  "details": {
    "airline": "Vietnam Airlines",
    "flight_number": "VN123",
    "departure_airport": "Nội Bài (HAN)",
    "arrival_airport": "Tân Sơn Nhất (SGN)",
    "departure_time": "08:00",
    "arrival_time": "10:00",
    "aircraft_type": "Boeing 787",
    "baggage_allowance": "23kg",
    "seat_class": "Economy"
  }
}
```

## Frontend Components

### ServiceTypeForms.jsx

Chứa 4 form components:

1. **TourDetailsForm** - Form cho tour du lịch
2. **FlightDetailsForm** - Form cho vé máy bay
3. **HotelDetailsForm** - Form cho khách sạn
4. **ComboDetailsForm** - Form cho combo

### TourView.jsx

Đã được cập nhật để:
- Hiển thị form động dựa trên `service_type`
- Lưu thông tin chi tiết vào bảng tương ứng
- Hiển thị thông tin chi tiết trong VIEW mode

## Cách sử dụng

### 1. Tạo dịch vụ mới

1. Vào Admin Dashboard → Quản lý Tours
2. Click "Tạo tour mới" (hoặc chỉnh sửa tour hiện có)
3. Chọn **Loại hình** từ dropdown:
   - Tour du lịch
   - Vé máy bay
   - Khách sạn
   - Combo

### 2. Chỉnh sửa thông tin cơ bản

- Tên
- Mô tả ngắn
- Giới thiệu
- Trạng thái

Click **"Lưu thông tin"**

### 3. Chỉnh sửa thông tin chi tiết

Form sẽ tự động thay đổi dựa trên loại hình đã chọn:

#### Tour du lịch
- Số ngày
- Quốc gia
- Số người tối thiểu/tối đa

#### Vé máy bay
- Hãng hàng không
- Số hiệu chuyến bay
- Sân bay đi/đến
- Giờ khởi hành/đến
- Loại máy bay
- Hành lý
- Hạng ghế

#### Khách sạn
- Tên khách sạn
- Địa chỉ
- Hạng sao
- Loại phòng
- Loại giường
- Diện tích
- Sức chứa
- Tiện nghi (checkbox)
- Giờ nhận/trả phòng
- Chính sách hủy

#### Combo
- Bao gồm (Tour/Hotel/Flight)
- Mô tả combo
- Ưu đãi đặc biệt

Click **"Lưu thông tin chi tiết"**

### 4. Upload ảnh

- Chọn file ảnh (có thể chọn nhiều)
- Ảnh sẽ được upload và hiển thị ngay

## Ví dụ

### Tạo vé máy bay

1. Loại hình: **Vé máy bay**
2. Tên: "Vé máy bay Hà Nội - TP.HCM"
3. Thông tin chi tiết:
   - Hãng: Vietnam Airlines
   - Số hiệu: VN123
   - Từ: Nội Bài (HAN)
   - Đến: Tân Sơn Nhất (SGN)
   - Giờ: 08:00 - 10:00
   - Hạng ghế: Economy

### Tạo khách sạn

1. Loại hình: **Khách sạn**
2. Tên: "Khách sạn Mường Thanh Luxury"
3. Thông tin chi tiết:
   - Tên KS: Mường Thanh Luxury
   - Địa chỉ: 60 Nguyễn Huệ, Q1, TP.HCM
   - Hạng sao: 5
   - Loại phòng: Deluxe
   - Diện tích: 35m²
   - Tiện nghi: ✓ wifi, ✓ pool, ✓ gym, ✓ breakfast

### Tạo combo

1. Loại hình: **Combo**
2. Tên: "Combo Phú Quốc 3N2Đ"
3. Thông tin chi tiết:
   - ✓ Tour du lịch
   - ✓ Khách sạn
   - ✓ Vé máy bay
   - Mô tả: Trọn gói tour Phú Quốc bao gồm vé máy bay khứ hồi, khách sạn 4 sao và tour tham quan
   - Ưu đãi: Giảm 20% cho đoàn từ 10 người

## Migration

File migration đã được tạo tại:
```
backend/migrations/add_service_type_details.sql
```

Chạy migration:
```bash
cd backend
node scripts/runMigration.js
```

## Testing

1. **Backend**: Server đã restart với API mới
2. **Frontend**: Mở `/admin/tours/:id` để test
3. **Database**: Kiểm tra các bảng `service_details_*`

## Lưu ý

- Khi thay đổi `service_type`, form sẽ tự động chuyển sang loại tương ứng
- Dữ liệu cũ vẫn được giữ nguyên trong DB
- Mỗi service chỉ có 1 record trong bảng detail tương ứng (UNIQUE constraint)
- Khi xóa service, detail records sẽ tự động xóa (ON DELETE CASCADE)

## Troubleshooting

### Form không hiển thị
- Kiểm tra `service_type` có đúng không
- Kiểm tra console có lỗi import component không

### Lưu thất bại
- Kiểm tra backend logs
- Verify migration đã chạy thành công
- Kiểm tra data type của các field

### Không load được dữ liệu
- Hard refresh (Ctrl+Shift+R)
- Kiểm tra API response trong Network tab
- Verify backend đã restart
