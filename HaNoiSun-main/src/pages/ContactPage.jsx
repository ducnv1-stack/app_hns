import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Bạn cần điền đầy đủ thông tin *';
    if (!form.address.trim()) e.address = 'Bạn cần điền đầy đủ thông tin *';
    if (!/^\+?\d{9,12}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.message.trim()) e.message = 'Bạn cần điền đầy đủ thông tin *';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const mailto = `mailto:cskh@hanoisuntravel.com?cc=dungnv@hanoisuntravel.com&subject=${encodeURIComponent('Liên hệ từ khách hàng')}&body=${encodeURIComponent(
      `Họ tên: ${form.name}\nĐịa chỉ: ${form.address}\nĐiện thoại: ${form.phone}\nEmail: ${form.email}\n\nNội dung:\n${form.message}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Liên hệ</h1>
          <p className="text-gray-600 mt-2">Hanoi Sun Travel xin tiếp nhận mọi thông tin đóng góp/ khiếu nại. Quý khách vui lòng liên hệ trực tiếp hoặc gửi email theo thông tin phía dưới</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <div className="font-semibold">Trụ sở chính</div>
                <div className="text-gray-600">Km số 2 - Cao tốc Nội Bài - Điền Xá - Quang Tiến - Sóc Sơn - Hà Nội</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary-600" />
              <div className="text-gray-600">Homephone: (024) 6663.44.55 | Hotline: 0945 53 2939</div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary-600" />
              <div className="text-gray-600">Email: cskh@hanoisuntravel.com - dungnv@hanoisuntravel.com</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Điện thoại</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nội dung</label>
              <textarea
                rows="5"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
            </div>
            <div className="pt-2">
              <button type="submit" className="btn-primary inline-flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Gửi liên hệ</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;


