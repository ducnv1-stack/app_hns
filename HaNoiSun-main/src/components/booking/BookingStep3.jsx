import React, { useState } from 'react';
import { CreditCard, Building2, MapPin, Smartphone, ArrowLeft, ArrowRight, Shield, Info } from 'lucide-react';

const BookingStep3 = ({ tour, bookingData, totalPrice, onUpdateData, onNext, onPrev }) => {
  const [paymentMethod, setPaymentMethod] = useState(bookingData.paymentMethod);
  const [selectedBank, setSelectedBank] = useState(bookingData.selectedBank || '');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: ''
  });
  const [transferInfo, setTransferInfo] = useState({
    accountName: '',
    transferRef: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const paymentMethods = [
    {
      id: 'online',
      title: 'Thanh Toán Online',
      subtitle: 'Nhanh chóng và bảo mật',
      icon: CreditCard,
      description: 'Thanh toán ngay qua ví điện tử hoặc thẻ tín dụng',
      options: [
        { id: 'momo', name: 'MoMo', logo: '🟣', fee: 0 },
        { id: 'zalopay', name: 'ZaloPay', logo: '🔵', fee: 0 },
        { id: 'vnpay', name: 'VNPay', logo: '🔴', fee: 0 },
        { id: 'visa', name: 'Visa/Mastercard', logo: '💳', fee: '1.5%' }
      ]
    },
    {
      id: 'bank_transfer',
      title: 'Chuyển Khoản Ngân Hàng',
      subtitle: 'Chuyển khoản trực tiếp',
      icon: Building2,
      description: 'Chuyển khoản qua tài khoản ngân hàng của công ty',
      bankInfo: {
        bankName: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
        accountNumber: '0123456789',
        accountName: 'CÔNG TY TNHH HÀ NỘI SUN TRAVEL',
        branch: 'Chi nhánh Hà Nội'
      }
    },
    {
      id: 'office_payment',
      title: 'Thanh Toán Tại Văn Phòng',
      subtitle: 'Đến trực tiếp văn phòng',
      icon: MapPin,
      description: 'Thanh toán bằng tiền mặt hoặc thẻ tại văn phòng công ty',
      address: '123 Phố Huế, Quận Hai Bà Trưng, Hà Nội',
      workingHours: 'Thứ 2 - Thứ 6: 8:00 - 17:30, Thứ 7: 8:00 - 12:00'
    },
    {
      id: 'installment',
      title: 'Trả Góp',
      subtitle: 'Chia nhỏ thanh toán',
      icon: Smartphone,
      description: 'Trả góp 0% lãi suất qua thẻ tín dụng (áp dụng tour > 10 triệu)',
      available: totalPrice >= 10000000,
      plans: [
        { months: 3, fee: 0 },
        { months: 6, fee: 0 },
        { months: 12, fee: '2%' }
      ]
    }
  ];

  const calculateFinalPrice = () => {
    let finalPrice = totalPrice;
    
    if (paymentMethod === 'online' && selectedBank === 'visa') {
      finalPrice += totalPrice * 0.015; // 1.5% fee for credit card
    } else if (paymentMethod === 'installment') {
      finalPrice += totalPrice * 0.02; // 2% fee for 12-month installment
    }
    
    return finalPrice;
  };

  const handleContinue = () => {
    onUpdateData({
      paymentMethod,
      selectedBank: paymentMethod === 'online' ? selectedBank : null,
      cardInfo: paymentMethod === 'online' && (selectedBank === 'visa') ? cardInfo : undefined,
      transferInfo: paymentMethod === 'bank_transfer' ? transferInfo : undefined
    });
    onNext();
  };

  const isFormValid = () => {
    if (paymentMethod === 'online') {
      if (!selectedBank) return false;
      if (selectedBank === 'visa') {
        const { cardNumber, cardName, expiry, cvc } = cardInfo;
        const cardNumberValid = /^\d{16}$/.test(cardNumber.replace(/\s/g, ''));
        const nameValid = cardName.trim().length >= 3;
        const expiryValid = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry);
        const cvcValid = /^\d{3,4}$/.test(cvc);
        return cardNumberValid && nameValid && expiryValid && cvcValid;
      }
      return true;
    }
    if (paymentMethod === 'bank_transfer') {
      return transferInfo.accountName.trim().length >= 3 && transferInfo.transferRef.trim().length >= 6;
    }
    if (paymentMethod === 'installment' && totalPrice < 10000000) return false;
    return true;
  };

  return (
    <div className="space-y-8">
      {/* Price Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm Tắt Đơn Hàng</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Tổng tiền tour</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
          {paymentMethod === 'online' && selectedBank === 'visa' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí thanh toán thẻ (1.5%)</span>
              <span className="text-red-600">+{formatPrice(totalPrice * 0.015)}</span>
            </div>
          )}
          {paymentMethod === 'installment' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí trả góp 12 tháng (2%)</span>
              <span className="text-red-600">+{formatPrice(totalPrice * 0.02)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng thanh toán</span>
              <span className="text-primary-600">{formatPrice(calculateFinalPrice())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
          Chọn Phương Thức Thanh Toán
        </h3>

        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            const isDisabled = method.id === 'installment' && !method.available;
            const isSelected = paymentMethod === method.id;

            return (
              <div key={method.id} className="relative">
                <button
                  onClick={() => !isDisabled && setPaymentMethod(method.id)}
                  disabled={isDisabled}
                  className={`w-full text-left p-6 border-2 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      isSelected ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{method.title}</h4>
                        {isDisabled && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            Không khả dụng
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{method.subtitle}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                      
                      {method.id === 'installment' && !method.available && (
                        <p className="text-xs text-red-600 mt-2">
                          Chỉ áp dụng cho tour từ 10 triệu trở lên
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Payment Method Details */}
                {isSelected && (
                  <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                    {method.id === 'online' && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Chọn phương thức:</h5>
                        <div className="grid grid-cols-2 gap-3">
                          {method.options.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setSelectedBank(option.id)}
                              className={`p-3 border rounded-lg text-left transition-colors ${
                                selectedBank === option.id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{option.logo}</span>
                                <div>
                                  <div className="font-medium">{option.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {option.fee === 0 ? 'Miễn phí' : `Phí: ${option.fee}`}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                        {selectedBank === 'visa' && (
                          <div className="mt-4 space-y-3">
                            <h6 className="text-sm font-medium text-gray-900">Thông tin thẻ</h6>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="Số thẻ (16 số)"
                              value={cardInfo.cardNumber}
                              onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Tên chủ thẻ"
                              value={cardInfo.cardName}
                              onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardInfo.expiry}
                                onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                              />
                              <input
                                type="text"
                                placeholder="CVC"
                                value={cardInfo.cvc}
                                onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {method.id === 'bank_transfer' && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900">Thông tin chuyển khoản:</h5>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div><strong>Ngân hàng:</strong> {method.bankInfo.bankName}</div>
                          <div><strong>Số tài khoản:</strong> {method.bankInfo.accountNumber}</div>
                          <div><strong>Chủ tài khoản:</strong> {method.bankInfo.accountName}</div>
                          <div><strong>Chi nhánh:</strong> {method.bankInfo.branch}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Tên người chuyển"
                            value={transferInfo.accountName}
                            onChange={(e) => setTransferInfo({ ...transferInfo, accountName: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Nội dung/ Mã tham chiếu chuyển khoản"
                            value={transferInfo.transferRef}
                            onChange={(e) => setTransferInfo({ ...transferInfo, transferRef: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="flex items-start space-x-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p>
                            Vui lòng ghi rõ nội dung chuyển khoản: "Họ tên + Số điện thoại + Tên tour" 
                            để chúng tôi xác nhận thanh toán nhanh chóng.
                          </p>
                        </div>
                      </div>
                    )}

                    {method.id === 'office_payment' && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900">Địa chỉ văn phòng:</h5>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div><strong>Địa chỉ:</strong> {method.address}</div>
                          <div><strong>Giờ làm việc:</strong> {method.workingHours}</div>
                        </div>
                        <div className="flex items-start space-x-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p>
                            Vui lòng mang theo giấy tờ tùy thân và thông tin đặt tour khi đến thanh toán.
                          </p>
                        </div>
                      </div>
                    )}

                    {method.id === 'installment' && method.available && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Chọn kỳ hạn trả góp:</h5>
                        <div className="space-y-2">
                          {method.plans.map((plan) => (
                            <div key={plan.months} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                              <span>{plan.months} tháng</span>
                              <div className="text-right">
                                <div className="font-medium">
                                  {formatPrice(calculateFinalPrice() / plan.months)}/tháng
                                </div>
                                <div className="text-sm text-gray-500">
                                  {plan.fee === 0 ? 'Lãi suất 0%' : `Phí: ${plan.fee}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-2">Bảo mật thanh toán:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Tất cả giao dịch được mã hóa SSL 256-bit</li>
              <li>Thông tin thẻ không được lưu trữ trên hệ thống</li>
              <li>Tuân thủ tiêu chuẩn bảo mật PCI DSS</li>
              <li>Hỗ trợ 24/7 cho mọi vấn đề thanh toán</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay Lại</span>
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span>Xác Nhận Thanh Toán</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BookingStep3;