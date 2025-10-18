# 🎯 UNIFIED SERVICE FORM - 3 SECTIONS IN 1 PAGE

## Design Concept

**Single scrollable page** với 3 sections:
1. **Thông tin Tour** (Tour info)
2. **Thông tin Khách sạn** (Hotel info)  
3. **Thông tin Vé máy bay** (Flight info)

User scroll xuống để điền từng section.

---

## Layout Structure

```
┌──────────────────────────────────────────┐
│  Thêm Dịch Vụ Mới          [Lưu]        │
└──────────────────────────────────────────┘

Section 1: TOUR INFO
Section 2: HOTEL INFO  
Section 3: FLIGHT INFO

[Lưu tất cả]
```

---

## Implementation

File: `src/pages/admin/ServiceNew.jsx`

**State structure:**
```javascript
const [tourData, setTourData] = useState({...});
const [hotelData, setHotelData] = useState({...});
const [flightData, setFlightData] = useState({...});
```

**Save logic:**
- Merge all 3 sections
- Remove empty fields
- POST to backend

---

## Next Steps

Tôi sẽ tạo component với:
1. ✅ 3 sections trong 1 page
2. ✅ Scroll navigation
3. ✅ Smart save (chỉ upload data có giá trị)
4. ✅ Validation cho từng section

Bạn có muốn tôi tiếp tục implement không?
