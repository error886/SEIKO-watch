import React from 'react';
import { motion } from 'motion/react';
import { Facebook, MessageCircle, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const Contact: React.FC = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={24} />,
      label: '@hcuong886',
      href: 'https://www.facebook.com/hcuong886/',
      color: 'hover:text-blue-600',
    },
    {
      name: 'Messenger',
      icon: <MessageCircle size={24} />,
      label: 'Nhắn tin ngay',
      href: 'https://m.me/hcuong886',
      color: 'hover:text-blue-500',
    },
    {
      name: 'KakaoTalk',
      icon: <span className="font-bold text-xl">K</span>,
      label: 'ID: hcuong886',
      href: '#',
      color: 'hover:text-yellow-500',
    }
  ];

  return (
    <div className="bg-[#FBFDFD] min-h-screen pt-32 pb-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold tracking-[0.3em] text-neutral-400 uppercase block mb-4"
          >
            Kết nối với chúng tôi
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-light uppercase tracking-tight text-neutral-900 mb-6"
          >
            Liên hệ
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-px bg-black mx-auto"
          />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Social Links Grid */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-medium uppercase tracking-widest mb-10 pb-4 border-b border-neutral-100">Mạng xã hội</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {socialLinks.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    className={`group flex items-center gap-5 p-6 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all hover:shadow-md hover:border-black ${link.color}`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                      {link.icon}
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-1 group-hover:text-black transition-colors">{link.name}</h3>
                      <p className="text-sm font-medium text-neutral-900 flex items-center gap-2">
                        {link.label}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium uppercase tracking-widest mb-10 pb-4 border-b border-neutral-100">Thông tin trực tiếp</h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 text-white shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-1">Điện thoại</h4>
                    <p className="text-lg font-medium text-neutral-900">+84 9xx xxx xxx</p>
                    <p className="text-sm text-neutral-500 mt-1">Hỗ trợ 24/7 cho các đơn đặt hàng</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 text-white shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-1">Email</h4>
                    <p className="text-lg font-medium text-neutral-900">support@seiko-shop.vn</p>
                    <p className="text-sm text-neutral-500 mt-1">Phản hồi trong vòng 24 giờ làm việc</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 text-white shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-1">Địa chỉ</h4>
                    <p className="text-lg font-medium text-neutral-900">Quận 1, TP. Hồ Chí Minh</p>
                    <p className="text-sm text-neutral-500 mt-1">Vui lòng liên hệ trước khi đến xem mẫu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-10 md:p-12 rounded-2xl border border-neutral-100 shadow-xl"
          >
            <h2 className="text-2xl font-light uppercase tracking-tight mb-8">Gửi tin nhắn cho chúng tôi</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-1">Họ và tên</label>
                <input 
                  type="text" 
                  placeholder="Nhập tên của bạn..."
                  className="w-full p-4 bg-neutral-50 border border-transparent rounded-lg focus:bg-white focus:border-black outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full p-4 bg-neutral-50 border border-transparent rounded-lg focus:bg-white focus:border-black outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-1">Nội dung</label>
                <textarea 
                  rows={5}
                  placeholder="Bạn đang quan tâm đến mẫu đồng hồ nào?"
                  className="w-full p-4 bg-neutral-50 border border-transparent rounded-lg focus:bg-white focus:border-black outline-none transition-all text-sm resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-neutral-900 text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-[0.98]"
              >
                Gửi yêu cầu
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
