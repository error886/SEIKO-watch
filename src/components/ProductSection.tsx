import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ProductSection: React.FC = () => {
  const { addToCart } = useCart();
  
  // Config state
  const [config, setConfig] = useState({
    productLimit: 8,
    productsPerRow: 4,
    showFeaturedOnly: false
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'configs', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching homepage config:", error);
      }
    };
    fetchConfig();
  }, []);

  const filteredProducts = products.slice(0, config.productLimit);

  // Dynamic grid column class based on productsPerRow
  const getGridColsClass = () => {
    switch (config.productsPerRow) {
      case 2: return 'lg:grid-cols-2';
      case 3: return 'lg:grid-cols-3';
      case 4: return 'lg:grid-cols-4';
      default: return 'lg:grid-cols-4';
    }
  };

  return (
    <section className="bg-white py-24 px-8 md:px-16 lg:px-24" id="products">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-medium tracking-[0.3em] text-neutral-500 uppercase block mb-4"
            >
              Bộ sưu tập nổi bật
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 uppercase leading-tight"
            >
              Tinh hoa chế tác <br /> thời gian Nhật Bản
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/shop" className="group flex items-center gap-2 text-sm font-medium text-neutral-900 uppercase tracking-widest border-b border-neutral-900 pb-1">
              Xem tất cả sản phẩm
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${getGridColsClass()} gap-10`}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-neutral-100 overflow-hidden mb-6 rounded-md">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="absolute bottom-4 right-4 bg-white text-neutral-900 p-3 rounded-full shadow-lg lg:translate-y-12 lg:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-neutral-900 hover:text-white z-10 opacity-100 translate-y-0"
                >
                  <ShoppingCart size={18} />
                </button>
              </Link>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 uppercase tracking-tight">
                      <Link to={`/product/${product.id}`} className="hover:underline">{product.name}</Link>
                    </h3>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest">{product.series}</p>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">{product.price}</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                <Link to={`/product/${product.id}`} className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900 pt-2 border-b border-transparent hover:border-neutral-900 transition-all">
                  Mua Ngay
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
