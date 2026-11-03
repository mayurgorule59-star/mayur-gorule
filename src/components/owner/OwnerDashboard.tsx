import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  ShoppingBag,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  Clock,
  Printer,
  Volume2,
  ExternalLink,
  Star,
  Banknote,
  Search,
  Store,
  Layers,
  Phone,
  Mail,
  Lock,
  LogOut,
  Key,
  ShieldAlert,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { MenuItem, RestaurantTable, OrderStatus } from '../../types/index.js';
import { formatINR } from '../../utils/engine.js';
import { QRStandeeModal } from '../qr/QRStandeeModal.js';
import { FoodPhotoUploader } from './FoodPhotoUploader.js';
import { ImageUploader } from '../common/ImageUploader.js';

export const OwnerDashboard: React.FC = () => {
  const {
    activeRestaurant,
    restaurants,
    navigateToOwnerDashboard,
    navigateToCustomerMenu,
    currentRestaurantCategories,
    currentRestaurantMenuItems,
    currentRestaurantTables,
    currentRestaurantOrders,
    currentRestaurantReviews,
    updateOrderStatus,
    confirmCashPayment,
    addCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    addTable,
    deleteTable,
    updateRestaurantSettings,
    playOrderChime,
    isOwnerAuthenticated,
    loginOwner,
    logoutOwner,
    navigateToLanding,
    ownerAccounts,
    verifyOwnerPin,
    submitPaymentDetails,
    currentUserEmail,
  } = useApp();

  // Authentication form state
  const [authEmail, setAuthEmail] = useState('owner@brewbliss.com');
  const [authPassword, setAuthPassword] = useState('1234');
  const [authError, setAuthError] = useState('');
  const [isPinStep, setIsPinStep] = useState(false);
  const [authPin, setAuthPin] = useState('');
  const [orderFilter, setOrderFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Active module
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'menu' | 'tables' | 'reviews' | 'settings' | 'subscription' | 'branding'
  >('overview');


  // Standee Modal State
  const [selectedTableForQR, setSelectedTableForQR] = useState<RestaurantTable | null>(null);

  // New Item Modal
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(149);
  const [newItemCategory, setNewItemCategory] = useState(currentRestaurantCategories[0]?.id || '');
  const [newItemIsVeg, setNewItemIsVeg] = useState(true);
  const [newItemImage, setNewItemImage] = useState('/src/assets/images/hero_latte_art_cup_1793552349663.jpg');

  // New Category
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // New Table
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableNum, setNewTableNum] = useState('');
  const [newTableName, setNewTableName] = useState('');

  // Filter orders
  const filteredOrders = currentRestaurantOrders.filter((o) =>
    orderFilter === 'ALL' ? true : o.orderStatus === orderFilter
  );

  // Key KPI numbers
  const todayRevenue = currentRestaurantOrders
    .filter((o) => o.paymentStatus === 'PAID_ONLINE' || o.paymentStatus === 'PAID_CASH')
    .reduce((sum, o) => sum + o.finalTotal, 0);

  const pendingOrdersCount = currentRestaurantOrders.filter(
    (o) => o.orderStatus === 'NEW' || o.orderStatus === 'PREPARING'
  ).length;

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    addMenuItem({
      categoryId: newItemCategory || currentRestaurantCategories[0]?.id || 'cat-1',
      name: newItemName,
      description: newItemDesc,
      price: Number(newItemPrice),
      image: newItemImage,
      isVeg: newItemIsVeg,
      isAvailable: true,
      rating: 4.8,
      reviewsCount: 1,
    });
    setIsAddItemOpen(false);
    setNewItemName('');
    setNewItemDesc('');
  };

  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum) return;
    addTable(newTableNum, newTableName || `Table ${newTableNum}`, 4);
    setIsAddTableOpen(false);
    setNewTableNum('');
    setNewTableName('');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const result = await loginOwner(authEmail, authPassword);
    if (result.success && result.requiresPin) {
        setIsPinStep(true);
    } else {
      setAuthError(result.message || 'Invalid credentials.');
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const result = await verifyOwnerPin(authPin);
    if (!result.success) {
      setAuthError(result.message || 'Invalid PIN.');
    }
  };

  // ACCESS CONTROL GATE: Restrict workspace only to authenticated restaurant owners & authorized admins
  if (!isOwnerAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF5ED] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E9DFD3] p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#542B17] text-[#D99A4E] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B87532]">
              AUTHORIZED STAFF & OWNER ACCESS ONLY
            </span>
            <h2 className="font-serif-luxury font-bold text-2xl text-[#29170F]">
              Restaurant Workspace
            </h2>
            <p className="text-xs text-[#75685E]">
              Sign in with your verified restaurant owner credentials to manage orders, tables, and menus. Customers cannot access this area.
            </p>
          </div>

          <form onSubmit={isPinStep ? handlePinSubmit : handleAuthSubmit} className="space-y-4 text-xs">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {!isPinStep ? (
              <>
                <div>
                  <label className="font-bold text-[#542B17] block mb-1">Owner Email</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="owner@brewbliss.com"
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-[#B87532]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#542B17] block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-[#B87532] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                >
                  Authenticate & Continue
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="font-bold text-[#542B17] block mb-1">Enter Private Verification PIN</label>
                  <input
                    type="password"
                    required
                    value={authPin}
                    onChange={(e) => setAuthPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-[#B87532] font-mono tracking-widest text-center"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#D99A4E] text-[#29170F] hover:bg-[#B87532] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                >
                  Verify PIN & Enter Workspace
                </button>
              </>
            )}
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={navigateToLanding}
              className="text-xs text-[#75685E] hover:text-[#542B17] font-semibold underline"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5ED] flex flex-col md:flex-row text-[#211B17]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#FFFDF9] border-r border-[#E9DFD3] flex flex-col shrink-0 no-print">
        {/* Restaurant Profile Selector Header */}
        <div className="p-4 border-b border-[#E9DFD3]">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#75685E] block">
              Active Restaurant Workspace
            </label>
            <button
              onClick={logoutOwner}
              className="text-[10px] font-semibold text-red-600 hover:underline flex items-center gap-1"
              title="Log out of workspace"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
          <div className="relative">
            <select
              value={activeRestaurant.id}
              onChange={(e) => navigateToOwnerDashboard(e.target.value)}
              className="w-full p-2 bg-[#FAF5ED] border border-[#E9DFD3] rounded-lg text-xs font-semibold text-[#542B17] outline-none"
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#75685E]">
            <span>ID: {activeRestaurant.id}</span>
            <button
              onClick={() => navigateToCustomerMenu(activeRestaurant.slug, '01')}
              className="text-[#B87532] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Customer Menu</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1 flex-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#542B17] text-white shadow-xs'
                : 'text-[#75685E] hover:bg-[#FAF5ED] hover:text-[#211B17]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#D99A4E]" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#542B17] text-white shadow-xs'
                : 'text-[#75685E] hover:bg-[#FAF5ED] hover:text-[#211B17]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-[#D99A4E]" />
              <span>Live Kitchen Orders</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D94A4A] text-white text-[10px] flex items-center justify-center font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'tables'
                ? 'bg-[#542B17] text-white shadow-xs'
                : 'text-[#75685E] hover:bg-[#FAF5ED] hover:text-[#211B17]'
            }`}
          >
            <QrCode className="w-4 h-4 text-[#D99A4E]" />
            <span>Table QRs & Standees</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'menu'
                ? 'bg-[#542B17] text-white shadow-xs'
                : 'text-[#75685E] hover:bg-[#FAF5ED] hover:text-[#211B17]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-[#D99A4E]" />
            <span>Menu & Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'reviews'
                ? 'bg-[#542B17] text-white shadow-xs'
                : 'text-[#75685E] hover:bg-[#FAF5ED] hover:text-[#211B17]'
            }`}
          >
            <Star className="w-4 h-4 text-[#D99A4E]" />
            <span>Customer Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#542B17] text-white shadow-xs'
                : 'text-[#75685E] hover:bg-[#FAF5ED] hover:text-[#211B17]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#D99A4E]" />
            <span>Restaurant Profile & Payments</span>
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'subscription'
                ? 'bg-[#542B17] text-white shadow-xs'
                : 'text-[#75685E] hover:bg-[#FAF5ED] hover:text-[#211B17]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#D99A4E]" />
            <span>Subscription & Billing</span>
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'branding'
                ? 'bg-[#542B17] text-white shadow-xs'
                : 'text-[#75685E] hover:bg-[#FAF5ED] hover:text-[#211B17]'
            }`}
          >
            <Store className="w-4 h-4 text-[#D99A4E]" />
            <span>Branding & Customization</span>
          </button>
        </nav>

        {/* Help & Support (Mayur Gorule) */}
        <div className="p-3.5 border-t border-[#E9DFD3] bg-[#FFFDF9] space-y-2 text-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#B87532]">
            Help & Support · Mayur Gorule
          </div>
          <a
            href="https://wa.me/919137043953"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp Support</span>
          </a>
          <a
            href="mailto:mayurgorulemg4444@gmail.com"
            className="flex items-center gap-1.5 text-[11px] text-[#75685E] hover:text-[#542B17] truncate pt-0.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#B87532] shrink-0" />
            <span className="truncate">mayurgorulemg4444@gmail.com</span>
          </a>
        </div>

        {/* Kitchen Chime Test */}
        <div className="p-3 border-t border-[#E9DFD3] bg-[#FAF5ED]">
          <button
            onClick={playOrderChime}
            className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-[#E9DFD3] rounded-lg text-xs font-semibold text-[#542B17] hover:bg-stone-50"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#B87532]" />
            <span>Test Kitchen Chime</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Canvas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top Header Breadcrumb & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E9DFD3] gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#B87532]">
              Private Restaurant Workspace
            </div>
            <h1 className="font-serif-luxury font-bold text-2xl text-[#29170F]">
              {activeRestaurant.name}
            </h1>
            <p className="text-xs text-[#75685E] mt-0.5">
              {activeRestaurant.address} · {activeRestaurant.phone}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigateToCustomerMenu(activeRestaurant.slug, '01')}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#542B17]/20 text-[#542B17] rounded-xl text-xs font-semibold hover:bg-[#FAF5ED] shadow-2xs"
            >
              <ExternalLink className="w-4 h-4 text-[#B87532]" />
              <span>Open Customer Menu</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685E]">
                  Today's Revenue
                </span>
                <div className="text-2xl font-bold font-mono text-[#211B17]">
                  {formatINR(todayRevenue)}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span>+18% from yesterday</span>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685E]">
                  Total Orders
                </span>
                <div className="text-2xl font-bold font-mono text-[#211B17]">
                  {currentRestaurantOrders.length}
                </div>
                <div className="text-[11px] text-[#75685E]">
                  {pendingOrdersCount} orders active right now
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685E]">
                  Active Tables
                </span>
                <div className="text-2xl font-bold font-mono text-[#211B17]">
                  {currentRestaurantTables.length} Tables
                </div>
                <div className="text-[11px] text-[#B87532] font-semibold">
                  100% with generated QR Standees
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685E]">
                  Guest Rating
                </span>
                <div className="text-2xl font-bold font-mono text-[#211B17] flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span>4.8 / 5</span>
                </div>
                <div className="text-[11px] text-[#75685E]">
                  {currentRestaurantReviews.length} verified reviews
                </div>
              </div>
            </div>

            {/* Recent Orders in Kitchen */}
            <div className="p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                    Recent Incoming Orders
                  </h3>
                  <p className="text-xs text-[#75685E]">
                    Real-time updates as customers scan and order from tables
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#B87532] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5ED] text-[#542B17] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Table</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {currentRestaurantOrders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold">{order.orderNumber}</td>
                        <td className="p-3 font-semibold text-[#542B17]">
                          Table {order.tableNumber}
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-[#211B17]">{order.customerName}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{order.customerPhone}</div>
                        </td>
                        <td className="p-3 max-w-[200px] truncate text-stone-600">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="p-3 font-mono font-bold text-[#211B17]">
                          {formatINR(order.finalTotal)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.paymentStatus === 'PAID_ONLINE' || order.paymentStatus === 'PAID_CASH'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-[#542B17] font-semibold text-[10px]">
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="px-2.5 py-1 bg-[#542B17] text-white rounded text-[10px] font-semibold"
                          >
                            Manage
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

        {/* TAB 2: LIVE KITCHEN ORDERS (KDS) */}
        {activeTab === 'orders' && (
          <div className="mt-6 space-y-5">
            {/* Order Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {(['ALL', 'NEW', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED'] as const).map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      orderFilter === filter
                        ? 'bg-[#542B17] text-white shadow-xs'
                        : 'bg-white border border-[#E9DFD3] text-[#75685E] hover:text-[#211B17]'
                    }`}
                  >
                    {filter === 'ALL' ? 'All Orders' : filter}
                  </button>
                )
              )}
            </div>

            {/* Order Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#E9DFD3] space-y-2">
                  <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                  <h4 className="font-serif-luxury font-bold text-base text-[#211B17]">
                    No orders in this stage
                  </h4>
                  <p className="text-xs text-[#75685E]">
                    New orders will appear here automatically with audio chimes.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-3.5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <div>
                          <div className="text-xs font-mono font-bold text-[#542B17]">
                            {order.orderNumber}
                          </div>
                          <div className="font-serif-luxury font-bold text-base text-[#29170F]">
                            Table {order.tableNumber}
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            order.orderStatus === 'NEW'
                              ? 'bg-red-100 text-red-800 animate-pulse'
                              : order.orderStatus === 'PREPARING'
                              ? 'bg-amber-100 text-amber-800'
                              : order.orderStatus === 'READY'
                              ? 'bg-blue-100 text-blue-800'
                              : order.orderStatus === 'SERVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="text-[11px] text-stone-600 pt-1">
                        <span>Guest: <strong>{order.customerName}</strong> ({order.customerPhone})</span>
                      </div>

                      {/* Items List */}
                      <div className="py-2.5 space-y-2 border-b border-stone-100">
                        {order.items.map((it) => (
                          <div key={it.id} className="text-xs flex items-start justify-between">
                            <div>
                              <div className="font-medium text-[#211B17]">
                                <span className="font-bold text-[#542B17] font-mono mr-1">
                                  {it.quantity}x
                                </span>
                                <span>{it.name}</span>
                              </div>
                              {it.selectedVariant && (
                                <div className="text-[10px] text-stone-400">
                                  Size: {it.selectedVariant.name}
                                </div>
                              )}
                              {it.selectedAddons && it.selectedAddons.length > 0 && (
                                <div className="text-[10px] text-stone-400">
                                  Extras: {it.selectedAddons.map((a) => a.name).join(', ')}
                                </div>
                              )}
                            </div>
                            <span className="font-mono text-stone-700 text-xs">
                              {formatINR(it.itemTotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.specialInstructions && (
                        <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-800 border border-amber-200 mt-2">
                          <strong>Note:</strong> {order.specialInstructions}
                        </div>
                      )}

                      {/* Payment Status & Total */}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 block">Total Amount</span>
                          <span className="font-bold text-sm font-mono text-[#211B17]">
                            {formatINR(order.finalTotal)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 block">
                            {order.paymentMethod === 'CASH' ? 'Cash at Table' : 'Online UPI'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.paymentStatus === 'PAID_ONLINE' || order.paymentStatus === 'PAID_CASH'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for Kitchen Staff */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      {order.paymentStatus === 'PENDING_CASH' && (
                        <button
                          onClick={() => confirmCashPayment(order.id)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          <span>Confirm Cash Received at Table</span>
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        {order.orderStatus === 'NEW' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                            className="py-1.5 bg-[#542B17] text-white rounded-lg text-xs font-semibold hover:bg-[#29170F]"
                          >
                            Accept Order
                          </button>
                        )}
                        {order.orderStatus === 'ACCEPTED' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                            className="py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.orderStatus === 'PREPARING' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'READY')}
                            className="py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.orderStatus === 'READY' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'SERVED')}
                            className="py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                          >
                            Mark Served
                          </button>
                        )}
                        {order.orderStatus === 'SERVED' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                            className="py-1.5 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-black"
                          >
                            Complete & Clear
                          </button>
                        )}

                        <button
                          onClick={() => window.print()}
                          className="py-1.5 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50 flex items-center justify-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print KOT</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TABLE MANAGEMENT & QR CODE GENERATOR (Inspired by Reference Image 2) */}
        {activeTab === 'tables' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E9DFD3] gap-3">
              <div>
                <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                  Table QR Codes & Standees
                </h3>
                <p className="text-xs text-[#75685E]">
                  Every table has a permanent scannable QR code. Print high-resolution table tent standees.
                </p>
              </div>
              <button
                onClick={() => setIsAddTableOpen(true)}
                className="px-4 py-2 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#D99A4E]" />
                <span>Add New Table</span>
              </button>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentRestaurantTables.map((tbl) => (
                <div
                  key={tbl.id}
                  className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-4 hover:border-[#B87532] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-serif-luxury font-bold text-lg text-[#211B17]">
                        Table {tbl.tableNumber}
                      </div>
                      <div className="text-xs text-[#75685E]">{tbl.tableName}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#E9DFD3] flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg border border-[#D99A4E] p-1 flex items-center justify-center shrink-0">
                      <QrCode className="w-8 h-8 text-[#542B17]" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-[#B87532] block">
                        Direct QR Destination
                      </span>
                      <div className="text-[11px] font-mono text-[#211B17] truncate">
                        /#/restaurant/{activeRestaurant.slug}/table/{tbl.tableNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTableForQR(tbl)}
                      className="flex-1 py-2 bg-[#542B17] text-white hover:bg-[#29170F] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#D99A4E]" />
                      <span>View & Print Standee</span>
                    </button>

                    <button
                      onClick={() => navigateToCustomerMenu(activeRestaurant.slug, tbl.tableNumber)}
                      className="p-2 bg-white border border-[#E9DFD3] text-[#542B17] hover:bg-[#FAF5ED] rounded-lg text-xs"
                      title="Test Menu"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteTable(tbl.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                      title="Delete Table"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MENU & PRICING */}
        {activeTab === 'menu' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E9DFD3] gap-3">
              <div>
                <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                  Menu Items & Categories
                </h3>
                <p className="text-xs text-[#75685E]">
                  Updates reflect instantly on all customer QR menus without reprinting QR codes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddCatOpen(true)}
                  className="px-3 py-2 bg-white border border-[#E9DFD3] text-[#542B17] hover:bg-stone-50 rounded-xl text-xs font-semibold"
                >
                  + Add Category
                </button>
                <button
                  onClick={() => setIsAddItemOpen(true)}
                  className="px-4 py-2 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4 text-[#D99A4E]" />
                  <span>Add Food Item</span>
                </button>
              </div>
            </div>

            {/* Categories Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {currentRestaurantCategories.map((c) => (
                <div
                  key={c.id}
                  className="px-3 py-1.5 bg-white border border-[#E9DFD3] rounded-lg text-xs font-semibold flex items-center gap-2 shrink-0"
                >
                  <span>{c.name}</span>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="text-stone-300 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-2xl border border-[#E9DFD3] overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5ED] text-[#542B17] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Dish / Item</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Diet</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Availability</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {currentRestaurantMenuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                          />
                          <div>
                            <div className="font-semibold text-[#211B17] text-xs">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-[#75685E] max-w-[240px] truncate">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-stone-600">
                        {currentRestaurantCategories.find((c) => c.id === item.categoryId)?.name ||
                          'General'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.isVeg
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#211B17]">
                        {formatINR(item.price)}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleItemAvailability(item.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFD3]">
              <div>
                <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                  Customer Reviews & Google Feedback
                </h3>
                <p className="text-xs text-[#75685E]">
                  Verified feedback collected from table QR checkout.
                </p>
              </div>
              <a
                href={activeRestaurant.googleReviewUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white border border-[#E9DFD3] text-[#542B17] hover:bg-stone-50 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#B87532]" />
                <span>Visit Google Review Page</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentRestaurantReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-white rounded-xl border border-[#E9DFD3] shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#211B17]">
                      {rev.customerName}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#75685E] leading-relaxed">"{rev.comment}"</p>
                  <div className="text-[10px] text-stone-400">{rev.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & PAYMENT CHANNELS */}
        {activeTab === 'settings' && (
          <div className="mt-6 max-w-2xl bg-white p-6 rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-5">
            <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
              Restaurant Profile & Payment Gateway Settings
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#542B17] block mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={activeRestaurant.name}
                  onChange={(e) => updateRestaurantSettings({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#542B17] block mb-1">Tagline / Description</label>
                <input
                  type="text"
                  value={activeRestaurant.description}
                  onChange={(e) => updateRestaurantSettings({ description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#542B17] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={activeRestaurant.phone}
                    onChange={(e) => updateRestaurantSettings({ phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#542B17] block mb-1">WhatsApp Order Alerts</label>
                  <input
                    type="text"
                    value={activeRestaurant.whatsapp}
                    onChange={(e) => updateRestaurantSettings({ whatsapp: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#542B17] block mb-1">Official Google Review Link</label>
                <input
                  type="url"
                  value={activeRestaurant.googleReviewUrl}
                  onChange={(e) => updateRestaurantSettings({ googleReviewUrl: e.target.value })}
                  placeholder="https://g.page/r/.../review"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none font-mono"
                />
              </div>

              {/* Payment Methods Activation (Prompt Section 4 Requirement) */}
              <div className="pt-3 border-t border-stone-100 space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-[#542B17] block">
                  Accepted Payment Methods on QR Checkout
                </span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 border border-stone-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-[#211B17]">Google Pay / UPI</div>
                      <div className="text-[10px] text-stone-500">Allow instant verified UPI payment</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeRestaurant.isGPayEnabled}
                      onChange={(e) => updateRestaurantSettings({ isGPayEnabled: e.target.checked })}
                      className="rounded text-[#542B17]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border border-stone-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-[#211B17]">PhonePe / UPI</div>
                      <div className="text-[10px] text-stone-500">Allow direct PhonePe payment</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeRestaurant.isPhonePeEnabled}
                      onChange={(e) => updateRestaurantSettings({ isPhonePeEnabled: e.target.checked })}
                      className="rounded text-[#542B17]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border border-stone-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-[#211B17]">Cash at Table</div>
                      <div className="text-[10px] text-stone-500">Customer pays waiter directly (Status: Pending Cash)</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeRestaurant.isCashEnabled}
                      onChange={(e) => updateRestaurantSettings({ isCashEnabled: e.target.checked })}
                      className="rounded text-[#542B17]"
                    />
                  </label>
                </div>
              </div>

              {/* Direct Owner Assistance */}
              <div className="p-4 bg-[#FAF5ED] rounded-xl border border-[#E9DFD3] space-y-2 mt-4">
                <span className="font-bold text-xs uppercase tracking-wider text-[#542B17] block">
                  Payment Gateway Assistance & Support
                </span>
                <p className="text-xs text-[#75685E] leading-relaxed">
                  Need help connecting your official Razorpay, Paytm, or PhonePe merchant gateway? Contact platform owner <strong>Mayur Gorule</strong> directly.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="https://wa.me/919137043953"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp: +91 9137043953</span>
                  </a>
                  <a
                    href="mailto:mayurgorulemg4444@gmail.com"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#542B17]/20 text-[#542B17] hover:bg-[#FAF5ED] rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#B87532]" />
                    <span>mayurgorulemg4444@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Standee Modal (Inspired by Reference Image 2) */}
      {selectedTableForQR && (
        <QRStandeeModal
          restaurant={activeRestaurant}
          table={selectedTableForQR}
          onClose={() => setSelectedTableForQR(null)}
          onTestOpen={(slug, tableNum) => {
            navigateToCustomerMenu(slug, tableNum);
          }}
        />
      )}

      {/* Add Food Item Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateMenuItem}
            className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
              Add New Food Item
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Item Name *</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Hazelnut Frappe"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Short appetizing description"
                  rows={2}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none"
                  >
                    {currentRestaurantCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <FoodPhotoUploader
                currentImage={newItemImage}
                onImageChange={setNewItemImage}
              />

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newItemIsVeg}
                  onChange={(e) => setNewItemIsVeg(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-medium">Is 100% Vegetarian</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddItemOpen(false)}
                className="flex-1 py-2 bg-stone-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[#542B17] text-white rounded-lg text-xs font-semibold"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateTable}
            className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
              Add New Restaurant Table
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Table Number (e.g. 05, VIP-1) *</label>
                <input
                  type="text"
                  value={newTableNum}
                  onChange={(e) => setNewTableNum(e.target.value)}
                  placeholder="09"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Table Name / Location</label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Patio Outdoor 09"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddTableOpen(false)}
                className="flex-1 py-2 bg-stone-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[#542B17] text-white rounded-lg text-xs font-semibold"
              >
                Generate Table & QR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
              Add Menu Category
            </h3>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Mocktails, Burgers"
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddCatOpen(false)}
                className="flex-1 py-2 bg-stone-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newCatName) {
                    addCategory(newCatName);
                    setNewCatName('');
                    setIsAddCatOpen(false);
                  }
                }}
                className="flex-1 py-2 bg-[#542B17] text-white rounded-lg text-xs font-semibold"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
      {/* TAB: SUBSCRIPTION & BILLING */}
      {activeTab === 'subscription' && (
        <div className="mt-6 p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-4">
          <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
            Subscription Plan
          </h3>
          <p className="text-xs text-[#75685E]">
            Current Plan: <span className="font-bold text-[#542B17]">{activeRestaurant.name} is on {ownerAccounts.find(o => o.restaurantId === activeRestaurant.id)?.plan || 'STARTER'}</span>
          </p>
          <div className="p-4 bg-[#FAF5ED] rounded-xl border border-[#E9DFD3] space-y-2">
            <p className="text-xs text-[#542B17]">
              Payment Instructions: Pay via WhatsApp to +91 9137043953.
            </p>
            <a href="https://wa.me/919137043953" className="inline-block px-4 py-2 bg-[#25D366] text-white rounded-lg text-xs font-semibold">Pay via WhatsApp</a>
            <button 
              onClick={() => submitPaymentDetails({restaurantId: activeRestaurant.id, ownerName: activeRestaurant.name, ownerEmail: currentUserEmail, plan: 'PRO', amount: 3000})}
              className="ml-2 px-4 py-2 bg-[#542B17] text-white rounded-lg text-xs font-semibold"
            >
              Submit Payment Proof (Demo)
            </button>
          </div>
        </div>
      )}
      {/* TAB: BRANDING & CUSTOMIZATION */}
      {activeTab === 'branding' && (
        <div className="mt-6 p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-6">
          <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
            Restaurant Branding
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ImageUploader
              label="Restaurant Logo"
              currentImage={activeRestaurant.logo}
              onImageChange={(url) => updateRestaurantSettings({ logo: url })}
            />
            <ImageUploader
              label="Cover Photo / Banner"
              currentImage={activeRestaurant.coverImage}
              onImageChange={(url) => updateRestaurantSettings({ coverImage: url })}
              aspectRatio="wide"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1 text-xs">Restaurant Name</label>
            <input
              type="text"
              value={activeRestaurant.name}
              onChange={(e) => updateRestaurantSettings({ name: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};
