import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface FeedbackItem {
  id: number;
  content: string;
  author: string;
  location: string;
  rating: number;
  model: string;
}

const feedbacks: FeedbackItem[] = [
  {
    id: 1,
    content: "Chiếc Seiko Presage tôi mua thực sự vượt xa mong đợi. Độ hoàn thiện tuyệt vời, kim xanh trên nền dial trắng gốm tạo nên một vẻ đẹp rất tinh tế. Tư vấn tận tình, đóng gói kỹ lưỡng.",
    author: "Hoàng Minh",
    location: "Hà Nội",
    rating: 5,
    model: "Seiko Presage Sharp Edged"
  },
  {
    id: 2,
    content: "Dịch vụ sau bán hàng rất tốt. Tôi có một chút thắc mắc về cách chỉnh dây nhưng được hỗ trợ ngay lập tức qua Messenger. Chiếc Prospex này đeo rất đằm tay và bền bỉ.",
    author: "Khánh Linh",
    location: "TP. Hồ Chí Minh",
    rating: 5,
    model: "Seiko Prospex 'Turtle'"
  },
  {
    id: 3,
    content: "Là một người sưu tầm đồng hồ lâu năm, tôi đánh giá cao uy tín của shop. Hàng về đúng hẹn, full box và giấy tờ kiểm định. Chắc chắn sẽ còn quay lại ủng hộ nhiều mẫu nữa.",
    author: "Quốc Anh",
    location: "Đà Nẵng",
    rating: 5,
    model: "King Seiko KSK"
  }
];

const Feedback: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-black py-32 px-8 md:px-16 lg:px-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500 block mb-4"
            >
              Cộng đồng yêu Seiko
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-tighter text-white"
            >
              Khách hàng <br /> <span className="italic">Cảm nhận</span>
            </motion.h2>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative min-h-[400px] md:min-h-[300px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 }
              }}
              className="flex flex-col md:flex-row items-center gap-16"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) prevSlide();
                else if (info.offset.x < -100) nextSlide();
              }}
            >
              <div className="flex-1">
                <Quote className="text-neutral-800 mb-8 w-16 h-16" strokeWidth={1} />
                <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight mb-12 italic">
                  "{feedbacks[currentIndex].content}"
                </p>
                
                <div className="flex items-center gap-6">
                  <div className="w-px h-12 bg-neutral-800" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">{feedbacks[currentIndex].author}</h4>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">{feedbacks[currentIndex].location} — {feedbacks[currentIndex].model}</p>
                  </div>
                  <div className="flex gap-1 ml-auto">
                    {[...Array(feedbacks[currentIndex].rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-white text-white" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3 aspect-[4/5] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <motion.img 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                  src={`https://images.unsplash.com/photo-1542491595-62e84bee54e1?auto=format&fit=crop&q=80&w=600&h=800&sig=${currentIndex}`}
                  alt="Feedback Watch"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Progress dots */}
        <div className="mt-20 flex gap-2">
          {feedbacks.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-1 transition-all duration-500 ${currentIndex === idx ? 'w-16 bg-white' : 'w-8 bg-neutral-800'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedback;

