import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowLeft, Shield, Clock, RotateCcw } from 'lucide-react';
import { products as fallbackProducts, Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { dbGetProducts } from '../lib/db';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const list = await dbGetProducts();
        const activeList = list.length > 0 ? list : fallbackProducts;
        const found = activeList.find((p) => String(p.id) === String(id));
        if (found) {
          setProduct(found);
          setActiveImage(found.image);
        }
      } catch (err) {
        console.error("Error fetching product detail:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500 text-xs uppercase tracking-widest font-mono">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4">Không tìm thấy sản phẩm</h2>
          <Link to="/" className="text-sm underline uppercase tracking-widest">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-black mb-12 transition-colors">
          <ArrowLeft size={14} /> Quay lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-[4/5] bg-neutral-100 rounded-xl overflow-hidden relative"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  src={activeImage} 
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-neutral-900' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-10">
              <span className="text-xs font-semibold tracking-[0.3em] text-neutral-400 uppercase block mb-4">
                {product.series}
              </span>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 uppercase mb-6">
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-neutral-900 border-b border-neutral-100 pb-8">
                {product.price}
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900 mb-4">Mô tả sản phẩm</h3>
              <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>

            {product.specs && (
              <div className="grid grid-cols-2 gap-6 mb-12 bg-neutral-50 p-6 rounded-lg">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Vỏ & Kích thước</h4>
                  <p className="text-sm font-medium">{product.specs.case}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Bộ máy</h4>
                  <p className="text-sm font-medium">{product.specs.movement}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Mặt kính</h4>
                  <p className="text-sm font-medium">{product.specs.glass}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Chống nước</h4>
                  <p className="text-sm font-medium">{product.specs.waterResistance}</p>
                </div>
              </div>
            )}

            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-neutral-900 text-white py-4 rounded font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 mb-10"
            >
              <ShoppingCart size={20} />
              Thêm vào giỏ hàng
            </button>

            <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-10">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-neutral-50 flex items-center justify-center text-neutral-900 mb-3">
                  <Shield size={18} />
                </div>
                <p className="text-[10px] uppercase tracking-widest font-medium">Bảo hành 5 năm</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-neutral-50 flex items-center justify-center text-neutral-900 mb-3">
                  <Clock size={18} />
                </div>
                <p className="text-[10px] uppercase tracking-widest font-medium">Giao hỏa tốc</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-neutral-50 flex items-center justify-center text-neutral-900 mb-3">
                  <RotateCcw size={18} />
                </div>
                <p className="text-[10px] uppercase tracking-widest font-medium">Dổi trả 30 ngày</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
