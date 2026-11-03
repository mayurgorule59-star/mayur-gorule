import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Check,
  Clock,
  ArrowRight,
  X,
  CreditCard,
  Banknote,
  Sparkles,
  Award,
  ExternalLink,
  ChevronRight,
  Info,
  Coffee,
  Croissant,
  Sandwich,
  Cake,
  CupSoda,
  Egg,
  Flame,
  Soup,
  UtensilsCrossed,
  Wheat,
  Wine,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { MenuItem, MenuCategory, CustomerOrder, PaymentMethod } from '../../types/index.js';
import { formatINR } from '../../utils/engine.js';

// Category icon helper
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Coffee': return <Coffee className="w-5 h-5" />;
    case 'Croissant': return <Croissant className="w-5 h-5" />;
    case 'Sandwich': return <Sandwich className="w-5 h-5" />;
    case 'Cake': return <Cake className="w-5 h-5" />;
    case 'CupSoda': return <CupSoda className="w-5 h-5" />;
    case 'Egg': return <Egg className="w-5 h-5" />;
    case 'Flame': return <Flame className="w-5 h-5" />;
    case 'Soup': return <Soup className="w-5 h-5" />;
    case 'Wheat': return <Wheat className="w-5 h-5" />;
    case 'Wine': return <Wine className="w-5 h-5" />;
    default: return <UtensilsCrossed className="w-5 h-5" />;
  }
};

export const CustomerMenu: React.FC = () => {
  const {
    activeRestaurant,
    activeTableNumber,
    currentRestaurantCategories,
    currentRestaurantMenuItems,
    cart,
    cartTotals,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    submitCustomerOrder,
    submitReview,
    loyaltyMembers,
  } = useApp();

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [vegFilterOnly, setVegFilterOnly] = useState(false);

  // Modals & Panels
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'rewards' | 'status'>('home');

  // Product customization state
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [itemInstructions, setItemInstructions] = useState('');

  // Checkout inputs
  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerPhone, setCustomerPhone] = useState('+91 91370 43953');
  const [orderMode, setOrderMode] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI_GPAY');
  const [orderNotes, setOrderNotes] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Order confirmation state
  const [placedOrder, setPlacedOrder] = useState<CustomerOrder | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return currentRestaurantMenuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategoryId === 'all' || item.categoryId === selectedCategoryId;
      const matchesVeg = !vegFilterOnly || item.isVeg;
      return matchesSearch && matchesCategory && matchesVeg;
    });
  }, [currentRestaurantMenuItems, searchQuery, selectedCategoryId, vegFilterOnly]);

  const popularPicks = useMemo(() => {
    return currentRestaurantMenuItems.filter((item) => item.isPopular || item.isBestseller);
  }, [currentRestaurantMenuItems]);

  // Open item detail
  const handleOpenProduct = (product: MenuItem) => {
    setSelectedProduct(product);
    setSelectedVariantId(product.variants?.[0]?.id);
    setSelectedAddonIds([]);
    setItemInstructions('');
  };

  const handleAddCustomizedToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, selectedVariantId, selectedAddonIds, itemInstructions);
    setSelectedProduct(null);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const order = submitCustomerOrder({
      customerName,
      customerPhone,
      orderMode,
      deliveryAddress: orderMode === 'DELIVERY' ? deliveryAddress : undefined,
      paymentMethod,
      specialInstructions: orderNotes,
    });
    setPlacedOrder(order);
    setIsCheckoutStep(false);
    setIsCartOpen(false);
    setActiveTab('status');
  };

  const handleSendReview = () => {
    submitReview(reviewRating, reviewComment, customerName);
    setReviewSubmitted(true);
  };

  // Find customer loyalty points
  const customerLoyalty = loyaltyMembers.find(
    (m) =>
      m.restaurantId === activeRestaurant.id &&
      m.customerPhone === customerPhone
  );

  return (
    <div className="min-h-screen bg-[#FAF5ED] pb-24 text-[#211B17]">
      {/* 1. Mobile-First Customer Top App Bar (Inspired by Reference Image 1) */}
      <div className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E9DFD3] px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#542B17] text-white flex items-center justify-center text-lg shadow-sm">
              {activeRestaurant.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury font-bold text-base text-[#29170F] leading-tight">
                  {activeRestaurant.name}
                </h1>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#75685E] font-medium">
                <span className="inline-flex items-center px-1.5 py-0.2 bg-[#B87532]/10 text-[#542B17] font-semibold rounded text-[10px]">
                  Table {activeTableNumber || '01'}
                </span>
                <span>·</span>
                <span>QR Dine-In</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#542B17] text-white shadow-sm hover:bg-[#29170F] transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 text-[#D99A4E]" />
              {cartTotals.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D94A4A] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartTotals.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-4 space-y-6">
        {/* Order Status Notification Banner if active order exists */}
        {placedOrder && activeTab !== 'status' && (
          <div
            onClick={() => setActiveTab('status')}
            className="p-3.5 bg-[#542B17] text-white rounded-xl shadow-md flex items-center justify-between cursor-pointer hover:bg-[#29170F] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D99A4E] text-[#29170F] flex items-center justify-center font-bold text-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">
                  Order {placedOrder.orderNumber} is{' '}
                  <span className="text-[#D99A4E]">{placedOrder.orderStatus}</span>
                </div>
                <div className="text-[11px] text-stone-300">
                  Table {placedOrder.tableNumber} · Tap to track live status
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#D99A4E]" />
          </div>
        )}

        {/* 2. Search & Veg Toggle Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75685E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, food & more..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E9DFD3] rounded-xl text-xs text-[#211B17] placeholder-[#75685E] shadow-2xs focus:outline-hidden focus:border-[#B87532]"
            />
          </div>
          <button
            onClick={() => setVegFilterOnly(!vegFilterOnly)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
              vegFilterOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                : 'bg-white border-[#E9DFD3] text-[#75685E] hover:border-[#B87532]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Veg Only</span>
          </button>
        </div>

        {/* 3. Promotional Hero Banner (Directly Inspired by Reference Image 1) */}
        <div className="relative rounded-2xl overflow-hidden shadow-md bg-[#29170F] text-white">
          <div className="p-6 relative z-10 max-w-[65%] space-y-2">
            <span className="font-serif-luxury italic text-[#D99A4E] text-sm block">
              Good Food · Good Vibes
            </span>
            <h2 className="font-serif-luxury text-xl font-bold leading-tight text-white">
              Freshly crafted delicacies made for you.
            </h2>
            <p className="text-[11px] text-[#EDE0CE]/80 leading-relaxed">
              Order directly to Table {activeTableNumber}. Fast kitchen prep, zero waiting.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('menu-items-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#D99A4E] hover:bg-[#B87532] text-[#29170F] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Order Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2">
            <img
              src={activeRestaurant.coverImage}
              alt="Promo hero"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#29170F] via-transparent to-transparent" />
          </div>
        </div>

        {/* 4. Food Categories (Circular Pills matching Reference Image 1) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif-luxury text-base font-bold text-[#29170F]">
              Categories
            </h3>
            {selectedCategoryId !== 'all' && (
              <button
                onClick={() => setSelectedCategoryId('all')}
                className="text-xs text-[#B87532] font-semibold hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`flex flex-col items-center gap-1.5 shrink-0 focus:outline-hidden ${
                selectedCategoryId === 'all' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  selectedCategoryId === 'all'
                    ? 'bg-[#542B17] text-[#D99A4E] ring-2 ring-[#D99A4E] shadow-sm'
                    : 'bg-white border border-[#E9DFD3] text-[#542B17]'
                }`}
              >
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-[#211B17]">All</span>
            </button>

            {currentRestaurantCategories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1.5 shrink-0 focus:outline-hidden ${
                    isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#542B17] text-[#D99A4E] ring-2 ring-[#D99A4E] shadow-sm'
                        : 'bg-white border border-[#E9DFD3] text-[#542B17]'
                    }`}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-[11px] font-semibold text-[#211B17]">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Popular Picks Section (Horizontal Cards matching Reference Image 1) */}
        {selectedCategoryId === 'all' && searchQuery === '' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-luxury text-base font-bold text-[#29170F]">
                Popular Picks
              </h3>
              <span className="text-xs text-[#75685E]">Chef recommendations</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {popularPicks.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenProduct(item)}
                  className="bg-white rounded-xl border border-[#E9DFD3] overflow-hidden shadow-2xs hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isBestseller && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#29170F]/90 backdrop-blur-xs text-[#D99A4E] text-[9px] font-bold tracking-wider uppercase rounded">
                        Bestseller
                      </span>
                    )}
                    <span
                      className={`absolute top-2 right-2 w-4 h-4 rounded border bg-white flex items-center justify-center ${
                        item.isVeg ? 'border-emerald-600' : 'border-red-600'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      />
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-[#211B17] line-clamp-1 group-hover:text-[#542B17]">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#75685E] line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                      <div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{item.rating}</span>
                        </div>
                        <span className="font-bold text-xs text-[#211B17] font-mono">
                          {formatINR(item.price)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="w-7 h-7 rounded-full bg-[#542B17] text-white flex items-center justify-center hover:bg-[#29170F] shadow-2xs"
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Promotional Weekend Special Banner (Inspired by Reference Image 1) */}
        <div className="p-4 bg-gradient-to-r from-[#FFFDF9] to-[#FAF5ED] rounded-xl border border-[#D99A4E]/40 flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#B87532]">
              Special Offer
            </span>
            <div className="font-serif-luxury font-bold text-sm text-[#29170F]">
              20% OFF on all orders above ₹299
            </div>
            <p className="text-[11px] text-[#75685E]">
              Use code <strong className="text-[#542B17] font-mono">WELCOME20</strong> at checkout
            </p>
          </div>
          <button
            onClick={() => {
              applyCoupon('WELCOME20');
              setIsCartOpen(true);
            }}
            className="px-3 py-1.5 bg-[#542B17] text-[#D99A4E] hover:bg-[#29170F] rounded-lg text-xs font-bold uppercase tracking-wider shrink-0"
          >
            Apply Code
          </button>
        </div>

        {/* 7. Full Menu Items Section */}
        <div id="menu-items-grid" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-base font-bold text-[#29170F]">
              Menu ({filteredProducts.length})
            </h3>
            <span className="text-xs text-[#75685E]">Tap item to customize</span>
          </div>

          <div className="space-y-3">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenProduct(item)}
                className="p-3 bg-white rounded-xl border border-[#E9DFD3] shadow-2xs hover:border-[#B87532] transition-colors cursor-pointer flex gap-3.5 group"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/src/assets/images/hero_latte_art_cup_1793552349663.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-1.5 left-1.5 w-3.5 h-3.5 rounded border bg-white flex items-center justify-center ${
                      item.isVeg ? 'border-emerald-600' : 'border-red-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                    />
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-[#211B17] group-hover:text-[#542B17]">
                        {item.name}
                      </h4>
                      {item.isBestseller && (
                        <span className="text-[9px] font-bold text-[#B87532] uppercase">
                          Bestseller
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#75685E] line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-xs text-[#211B17] font-mono">
                      {formatINR(item.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="px-3 py-1 bg-[#542B17] text-white hover:bg-[#29170F] rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Feedback & Google Review Link */}
        <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h4 className="font-serif-luxury font-bold text-sm text-[#29170F]">
              Enjoying your dining experience?
            </h4>
            <p className="text-xs text-[#75685E] mt-0.5">
              Leave a quick rating or review on Google to help us improve.
            </p>
          </div>

          <div className="flex justify-center gap-2 pt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setReviewRating(s)}
                className="p-1 focus:outline-hidden"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    s <= reviewRating
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-1">
            <input
              type="text"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What did you love most? (optional)"
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-[#B87532]"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSendReview}
                disabled={reviewSubmitted}
                className="flex-1 py-2 bg-[#542B17] text-white rounded-lg text-xs font-semibold hover:bg-[#29170F] transition-colors disabled:opacity-50"
              >
                {reviewSubmitted ? 'Thank You!' : 'Submit Feedback'}
              </button>

              <a
                href={activeRestaurant.googleReviewUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-white border border-[#542B17] text-[#542B17] rounded-lg text-xs font-semibold hover:bg-[#FAF5ED] flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#B87532]" />
                <span>Google Review</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Fixed Bottom Navigation Bar (Matching Reference Image 1) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF9] border-t border-[#E9DFD3] py-2 px-4 shadow-lg no-print">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'home' ? 'text-[#542B17]' : 'text-[#75685E] hover:text-[#542B17]'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('menu');
              const el = document.getElementById('menu-items-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'menu' ? 'text-[#542B17]' : 'text-[#75685E] hover:text-[#542B17]'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
            <span>Menu</span>
          </button>

          {/* Center Order Button (Circular Brown Emblem matching Reference Image 1) */}
          <div className="-mt-6">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-14 h-14 rounded-full bg-[#542B17] text-white flex flex-col items-center justify-center shadow-lg hover:bg-[#29170F] transition-transform active:scale-95 border-4 border-[#FAF5ED]"
              aria-label="Order Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#D99A4E]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                {cartTotals.itemCount > 0 ? `${cartTotals.itemCount}` : 'Order'}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsRewardsOpen(true)}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'rewards' ? 'text-[#542B17]' : 'text-[#75685E] hover:text-[#542B17]'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <span>Rewards</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'status' ? 'text-[#542B17]' : 'text-[#75685E] hover:text-[#542B17]'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span>Track Order</span>
          </button>
        </div>
      </div>

      {/* Product Detail & Customization Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            <div className="relative aspect-16/10 bg-stone-100">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-stone-700 flex items-center justify-center shadow-md hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                    selectedProduct.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                >
                  {selectedProduct.isVeg ? '100% VEGETARIAN' : 'NON-VEGETARIAN'}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                    {selectedProduct.name}
                  </h3>
                  <span className="font-bold text-base text-[#542B17] font-mono">
                    {formatINR(selectedProduct.price)}
                  </span>
                </div>
                <p className="text-xs text-[#75685E] mt-1 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Variants */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="space-y-2 border-t border-stone-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#542B17]">
                    Choose Size / Portion
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          selectedVariantId === v.id
                            ? 'border-[#542B17] bg-[#FAF5ED] text-[#542B17] font-semibold'
                            : 'border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <span>{v.name}</span>
                        {v.priceDelta > 0 && (
                          <span className="text-[11px] font-mono font-medium text-[#B87532]">
                            +{formatINR(v.priceDelta)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons */}
              {selectedProduct.addons && selectedProduct.addons.length > 0 && (
                <div className="space-y-2 border-t border-stone-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#542B17]">
                    Add-ons & Extras
                  </h4>
                  <div className="space-y-1.5">
                    {selectedProduct.addons.map((a) => {
                      const isChecked = selectedAddonIds.includes(a.id);
                      return (
                        <label
                          key={a.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                            isChecked
                              ? 'border-[#B87532] bg-[#FFFDF9]'
                              : 'border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedAddonIds(selectedAddonIds.filter((id) => id !== a.id));
                                } else {
                                  setSelectedAddonIds([...selectedAddonIds, a.id]);
                                }
                              }}
                              className="rounded text-[#542B17] focus:ring-[#B87532]"
                            />
                            <span className="font-medium text-[#211B17]">{a.name}</span>
                          </div>
                          <span className="font-mono text-[11px] text-[#B87532] font-semibold">
                            +{formatINR(a.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="border-t border-stone-100 pt-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#542B17] block mb-1">
                  Special Kitchen Note
                </label>
                <input
                  type="text"
                  value={itemInstructions}
                  onChange={(e) => setItemInstructions(e.target.value)}
                  placeholder="e.g. Less sugar, extra crispy, no onion"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-[#B87532]"
                />
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddCustomizedToCart}
                className="w-full py-3 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
              >
                <span>Add to Cart</span>
                <span className="text-[#D99A4E]">·</span>
                <span className="font-mono">
                  {formatINR(
                    selectedProduct.price +
                      (selectedProduct.variants?.find((v) => v.id === selectedVariantId)
                        ?.priceDelta || 0) +
                      (selectedProduct.addons
                        ?.filter((a) => selectedAddonIds.includes(a.id))
                        .reduce((sum, a) => sum + a.price, 0) || 0)
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
            {/* Cart Header */}
            <div className="p-4 bg-[#FFFDF9] border-b border-[#E9DFD3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#542B17]" />
                <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
                  Your Order (Table {activeTableNumber})
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutStep(false);
                }}
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#FAF5ED] text-[#542B17] flex items-center justify-center mx-auto">
                    <ShoppingCart className="w-8 h-8 opacity-40" />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-base text-[#211B17]">
                    Your cart is empty
                  </h4>
                  <p className="text-xs text-[#75685E]">
                    Explore our menu and add your favorite dishes.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 bg-[#542B17] text-white rounded-lg text-xs font-semibold"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : !isCheckoutStep ? (
                // Step 1: Review Items in Cart
                <div className="space-y-4">
                  <div className="divide-y divide-stone-100">
                    {cart.map((item, idx) => (
                      <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                              }`}
                            />
                            <h5 className="font-semibold text-xs text-[#211B17]">
                              {item.name}
                            </h5>
                          </div>
                          {item.selectedVariant && (
                            <span className="text-[10px] text-[#75685E] block">
                              Size: {item.selectedVariant.name}
                            </span>
                          )}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <span className="text-[10px] text-[#75685E] block">
                              Extras: {item.selectedAddons.map((a) => a.name).join(', ')}
                            </span>
                          )}
                          {item.specialInstructions && (
                            <span className="text-[10px] text-amber-700 italic block">
                              Note: {item.specialInstructions}
                            </span>
                          )}
                          <div className="font-mono text-xs font-semibold text-[#542B17] mt-1">
                            {formatINR(item.itemTotal)}
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-2 bg-[#FAF5ED] border border-[#E9DFD3] rounded-lg p-1">
                          <button
                            onClick={() => updateCartQuantity(idx, -1)}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(idx, 1)}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyCoupon} className="p-3 bg-[#FAF5ED] rounded-xl border border-[#E9DFD3] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#542B17]">
                      Have a Promo Code?
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. WELCOME20"
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E9DFD3] rounded-lg outline-none font-mono uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#542B17] text-white rounded-lg text-xs font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && (
                      <p
                        className={`text-[11px] font-medium ${
                          couponMessage.success ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {couponMessage.text}
                      </p>
                    )}
                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold pt-1">
                        <span>Applied: {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)</span>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-stone-400 hover:text-stone-600 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                // Step 2: Customer Details & Payment Option
                <div className="space-y-4">
                  <div className="p-3 bg-stone-50 rounded-xl space-y-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#542B17]">
                      Your Information
                    </h5>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] text-stone-600 block">Name *</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-stone-600 block">Phone (for Order Updates & Loyalty) *</label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs outline-none font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ordering Mode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#542B17]">
                      Dining Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderMode('DINE_IN')}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                          orderMode === 'DINE_IN'
                            ? 'bg-[#542B17] text-white border-[#542B17]'
                            : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        Table {activeTableNumber}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderMode('TAKEAWAY')}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                          orderMode === 'TAKEAWAY'
                            ? 'bg-[#542B17] text-white border-[#542B17]'
                            : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        Takeaway
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderMode('DELIVERY')}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                          orderMode === 'DELIVERY'
                            ? 'bg-[#542B17] text-white border-[#542B17]'
                            : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        Delivery
                      </button>
                    </div>
                    {orderMode === 'DELIVERY' && (
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Complete delivery address"
                        className="w-full mt-2 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs outline-none"
                      />
                    )}
                  </div>

                  {/* Payment Methods (Prompt Section 4 Requirement) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#542B17]">
                      Select Payment Method
                    </label>
                    <div className="space-y-2">
                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          paymentMethod === 'UPI_GPAY'
                            ? 'border-[#542B17] bg-[#FAF5ED]'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payMethod"
                            checked={paymentMethod === 'UPI_GPAY'}
                            onChange={() => setPaymentMethod('UPI_GPAY')}
                            className="text-[#542B17]"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[#211B17]">
                              Google Pay / UPI
                            </div>
                            <div className="text-[10px] text-stone-500">
                              Instant direct UPI settlement
                            </div>
                          </div>
                        </div>
                        <CreditCard className="w-4 h-4 text-[#B87532]" />
                      </label>

                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          paymentMethod === 'UPI_PHONEPE'
                            ? 'border-[#542B17] bg-[#FAF5ED]'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payMethod"
                            checked={paymentMethod === 'UPI_PHONEPE'}
                            onChange={() => setPaymentMethod('UPI_PHONEPE')}
                            className="text-[#542B17]"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[#211B17]">
                              PhonePe / UPI
                            </div>
                            <div className="text-[10px] text-stone-500">
                              Direct verified mobile UPI
                            </div>
                          </div>
                        </div>
                        <CreditCard className="w-4 h-4 text-purple-700" />
                      </label>

                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          paymentMethod === 'CASH'
                            ? 'border-[#542B17] bg-[#FAF5ED]'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payMethod"
                            checked={paymentMethod === 'CASH'}
                            onChange={() => setPaymentMethod('CASH')}
                            className="text-[#542B17]"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[#211B17]">
                              Cash at Table
                            </div>
                            <div className="text-[10px] text-stone-500">
                              Pay waiter directly (Status: Pending Cash)
                            </div>
                          </div>
                        </div>
                        <Banknote className="w-4 h-4 text-emerald-600" />
                      </label>
                    </div>
                  </div>

                  {/* Cooking Instructions */}
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">
                      Order Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Serve coffee first, extra napkins"
                      className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-lg outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer & Bill Summary */}
            {cart.length > 0 && (
              <div className="p-4 bg-[#FFFDF9] border-t border-[#E9DFD3] space-y-3">
                <div className="space-y-1.5 text-xs text-[#75685E]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#211B17]">{formatINR(cartTotals.subtotal)}</span>
                  </div>
                  {cartTotals.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount</span>
                      <span className="font-mono">-{formatINR(cartTotals.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-mono text-[#211B17]">{formatINR(cartTotals.taxAmount)}</span>
                  </div>
                  {cartTotals.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-mono text-[#211B17]">{formatINR(cartTotals.deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#211B17] pt-2 border-t border-stone-200">
                    <span>Final Total</span>
                    <span className="font-mono text-[#542B17]">{formatINR(cartTotals.finalTotal)}</span>
                  </div>
                </div>

                {!isCheckoutStep ? (
                  <button
                    onClick={() => setIsCheckoutStep(true)}
                    className="w-full py-3 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#D99A4E]" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsCheckoutStep(false)}
                      className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-3 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>
                        Place Order ({formatINR(cartTotals.finalTotal)})
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Status Tracking Modal / View */}
      {activeTab === 'status' && placedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E9DFD3] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B87532]">
                  Live Kitchen Tracker
                </span>
                <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                  Order #{placedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('home')}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper tracker */}
            <div className="py-2 space-y-3">
              {[
                { status: 'NEW', label: 'Order Received', desc: 'Sent to restaurant kitchen' },
                { status: 'ACCEPTED', label: 'Accepted by Kitchen', desc: 'Chef reviewed items' },
                { status: 'PREPARING', label: 'Cooking & Brewing', desc: 'Freshly making your meal' },
                { status: 'READY', label: 'Ready for Table', desc: 'Plated and ready to serve' },
                { status: 'SERVED', label: 'Served at Table', desc: 'Enjoy your food!' },
              ].map((step, idx) => {
                const orderSteps = ['NEW', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED'];
                const currentIdx = orderSteps.indexOf(placedOrder.orderStatus);
                const isCompleted = currentIdx >= idx;
                const isCurrent = orderSteps[currentIdx] === step.status;

                return (
                  <div key={step.status} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-[#542B17] text-[#D99A4E]'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${isCurrent ? 'text-[#542B17]' : 'text-stone-700'}`}>
                        {step.label}
                      </div>
                      <div className="text-[10px] text-stone-400">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment status badge */}
            <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#E9DFD3] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-500 block">Payment Method</span>
                <span className="font-semibold text-[#211B17]">
                  {placedOrder.paymentMethod === 'CASH' ? 'Cash at Table' : 'Online UPI'}
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                  placedOrder.paymentStatus === 'PAID_ONLINE' || placedOrder.paymentStatus === 'PAID_CASH'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {placedOrder.paymentStatus}
              </span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setActiveTab('home')}
                className="w-full py-2.5 bg-[#542B17] hover:bg-[#29170F] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Back to Menu & Add More Dishes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loyalty Rewards Drawer */}
      {isRewardsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E9DFD3] p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#B87532]" />
                <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
                  DineFlow Loyalty Rewards
                </h3>
              </div>
              <button onClick={() => setIsRewardsOpen(false)} className="p-1 text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-gradient-to-br from-[#542B17] to-[#29170F] text-white rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-[#D99A4E] uppercase tracking-wider font-semibold">
                  Points Balance
                </span>
                <Sparkles className="w-4 h-4 text-[#D99A4E]" />
              </div>
              <div className="text-3xl font-serif-luxury font-bold text-white font-mono">
                {customerLoyalty ? customerLoyalty.pointsBalance : 0} <span className="text-sm font-sans font-normal text-stone-300">pts</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Earn 10 points for every ₹100 spent at {activeRestaurant.name}.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#542B17]">
                Available Coupons
              </h5>
              <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#E9DFD3] flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs font-bold text-[#542B17]">WELCOME20</div>
                  <div className="text-[10px] text-stone-500">20% off on orders above ₹299</div>
                </div>
                <button
                  onClick={() => {
                    applyCoupon('WELCOME20');
                    setIsRewardsOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="px-2.5 py-1 bg-[#542B17] text-white rounded-md text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
