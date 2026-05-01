import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';

const About: React.FC = () => {
  return (
    <section className="bg-[#0F0F0F] min-h-[600px] lg:min-h-[700px] flex flex-col lg:flex-row overflow-hidden" id="about">
      <div className="w-full lg:w-1/2 h-[400px] lg:h-auto overflow-hidden relative">
        <motion.img
          src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1200"
          alt="Cận cảnh bộ máy Seiko"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: [1.1, 1.2, 1.1] }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center px-8 py-16 md:px-16 lg:px-20 xl:px-28">
        <div className="max-w-lg">
          <span className="text-xs font-medium tracking-[0.3em] text-neutral-500 uppercase block mb-8 md:mb-10">
            Về chúng tôi
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-white leading-[1.05] uppercase mb-10 md:mb-12">
            Di sản thời gian Seiko
          </h2>
          
          <div className="flex flex-wrap gap-3 mb-10 md:mb-12">
            {['Kỹ nghệ', 'Chính xác', 'Bền bỉ'].map((tag) => (
              <span 
                key={tag}
                className="px-5 py-2 rounded-full border border-neutral-700 text-sm text-neutral-300 hover:border-neutral-500 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-md mb-12">
            Từ năm 1881, Seiko đã không ngừng đổi mới và kiến tạo những chuẩn mực mới trong thế giới đồng hồ. Với triết lý "Luôn đi trước một bước", chúng tôi mang đến những cỗ máy thời gian hoàn hảo nhất.
          </p>

          <div className="flex items-center gap-8">
            <button className="bg-neutral-800 text-white text-sm font-medium rounded px-7 py-3.5 hover:bg-neutral-700 transition-colors uppercase tracking-wider">
              Khám phá thêm
            </button>
            <button className="flex items-center gap-3 text-sm font-medium text-white group">
              <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <Play size={14} fill="currentColor" />
              </div>
              <span className="uppercase tracking-widest">Watch a Video</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
