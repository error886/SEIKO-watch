import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { products as defaultProducts, Product } from '../data/products';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Ensure first-load connection & automatic database seeding
export async function initializeDatabase() {
  try {
    // Validate Firestore connection first (per critical constraint)
    await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {});

    // 1. Seed Products if empty
    const prodSnap = await getDocs(collection(db, 'products'));
    if (prodSnap.empty) {
      console.log('Seeding products collection...');
      for (const p of defaultProducts) {
        await setDoc(doc(db, 'products', String(p.id)), {
          id: p.id,
          name: p.name,
          series: p.series,
          price: p.price,
          image: p.image,
          images: p.images || [p.image],
          description: p.description,
          specs: p.specs || { case: '', movement: '', glass: '', waterResistance: '' },
          createdAt: new Date().toISOString()
        });
      }
    }

    // 2. Seed Home Page Layout Configuration
    const configRef = doc(db, 'configs', 'homepage');
    const configSnap = await getDoc(configRef);
    if (!configSnap.exists()) {
      console.log('Seeding homepage config...');
      await setDoc(configRef, {
        productLimit: 8,
        productsPerRow: 4,
        showFeaturedOnly: false,
        updatedAt: new Date().toISOString()
      });
    }

    // 3. Seed Feedbacks
    const feedbackSnap = await getDocs(collection(db, 'feedbacks'));
    if (feedbackSnap.empty) {
      console.log('Seeding feedbacks...');
      const defaultFeedbacks = [
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

      for (const f of defaultFeedbacks) {
        await setDoc(doc(db, 'feedbacks', String(f.id)), f);
      }
    }

    // 4. Seed Banners
    const bannerSnap = await getDocs(collection(db, 'banners'));
    if (bannerSnap.empty) {
      console.log('Seeding banners...');
      await setDoc(doc(db, 'banners', 'hero-1'), {
        id: 'hero-1',
        title: 'Main Hero Banner',
        subtitle: 'Tinh hoa Nhật Bản',
        image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200',
        isActive: true,
        createdAt: new Date().toISOString()
      });
    }

    console.log('Database initialized and seeded successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// --- Direct Firestore dynamic API handlers for our components ---

// PRODUCTS
export async function dbGetProducts(): Promise<Product[]> {
  const path = 'products';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const list: Product[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Product);
    });
    // Order by ID
    return list.sort((a, b) => Number(a.id) - Number(b.id));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

export async function dbAddProduct(product: Omit<Product, 'id'> & { id?: number }): Promise<Product> {
  const path = 'products';
  try {
    let newId = product.id;
    if (!newId) {
      const existing = await dbGetProducts();
      newId = Math.max(0, ...existing.map(p => p.id)) + 1;
    }
    const finalProduct = { ...product, id: newId } as Product;
    await setDoc(doc(db, path, String(newId)), finalProduct);
    return finalProduct;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function dbUpdateProduct(id: number, product: Product): Promise<void> {
  const path = `products/${id}`;
  try {
    await setDoc(doc(db, 'products', String(id)), product);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function dbDeleteProduct(id: number): Promise<void> {
  const path = `products/${id}`;
  try {
    await deleteDoc(doc(db, 'products', String(id)));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// BANNERS
export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
  createdAt?: string;
}

export async function dbGetBanners(): Promise<Banner[]> {
  const path = 'banners';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const list: Banner[] = [];
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id } as Banner);
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

export async function dbAddBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
  const path = 'banners';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...banner,
      createdAt: new Date().toISOString()
    });
    return { ...banner, id: docRef.id } as Banner;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function dbDeleteBanner(id: string): Promise<void> {
  const path = `banners/${id}`;
  try {
    await deleteDoc(doc(db, 'banners', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// FEEDBACKS
export interface FeedbackItem {
  id: number;
  content: string;
  author: string;
  location: string;
  rating: number;
  model: string;
}

export async function dbGetFeedbacks(): Promise<FeedbackItem[]> {
  const path = 'feedbacks';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const list: FeedbackItem[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as FeedbackItem);
    });
    return list.sort((a, b) => Number(a.id) - Number(b.id));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

export async function dbAddFeedback(item: Omit<FeedbackItem, 'id'>): Promise<FeedbackItem> {
  const path = 'feedbacks';
  try {
    const existing = await dbGetFeedbacks();
    const newId = Math.max(0, ...existing.map(f => f.id)) + 1;
    const finalFeedback = { ...item, id: newId } as FeedbackItem;
    await setDoc(doc(db, path, String(newId)), finalFeedback);
    return finalFeedback;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

// ORDERS
export interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // SKU e.g. #SK2026-992
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  paymentMethod: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
  createdAt: string;
}

export async function dbGetOrders(): Promise<Order[]> {
  const path = 'orders';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const list: Order[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Order);
    });
    // Order by createdAt desc
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

export async function dbSaveOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  const path = 'orders';
  try {
    const count = (await getDocs(collection(db, path))).size;
    const trackingId = `#SK2026-${100 + count}`;
    const finalOrder: Order = {
      ...order,
      id: trackingId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, path, trackingId), finalOrder);
    return finalOrder;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function dbUpdateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const ref = doc(db, 'orders', orderId);
    await updateDoc(ref, { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
