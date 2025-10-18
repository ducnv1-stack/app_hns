# 🔍 SLIDESHOW DEBUG GUIDE

## ❌ Vấn đề

**Triệu chứng:**
- Upload 3 ảnh
- Chỉ hiển thị ảnh đầu tiên
- Không có slideshow tự động
- Không chuyển ảnh

---

## ✅ Đã fix

### **1. Sửa useEffect dependency**

**Trước (SAI):**
```javascript
useEffect(() => {
  if (images.length <= 1) return;
  
  const interval = setInterval(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, 3000);
  
  return () => clearInterval(interval);
}, [images.length]); // ← Chỉ theo dõi length
```

**Vấn đề:**
- Khi upload ảnh mới, `images` thay đổi nhưng `images.length` có thể giữ nguyên
- Interval không được tạo lại
- Slideshow không hoạt động

**Sau (ĐÚNG):**
```javascript
useEffect(() => {
  if (images.length <= 1) {
    setCurrentImageIndex(0);
    return;
  }

  console.log('🎬 Starting slideshow with', images.length, 'images');
  
  const interval = setInterval(() => {
    setCurrentImageIndex((prev) => {
      const next = (prev + 1) % images.length;
      console.log('📸 Slideshow: changing from', prev, 'to', next);
      return next;
    });
  }, 3000);

  return () => {
    console.log('🛑 Stopping slideshow');
    clearInterval(interval);
  };
}, [images]); // ← Theo dõi toàn bộ images array
```

---

### **2. Thêm reset index**

```javascript
// Reset index khi images thay đổi
useEffect(() => {
  if (currentImageIndex >= images.length && images.length > 0) {
    setCurrentImageIndex(0);
  }
}, [images, currentImageIndex]);
```

**Tại sao cần:**
- Khi xóa ảnh, `currentImageIndex` có thể vượt quá `images.length`
- Cần reset về 0 để tránh lỗi

---

### **3. Thêm debug info**

```jsx
{/* Debug info */}
{images.length > 1 && (
  <div className="mb-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">
    🎬 Slideshow active: {images.length} ảnh | Hiện tại: ảnh {currentImageIndex + 1}
  </div>
)}
```

**Hiển thị:**
```
🎬 Slideshow active: 3 ảnh | Hiện tại: ảnh 1
→ Sau 3s: ảnh 2
→ Sau 3s: ảnh 3
→ Sau 3s: ảnh 1 (loop)
```

---

## 🧪 Cách test

### **Bước 1: Mở DevTools**
- F12 → Console tab

### **Bước 2: Upload 3 ảnh**
- Chọn file input
- Upload 3 ảnh

### **Bước 3: Xem Console logs**

**Expected logs:**
```
🎬 Starting slideshow with 3 images
📸 Slideshow: changing from 0 to 1
📸 Slideshow: changing from 1 to 2
📸 Slideshow: changing from 2 to 0
📸 Slideshow: changing from 0 to 1
...
```

### **Bước 4: Xem UI**

**Phải thấy:**
- ✅ "Ảnh tour (3 ảnh)" ở header
- ✅ "🎬 Slideshow active: 3 ảnh | Hiện tại: ảnh 1"
- ✅ Ảnh tự động chuyển mỗi 3 giây
- ✅ Counter "1/3", "2/3", "3/3"
- ✅ Dots indicator (3 chấm)

---

## 🔍 Troubleshooting

### **Case 1: Vẫn không chuyển ảnh**

**Check:**
1. Console có log "🎬 Starting slideshow"?
   - ❌ Không → `images.length` vẫn <= 1
   - ✅ Có → Tiếp tục check

2. Console có log "📸 Slideshow: changing..."?
   - ❌ Không → Interval không chạy
   - ✅ Có → Tiếp tục check

3. UI có update?
   - ❌ Không → React không re-render
   - ✅ Có → OK!

**Giải pháp:**
```javascript
// Force re-render bằng cách log state
useEffect(() => {
  console.log('📊 Images state:', images.length, images);
  console.log('📍 Current index:', currentImageIndex);
}, [images, currentImageIndex]);
```

---

### **Case 2: Chỉ thấy 1 ảnh trong state**

**Check API response:**
```javascript
const load = async () => {
  const data = await adminTourService.getTourContent(id);
  console.log('📷 Images from API:', data.images);
  setImages(data.images || []);
};
```

**Nếu API trả về 1 ảnh:**
- Check database: `SELECT * FROM service_images WHERE service_id = 12`
- Check upload function có lưu đúng không

---

### **Case 3: Upload thành công nhưng không hiển thị**

**Check upload function:**
```javascript
const onUploadImages = async (e) => {
  const files = Array.from(e.target.files);
  console.log('📤 Uploading', files.length, 'files');
  
  // ... upload logic
  
  // Sau khi upload xong
  const newImages = await uploadResult;
  console.log('✅ Upload complete:', newImages);
  
  setImages(prev => {
    const updated = [...prev, ...newImages];
    console.log('📊 Updated images state:', updated);
    return updated;
  });
};
```

---

## 📊 State Flow

### **Normal Flow:**

```
1. Page load
   ↓
   images = []
   currentImageIndex = 0
   ↓
2. Load tour data
   ↓
   images = [img1, img2, img3]
   ↓
3. useEffect triggers (images changed)
   ↓
   images.length = 3 > 1
   ↓
4. Start interval
   ↓
   Every 3s: currentImageIndex++
   ↓
5. UI updates with new image
```

### **Upload Flow:**

```
1. User selects 3 files
   ↓
2. onUploadImages called
   ↓
3. Upload to backend
   ↓
4. Backend saves & returns image URLs
   ↓
5. setImages([...prev, ...newImages])
   ↓
6. useEffect triggers (images changed)
   ↓
7. Start slideshow
```

---

## 🎯 Expected Behavior

### **Khi có 1 ảnh:**
- ❌ Không có slideshow
- ❌ Không có arrows
- ❌ Không có dots
- ❌ Không có counter
- ✅ Chỉ hiển thị ảnh tĩnh

### **Khi có 2+ ảnh:**
- ✅ Slideshow tự động (3s)
- ✅ Arrows (khi hover)
- ✅ Dots indicator
- ✅ Counter (1/3, 2/3, ...)
- ✅ Debug info hiển thị

### **Khi click arrow:**
- ✅ Chuyển ảnh ngay lập tức
- ✅ Interval reset (bắt đầu đếm 3s mới)

### **Khi click dot:**
- ✅ Jump đến ảnh tương ứng
- ✅ Interval reset

---

## 🔧 Quick Debug Commands

### **Check images state:**
```javascript
// Trong component
console.log('Images:', images);
console.log('Images length:', images.length);
console.log('Current index:', currentImageIndex);
```

### **Check interval:**
```javascript
// Trong useEffect
const interval = setInterval(() => {
  console.log('⏰ Interval tick');
  setCurrentImageIndex(prev => {
    console.log('Old index:', prev);
    const next = (prev + 1) % images.length;
    console.log('New index:', next);
    return next;
  });
}, 3000);
```

### **Force trigger:**
```javascript
// Thêm button test
<button onClick={() => {
  console.log('🔄 Manual trigger');
  setCurrentImageIndex((prev) => (prev + 1) % images.length);
}}>
  Next Image (Manual)
</button>
```

---

## ✅ Verification Checklist

Sau khi fix, verify:

- [ ] Upload 3 ảnh
- [ ] Console log "🎬 Starting slideshow with 3 images"
- [ ] UI hiển thị "Ảnh tour (3 ảnh)"
- [ ] UI hiển thị "🎬 Slideshow active: 3 ảnh"
- [ ] Ảnh tự động chuyển sau 3 giây
- [ ] Console log "📸 Slideshow: changing from X to Y"
- [ ] Counter update: 1/3 → 2/3 → 3/3 → 1/3
- [ ] Dots indicator update
- [ ] Click arrow → chuyển ảnh
- [ ] Click dot → jump đến ảnh
- [ ] Hover → hiện arrows và delete button

---

## 📝 Common Mistakes

### **1. Dependency array sai**
```javascript
// ❌ SAI
useEffect(() => { ... }, [images.length]);

// ✅ ĐÚNG
useEffect(() => { ... }, [images]);
```

### **2. Không cleanup interval**
```javascript
// ❌ SAI
useEffect(() => {
  setInterval(() => { ... }, 3000);
}, [images]);

// ✅ ĐÚNG
useEffect(() => {
  const interval = setInterval(() => { ... }, 3000);
  return () => clearInterval(interval);
}, [images]);
```

### **3. Index out of bounds**
```javascript
// ❌ SAI
const img = images[currentImageIndex];

// ✅ ĐÚNG
const img = images[currentImageIndex] || images[0];
// Hoặc
if (currentImageIndex >= images.length) {
  setCurrentImageIndex(0);
}
```

---

## 🎯 Kết luận

**Đã fix:**
- ✅ useEffect dependency từ `[images.length]` → `[images]`
- ✅ Thêm reset index logic
- ✅ Thêm console logs để debug
- ✅ Thêm UI debug info

**Bây giờ slideshow sẽ hoạt động khi upload nhiều ảnh!**

---

**Ngày cập nhật:** 15/10/2025  
**File:** `src/pages/admin/TourEdit.jsx`
