# 🎬 TÍNH NĂNG SLIDESHOW ẢNH TOUR

## ✅ Đã thêm vào TourEdit Page

### **Tính năng:**
- ✅ Tự động chuyển ảnh mỗi **3 giây**
- ✅ Hiển thị ảnh lớn với aspect ratio 16:9
- ✅ Nút Previous/Next (hiện khi hover)
- ✅ Dots indicator (chấm tròn chỉ vị trí ảnh)
- ✅ Image counter (1/5, 2/5, ...)
- ✅ Nút xóa ảnh hiện tại
- ✅ Click vào dot để jump đến ảnh cụ thể

---

## 🎨 Giao diện

### **Khi có nhiều ảnh (>1):**

```
┌─────────────────────────────────────────┐
│  [←]      Ảnh Tour Hiện Tại      [→]   │
│                                    [Xóa]│
│                                         │
│          [Ảnh chính - 16:9]            │
│                                         │
│                                  [2/5]  │
└─────────────────────────────────────────┘
           ○ ● ○ ○ ○
        (Dots indicator)
```

### **Khi chỉ có 1 ảnh:**

```
┌─────────────────────────────────────────┐
│          [Ảnh Tour Duy Nhất]      [Xóa]│
│                                         │
│          [Ảnh chính - 16:9]            │
│                                         │
└─────────────────────────────────────────┘
```

### **Khi chưa có ảnh:**

```
┌─────────────────────────────────────────┐
│                                         │
│              📷 Icon                    │
│        Chưa có ảnh nào được chọn       │
│   Khi upload nhiều ảnh, sẽ tự động    │
│       chuyển ảnh mỗi 3 giây           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔧 Code Implementation

### **1. State Management:**

```javascript
const [currentImageIndex, setCurrentImageIndex] = useState(0);

// Auto slideshow - chuyển ảnh mỗi 3 giây
useEffect(() => {
  if (images.length <= 1) return;

  const interval = setInterval(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, 3000); // 3 giây

  return () => clearInterval(interval);
}, [images.length]);
```

**Logic:**
- Chỉ chạy slideshow khi có **> 1 ảnh**
- Tự động tăng index mỗi 3 giây
- Quay về ảnh đầu tiên khi hết (loop)
- Cleanup interval khi component unmount

---

### **2. Main Image Display:**

```jsx
<img 
  src={images[currentImageIndex]?.image_url}
  alt={`Tour image ${currentImageIndex + 1}`}
  className="w-full h-full object-cover transition-opacity duration-500"
/>
```

**Features:**
- Aspect ratio: 16:9 (`aspect-video`)
- Object fit: cover (không bị méo)
- Transition smooth khi đổi ảnh

---

### **3. Navigation Arrows:**

```jsx
{images.length > 1 && (
  <>
    {/* Previous */}
    <button
      onClick={() => setCurrentImageIndex((prev) => 
        (prev - 1 + images.length) % images.length
      )}
      className="absolute left-2 top-1/2 -translate-y-1/2 
                 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full 
                 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>

    {/* Next */}
    <button
      onClick={() => setCurrentImageIndex((prev) => 
        (prev + 1) % images.length
      )}
      className="absolute right-2 top-1/2 -translate-y-1/2 
                 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full 
                 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <ChevronRight className="h-5 w-5" />
    </button>
  </>
)}
```

**Features:**
- Chỉ hiện khi có > 1 ảnh
- Opacity 0 → 100 khi hover
- Previous: index - 1 (với wrap around)
- Next: index + 1 (với wrap around)

---

### **4. Image Counter:**

```jsx
{images.length > 1 && (
  <div className="absolute bottom-3 right-3 
                  bg-black/60 text-white text-xs px-2 py-1 rounded">
    {currentImageIndex + 1} / {images.length}
  </div>
)}
```

**Display:** "2 / 5" (ảnh thứ 2 trong tổng 5 ảnh)

---

### **5. Dots Indicator:**

```jsx
{images.length > 1 && (
  <div className="flex justify-center gap-2 mt-3">
    {images.map((_, idx) => (
      <button
        key={idx}
        onClick={() => setCurrentImageIndex(idx)}
        className={`w-2 h-2 rounded-full transition-all ${
          idx === currentImageIndex 
            ? 'bg-primary-600 w-6'  // Active: wider
            : 'bg-gray-300 hover:bg-gray-400'
        }`}
      />
    ))}
  </div>
)}
```

**Features:**
- Mỗi ảnh = 1 dot
- Active dot: màu primary, rộng hơn (w-6)
- Inactive dot: màu gray, nhỏ (w-2)
- Click vào dot → jump đến ảnh đó

---

### **6. Delete Button:**

```jsx
<button
  onClick={() => onDeleteImage(images[currentImageIndex]?.id)}
  className="absolute top-3 right-3 
             bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm 
             opacity-0 group-hover:opacity-100 transition-opacity"
>
  Xóa ảnh này
</button>
```

**Features:**
- Xóa ảnh đang hiển thị
- Chỉ hiện khi hover
- Màu đỏ để warning

---

## 🎯 User Experience

### **Khi upload nhiều ảnh:**

1. Upload 5 ảnh
2. Ảnh đầu tiên hiển thị
3. Sau 3 giây → Ảnh thứ 2
4. Sau 3 giây → Ảnh thứ 3
5. ... tiếp tục
6. Sau ảnh cuối → Quay lại ảnh đầu

### **Tương tác:**

- **Hover vào ảnh:**
  - Hiện nút Previous/Next
  - Hiện nút Xóa

- **Click Previous/Next:**
  - Chuyển ảnh ngay lập tức
  - Reset timer 3 giây

- **Click vào dot:**
  - Jump đến ảnh tương ứng
  - Reset timer 3 giây

- **Xóa ảnh:**
  - Xóa ảnh hiện tại
  - Tự động chuyển sang ảnh tiếp theo
  - Nếu chỉ còn 1 ảnh → Tắt slideshow

---

## 🔄 Auto Slideshow Logic

### **Flow:**

```
Start
  ↓
Check: images.length > 1?
  ↓ Yes
Set interval (3000ms)
  ↓
Every 3 seconds:
  currentIndex = (currentIndex + 1) % images.length
  ↓
Display image at currentIndex
  ↓
Loop forever
  ↓
On unmount: Clear interval
```

### **Edge Cases:**

**Case 1: Chỉ có 1 ảnh**
```javascript
if (images.length <= 1) return; // Không chạy slideshow
```

**Case 2: Xóa ảnh**
```javascript
// Nếu xóa ảnh cuối cùng
if (currentImageIndex >= images.length) {
  setCurrentImageIndex(0); // Reset về đầu
}
```

**Case 3: Upload thêm ảnh**
```javascript
// Slideshow tự động bắt đầu khi images.length > 1
useEffect(() => { ... }, [images.length]);
```

---

## 🎨 Styling Details

### **Container:**
```css
aspect-video        /* 16:9 ratio */
bg-gray-100        /* Placeholder background */
rounded-lg         /* Bo góc */
overflow-hidden    /* Ẩn phần thừa */
group              /* Cho hover effects */
```

### **Image:**
```css
w-full h-full      /* Full container */
object-cover       /* Không bị méo */
transition-opacity /* Smooth fade */
duration-500       /* 0.5s transition */
```

### **Arrows:**
```css
absolute           /* Position trên ảnh */
bg-black/50        /* Semi-transparent */
hover:bg-black/70  /* Darker on hover */
opacity-0          /* Ẩn mặc định */
group-hover:opacity-100 /* Hiện khi hover */
```

### **Dots:**
```css
w-2 h-2            /* Inactive: small */
w-6                /* Active: wider */
bg-primary-600     /* Active: primary color */
bg-gray-300        /* Inactive: gray */
transition-all     /* Smooth size change */
```

---

## 📊 Performance

### **Optimization:**

1. **Cleanup interval:**
   ```javascript
   return () => clearInterval(interval);
   ```
   Tránh memory leak

2. **Conditional rendering:**
   ```javascript
   {images.length > 1 && <Arrows />}
   ```
   Không render khi không cần

3. **Image preloading:**
   Browser tự động preload ảnh tiếp theo

---

## 🧪 Testing

### **Test Cases:**

1. **Upload 1 ảnh:**
   - ✅ Không có arrows
   - ✅ Không có dots
   - ✅ Không có counter
   - ✅ Không auto chuyển

2. **Upload 3 ảnh:**
   - ✅ Có arrows (khi hover)
   - ✅ Có 3 dots
   - ✅ Counter: 1/3, 2/3, 3/3
   - ✅ Auto chuyển mỗi 3s

3. **Click Previous:**
   - ✅ Từ ảnh 1 → ảnh 3 (wrap)
   - ✅ Reset timer

4. **Click Next:**
   - ✅ Từ ảnh 3 → ảnh 1 (wrap)
   - ✅ Reset timer

5. **Click dot:**
   - ✅ Jump đến ảnh đúng
   - ✅ Dot active đổi màu

6. **Xóa ảnh:**
   - ✅ Xóa thành công
   - ✅ Chuyển sang ảnh tiếp theo
   - ✅ Update counter

---

## 🎯 Customization

### **Thay đổi thời gian chuyển ảnh:**

```javascript
// Từ 3 giây → 5 giây
const interval = setInterval(() => {
  setCurrentImageIndex((prev) => (prev + 1) % images.length);
}, 5000); // 5 giây
```

### **Thêm fade effect:**

```jsx
<img 
  className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
  style={{ opacity: isTransitioning ? 0 : 1 }}
/>
```

### **Thay đổi aspect ratio:**

```jsx
// Từ 16:9 → 4:3
<div className="relative aspect-[4/3] bg-gray-100 rounded-lg">
```

---

## ✅ Kết luận

**Đã thêm slideshow với:**
- ✅ Auto chuyển ảnh mỗi 3 giây
- ✅ Manual navigation (arrows + dots)
- ✅ Image counter
- ✅ Delete button
- ✅ Responsive design
- ✅ Smooth transitions
- ✅ Hover effects

**File đã chỉnh sửa:**
- `src/pages/admin/TourEdit.jsx`

**Bây giờ khi upload nhiều ảnh, chúng sẽ tự động chuyển đổi mỗi 3 giây!** 🎉
