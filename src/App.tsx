import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
};

export default function App() {
  <title>hCuongg86</title>
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
        <main className="bg-black min-h-screen selection:bg-white selection:text-black">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
          
          {/* Footer minimal spacer */}
          <footer className="bg-[#0F0F0F] py-20 px-8 text-center border-t border-neutral-900">
            <div className="flex flex-col items-center gap-6">
              <p className="text-xs text-neutral-600 uppercase tracking-[0.5em]">
                &copy; 2026 Seiko Watches. All Rights Reserved.
              </p>
              <Link to="/admin" className="text-[10px] text-neutral-800 uppercase tracking-widest hover:text-white transition-colors">Admin Portal</Link>
            </div>
          </footer>
        </main>
      </CartProvider>
      </AuthProvider>
    </Router>
  );
}
