# 🏠 CẬP NHẬT TOURS Ở TRANG CHỦ

## ✅ Thay đổi đã thực hiện

### **Trước:**
- Hiển thị tours demo từ file `src/data/tours.js`
- Data tĩnh, không kết nối database
- Hiển thị tất cả tours demo

### **Sau:**
- ✅ Lấy tours từ API `/api/tours`
- ✅ Kết nối với database thực
- ✅ Giới hạn **6 tours** hiển thị
- ✅ Có loading state
- ✅ Có empty state
- ✅ Cập nhật tiêu đề: "Tours Nổi Bật"

---

## 📝 Chi tiết thay đổi

### **File: `src/components/home/FeaturedTours.jsx`**

#### **1. Import API service:**
```javascript
import { api } from '../../services/api';
```

#### **2. Thêm state:**
```javascript
const [tours, setTours] = useState([]);
const [loading, setLoading] = useState(true);
```

#### **3. Load tours từ API:**
```javascript
useEffect(() => {
  loadTours();
}, []);

const loadTours = async () => {
  try {
    setLoading(true);
    const response = await api.get('/tours', { 
      limit: 6,        // Giới hạn 6 tours
      page: 1,
      category: 'TOUR' // Chỉ lấy tours
    });
    
    if (response.success && response.data.tours) {
      setTours(response.data.tours);
    }
  } catch (error) {
    console.error('Failed to load tours:', error);
  } finally {
    setLoading(false);
  }
};
```

#### **4. Transform data:**
```javascript
const featuredTours = useMemo(() => {
  return tours.map(tour => ({
    id: tour.id,
    title: tour.name,
    location: tour.country || 'Việt Nam',
    duration: `${tour.duration_days || 0} ngày`,
    groupSize: `${tour.min_participants || 1}-${tour.max_participants || 25} người`,
    price: parseFloat(tour.min_price || 0),
    originalPrice: tour.max_price ? parseFloat(tour.max_price) : null,
    rating: 4.8,
    reviews: 120,
    image: tour.images && tour.images.length > 0 
      ? tour.images[0].image_url 
      : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    highlights: tour.itinerary ? ['Hành trình khám phá', 'Trải nghiệm độc đáo'] : [],
    category: 'tour',
    continent: 'domestic',
    discount: null
  }));
}, [tours]);
```

#### **5. Loading state:**
```javascript
if (loading) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải tours...</p>
        </div>
      </div>
    </section>
  );
}
```

#### **6. Empty state:**
```javascript
{filteredTours.length === 0 && (
  <div className="text-center py-12">
    <p className="text-gray-500 text-lg">Không có tour nào</p>
  </div>
)}
```

---

## 🎨 Giao diện

### **Trang chủ sẽ hiển thị:**

```
┌─────────────────────────────────────────────────────┐
│              Tours Nổi Bật                          │
│  Khám phá những tour du lịch hấp dẫn nhất          │
└─────────────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┐
│ Tất Cả(6)│Trong Nước│ Quốc Tế  │  Cao Cấp │
└──────────┴──────────┴──────────┴──────────┘

┌─────────┐  ┌─────────┐  ┌─────────┐
│ Tour 1  │  │ Tour 2  │  │ Tour 3  │
│ [Image] │  │ [Image] │  │ [Image] │
│ Title   │  │ Title   │  │ Title   │
│ Price   │  │ Price   │  │ Price   │
└─────────┘  └─────────┘  └─────────┘

┌─────────┐  ┌─────────┐  ┌─────────┐
│ Tour 4  │  │ Tour 5  │  │ Tour 6  │
│ [Image] │  │ [Image] │  │ [Image] │
│ Title   │  │ Title   │  │ Title   │
│ Price   │  │ Price   │  │ Price   │
└─────────┘  └─────────┘  └─────────┘

        [Xem Tất Cả Tours]
```

---

## 🔍 Data Mapping

### **Database → Frontend:**

| Database Field | Frontend Display |
|----------------|------------------|
| `name` | Tour title |
| `country` | Location |
| `duration_days` | Duration (X ngày) |
| `min_participants` - `max_participants` | Group size |
| `min_price` | Price |
| `max_price` | Original price (strikethrough) |
| `images[0].image_url` | Tour image |
| `itinerary` | Highlights |

---

## 🧪 Testing

### **1. Kiểm tra API:**
```bash
curl http://localhost:5000/api/tours?limit=6&page=1&category=TOUR
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "tours": [
      {
        "id": 1,
        "name": "Buôn Mê Thuột - Pleiku 4N3Đ",
        "country": "Việt Nam",
        "duration_days": 4,
        "min_participants": 1,
        "max_participants": 25,
        "min_price": "800000.00",
        "max_price": "2500000.00",
        "images": [...]
      },
      ...
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 11
    }
  }
}
```

### **2. Kiểm tra Frontend:**

1. Mở trang chủ: `http://localhost:5173`
2. Scroll xuống phần "Tours Nổi Bật"
3. Kiểm tra:
   - ✅ Hiển thị đúng 6 tours
   - ✅ Hiển thị loading khi đang tải
   - ✅ Hiển thị thông tin tour từ database
   - ✅ Click vào tour redirect đến `/tours/:id`
   - ✅ Click "Xem Tất Cả Tours" redirect đến `/tours`

---

## 📊 So sánh

### **Trước (Demo Data):**
```javascript
// src/data/tours.js
export const tours = [
  {
    id: 1,
    title: "Combo Hạ Long - Sapa 5N4Đ",
    price: 8500000,
    // ... static data
  },
  // ... 20+ tours
];
```

### **Sau (Real Data):**
```javascript
// API call
const response = await api.get('/tours', { limit: 6 });

// Database query
SELECT * FROM services 
WHERE service_type = 'TOUR' 
AND status = 'ACTIVE'
LIMIT 6;
```

---

## 🎯 Lợi ích

### **1. Dynamic Content:**
- Admin có thể thêm/sửa/xóa tours từ admin panel
- Trang chủ tự động cập nhật

### **2. Performance:**
- Chỉ load 6 tours thay vì tất cả
- Giảm data transfer

### **3. Consistency:**
- Tours ở trang chủ giống tours ở trang Tours
- Cùng source data từ database

### **4. Scalability:**
- Dễ dàng thêm filters (featured, popular, new)
- Dễ dàng thay đổi số lượng hiển thị

---

## 🔧 Customization

### **Thay đổi số lượng tours:**
```javascript
const response = await api.get('/tours', { 
  limit: 8, // Thay đổi từ 6 thành 8
  page: 1
});
```

### **Chỉ hiển thị tours nổi bật:**
```javascript
const response = await api.get('/tours', { 
  limit: 6,
  featured: true // Thêm filter
});
```

### **Sort theo giá:**
```javascript
const response = await api.get('/tours', { 
  limit: 6,
  sort: 'price_asc' // Sắp xếp giá tăng dần
});
```

---

## ✅ Checklist

- [x] Xóa import tours demo
- [x] Thêm API call
- [x] Transform data
- [x] Thêm loading state
- [x] Thêm empty state
- [x] Cập nhật tiêu đề
- [x] Giới hạn 6 tours
- [x] Test API
- [x] Test Frontend

---

**Tóm tắt:** Trang chủ giờ hiển thị 6 tours thực từ database thay vì tours demo. Data được load từ API `/api/tours` với limit=6.
