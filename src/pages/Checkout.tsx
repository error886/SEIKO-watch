import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, CreditCard, Truck, User, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 4000);
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-light uppercase tracking-tight mb-4">Đặt hàng thành công!</h2>
          <p className="text-neutral-500 mb-10">
            Cảm ơn bạn đã tin tưởng Seiko. Mã đơn hàng của bạn là <b>#SK2026-992</b>. Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng.
          </p>
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4 }}
              className="h-full bg-black"
            />
          </div>
          <p className="text-[10px] uppercase tracking-[.2em] text-neutral-400 mt-4">Đang quay lại trang chủ...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFDFD] pt-32 pb-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-light uppercase tracking-tight mb-12">Thanh toán</h1>
            
            <form onSubmit={handlePlaceOrder} className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-6 text-neutral-900 uppercase tracking-widest text-xs font-bold font-mono">
                   <User size={16} /> <span>Thông tin khách hàng</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required type="text" placeholder="Họ và tên" className="p-4 bg-white border border-neutral-200 rounded focus:border-black outline-none text-sm transition-colors" />
                  <input required type="email" placeholder="Email" className="p-4 bg-white border border-neutral-200 rounded focus:border-black outline-none text-sm transition-colors" />
                  <input required type="tel" placeholder="Số điện thoại" className="p-4 bg-white border border-neutral-200 rounded focus:border-black outline-none text-sm transition-colors md:col-span-2" />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6 text-neutral-900 uppercase tracking-widest text-xs font-bold font-mono">
                   <Truck size={16} /> <span>Địa chỉ giao hàng</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <input required type="text" placeholder="Địa chỉ (Số nhà, đường...)" className="p-4 bg-white border border-neutral-200 rounded focus:border-black outline-none text-sm transition-colors" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="Thành phố" className="p-4 bg-white border border-neutral-200 rounded focus:border-black outline-none text-sm transition-colors" />
                    <input required type="text" placeholder="Quận/Huyện" className="p-4 bg-white border border-neutral-200 rounded focus:border-black outline-none text-sm transition-colors" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6 text-neutral-900 uppercase tracking-widest text-xs font-bold font-mono">
                   <CreditCard size={16} /> <span>Phương thức thanh toán</span>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center p-4 bg-white border border-neutral-200 rounded cursor-pointer hover:border-black transition-colors">
                    <input type="radio" name="payment" defaultChecked className="mr-4 accent-black" />
                    <span className="text-sm">Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-center p-4 bg-white border border-neutral-200 rounded cursor-pointer hover:border-black transition-colors">
                    <input type="radio" name="payment" className="mr-4 accent-black" />
                    <span className="text-sm">Chuyển khoản ngân hàng</span>
                  </label>
                </div>
              </section>

              <button 
                type="submit"
                className="w-full bg-neutral-900 text-white py-5 rounded font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3"
              >
                Hoàn tất đặt hàng
                <ArrowRight size={20} />
              </button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:pt-12"
          >
            <div className="bg-white p-8 md:p-10 rounded-lg border border-neutral-100 shadow-sm">
              <h2 className="text-xl font-medium uppercase tracking-tight mb-8">Tóm tắt đơn hàng</h2>
              
              <div className="max-h-[400px] overflow-y-auto mb-10 space-y-6 pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-neutral-100 overflow-hidden flex-shrink-0 rounded">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium uppercase tracking-tight">{item.name}</h4>
                      <p className="text-xs text-neutral-400 mt-1">SL: {item.quantity}</p>
                      <p className="text-sm font-bold mt-1">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-neutral-50 pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Phí vận chuyển</span>
                  <span className="text-green-600 font-medium uppercase text-[10px] font-mono">Miễn phí</span>
                </div>
                <div className="border-t border-neutral-100 pt-6 flex justify-between items-end">
                  <span className="text-lg font-medium leading-none">Tổng thanh toán</span>
                  <span className="text-2xl font-bold leading-none">{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-4 py-4 px-6 border border-neutral-200 rounded-full">
              <Shield size={16} className="text-green-600" />
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Bảo mật giao dịch tuyệt đối</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
