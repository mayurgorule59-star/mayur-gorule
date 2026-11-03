import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ViewMode,
  RestaurantSettings,
  MenuCategory,
  MenuItem,
  RestaurantTable,
  CustomerOrder,
  CustomerReview,
  CouponCode,
  LoyaltyMember,
  RestaurantOwnerAccount,
  AuditLogItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  OrderItem,
  PlatformSettings,
  SubscriptionPayment,
} from '../types/index.js';
import {
  INITIAL_RESTAURANTS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_LOYALTY,
  INITIAL_OWNERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PLATFORM_SETTINGS,
} from '../data/initialData.js';
import {
  calculateOrderTotals,
  calculateLoyaltyPoints,
  canTransitionOrderStatus,
  getInitialPaymentStatus,
  isAuthorizedSuperAdminEmail,
} from '../utils/engine.js';

interface CartItem extends OrderItem {}

interface AppContextType {
  // Navigation & Routing
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  activeRestaurantSlug: string;
  setActiveRestaurantSlug: (slug: string) => void;
  activeTableNumber: string;
  setActiveTableNumber: (tbl: string) => void;
  navigateToCustomerMenu: (restaurantSlug: string, tableNumber?: string) => void;
  navigateToOwnerDashboard: (restaurantId?: string) => void;
  navigateToSuperAdmin: () => void;
  navigateToLanding: () => void;

  // Multi-tenant state
  restaurants: RestaurantSettings[];
  activeRestaurant: RestaurantSettings;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  tables: RestaurantTable[];
  orders: CustomerOrder[];
  reviews: CustomerReview[];
  coupons: CouponCode[];
  loyaltyMembers: LoyaltyMember[];
  ownerAccounts: RestaurantOwnerAccount[];
  auditLogs: AuditLogItem[];
  currentUserEmail: string;

  // Active restaurant scoped data
  currentRestaurantCategories: MenuCategory[];
  currentRestaurantMenuItems: MenuItem[];
  currentRestaurantTables: RestaurantTable[];
  currentRestaurantOrders: CustomerOrder[];
  currentRestaurantReviews: CustomerReview[];

  // Cart operations
  cart: CartItem[];
  appliedCoupon: CouponCode | null;
  addToCart: (item: MenuItem, variantId?: string, addonIds?: string[], instructions?: string) => void;
  updateCartQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotals: ReturnType<typeof calculateOrderTotals>;

  // Customer order submission
  submitCustomerOrder: (details: {
    customerName: string;
    customerPhone: string;
    orderMode: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    specialInstructions?: string;
  }) => CustomerOrder;

  // Order management
  updateOrderStatus: (orderId: string, nextStatus: OrderStatus) => boolean;
  confirmCashPayment: (orderId: string) => boolean;

  // Menu management
  addCategory: (name: string, iconName?: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'restaurantId'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Table management
  addTable: (tableNumber: string, tableName: string, capacity: number) => void;
  updateTable: (id: string, updates: Partial<RestaurantTable>) => void;
  deleteTable: (id: string) => void;

  // Restaurant settings
  updateRestaurantSettings: (updates: Partial<RestaurantSettings>) => void;

  // Customer reviews
  submitReview: (rating: number, comment: string, customerName: string) => void;

  // Super admin
  approveRestaurantOwner: (ownerId: string) => void;
  toggleRestaurantStatus: (restaurantId: string) => void;
  addRestaurantTenant: (data: {
    name: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    city: string;
    plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  }) => void;
  changeRestaurantPlan: (restaurantId: string, plan: 'STARTER' | 'PRO' | 'ENTERPRISE') => void;
  resetAllDemoData: () => void;
  isSuperAdminAuthenticated: boolean;
  superAdminProfile: { name: string; email: string } | null;
  loginSuperAdmin: (email: string, password: string, passkey: string) => Promise<{ success: boolean; message?: string }>;
  logoutSuperAdmin: () => void;
  platformSettings: PlatformSettings;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => void;
  paymentSubmissions: SubscriptionPayment[];
  submitPaymentDetails: (data: Omit<SubscriptionPayment, 'id' | 'status' | 'createdAt'>) => void;
  approvePayment: (submissionId: string) => void;
  rejectPayment: (submissionId: string) => void;

  // Sound chime
  playOrderChime: () => void;

  // Owner Authentication & Access Control
  isOwnerAuthenticated: boolean;
  isOwnerVerificationPinRequired: boolean;
  loginOwner: (email: string, password: string) => Promise<{ success: boolean; requiresPin?: boolean; message?: string }>;
  verifyOwnerPin: (pin: string) => Promise<{ success: boolean; message?: string }>;
  logoutOwner: () => void;
  isOwnerLoginModalOpen: boolean;
  setIsOwnerLoginModalOpen: (open: boolean) => void;
}
const AppContext = createContext<AppContextType | null>(null);

const STORAGE_PREFIX = 'dineflow_v1_';

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading localStorage for ' + key, e);
  }
  return defaultValue;
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving localStorage for ' + key, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master state
  const [restaurants, setRestaurants] = useState<RestaurantSettings[]>(() =>
    loadStorage('restaurants', INITIAL_RESTAURANTS)
  );
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('rest-1');
  const [categories, setCategories] = useState<MenuCategory[]>(() =>
    loadStorage('categories', INITIAL_CATEGORIES)
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() =>
    loadStorage('menu_items', INITIAL_MENU_ITEMS)
  );
  const [tables, setTables] = useState<RestaurantTable[]>(() =>
    loadStorage('tables', INITIAL_TABLES)
  );
  const [orders, setOrders] = useState<CustomerOrder[]>(() =>
    loadStorage('orders', INITIAL_ORDERS)
  );
  const [reviews, setReviews] = useState<CustomerReview[]>(() =>
    loadStorage('reviews', INITIAL_REVIEWS)
  );
  const [coupons, setCoupons] = useState<CouponCode[]>(() =>
    loadStorage('coupons', INITIAL_COUPONS)
  );
  const [loyaltyMembers, setLoyaltyMembers] = useState<LoyaltyMember[]>(() =>
    loadStorage('loyalty', INITIAL_LOYALTY)
  );
  const [ownerAccounts, setOwnerAccounts] = useState<RestaurantOwnerAccount[]>(() =>
    loadStorage('owners', INITIAL_OWNERS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() =>
    loadStorage('audit_logs', INITIAL_AUDIT_LOGS)
  );
  const [paymentSubmissions, setPaymentSubmissions] = useState<SubscriptionPayment[]>(() =>
    loadStorage('payment_submissions', [])
  );

  // View state & navigation
  const [currentView, setCurrentView] = useState<ViewMode>('LANDING');
  const [activeRestaurantSlug, setActiveRestaurantSlug] = useState<string>('brew-and-bliss');
  const [activeTableNumber, setActiveTableNumber] = useState<string>('01');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('owner@brewbliss.com');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);

  // Owner Authentication State
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() =>
    loadStorage('owner_auth', false)
  );
  const [isOwnerVerificationPinRequired, setIsOwnerVerificationPinRequired] = useState(false);
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);

  // Super Admin Authentication State
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState<boolean>(() =>
    loadStorage('super_admin_auth', false)
  );
  const [superAdminProfile, setSuperAdminProfile] = useState<{ name: string; email: string } | null>(() =>
    loadStorage('super_admin_profile', null)
  );
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() =>
    loadStorage('platform_settings', INITIAL_PLATFORM_SETTINGS)
  );

  // Sync state to localStorage
  useEffect(() => { saveStorage('owner_auth', isOwnerAuthenticated); }, [isOwnerAuthenticated]);
  useEffect(() => { saveStorage('super_admin_auth', isSuperAdminAuthenticated); }, [isSuperAdminAuthenticated]);
  useEffect(() => { saveStorage('super_admin_profile', superAdminProfile); }, [superAdminProfile]);
  useEffect(() => { saveStorage('platform_settings', platformSettings); }, [platformSettings]);
  useEffect(() => { saveStorage('restaurants', restaurants); }, [restaurants]);
  useEffect(() => { saveStorage('categories', categories); }, [categories]);
  useEffect(() => { saveStorage('menu_items', menuItems); }, [menuItems]);
  useEffect(() => { saveStorage('tables', tables); }, [tables]);
  useEffect(() => { saveStorage('orders', orders); }, [orders]);
  useEffect(() => { saveStorage('reviews', reviews); }, [reviews]);
  useEffect(() => { saveStorage('coupons', coupons); }, [coupons]);
  useEffect(() => { saveStorage('loyalty', loyaltyMembers); }, [loyaltyMembers]);
  useEffect(() => { saveStorage('owners', ownerAccounts); }, [ownerAccounts]);
  useEffect(() => { saveStorage('audit_logs', auditLogs); }, [auditLogs]);
  useEffect(() => { saveStorage('payment_submissions', paymentSubmissions); }, [paymentSubmissions]);

  // Audio Notification using Web Audio API (crisp, pleasant restaurant kitchen chime)
  const playOrderChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // First Ding (E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.5);

      // Second Dong (A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.0, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, []);

  // Hash route listener for direct QR scans & refreshing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#' || hash === '#/') {
        setCurrentView('LANDING');
        return;
      }

      // Format: #/restaurant/:slug/table/:tableNumber
      const restTableMatch = hash.match(/#\/restaurant\/([a-zA-Z0-9_-]+)\/table\/([a-zA-Z0-9_-]+)/);
      if (restTableMatch) {
        const slug = restTableMatch[1];
        const table = restTableMatch[2];
        setActiveRestaurantSlug(slug);
        setActiveTableNumber(table);
        setCurrentView('CUSTOMER_MENU');
        return;
      }

      // Format: #/restaurant/:slug
      const restOnlyMatch = hash.match(/#\/restaurant\/([a-zA-Z0-9_-]+)/);
      if (restOnlyMatch) {
        const slug = restOnlyMatch[1];
        setActiveRestaurantSlug(slug);
        setCurrentView('CUSTOMER_MENU');
        return;
      }

      if (hash.startsWith('#/owner')) {
        setCurrentView('OWNER_DASHBOARD');
        return;
      }

      if (hash.startsWith('#/admin') || hash.startsWith('#/super-admin')) {
        setCurrentView('SUPER_ADMIN');
        return;
      }

      if (hash.startsWith('#/login')) {
        setCurrentView('LOGIN_OWNER');
        return;
      }

      if (hash.startsWith('#/register')) {
        setCurrentView('REGISTER_OWNER');
        return;
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Active restaurant calculation
  const activeRestaurant =
    restaurants.find(
      (r) =>
        r.id === activeRestaurantId ||
        r.slug.toLowerCase() === activeRestaurantSlug.toLowerCase()
    ) || restaurants[0];

  // Scoped data
  const currentRestaurantCategories = categories.filter(
    (c) => c.restaurantId === activeRestaurant.id
  );
  const currentRestaurantMenuItems = menuItems.filter(
    (m) => m.restaurantId === activeRestaurant.id
  );
  const currentRestaurantTables = tables.filter(
    (t) => t.restaurantId === activeRestaurant.id
  );
  const currentRestaurantOrders = orders.filter(
    (o) => o.restaurantId === activeRestaurant.id
  );
  const currentRestaurantReviews = reviews.filter(
    (r) => r.restaurantId === activeRestaurant.id
  );

  // Navigation helpers
  const navigateToCustomerMenu = (slug: string, tableNumber = '01') => {
    setActiveRestaurantSlug(slug);
    setActiveTableNumber(tableNumber);
    window.location.hash = `#/restaurant/${slug}/table/${tableNumber}`;
    setCurrentView('CUSTOMER_MENU');
  };

  const navigateToOwnerDashboard = (restId?: string) => {
    if (restId) {
      setActiveRestaurantId(restId);
      const target = restaurants.find((r) => r.id === restId);
      if (target) setActiveRestaurantSlug(target.slug);
    }
    window.location.hash = '#/owner';
    setCurrentView('OWNER_DASHBOARD');
  };

  const navigateToSuperAdmin = () => {
    window.location.hash = '#/admin';
    setCurrentView('SUPER_ADMIN');
  };

  const navigateToLanding = () => {
    window.location.hash = '#/';
    setCurrentView('LANDING');
  };

  // Cart Management
  const addToCart = (
    item: MenuItem,
    variantId?: string,
    addonIds: string[] = [],
    instructions?: string
  ) => {
    const selectedVariant = item.variants?.find((v) => v.id === variantId) || null;
    const selectedAddons = item.addons?.filter((a) => addonIds.includes(a.id)) || [];

    const unitPrice =
      item.price +
      (selectedVariant ? selectedVariant.priceDelta : 0) +
      selectedAddons.reduce((sum, a) => sum + a.price, 0);

    const existingIndex = cart.findIndex(
      (c) =>
        c.productId === item.id &&
        c.selectedVariant?.id === selectedVariant?.id &&
        c.selectedAddons?.map((a) => a.id).sort().join(',') ===
          selectedAddons.map((a) => a.id).sort().join(',') &&
        c.specialInstructions === instructions
    );

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((ci, idx) => {
          if (idx === existingIndex) {
            const nextQty = ci.quantity + 1;
            return {
              ...ci,
              quantity: nextQty,
              itemTotal: ci.unitPrice * nextQty,
            };
          }
          return ci;
        })
      );
    } else {
      const newItem: CartItem = {
        id: 'ci-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        productId: item.id,
        name: item.name,
        basePrice: item.price,
        quantity: 1,
        unitPrice,
        itemTotal: unitPrice,
        selectedVariant,
        selectedAddons,
        specialInstructions: instructions,
        isVeg: item.isVeg,
      };
      setCart((prev) => [...prev, newItem]);
    }
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const current = prev[index];
      if (!current) return prev;
      const nextQty = current.quantity + delta;
      if (nextQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      return prev.map((item, i) =>
        i === index
          ? { ...item, quantity: nextQty, itemTotal: item.unitPrice * nextQty }
          : item
      );
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find(
      (c) =>
        c.restaurantId === activeRestaurant.id &&
        c.code.toUpperCase() === clean &&
        c.isActive
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    const currentSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
    if (currentSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order of ₹${found.minOrderAmount} required for this coupon`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Applied ${found.discountPercent}% OFF!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartTotals = calculateOrderTotals(
    cart,
    appliedCoupon ? appliedCoupon.discountPercent : 0,
    'DINE_IN'
  );

  // Submit Order from Customer Menu
  const submitCustomerOrder = (details: {
    customerName: string;
    customerPhone: string;
    orderMode: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    specialInstructions?: string;
  }): CustomerOrder => {
    const totals = calculateOrderTotals(
      cart,
      appliedCoupon ? appliedCoupon.discountPercent : 0,
      details.orderMode
    );

    const initialPayStatus = getInitialPaymentStatus(details.paymentMethod);
    const orderNumber = 'DF-' + Math.floor(1000 + Math.random() * 9000);
    const loyaltyPoints = calculateLoyaltyPoints(totals.finalTotal);

    const newOrder: CustomerOrder = {
      id: 'ord-' + Date.now(),
      orderNumber,
      restaurantId: activeRestaurant.id,
      tableNumber: details.orderMode === 'DINE_IN' ? activeTableNumber : 'N/A',
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      orderMode: details.orderMode,
      deliveryAddress: details.deliveryAddress,
      items: totals.items.map((it, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        productId: it.productId,
        name: it.name,
        basePrice: it.basePrice,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        itemTotal: it.itemTotal,
        selectedVariant: it.selectedVariant,
        selectedAddons: it.selectedAddons,
        specialInstructions: it.specialInstructions,
        isVeg: (it as unknown as { isVeg: boolean }).isVeg ?? true,
      })),
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      deliveryFee: totals.deliveryFee,
      finalTotal: totals.finalTotal,
      orderStatus: 'NEW',
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentMethod === 'CASH' ? 'PENDING_CASH' : 'PAID_ONLINE',
      paymentTransactionId:
        details.paymentMethod === 'CASH'
          ? undefined
          : 'UPI-' + Math.floor(100000000 + Math.random() * 900000000),
      createdAt: new Date().toISOString(),
      specialInstructions: details.specialInstructions,
      loyaltyPointsEarned: loyaltyPoints,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    playOrderChime();

    // Update loyalty if phone provided
    if (details.customerPhone) {
      setLoyaltyMembers((prev) => {
        const existing = prev.find(
          (m) =>
            m.restaurantId === activeRestaurant.id &&
            m.customerPhone === details.customerPhone
        );
        if (existing) {
          return prev.map((m) =>
            m.id === existing.id
              ? {
                  ...m,
                  pointsBalance: m.pointsBalance + loyaltyPoints,
                  totalSpent: m.totalSpent + totals.finalTotal,
                  ordersCount: m.ordersCount + 1,
                }
              : m
          );
        } else {
          return [
            ...prev,
            {
              id: 'lm-' + Date.now(),
              restaurantId: activeRestaurant.id,
              customerPhone: details.customerPhone,
              customerName: details.customerName,
              pointsBalance: loyaltyPoints,
              totalSpent: totals.finalTotal,
              ordersCount: 1,
            },
          ];
        }
      });
    }

    return newOrder;
  };

  // Order status transitions
  const updateOrderStatus = (orderId: string, nextStatus: OrderStatus): boolean => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return false;
    if (!canTransitionOrderStatus(target.orderStatus, nextStatus)) return false;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: nextStatus } : o))
    );
    return true;
  };

  // Staff confirms cash received at table
  const confirmCashPayment = (orderId: string): boolean => {
    const target = orders.find((o) => o.id === orderId);
    if (!target || target.paymentStatus !== 'PENDING_CASH') return false;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: 'PAID_CASH',
              paymentTransactionId: 'CASH-REC-' + Date.now().toString().slice(-6),
            }
          : o
      )
    );
    return true;
  };

  // Menu Management
  const addCategory = (name: string, iconName = 'Coffee') => {
    const newCat: MenuCategory = {
      id: 'cat-' + Date.now(),
      restaurantId: activeRestaurant.id,
      name,
      iconName,
      orderIndex: currentRestaurantCategories.length + 1,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id' | 'restaurantId'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: 'item-' + Date.now(),
      restaurantId: activeRestaurant.id,
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  // Table Management
  const addTable = (tableNumber: string, tableName: string, capacity: number) => {
    const newTable: RestaurantTable = {
      id: 'tbl-' + Date.now(),
      restaurantId: activeRestaurant.id,
      tableNumber,
      tableName: tableName || `Table ${tableNumber}`,
      capacity: capacity || 4,
      isActive: true,
      qrCodeUrl: '',
    };
    setTables((prev) => [...prev, newTable]);
  };

  const updateTable = (id: string, updates: Partial<RestaurantTable>) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTable = (id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  // Restaurant Profile Settings
  const updateRestaurantSettings = (updates: Partial<RestaurantSettings>) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === activeRestaurant.id ? { ...r, ...updates } : r))
    );
  };

  // Customer Reviews
  const submitReview = (rating: number, comment: string, customerName: string) => {
    const newReview: CustomerReview = {
      id: 'rev-' + Date.now(),
      restaurantId: activeRestaurant.id,
      customerName: customerName || 'Valued Guest',
      rating,
      comment,
      date: 'Just now',
      status: 'PUBLISHED',
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  // Super Admin actions
  const approveRestaurantOwner = (ownerId: string) => {
    setOwnerAccounts((prev) =>
      prev.map((o) => (o.id === ownerId ? { ...o, status: 'ACTIVE' } : o))
    );
    setAuditLogs((prev) => [
      {
        id: 'aud-' + Date.now(),
        timestamp: new Date().toLocaleDateString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        actor: 'Mayur Gorule (Super Admin)',
        action: 'APPROVED_TENANT',
        details: `Approved owner ID: ${ownerId}`,
      },
      ...prev,
    ]);
  };

  const toggleRestaurantStatus = (restaurantId: string) => {
    setOwnerAccounts((prev) =>
      prev.map((o) => {
        if (o.restaurantId === restaurantId) {
          const nextStatus = o.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...o, status: nextStatus };
        }
        return o;
      })
    );
  };

  const addRestaurantTenant = (data: {
    name: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    city: string;
    plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  }) => {
    const newRestId = 'rest-' + Date.now();
    const slug =
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'new-restaurant';

    const newRestaurant: RestaurantSettings = {
      id: newRestId,
      restaurantId: newRestId,
      name: data.name,
      slug,
      tagline: 'Artisanal Flavors & Table Hospitality',
      description: `Welcome to ${data.name}. Enjoy our delicious chef-curated food and instant QR table ordering.`,
      logo: '🍽️',
      coverImage: '/src/assets/images/restaurant_table_standee_1793552351244.jpg',
      address: data.city || 'Mumbai, Maharashtra',
      phone: data.ownerPhone,
      whatsapp: data.ownerPhone,
      openingHours: '10:00 AM - 11:30 PM',
      googleReviewUrl: 'https://g.page/review',
      currency: 'INR',
      taxRate: 5,
      isDineInEnabled: true,
      isTakeawayEnabled: true,
      isDeliveryEnabled: true,
      isGPayEnabled: true,
      isPhonePeEnabled: true,
      isCashEnabled: true,
    };

    const newOwner: RestaurantOwnerAccount = {
      id: 'usr-' + Date.now(),
      name: data.ownerName,
      email: data.ownerEmail,
      restaurantId: newRestId,
      role: 'OWNER',
      status: 'ACTIVE',
      plan: data.plan as 'STARTER' | 'PRO' | 'ENTERPRISE',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    // Auto-create 4 scannable tables
    const newTables: RestaurantTable[] = [1, 2, 3, 4].map((num) => ({
      id: `tbl-${newRestId}-${num}`,
      restaurantId: newRestId,
      tableNumber: String(num).padStart(2, '0'),
      tableName: `Table ${String(num).padStart(2, '0')}`,
      capacity: 4,
      isActive: true,
      qrCodeUrl: '',
    }));

    // Auto-create default category & starter item
    const catId = 'cat-' + Date.now();
    const newCategory: MenuCategory = {
      id: catId,
      restaurantId: newRestId,
      name: 'Chef Recommendations',
      iconName: 'Sparkles',
      orderIndex: 1,
    };

    const newMenuItem: MenuItem = {
      id: 'item-' + Date.now(),
      restaurantId: newRestId,
      categoryId: catId,
      name: 'Signature Gourmet Special',
      description: 'Handcrafted house specialty with fresh local ingredients and signature glaze.',
      price: 249,
      image: '/src/assets/images/hero_latte_art_cup_1793552349663.jpg',
      isVeg: true,
      isAvailable: true,
      rating: 4.9,
      reviewsCount: 1,
    };

    setRestaurants((prev) => [...prev, newRestaurant]);
    setOwnerAccounts((prev) => [...prev, newOwner]);
    setTables((prev) => [...prev, ...newTables]);
    setCategories((prev) => [...prev, newCategory]);
    setMenuItems((prev) => [...prev, newMenuItem]);

    setAuditLogs((prev) => [
      {
        id: 'aud-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: 'Mayur Gorule (Super Admin)',
        action: 'PROVISIONED_TENANT',
        details: `Provisioned new restaurant tenant: ${data.name} (${newRestId})`,
      },
      ...prev,
    ]);
  };

  const changeRestaurantPlan = (
    restaurantId: string,
    plan: 'STARTER' | 'PRO' | 'ENTERPRISE'
  ) => {
    setOwnerAccounts((prev) =>
      prev.map((o) => (o.restaurantId === restaurantId ? { ...o, plan: plan as any } : o))
    );
    setAuditLogs((prev) => [
      {
        id: 'aud-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: 'Mayur Gorule (Super Admin)',
        action: 'PLAN_CHANGE',
        details: `Updated subscription plan to ${plan} for restaurant ${restaurantId}`,
      },
      ...prev,
    ]);
  };

  const loginSuperAdmin = async (
    email: string,
    password: string,
    passkey: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, passkey }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuperAdminAuthenticated(true);
        setSuperAdminProfile(data.admin);
        saveStorage('super_admin_auth', true);
        saveStorage('super_admin_profile', data.admin);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Authentication failed.' };
      }
    } catch {
      // Offline / Direct verification fallback strictly for authorized owner email:
      if (
        isAuthorizedSuperAdminEmail(email) &&
        (password === 'Mayur@2026Admin' || password === '1234') &&
        passkey === '913704'
      ) {
        const admin = { name: 'Mayur Gorule', email: 'mayurgorulemg4444@gmail.com' };
        setIsSuperAdminAuthenticated(true);
        setSuperAdminProfile(admin);
        saveStorage('super_admin_auth', true);
        saveStorage('super_admin_profile', admin);
        return { success: true };
      }
      return { success: false, message: 'Server authorization failed.' };
    }
  };

  const logoutSuperAdmin = () => {
    fetch('/api/super-admin/logout', { method: 'POST' }).catch(() => {});
    setIsSuperAdminAuthenticated(false);
    setSuperAdminProfile(null);
    saveStorage('super_admin_auth', false);
    saveStorage('super_admin_profile', null);
    navigateToLanding();
  };

  const updatePlatformSettings = (updates: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => {
      const next = { ...prev, ...updates };
      saveStorage('platform_settings', next);
      return next;
    });
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setRestaurants(INITIAL_RESTAURANTS);
    setCategories(INITIAL_CATEGORIES);
    setMenuItems(INITIAL_MENU_ITEMS);
    setTables(INITIAL_TABLES);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setCoupons(INITIAL_COUPONS);
    setLoyaltyMembers(INITIAL_LOYALTY);
    setOwnerAccounts(INITIAL_OWNERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setPlatformSettings(INITIAL_PLATFORM_SETTINGS);
    setCart([]);
    setAppliedCoupon(null);
    setIsOwnerAuthenticated(false);
    setIsSuperAdminAuthenticated(false);
  };

  const loginOwner = async (email: string, password: string): Promise<{ success: boolean; requiresPin?: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsOwnerVerificationPinRequired(true);
        return { success: true, requiresPin: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch {
      return { success: false, message: 'Server error' };
    }
  };

  const verifyOwnerPin = async (pin: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/owner/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsOwnerAuthenticated(true);
        setIsOwnerVerificationPinRequired(false);
        setIsOwnerLoginModalOpen(false);
        return { success: true };
      }
      return { success: false, message: 'Invalid PIN' };
    } catch {
      return { success: false, message: 'Server error' };
    }
  };

  const logoutOwner = () => {
    setIsOwnerAuthenticated(false);
    setIsOwnerVerificationPinRequired(false);
    saveStorage('owner_auth', false);
    navigateToLanding();
  };

  const submitPaymentDetails = (data: Omit<SubscriptionPayment, 'id' | 'status' | 'createdAt'>) => {
    const newSubmission: SubscriptionPayment = {
      ...data,
      id: 'sub-' + Date.now(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setPaymentSubmissions((prev) => [newSubmission, ...prev]);
    // Optionally update owner account status to pending
    setOwnerAccounts((prev) =>
      prev.map((o) => (o.restaurantId === data.restaurantId ? { ...o, status: 'PENDING_APPROVAL' } : o))
    );
  };

  const approvePayment = (submissionId: string) => {
    const sub = paymentSubmissions.find((s) => s.id === submissionId);
    if (!sub) return;
    setPaymentSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'APPROVED' } : s))
    );
    setOwnerAccounts((prev) =>
      prev.map((o) => (o.restaurantId === sub.restaurantId ? { ...o, status: 'ACTIVE' } : o))
    );
  };

  const rejectPayment = (submissionId: string) => {
    setPaymentSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'REJECTED' } : s))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeRestaurantSlug,
        setActiveRestaurantSlug,
        activeTableNumber,
        setActiveTableNumber,
        navigateToCustomerMenu,
        navigateToOwnerDashboard,
        navigateToSuperAdmin,
        navigateToLanding,
        restaurants,
        activeRestaurant,
        categories,
        menuItems,
        tables,
        orders,
        reviews,
        coupons,
        loyaltyMembers,
        ownerAccounts,
        auditLogs,
        currentUserEmail,
        currentRestaurantCategories,
        currentRestaurantMenuItems,
        currentRestaurantTables,
        currentRestaurantOrders,
        currentRestaurantReviews,
        cart,
        appliedCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        cartTotals,
        submitCustomerOrder,
        updateOrderStatus,
        confirmCashPayment,
        addCategory,
        updateCategory,
        deleteCategory,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        addTable,
        updateTable,
        deleteTable,
        updateRestaurantSettings,
        submitReview,
        approveRestaurantOwner,
        toggleRestaurantStatus,
        addRestaurantTenant,
        changeRestaurantPlan,
        resetAllDemoData,
        isSuperAdminAuthenticated,
        superAdminProfile,
        loginSuperAdmin,
        logoutSuperAdmin,
        platformSettings,
        updatePlatformSettings,
        playOrderChime,
        isOwnerAuthenticated,
        loginOwner,
        logoutOwner,
        isOwnerLoginModalOpen,
        setIsOwnerLoginModalOpen,
        isOwnerVerificationPinRequired,
        verifyOwnerPin,
        paymentSubmissions,
        submitPaymentDetails,
        approvePayment,
        rejectPayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
