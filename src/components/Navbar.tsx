import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ShoppingBag, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/shop' },
    { name: 'Thông tin', href: '/#about' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-5 py-4 md:px-12 md:py-6 transition-all duration-300">
      <div className="flex items-center gap-12">
        <Link to="/">
          <img 
            src="/regenerated_image_1777395153942.png" 
            alt="Logo" 
            id="nav-logo"
            className="h-7 md:h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://hcuong86-seiko.s3.ap-southeast-2.amazonaws.com/svgexport-3.svg';
            }}
          />
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-colors ${
                location.pathname === link.href ? 'text-black' : 'text-neutral-400 hover:text-black'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:block relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="w-48 lg:w-72 pl-4 pr-10 py-2.5 rounded-full border border-neutral-200 text-sm text-neutral-600 focus:outline-none focus:border-neutral-900 transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        </div>

        <Link to="/cart" className="relative p-2 text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors">
          <ShoppingBag size={22} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-black text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="hidden md:flex items-center gap-4 border-l border-neutral-100 pl-6 ml-2">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-tight leading-none mb-1">{user.displayName}</span>
              <button 
                onClick={logout}
                className="text-[9px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors font-bold"
              >
                Đăng xuất
              </button>
            </div>
            {isAdmin ? (
               <Link to="/admin" className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white ring-1 ring-neutral-100">
                  {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon size={16} />}
               </Link>
            ) : (
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 overflow-hidden">
                {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon size={16} />}
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-black transition-colors pl-6 border-l border-neutral-100 ml-2">
            <UserIcon size={16} />
            Đăng nhập
          </Link>
        )}

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden p-3 text-neutral-900 rounded-full border border-neutral-200 active:bg-neutral-50 transition-colors"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-neutral-100 shadow-xl px-5 py-10 z-40 md:hidden"
          >
            <div className="flex flex-col gap-8 mb-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-2xl font-light tracking-tight text-neutral-900 uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <div className="pt-8 border-t border-neutral-100 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                      {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon size={24} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight">{user.displayName}</p>
                      <p className="text-xs text-neutral-400 capitalize">{isAdmin ? 'Quản trị viên' : 'Khách hàng'}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-lg font-bold uppercase tracking-widest text-black flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShieldAlert size={20} /> Admin Portal
                    </Link>
                  )}
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="text-lg font-bold uppercase tracking-widest text-red-500 text-left flex items-center gap-2"
                  >
                    <LogOut size={20} /> Đăng xuất
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="text-2xl font-bold tracking-tight text-neutral-400 uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              )}
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="w-full pl-4 pr-10 py-4 rounded-full border border-neutral-200 text-sm text-neutral-600 focus:outline-none"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
