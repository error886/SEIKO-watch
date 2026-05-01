import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ShoppingCart, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products, Product } from '../data/products';
import { useCart } from '../context/CartContext';

const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('Tất cả');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000000]);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const seriesOptions = useMemo(() => {
    const seriesSet = new Set(products.map(p => p.series));
    return ['Tất cả', ...Array.from(seriesSet)];
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const priceNum = parseInt(product.price.replace(/\D/g, ''));
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.series.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeries = selectedSeries === 'Tất cả' || product.series === selectedSeries;
      const matchesPrice = priceNum >= priceRange[0] && priceNum <= priceRange[1];

      return matchesSearch && matchesSeries && matchesPrice;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')));
    }

    return result;
  }, [searchQuery, selectedSeries, priceRange, sortBy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="bg-[#FBFDFD] min-h-screen pt-32 pb-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-light uppercase tracking-tight text-neutral-900 mb-4">Bộ sưu tập</h1>
              <p className="text-neutral-500 uppercase tracking-widest text-xs font-medium">Khám phá thế giới của sự chính xác và đẳng cấp</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm mẫu đồng hồ..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-full border border-neutral-200 bg-white text-sm w-full md:w-64 focus:border-black outline-none transition-all"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-200 bg-white text-sm font-medium hover:border-black transition-all"
              >
                <SlidersHorizontal size={18} />
                Bộ lọc
              </button>
            </div>
          </div>
        </header>

        <div className="flex justify-between items-center mb-10 pb-6 border-b border-neutral-100">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
            Hiển thị {filteredProducts.length} sản phẩm
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Sắp xếp:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-neutral-100 overflow-hidden mb-5 rounded-lg shadow-sm">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="absolute bottom-4 right-4 bg-white text-neutral-900 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-neutral-900 hover:text-white"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </Link>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-medium uppercase tracking-tight">
                        <Link to={`/product/${product.id}`} className="hover:underline">{product.name}</Link>
                      </h3>
                      <span className="text-sm font-bold">{product.price}</span>
                    </div>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest">{product.series}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-40 text-center">
            <h3 className="text-2xl font-light uppercase mb-4">Không tìm thấy sản phẩm</h3>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedSeries('Tất cả');
                setPriceRange([0, 200000000]);
              }}
              className="text-xs underline uppercase tracking-widest"
            >
              Thiết lập lại bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Filter Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[101] shadow-2xl p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-light uppercase">Bộ lọc</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 space-y-12 overflow-y-auto pr-2">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-6">Theo dòng sản phẩm</h4>
                  <div className="flex flex-wrap gap-3">
                    {seriesOptions.map((series) => (
                      <button
                        key={series}
                        onClick={() => setSelectedSeries(series)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                          selectedSeries === series 
                           ? 'bg-black text-white border-black' 
                           : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
                        }`}
                      >
                        {series}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-6">Theo khoảng giá</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-mono">
                      <span>{formatCurrency(priceRange[0])}</span>
                      <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="150000000"
                      step="1000000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-black h-1 bg-neutral-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-neutral-100 space-y-4">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full bg-black text-white py-4 rounded uppercase tracking-widest font-bold text-xs"
                >
                  Áp dụng bộ lọc
                </button>
                <button 
                  onClick={() => {
                    setSelectedSeries('Tất cả');
                    setPriceRange([0, 200000000]);
                  }}
                  className="w-full bg-white text-black py-4 rounded border border-neutral-200 uppercase tracking-widest font-bold text-xs"
                >
                  Xóa tất cả
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
