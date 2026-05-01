import React from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  React.useEffect(() => {
    if (user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, navigate, from]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FBFDFD] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl border border-neutral-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-light uppercase tracking-tight text-neutral-900 mb-2">Admin Portal</h1>
          <p className="text-neutral-400 text-xs uppercase tracking-[0.2em] font-medium">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {user && !isAdmin && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4 text-red-600"
          >
            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase mb-1">Truy cập bị từ chối</p>
              <p className="text-xs opacity-80">Tài khoản của bạn không có quyền quản trị. Vui lòng liên hệ quản trị viên.</p>
            </div>
          </motion.div>
        )}

        <button 
          onClick={login}
          className="w-full flex items-center justify-center gap-4 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
          Đăng nhập với Google
        </button>

        <div className="mt-12 pt-8 border-t border-neutral-50 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-neutral-400 text-[10px] uppercase tracking-widest font-bold hover:text-black transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            Quay lại trang chủ <ArrowRight size={12} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
