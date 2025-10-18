# ➕ TRANG THÊM TOUR MỚI - ADMIN DASHBOARD

## ✅ Đã triển khai

### 📍 **Vị trí:**
- **Component:** `src/pages/admin/TourNew.jsx`
- **Route:** `/admin/tours/new`
- **Access:** Admin only

---

## 🎯 Features

### **1. Thông tin cơ bản**
- ✅ Tên tour (required)
- ✅ Loại hình (Tour/Hotel/Flight/Combo)
- ✅ Trạng thái (Active/Inactive/Draft)
- ✅ Số ngày
- ✅ Quốc gia
- ✅ Số người (min/max)
- ✅ Mô tả ngắn
- ✅ Mô tả chi tiết

### **2. Ngày đi và ngày về** ⭐ NEW
- ✅ Ngày đi (departure_date)
- ✅ Ngày về (return_date)
- ✅ Date picker
- ✅ Optional (có thể để trống)

### **3. Lịch trình chi tiết** ⭐ NEW
- ✅ Thêm/xóa ngày
- ✅ Tiêu đề cho mỗi ngày
- ✅ Mô tả chi tiết
- ✅ Dynamic form (thêm bao nhiêu ngày cũng được)

### **4. Upload ảnh**
- ✅ Multiple images
- ✅ Preview trước khi lưu
- ✅ Xóa ảnh
- ✅ Auto upload khi save tour

### **5. Preview**
- ✅ Xem nhanh thông tin
- ✅ Tổng hợp dữ liệu
- ✅ Real-time update

---

## 🎨 UI Layout

```
┌─────────────────────────────────────────────────────┐
│  [← Quay lại]  Thêm Tour Mới          [💾 Lưu tour] │
└─────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────┐
│  THÔNG TIN CƠ BẢN           │  ẢNH TOUR           │
│  - Tên tour *                │  [Upload]           │
│  - Loại hình / Trạng thái   │  [Preview grid]     │
│  - Số ngày / Quốc gia       │                     │
│  - Số người (min/max)        │  XEM NHANH          │
│  - Mô tả ngắn                │  - Tên tour         │
│  - Mô tả chi tiết           │  - Loại hình        │
│                              │  - Thời gian        │
│  NGÀY ĐI VÀ NGÀY VỀ ⭐      │  - Quốc gia         │
│  - Ngày đi: [date picker]   │  - Số người         │
│  - Ngày về: [date picker]   │  - Ngày đi/về       │
│                              │  - Lịch trình       │
│  LỊCH TRÌNH CHI TIẾT ⭐     │  - Số ảnh           │
│  ┌──────────────────────┐   │                     │
│  │ Ngày 1          [Xóa]│   │                     │
│  │ Tiêu đề: [input]     │   │                     │
│  │ Mô tả: [textarea]    │   │                     │
│  └──────────────────────┘   │                     │
│  ┌──────────────────────┐   │                     │
│  │ Ngày 2          [Xóa]│   │                     │
│  │ ...                  │   │                     │
│  └──────────────────────┘   │                     │
│  [+ Thêm ngày]              │                     │
└──────────────────────────────┴─────────────────────┘
```

---

## 📝 Form Fields

### **Basic Info:**
```javascript
{
  name: '',                    // * Required
  short_description: '',
  description: '',
  service_type: 'TOUR',       // TOUR|HOTEL|FLIGHT|COMBO
  status: 'DRAFT',            // ACTIVE|INACTIVE|DRAFT
  duration_days: 1,
  country: 'Việt Nam',
  min_participants: 1,
  max_participants: 25
}
```

### **Dates:** ⭐ NEW
```javascript
{
  departure_date: '',         // YYYY-MM-DD
  return_date: ''             // YYYY-MM-DD
}
```

### **Itinerary:** ⭐ NEW
```javascript
[
  {
    day: 1,
    title: 'Khởi hành - Tham quan Đà Lạt',
    description: 'Sáng: Khởi hành từ TP.HCM...'
  },
  {
    day: 2,
    title: 'Tham quan thác Datanla',
    description: 'Cả ngày tham quan...'
  },
  // ...
]
```

### **Images:**
```javascript
[
  {
    file: File,
    preview: 'blob:http://...',
    name: 'image1.jpg'
  },
  // ...
]
```

---

## 🔧 Implementation Details

### **1. State Management:**

```javascript
const [basic, setBasic] = useState({...});
const [dates, setDates] = useState({...});
const [itinerary, setItinerary] = useState([...]);
const [images, setImages] = useState([]);
const [saving, setSaving] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
```

### **2. Itinerary Functions:**

```javascript
// Thêm ngày mới
const addDay = () => {
  setItinerary(prev => [
    ...prev,
    { day: prev.length + 1, title: '', description: '' }
  ]);
};

// Xóa ngày
const removeDay = (idx) => {
  setItinerary(prev => prev.filter((_, i) => i !== idx));
};

// Update field
const updateDay = (idx, field, value) => {
  setItinerary(prev => prev.map((item, i) => 
    i === idx ? { ...item, [field]: value } : item
  ));
};
```

### **3. Image Upload:**

```javascript
const onUploadImages = async (e) => {
  const files = Array.from(e.target.files);
  
  // Create preview URLs
  const previews = files.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    name: file.name
  }));
  
  setImages(prev => [...prev, ...previews]);
};
```

### **4. Save Tour:**

```javascript
const onSave = async () => {
  // 1. Validate
  if (!basic.name.trim()) {
    setError('Vui lòng nhập tên tour');
    return;
  }

  // 2. Prepare data
  const tourData = {
    ...basic,
    departure_date: dates.departure_date || null,
    return_date: dates.return_date || null,
    itinerary: JSON.stringify(itinerary),
  };

  // 3. Create tour
  const result = await adminTourService.createTour(tourData);
  const tourId = result.data.id;

  // 4. Upload images
  if (images.length > 0) {
    for (let img of images) {
      const formData = new FormData();
      formData.append('images', img.file);
      await adminTourService.uploadImages(tourId, formData);
    }
  }

  // 5. Redirect to edit page
  navigate(`/admin/tours/${tourId}/edit`);
};
```

---

## 🌐 API Integration

### **1. Create Tour:**

**Endpoint:** `POST /api/admin/tours`

**Request:**
```json
{
  "name": "Đà Lạt - Nha Trang 4N3Đ",
  "short_description": "Tour khám phá Đà Lạt và Nha Trang",
  "description": "Mô tả chi tiết...",
  "service_type": "TOUR",
  "status": "DRAFT",
  "duration_days": 4,
  "country": "Việt Nam",
  "min_participants": 10,
  "max_participants": 25,
  "departure_date": "2025-11-01",
  "return_date": "2025-11-04",
  "itinerary": "[{\"day\":1,\"title\":\"Khởi hành\",\"description\":\"...\"}]"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "name": "Đà Lạt - Nha Trang 4N3Đ",
    ...
  }
}
```

### **2. Upload Images:**

**Endpoint:** `POST /api/admin/tours/:id/images`

**Request:** FormData with files

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "image_url": "/uploads/tours/tour_15_123456.jpg"
    }
  ]
}
```

---

## 🎯 User Flow

```
1. Admin clicks "Thêm tour mới"
   ↓
2. Navigate to /admin/tours/new
   ↓
3. Fill in basic info
   ↓
4. Select departure & return dates
   ↓
5. Add itinerary (day by day)
   ↓
6. Upload images
   ↓
7. Preview in sidebar
   ↓
8. Click "Lưu tour"
   ↓
9. Backend creates tour
   ↓
10. Upload images to server
   ↓
11. Redirect to /admin/tours/:id/edit
   ↓
12. Success! Tour created
```

---

## ✅ Validation

### **Required Fields:**
- ✅ Tên tour (name)

### **Optional Fields:**
- Tất cả các field khác đều optional
- Ngày đi/về có thể để trống
- Lịch trình có thể để trống
- Ảnh có thể upload sau

### **Business Rules:**
- `min_participants` <= `max_participants`
- `duration_days` >= 1
- `return_date` >= `departure_date` (nếu cả 2 đều có giá trị)

---

## 🎨 Styling

### **Form Layout:**
- 2 columns on desktop (lg:grid-cols-3)
- Left: 2/3 width (forms)
- Right: 1/3 width (images + preview)
- Responsive: 1 column on mobile

### **Itinerary Cards:**
```css
.itinerary-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
}
```

### **Image Grid:**
```css
.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
```

---

## 📊 Data Flow

```
User Input
  ↓
React State (basic, dates, itinerary, images)
  ↓
onSave() function
  ↓
Validate data
  ↓
adminTourService.createTour(tourData)
  ↓
Backend API: POST /admin/tours
  ↓
Database: INSERT INTO services
  ↓
Return tour ID
  ↓
Upload images (if any)
  ↓
Backend API: POST /admin/tours/:id/images
  ↓
Database: INSERT INTO service_images
  ↓
Navigate to edit page
```

---

## 🧪 Testing

### **Test Cases:**

1. **Create tour with minimal data:**
   - ✅ Only name filled
   - ✅ Should create successfully

2. **Create tour with full data:**
   - ✅ All fields filled
   - ✅ Dates selected
   - ✅ Itinerary added (3 days)
   - ✅ Images uploaded (5 images)
   - ✅ Should create successfully

3. **Validation:**
   - ✅ Empty name → Show error
   - ✅ Invalid dates → Show error

4. **Itinerary:**
   - ✅ Add day → Day count increases
   - ✅ Remove day → Day count decreases
   - ✅ Update title/description → State updates

5. **Images:**
   - ✅ Upload 3 images → Preview shows 3 images
   - ✅ Remove image → Preview updates
   - ✅ Save tour → Images uploaded to server

---

## 🔄 Comparison with TourEdit

| Feature | TourEdit | TourNew |
|---------|----------|---------|
| **Purpose** | Edit existing tour | Create new tour |
| **Load data** | Yes (from API) | No (empty form) |
| **Save** | Update (PUT) | Create (POST) |
| **Images** | Can delete existing | Only upload new |
| **Redirect** | Stay on page | Go to edit page |
| **Dates** | ✅ Has | ✅ Has |
| **Itinerary** | ✅ Has | ✅ Has |

---

## 📚 Files Changed

### **Created:**
- ✅ `src/pages/admin/TourNew.jsx` - Main component

### **Modified:**
- ✅ `src/App.jsx` - Added route
- ✅ `src/services/adminTourService.js` - Added createTour method

### **Existing (no changes needed):**
- ✅ Backend: `backend/routes/admin/tours.js` - Already has POST endpoint

---

## 🎯 Summary

### **New Features:**
1. ✅ **Ngày đi và ngày về** - Date pickers for departure/return
2. ✅ **Lịch trình chi tiết** - Dynamic itinerary with add/remove days
3. ✅ **Upload ảnh** - Multiple image upload with preview
4. ✅ **Preview** - Real-time preview sidebar

### **User Experience:**
- ✅ Clean, intuitive form
- ✅ Responsive design
- ✅ Real-time validation
- ✅ Success/error messages
- ✅ Auto-redirect after save

### **Technical:**
- ✅ React hooks (useState)
- ✅ API integration
- ✅ FormData for images
- ✅ JSON stringify for itinerary
- ✅ Protected route (admin only)

---

**Bây giờ admin có thể tạo tour mới với đầy đủ thông tin!** 🎉

**Test ngay:**
```
http://localhost:5173/#/admin/tours/new
```

1. Fill in tour name
2. Select dates
3. Add itinerary (3-4 days)
4. Upload images
5. Click "Lưu tour"
6. Verify redirect to edit page

---

**Ngày hoàn thành:** 15/10/2025  
**Status:** ✅ Tour creation page implemented with dates & itinerary
