import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Image as ImageIcon, 
  Settings, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Monitor
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AnimatePresence, motion } from 'motion/react';
import { products as initialProducts, Product } from '../data/products';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'banners' | 'homepage' | 'settings';

const ConfirmModal: React.FC<{ 
  title: string, 
  message: string, 
  onConfirm: () => void, 
  onCancel: () => void 
}> = ({ title, message, onConfirm, onCancel }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-6"
  >
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center"
    >
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-xl font-bold uppercase tracking-tight mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm mb-8">{message}</p>
      <div className="flex gap-4">
        <button 
          onClick={onConfirm}
          className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all"
        >
          Xác nhận xóa
        </button>
        <button 
          onClick={onCancel}
          className="flex-1 bg-white text-black py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] border border-neutral-200 hover:border-black transition-all"
        >
          Hủy bỏ
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const ProductForm: React.FC<{ 
  product: Product | null, 
  onSave: (product: Product) => void, 
  onCancel: () => void 
}> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      series: '',
      price: '',
      image: '',
      description: '',
      specs: { case: '', movement: '', glass: '', waterResistance: '' }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Product);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-10 flex flex-col"
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-100">
          <h2 className="text-2xl font-light uppercase tracking-tight">
            {product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest px-1">Tên đồng hồ</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                  placeholder="Ví dụ: Seiko Prospex"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest px-1">Dòng máy</label>
                <input 
                  required
                  type="text" 
                  value={formData.series}
                  onChange={(e) => setFormData({...formData, series: e.target.value})}
                  className="w-full p-4 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                  placeholder="Ví dụ: DIVER SCUBA"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest px-1">Giá bán</label>
                <input 
                  required
                  type="text" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full p-4 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                  placeholder="Ví dụ: 15.500.000₫"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest px-1">Đường dẫn ảnh</label>
                <input 
                  required
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full p-4 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest px-1">Thông số kỹ thuật</label>
                <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-xl">
                  <input 
                    placeholder="Vỏ (Case)" 
                    value={formData.specs?.case}
                    onChange={(e) => setFormData({...formData, specs: {...formData.specs!, case: e.target.value}})}
                    className="p-3 bg-white text-xs border rounded-lg outline-none focus:border-black" 
                  />
                  <input 
                    placeholder="Máy (Movement)" 
                    value={formData.specs?.movement}
                    onChange={(e) => setFormData({...formData, specs: {...formData.specs!, movement: e.target.value}})}
                    className="p-3 bg-white text-xs border rounded-lg outline-none focus:border-black" 
                  />
                  <input 
                    placeholder="Kính (Glass)" 
                    value={formData.specs?.glass}
                    onChange={(e) => setFormData({...formData, specs: {...formData.specs!, glass: e.target.value}})}
                    className="p-3 bg-white text-xs border rounded-lg outline-none focus:border-black" 
                  />
                  <input 
                    placeholder="Chống nước" 
                    value={formData.specs?.waterResistance}
                    onChange={(e) => setFormData({...formData, specs: {...formData.specs!, waterResistance: e.target.value}})}
                    className="p-3 bg-white text-xs border rounded-lg outline-none focus:border-black" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest px-1">Mô tả sản phẩm</label>
                <textarea 
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all resize-none text-sm"
                  placeholder="Nhập mô tả chi tiết..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-neutral-100">
            <button 
              type="submit"
              className="flex-1 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all"
            >
              Lưu sản phẩm
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs border border-neutral-200 hover:border-black transition-all"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const SidebarNav: React.FC<{ activeTab: AdminTab, setActiveTab: (tab: AdminTab) => void }> = ({ activeTab, setActiveTab }) => (
  <>
    <button 
      onClick={() => setActiveTab('dashboard')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}`}
    >
      <LayoutDashboard size={18} /> Dashboard
    </button>
    <button 
      onClick={() => setActiveTab('products')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}`}
    >
      <Package size={18} /> Sản phẩm
    </button>
    <button 
      onClick={() => setActiveTab('orders')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}`}
    >
      <ShoppingBag size={18} /> Đơn hàng
    </button>
    <button 
      onClick={() => setActiveTab('banners')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'banners' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}`}
    >
      <ImageIcon size={18} /> Banners
    </button>
    <button 
      onClick={() => setActiveTab('homepage')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'homepage' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}`}
    >
      <Monitor size={18} /> Trang chủ
    </button>
    <div className="pt-8 pb-4">
      <p className="px-4 text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Hệ thống</p>
    </div>
    <button 
      onClick={() => setActiveTab('settings')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}`}
    >
      <Settings size={18} /> Cài đặt
    </button>
  </>
);

import { 
  dbGetProducts, 
  dbAddProduct, 
  dbUpdateProduct, 
  dbDeleteProduct, 
  dbGetOrders, 
  dbUpdateOrderStatus, 
  dbGetBanners, 
  dbAddBanner, 
  dbDeleteBanner,
  Order,
  Banner
} from '../lib/db';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const Admin: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', image: '', isActive: true });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number | string, type: 'product' | 'banner', title: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Home Page Config State
  const [hpConfig, setHpConfig] = useState({
    productLimit: 8,
    productsPerRow: 4,
    showFeaturedOnly: false
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const dbProds = await dbGetProducts();
      setProducts(dbProds);

      const dbOrds = await dbGetOrders();
      setOrders(dbOrds);

      const dbBans = await dbGetBanners();
      setBanners(dbBans);
    } catch (error) {
      console.error("Error loading admin dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'configs', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHpConfig(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching homepage config:", error);
      }
    };
    fetchConfig();
  }, []);

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      await setDoc(doc(db, 'configs', 'homepage'), {
        ...hpConfig,
        updatedAt: serverTimestamp()
      });
      alert('Đã cập nhật cấu hình Trang chủ thành công!');
    } catch (error) {
      console.error("Error saving homepage config:", error);
      alert('Lỗi khi cập nhật cấu hình.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      if (editingProduct) {
        await dbUpdateProduct(editingProduct.id, { ...product, id: editingProduct.id });
      } else {
        await dbAddProduct(product);
      }
      await loadAllData();
    } catch (err) {
      console.error("Error saving product:", err);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setConfirmDelete({ id, type: 'product', title: product.name });
    }
  };

  const handleDeleteBanner = (id: string, title: string) => {
    setConfirmDelete({ id, type: 'banner', title });
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dbAddBanner({
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        image: bannerForm.image,
        isActive: bannerForm.isActive
      });
      setBannerForm({ title: '', subtitle: '', image: '', isActive: true });
      setIsBannerFormOpen(false);
      await loadAllData();
    } catch (err) {
      console.error("Error creating banner:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    try {
      if (confirmDelete.type === 'product') {
        await dbDeleteProduct(Number(confirmDelete.id));
      } else if (confirmDelete.type === 'banner') {
        await dbDeleteBanner(String(confirmDelete.id));
      }
      await loadAllData();
    } catch (err) {
      console.error("Error confirming delete:", err);
    }

    setConfirmDelete(null);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  // Dynamic statistics calculated directly from the dynamic Firestore orders database
  const dynamicRevenueSum = useMemo(() => {
    return orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const dynamicOrdersCount = useMemo(() => {
    return orders.length;
  }, [orders]);

  const orderStats = useMemo(() => {
    return [
      { label: 'Tổng doanh thu', value: formatCurrency(dynamicRevenueSum), icon: <DollarSign />, trend: '+14.5%', isUp: true },
      { label: 'Đơn hàng mới', value: String(dynamicOrdersCount), icon: <ShoppingBag />, trend: '+8.2%', isUp: true },
      { label: 'Khách hàng', value: '1.240', icon: <Users />, trend: '-2.4%', isUp: false },
      { label: 'Tỉ lệ chuyển đổi', value: '3.2%', icon: <TrendingUp />, trend: '+0.8%', isUp: true },
    ];
  }, [dynamicRevenueSum, dynamicOrdersCount]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 4).map(o => ({
      id: o.id,
      customer: o.customerName,
      status: o.status === 'completed' ? 'Hoàn thành' :
              o.status === 'processing' ? 'Đang xử lý' :
              o.status === 'shipping' ? 'Đang giao' :
              o.status === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý',
      amount: formatCurrency(o.total),
      date: new Date(o.createdAt).toLocaleDateString('vi-VN')
    }));
  }, [orders]);

  // Mock Data for Charts
  const revenueData = [
    { day: 'Thứ 2', revenue: 45000000 },
    { day: 'Thứ 3', revenue: 52000000 },
    { day: 'Thứ 4', revenue: 38000000 },
    { day: 'Thứ 5', revenue: 65000000 },
    { day: 'Thứ 6', revenue: 48000000 },
    { day: 'Thứ 7', revenue: 85000000 },
    { day: 'CN', revenue: 72000000 },
  ];

  const categoryData = [
    { name: 'Prospex', value: 45 },
    { name: 'Presage', value: 30 },
    { name: '5 Sports', value: 15 },
    { name: 'Grand Seiko', value: 10 },
  ];

  const COLORS = ['#000000', '#404040', '#737373', '#a3a3a3'];


  return (
    <div className="flex min-h-screen bg-[#FBFDFD] relative">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-neutral-100 z-[60] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold tracking-tighter text-lg uppercase">Seiko Admin</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-neutral-900 border border-neutral-200 rounded-lg"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white z-[80] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-8 border-b border-neutral-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">S</div>
                  <span className="font-bold tracking-tighter text-xl">SEIKO</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-6 space-y-2">
                 {/* Sidebar Content (same as desktop) */}
                 <SidebarNav activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} />
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-neutral-100 flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-neutral-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold tracking-tighter text-xl uppercase">Seiko Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>

        <div className="p-6 border-t border-neutral-50 space-y-4">
          <div className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
               {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <div className="text-xs font-bold font-mono">AD</div>}
            </div>
            <div>
              <p className="text-xs font-bold leading-none">{user?.displayName}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">Quản trị viên</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/" className="flex items-center justify-center gap-2 py-2 rounded bg-neutral-50 text-neutral-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest">
              <Home size={12} /> Home
            </Link>
            <button 
              onClick={logout}
              className="flex items-center justify-center gap-2 py-2 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-[10px] font-bold uppercase tracking-widest"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 mt-16 lg:mt-0 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-light uppercase tracking-tight text-neutral-900">
              {activeTab === 'dashboard' && 'Tổng quan hệ thống'}
              {activeTab === 'products' && 'Quản lý sản phẩm'}
              {activeTab === 'orders' && 'Danh sách đơn hàng'}
              {activeTab === 'banners' && 'Quản lý hình ảnh'}
              {activeTab === 'homepage' && 'Cấu hình Trang chủ'}
              {activeTab === 'settings' && 'Cấu hình hệ thống'}
            </h2>
            <p className="text-neutral-400 text-xs mt-1 uppercase tracking-widest font-medium">Báo cáo cập nhật lúc 09:00 AM</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors">
              <Download size={14} /> Xuất báo cáo
            </button>
            <button 
              onClick={openAddForm}
              className="bg-black text-white flex items-center gap-2 px-6 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              <Plus size={16} /> Thêm mới
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {orderStats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-900">
                      {stat.icon}
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {stat.trend}
                    </div>
                  </div>
                  <h4 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">{stat.label}</h4>
                  <p className="text-2xl font-light tracking-tight text-neutral-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-neutral-100 shadow-sm">
                <h3 className="text-sm uppercase tracking-widest font-bold mb-8">Doanh thu theo ngày</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a3a3a3' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a3a3a3' }} tickFormatter={(val) => `${val/1000000}tr`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(val: number) => [formatCurrency(val), 'Doanh thu']}
                      />
                      <Bar dataKey="revenue" fill="#000" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm">
                <h3 className="text-sm uppercase tracking-widest font-bold mb-8">Phân bổ dòng sản phẩm</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {categoryData.map((cat, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                          <span className="text-neutral-500">{cat.name}</span>
                        </div>
                        <span className="font-bold">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-neutral-50 flex justify-between items-center">
                <h3 className="text-sm uppercase tracking-widest font-bold">Đơn hàng mới nhất</h3>
                <button className="text-[10px] uppercase tracking-widest font-bold border-b border-black">Xem tất cả</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-neutral-400 uppercase tracking-widest border-b border-neutral-50 font-bold">
                      <th className="px-8 py-4">Mã đơn</th>
                      <th className="px-8 py-4">Khách hàng</th>
                      <th className="px-8 py-4">Trạng thái</th>
                      <th className="px-8 py-4">Tổng tiền</th>
                      <th className="px-8 py-4">Ngày đặt</th>
                      <th className="px-8 py-4">Tác vụ</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                        <td className="px-8 py-4 font-mono font-medium">{order.id}</td>
                        <td className="px-8 py-4">{order.customer}</td>
                        <td className="px-8 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            order.status === 'Hoàn thành' ? 'bg-green-50 text-green-600' :
                            order.status === 'Đang xử lý' ? 'bg-blue-50 text-blue-600' :
                            order.status === 'Đang giao' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 font-bold">{order.amount}</td>
                        <td className="px-8 py-4 text-neutral-500">{order.date}</td>
                        <td className="px-8 py-4">
                          <button className="text-neutral-400 hover:text-black">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Tìm sản phẩm..."
                  className="pl-12 pr-4 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black w-full md:w-80 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50">
                  <Filter size={14} /> Lọc
                </button>
                <select className="bg-white border border-neutral-200 rounded px-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none">
                  <option>Tất cả danh mục</option>
                  <option>Prospex</option>
                  <option>Presage</option>
                  <option>5 Sports</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-neutral-400 uppercase tracking-widest border-b border-neutral-50 font-bold">
                    <th className="px-8 py-4">Sản phẩm</th>
                    <th className="px-8 py-4">Dòng máy</th>
                    <th className="px-8 py-4">Giá bán</th>
                    <th className="px-8 py-4">Tồn kho</th>
                    <th className="px-8 py-4">Trạng thái</th>
                    <th className="px-8 py-4">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <img src={product.image} className="w-10 h-10 object-cover rounded" />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-neutral-500">{product.series}</td>
                      <td className="px-8 py-4 font-bold">{product.price}</td>
                      <td className="px-8 py-4">12</td>
                      <td className="px-8 py-4">
                        <span className="px-2 py-1 rounded bg-green-50 text-green-600 text-[10px] font-bold uppercase">Còn hàng</span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex gap-4">
                          <button 
                            onClick={() => openEditForm(product)}
                            className="text-neutral-400 hover:text-black transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden group">
                <div className="aspect-[21/9] bg-neutral-100 relative">
                  <img src={banner.image} className="w-full h-full object-cover" alt={banner.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                     <button 
                      onClick={() => handleDeleteBanner(banner.id, banner.title)}
                      className="p-3 bg-white rounded-full text-red-500 hover:bg-red-50"
                     >
                      <Trash2 size={20} />
                     </button>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight">{banner.title}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono">{banner.subtitle || 'Active Promo'}</p>
                  </div>
                  <div className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${banner.isActive ? 'bg-green-50 text-green-600' : 'bg-neutral-50 text-neutral-400'}`}>
                    {banner.isActive ? 'Đang hiển thị' : 'Tạm ẩn'}
                  </div>
                </div>
              </div>
            ))}

            {isBannerFormOpen ? (
              <form onSubmit={handleCreateBanner} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-8 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Mẫu Tải Thêm Banner</h4>
                <div className="space-y-3">
                  <input required placeholder="Tiêu đề Banner" value={bannerForm.title} onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none" />
                  <input placeholder="Phụ đề (Subtitle)" value={bannerForm.subtitle} onChange={(e) => setBannerForm({...bannerForm, subtitle: e.target.value})} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none" />
                  <input required placeholder="Đường dẫn ảnh (URL)" value={bannerForm.image} onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none" />
                </div>
                <div className="flex gap-4 pt-3">
                  <button type="submit" className="flex-1 bg-black text-white py-3 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800">Tạo</button>
                  <button type="button" onClick={() => setIsBannerFormOpen(false)} className="flex-1 bg-white text-black py-3 rounded text-[10px] border border-neutral-200 font-bold uppercase tracking-widest hover:border-black">Hủy</button>
                </div>
              </form>
            ) : (
              <div 
                onClick={() => setIsBannerFormOpen(true)}
                className="bg-white rounded-xl border border-dashed border-neutral-200 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-black transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-all">
                  <Plus size={32} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Thêm Banner Mới</h4>
                <p className="text-xs text-neutral-400">Định dạng JPG, PNG hoặc WebP. Max 5MB.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'homepage' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-50 pb-2">Hiển thị sản phẩm</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest block">Số lượng sản phẩm tối đa</label>
                  <input 
                    type="number" 
                    value={hpConfig.productLimit}
                    onChange={(e) => setHpConfig({...hpConfig, productLimit: parseInt(e.target.value)})}
                    className="w-full p-4 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest block">Số sản phẩm mỗi dòng (Desktop)</label>
                  <select 
                    value={hpConfig.productsPerRow}
                    onChange={(e) => setHpConfig({...hpConfig, productsPerRow: parseInt(e.target.value)})}
                    className="w-full p-4 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                  >
                    <option value={2}>2 Sản phẩm</option>
                    <option value={3}>3 Sản phẩm</option>
                    <option value={4}>4 Sản phẩm</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                 <div>
                    <p className="text-xs font-bold uppercase tracking-tight">Chỉ hiển thị sản phẩm nổi bật</p>
                    <p className="text-[10px] text-neutral-500">Bật để chỉ hiển thị các sản phẩm được đánh dấu "Nổi bật"</p>
                 </div>
                 <button 
                  onClick={() => setHpConfig({...hpConfig, showFeaturedOnly: !hpConfig.showFeaturedOnly})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${hpConfig.showFeaturedOnly ? 'bg-black' : 'bg-neutral-200'}`}
                 >
                    <motion.div 
                      animate={{ x: hpConfig.showFeaturedOnly ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                 </button>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-50">
               <button 
                onClick={handleSaveConfig}
                disabled={isSavingConfig}
                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
               >
                {isSavingConfig ? 'Đang lưu...' : 'Lưu cấu hình'}
               </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Quản lý đơn hàng</h3>
              <p className="text-xs text-neutral-400 font-mono">Tổng cộng: {orders.length} Đơn hàng</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-neutral-400 uppercase tracking-widest border-b border-neutral-50 font-bold">
                    <th className="px-8 py-4">Mã đơn</th>
                    <th className="px-8 py-4">Khách hàng</th>
                    <th className="px-8 py-4">Số điện thoại</th>
                    <th className="px-8 py-4">Thanh toán</th>
                    <th className="px-8 py-4">Trạng thái</th>
                    <th className="px-8 py-4">Tổng tiền</th>
                    <th className="px-8 py-4">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="px-8 py-4 font-mono font-bold text-neutral-900">{order.id}</td>
                      <td className="px-8 py-4">
                        <div>
                          <p className="font-semibold text-neutral-900">{order.customerName}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-neutral-500 font-mono">{order.phone}</td>
                      <td className="px-8 py-4 text-xs font-mono uppercase text-neutral-600">{order.paymentMethod}</td>
                      <td className="px-8 py-4">
                        <select 
                          value={order.status}
                          onChange={async (e) => {
                            try {
                              await dbUpdateOrderStatus(order.id, e.target.value as any);
                              await loadAllData();
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className={`p-2 rounded text-[10px] font-bold uppercase cursor-pointer outline-none border border-neutral-200 outline-none ${
                            order.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' :
                            order.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            order.status === 'shipping' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                            order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                            'bg-neutral-50 text-neutral-400'
                          }`}
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="processing">Đang xử lý</option>
                          <option value="shipping">Đang giao</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </td>
                      <td className="px-8 py-4 font-bold text-neutral-900">{formatCurrency(order.total)}</td>
                      <td className="px-8 py-4">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs uppercase tracking-widest font-bold border-b border-transparent hover:border-black hover:text-black py-1 text-neutral-500 transition-all font-sans"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="py-32 text-center bg-white rounded-xl border border-neutral-100 shadow-sm border-dashed">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
               <Settings size={40} />
            </div>
            <h3 className="text-2xl font-light uppercase tracking-tight mb-2">Cài đặt hệ thống</h3>
            <p className="text-neutral-500 text-sm">Cấu hình bảo mật nâng cao và thông tin cổng quản trị viên Seiko.</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isFormOpen && (
          <ProductForm 
            product={editingProduct} 
            onSave={handleSaveProduct} 
            onCancel={() => setIsFormOpen(false)} 
          />
        )}
        {confirmDelete && (
          <ConfirmModal 
            title="Xác nhận xóa"
            message={`Bạn có chắc chắn muốn xóa ${confirmDelete.type === 'product' ? 'sản phẩm' : 'banner'} "${confirmDelete.title}"? Hành động này không thể hoàn tác.`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setConfirmDelete(null)}
          />
        )}

        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-6"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-widest text-neutral-900">Chi tiết đơn hàng</h3>
                  <p className="text-xs text-neutral-400 font-mono">{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-neutral-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2">Thông tin khách hàng</h4>
                  <div className="bg-neutral-50 p-4 rounded-lg space-y-1 text-sm text-neutral-800">
                    <p><b>Họ tên:</b> {selectedOrder.customerName}</p>
                    <p><b>Email:</b> {selectedOrder.email}</p>
                    <p><b>Số điện thoại:</b> {selectedOrder.phone}</p>
                    <p><b>Địa chỉ:</b> {selectedOrder.address}, {selectedOrder.district}, {selectedOrder.city}</p>
                    <p><b>Phương thức thanh toán:</b> {selectedOrder.paymentMethod === 'COD' ? 'Thanh toán trực tiếp khi nhận hàng (COD)' : 'Chuyển khoản trực tiếp NH'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2">Sản phẩm đã chọn</h4>
                  <div className="divide-y border rounded-lg overflow-hidden bg-white">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 hover:bg-neutral-50">
                        <img src={item.image} className="w-12 h-12 object-cover rounded" alt={item.name} />
                        <div className="flex-1">
                          <p className="font-semibold text-neutral-900 text-sm uppercase">{item.name}</p>
                          <p className="text-xs text-neutral-500 font-mono">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-neutral-900 text-sm">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                  <span className="text-sm font-bold uppercase text-neutral-500">Tổng thanh toán:</span>
                  <span className="text-xl font-bold text-neutral-900 font-mono">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
