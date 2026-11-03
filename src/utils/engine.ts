/**
 * Core business engine for DineFlow Multi-Restaurant SaaS
 * Calculates pricing, enforces server-authoritative validations,
 * manages order state machines, and generates permanent table QR URLs.
 */

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

export interface OrderItemInput {
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  selectedVariant?: MenuItemVariant | null;
  selectedAddons?: MenuItemAddon[];
  specialInstructions?: string;
}

export interface CartCalculationResult {
  subtotal: number;
  taxAmount: number; // 5% GST
  discountAmount: number;
  deliveryFee: number;
  finalTotal: number;
  itemCount: number;
  items: Array<OrderItemInput & { unitPrice: number; itemTotal: number }>;
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

export const TAX_RATE = 0.05; // 5% Restaurant GST in India
export const LOYALTY_POINTS_PER_100_INR = 10;
export const AUTHORIZED_SUPER_ADMIN_EMAIL = 'mayurgorulemg4444@gmail.com';

/**
 * Validates if an email is the authorized platform Super Admin
 */
export function isAuthorizedSuperAdminEmail(email: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Validates uploaded food image file type and size (max 5MB, jpeg/png/webp)
 */
export function validateUploadedImageFile(file: { type?: string; size?: number }): { valid: boolean; error?: string } {
  if (!file) return { valid: false, error: 'No file provided' };
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (file.type && !allowedTypes.includes(file.type.toLowerCase())) {
    return { valid: false, error: 'Invalid file format. Please upload JPG, PNG, or WebP.' };
  }
  const maxBytes = 5 * 1024 * 1024; // 5MB
  if (file.size && file.size > maxBytes) {
    return { valid: false, error: 'Image file too large. Maximum file size is 5MB.' };
  }
  return { valid: true };
}

/**
 * Calculates item unit price including variant and addons
 */
export function calculateItemUnitPrice(
  basePrice: number,
  variant?: MenuItemVariant | null,
  addons: MenuItemAddon[] = []
): number {
  const variantDelta = variant ? variant.priceDelta : 0;
  const addonsTotal = addons.reduce((sum, a) => sum + Math.max(0, a.price), 0);
  return Math.max(0, basePrice + variantDelta + addonsTotal);
}

/**
 * Calculates cart totals authoritatively
 */
export function calculateOrderTotals(
  items: OrderItemInput[],
  couponDiscountPercent = 0,
  orderMode: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' = 'DINE_IN'
): CartCalculationResult {
  let subtotal = 0;
  let totalCount = 0;

  const calculatedItems = items.map((item) => {
    const qty = Math.max(1, Math.floor(item.quantity || 1));
    const unitPrice = calculateItemUnitPrice(
      item.basePrice,
      item.selectedVariant,
      item.selectedAddons
    );
    const itemTotal = unitPrice * qty;
    subtotal += itemTotal;
    totalCount += qty;

    return {
      ...item,
      quantity: qty,
      unitPrice,
      itemTotal,
    };
  });

  const discountAmount = Math.round(subtotal * (Math.min(100, Math.max(0, couponDiscountPercent)) / 100));
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(subtotalAfterDiscount * TAX_RATE);
  const deliveryFee = orderMode === 'DELIVERY' ? 40 : 0;
  const finalTotal = subtotalAfterDiscount + taxAmount + deliveryFee;

  return {
    subtotal,
    taxAmount,
    discountAmount,
    deliveryFee,
    finalTotal,
    itemCount: totalCount,
    items: calculatedItems,
  };
}

/**
 * Calculates loyalty points earned on completed order
 */
export function calculateLoyaltyPoints(finalTotal: number): number {
  if (finalTotal <= 0) return 0;
  return Math.floor(finalTotal / 100) * LOYALTY_POINTS_PER_100_INR;
}

/**
 * Validates order state machine transitions
 */
export function canTransitionOrderStatus(current: OrderStatus, next: OrderStatus): boolean {
  if (current === next) return true;
  if (current === 'COMPLETED' || current === 'CANCELLED') return false;

  const transitions: Record<OrderStatus, OrderStatus[]> = {
    NEW: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['PREPARING', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['SERVED', 'COMPLETED', 'CANCELLED'],
    SERVED: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
  };

  return transitions[current]?.includes(next) ?? false;
}

/**
 * Determine initial payment status based on payment method
 */
export function getInitialPaymentStatus(method: PaymentMethod): PaymentStatus {
  if (method === 'CASH') {
    return 'PENDING_CASH';
  }
  return 'PENDING';
}

/**
 * Verifies if cash payment can be confirmed by staff
 */
export function canConfirmCashPayment(current: PaymentStatus): boolean {
  return current === 'PENDING_CASH';
}

/**
 * Formats a clean permanent QR destination URL
 */
export function buildTableQRUrl(baseUrl: string, restaurantSlug: string, tableNumber: string | number): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanSlug = encodeURIComponent(restaurantSlug.toLowerCase().trim());
  const cleanTable = encodeURIComponent(String(tableNumber).trim());
  return `${cleanBase}/#/restaurant/${cleanSlug}/table/${cleanTable}`;
}

/**
 * Formats Indian Currency (₹)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
