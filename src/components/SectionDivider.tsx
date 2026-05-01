import React from 'react';

const SectionDivider: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none overflow-hidden h-[60px] md:h-[120px]">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        id="diagonal-svg"
      >
        <polygon
          points="0,0 0,120 1440,120 1440,80 920,80 680,0"
          fill="#0F0F0F"
        />
      </svg>
    </div>
  );
};

export default SectionDivider;
