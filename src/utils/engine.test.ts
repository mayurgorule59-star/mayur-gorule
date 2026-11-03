import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemUnitPrice,
  calculateOrderTotals,
  calculateLoyaltyPoints,
  canTransitionOrderStatus,
  getInitialPaymentStatus,
  canConfirmCashPayment,
  buildTableQRUrl,
  formatINR,
  isAuthorizedSuperAdminEmail,
  validateUploadedImageFile,
} from './engine.js';

test('calculateItemUnitPrice handles base, variants and addons correctly', () => {
  const basePrice = 149;
  const variant = { id: 'v1', name: 'Large', priceDelta: 40 };
  const addons = [
    { id: 'a1', name: 'Extra Shot', price: 30 },
    { id: 'a2', name: 'Oat Milk', price: 25 },
  ];

  const total = calculateItemUnitPrice(basePrice, variant, addons);
  assert.equal(total, 149 + 40 + 30 + 25); // 244
});

test('calculateOrderTotals applies 5% GST and coupon discounts', () => {
  const items = [
    {
      productId: 'p1',
      name: 'Cappuccino',
      basePrice: 150,
      quantity: 2,
    },
    {
      productId: 'p2',
      name: 'Muffin',
      basePrice: 100,
      quantity: 1,
    },
  ];

  // Subtotal = 150*2 + 100 = 400
  // Discount 20% = 80 -> Subtotal after discount = 320
  // 5% GST = 16
  // Delivery = 0
  // Final = 336
  const result = calculateOrderTotals(items, 20, 'DINE_IN');
  assert.equal(result.subtotal, 400);
  assert.equal(result.discountAmount, 80);
  assert.equal(result.taxAmount, 16);
  assert.equal(result.deliveryFee, 0);
  assert.equal(result.finalTotal, 336);
  assert.equal(result.itemCount, 3);
});

test('calculateLoyaltyPoints awards 10 points per ₹100', () => {
  assert.equal(calculateLoyaltyPoints(450), 40);
  assert.equal(calculateLoyaltyPoints(99), 0);
  assert.equal(calculateLoyaltyPoints(1250), 120);
});

test('canTransitionOrderStatus enforces proper order life cycle', () => {
  assert.equal(canTransitionOrderStatus('NEW', 'ACCEPTED'), true);
  assert.equal(canTransitionOrderStatus('ACCEPTED', 'PREPARING'), true);
  assert.equal(canTransitionOrderStatus('PREPARING', 'READY'), true);
  assert.equal(canTransitionOrderStatus('READY', 'SERVED'), true);
  assert.equal(canTransitionOrderStatus('SERVED', 'COMPLETED'), true);

  // Illegal backward jumps
  assert.equal(canTransitionOrderStatus('READY', 'NEW'), false);
  assert.equal(canTransitionOrderStatus('COMPLETED', 'PREPARING'), false);
});

test('cash payment flow sets PENDING_CASH and allows staff confirmation', () => {
  const status = getInitialPaymentStatus('CASH');
  assert.equal(status, 'PENDING_CASH');
  assert.equal(canConfirmCashPayment(status), true);
  assert.equal(canConfirmCashPayment('PAID_CASH'), false);
});

test('buildTableQRUrl produces clean scannable URL with restaurant and table', () => {
  const url = buildTableQRUrl('https://dineflow.app', 'brew-and-bliss', '04');
  assert.equal(url, 'https://dineflow.app/#/restaurant/brew-and-bliss/table/04');
});

test('formatINR formats currency nicely', () => {
  const formatted = formatINR(249);
  assert.ok(formatted.includes('249'));
});

test('isAuthorizedSuperAdminEmail restricts access strictly to mayurgorulemg@gmail.com', () => {
  assert.equal(isAuthorizedSuperAdminEmail('mayurgorulemg@gmail.com'), true);
  assert.equal(isAuthorizedSuperAdminEmail('MAYURGORULEMG@GMAIL.COM'), true);
  assert.equal(isAuthorizedSuperAdminEmail('  mayurgorulemg@gmail.com  '), true);
  // Rejects anyone else
  assert.equal(isAuthorizedSuperAdminEmail('owner@brewbliss.com'), false);
  assert.equal(isAuthorizedSuperAdminEmail('admin@other.com'), false);
  assert.equal(isAuthorizedSuperAdminEmail(''), false);
});

test('validateUploadedImageFile enforces image type and 5MB size limit', () => {
  assert.equal(validateUploadedImageFile({ type: 'image/jpeg', size: 1024 * 500 }).valid, true);
  assert.equal(validateUploadedImageFile({ type: 'image/png', size: 1024 * 1024 }).valid, true);
  assert.equal(validateUploadedImageFile({ type: 'image/webp', size: 1024 * 200 }).valid, true);
  // Rejects non-image and oversized
  assert.equal(validateUploadedImageFile({ type: 'application/pdf', size: 1024 }).valid, false);
  assert.equal(validateUploadedImageFile({ type: 'image/jpeg', size: 6 * 1024 * 1024 }).valid, false);
});
