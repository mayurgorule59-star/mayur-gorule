export type ViewMode =
  | 'LANDING'
  | 'CUSTOMER_MENU'
  | 'OWNER_DASHBOARD'
  | 'SUPER_ADMIN'
  | 'LOGIN_OWNER'
  | 'REGISTER_OWNER';

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemVariant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isPopular?: boolean;
  isBestseller?: boolean;
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
  variants?: MenuItemVariant[];
  addons?: MenuItemAddon[];
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  iconName: string; // Lucide icon identifier
  orderIndex: number;
}

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  tableNumber: string;
  tableName: string;
  capacity: number;
  isActive: boolean;
  qrCodeUrl: string;
}

export interface RestaurantSettings {
  id: string;
  restaurantId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
  googleReviewUrl: string;
  googleMapsUrl?: string;
  currency: string;
  taxRate: number; // e.g. 5 for 5%
  isDineInEnabled: boolean;
  isTakeawayEnabled: boolean;
  isDeliveryEnabled: boolean;
  isGPayEnabled: boolean;
  isPhonePeEnabled: boolean;
  isCashEnabled: boolean;
  wifiName?: string;
  wifiPassword?: string;
}

export type OrderStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod = 'UPI_GPAY' | 'UPI_PHONEPE' | 'CASH';
export type PaymentStatus = 'PENDING' | 'PENDING_CASH' | 'PAID_ONLINE' | 'PAID_CASH' | 'FAILED';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  selectedVariant?: MenuItemVariant | null;
  selectedAddons?: MenuItemAddon[];
  specialInstructions?: string;
  isVeg: boolean;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string; // e.g. DF-1042
  restaurantId: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  orderMode: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  deliveryFee: number;
  finalTotal: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  createdAt: string; // ISO String
  specialInstructions?: string;
  loyaltyPointsEarned: number;
}

export interface CustomerReview {
  id: string;
  restaurantId: string;
  orderId?: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  status: 'PUBLISHED' | 'FLAGGED';
}

export interface CouponCode {
  id: string;
  restaurantId: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  isActive: boolean;
}

export interface LoyaltyMember {
  id: string;
  restaurantId: string;
  customerPhone: string;
  customerName: string;
  pointsBalance: number;
  totalSpent: number;
  ordersCount: number;
}

export interface RestaurantOwnerAccount {
  id: string;
  name: string;
  email: string;
  restaurantId: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  plan: 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  joinedDate: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface SubscriptionPayment {
  id: string;
  restaurantId: string;
  ownerName: string;
  ownerEmail: string;
  plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  screenshotUrl?: string;
  createdAt: string;
}

export interface PlatformSettings {
  platformName: string;
  ownerName: string;
  authorizedEmail: string;
  whatsappNumber: string;
  contactEmail: string;
  commissionPercent: number;
  directUpiMode: boolean;
  showAnnouncement: boolean;
  announcementText: string;
  maintenanceMode: boolean;
}

