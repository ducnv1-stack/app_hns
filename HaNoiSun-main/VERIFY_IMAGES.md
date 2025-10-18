# Hướng dẫn kiểm tra hiển thị ảnh từ DB

## ✅ Backend đã sẵn sàng

1. **Database**: Tour ID 12 có 1 ảnh trong bảng `service_images`
2. **File**: Ảnh tồn tại tại `backend/uploads/tours/tour_12_1760153301889.png` (3.48 MB)
3. **API**: Endpoint `/api/tours` đã trả về mảng `images` cho mỗi tour
4. **Static files**: Server đang serve `/uploads` qua Express

## 🔍 Các bước kiểm tra

### Bước 1: Kiểm tra API trực tiếp
Mở trình duyệt và truy cập:
```
http://localhost:5000/api/tours?limit=5
```

Tìm tour ID 12, kiểm tra có field `images` như sau:
```json
{
  "id": "12",
  "name": "Đà Lạt - Nha Trang 4N3Đ",
  "images": [
    {
      "id": "1",
      "image_url": "/uploads/tours/tour_12_1760153301889.png",
      "is_primary": false,
      "sort_order": 1
    }
  ]
}
```

### Bước 2: Kiểm tra ảnh trực tiếp
Mở trình duyệt:
```
http://localhost:5000/uploads/tours/tour_12_1760153301889.png
```
Ảnh phải hiển thị (3.48 MB PNG)

### Bước 3: Kiểm tra trang test
Mở:
```
http://localhost:5173/#/test-images
```

Mở Console (F12) và xem:
- `📊 API Response:` - phải có mảng `images`
- `🖼️ TourCard 12: images array:` - phải có ảnh
- `✅ TourCard 12: Using first image:` - URL đầy đủ

### Bước 4: Hard refresh trang Tours
1. Mở `http://localhost:5173/#/tours`
2. Nhấn **Ctrl+Shift+R** (hard refresh)
3. Mở Console (F12)
4. Xem logs:
   - `🔍 useTours: Fetching with filters:`
   - `📊 useTours: API response:`
   - `✅ useTours: Using response.tours`
   - `🖼️ useTours: First tour images:`
   - `🖼️ TourCard 12: images array:`

## 🐛 Nếu vẫn không hiển thị

### Kiểm tra Console
Nếu thấy:
- `⚠️ useTours: Using fallback data` → API call thất bại
- `❌ useTours: API error` → Kiểm tra backend có chạy không

### Kiểm tra Network tab
1. Mở DevTools → Network
2. Filter: `tours`
3. Xem request `/api/tours?limit=50`
4. Kiểm tra Response có `images` array không

### Xóa cache hoàn toàn
1. DevTools → Application → Storage
2. Click "Clear site data"
3. Reload trang

## 📝 Expected Behavior

Khi mọi thứ hoạt động đúng:

1. **Console logs**:
```
🔍 useTours: Fetching with filters: {page: 1, limit: 50}
📊 useTours: API response: {tours: Array(11), pagination: {...}}
✅ useTours: Using response.tours ( 11 tours)
🖼️ useTours: First tour images: [{id: "1", image_url: "/uploads/tours/...", ...}]
🖼️ TourCard 12: images array: [{id: "1", image_url: "/uploads/tours/...", ...}]
✅ TourCard 12: Using first image: http://localhost:5000/uploads/tours/tour_12_1760153301889.png
```

2. **Hiển thị**: Tour "Đà Lạt - Nha Trang 4N3Đ" sẽ hiển thị ảnh đã upload thay vì placeholder

## 🎯 Nếu cần thêm ảnh cho tour khác

1. Vào Admin: `http://localhost:5173/#/admin/tours`
2. Click View (mắt) vào tour bất kỳ
3. Click "Chỉnh sửa"
4. Upload ảnh trong phần "Ảnh tour"
5. Quay lại trang Tours công khai và hard refresh
