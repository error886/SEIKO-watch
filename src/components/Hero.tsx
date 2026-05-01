import React from 'react';
import SectionDivider from './SectionDivider';

const Hero: React.FC = () => {

  return (
    <section className="app-hero-wrapper relative">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[#FBFDFD] z-0" />
      
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[55%] z-[1] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-top opacity-30 md:opacity-100 video-plus-darker"
        >
          <source src="https://hcuong86-seiko.s3.ap-southeast-2.amazonaws.com/Seiko_dive_watch_202604290041.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen md:h-screen">
        <div className="flex-1 flex flex-col justify-center px-5 pt-24 pb-32 md:px-12 md:pb-48">
          <div className="max-w-4xl">
            <div className="flex">
              <h1 className="text-[2.75rem] md:text-[5.5rem] lg:text-[7.5rem] leading-[0.95] font-light tracking-tight text-neutral-900 uppercase">
                NEW COLLECTION<br />Universe
              </h1>
            </div>
            <div className="flex items-center gap-8 mt-10 md:mt-12">
              <button className="bg-neutral-900 text-white text-sm font-medium rounded px-8 py-3.5 hover:bg-neutral-800 transition-colors uppercase tracking-wider">
               Mua Ngay
              </button>
              <a href="#products" className="text-sm font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 uppercase tracking-wider">
               Khám phá
              </a>
            </div>
          </div>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
};

export default Hero;
