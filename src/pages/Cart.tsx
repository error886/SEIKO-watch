import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Minus, Plus, ArrowLeft, CreditCard, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-40 px-8 flex flex-col items-center justify-center bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-3xl font-light mb-4 uppercase tracking-tight text-neutral-900">Giỏ hàng của bạn đang trống</h2>
          <p className="text-neutral-500 mb-10 max-w-sm mx-auto">Hãy khám phá bộ sưu tập của chúng tôi để tìm thấy chiếc đồng hồ ưng ý nhất.</p>
          <Link to="/" className="bg-black text-white px-10 py-4 rounded uppercase tracking-widest font-medium inline-block hover:bg-neutral-800 transition-colors">
            Mua sắm ngay
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFDFD] pt-32 pb-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-light uppercase tracking-tight mb-12 text-neutral-900">Giỏ hàng ({cartCount})</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-6 bg-white p-6 rounded-lg border border-neutral-100 shadow-sm"
              >
                <div className="w-24 h-32 md:w-32 md:h-40 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium uppercase tracking-tight text-neutral-900">{item.name}</h3>
                      <p className="text-sm font-semibold text-neutral-900 mt-1">{item.priceFormatted}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-neutral-200 rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-neutral-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-neutral-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-neutral-900">
                      Tổng: {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-black mt-4 transition-colors">
              <ArrowLeft size={14} /> Tiếp tục mua sắm
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg border border-neutral-100 shadow-sm sticky top-32">
              <h2 className="text-xl font-medium uppercase tracking-tight mb-8">Tổng đơn hàng</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Tạm tính ({cartCount} sản phẩm)</span>
                  <span className="font-medium">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Phí vận chuyển</span>
                  <span className="text-green-600 font-medium font-mono uppercase text-[10px]">Miễn phí</span>
                </div>
                <div className="border-t border-neutral-100 pt-4 flex justify-between">
                  <span className="text-lg font-medium">Tổng cộng</span>
                  <span className="text-xl font-bold">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-neutral-900 text-white py-4 rounded font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3"
              >
                <CreditCard size={18} />
                Thanh toán
              </button>
              
              <p className="text-[10px] text-neutral-400 text-center mt-6 uppercase tracking-widest leading-relaxed">
                Khi nhấn Thanh toán, bạn đồng ý với các điều khoản mua hàng của Seiko.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
