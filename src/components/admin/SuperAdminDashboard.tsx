import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sliders,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Search,
  Filter,
  Phone,
  Mail,
  Plus,
  Trash2,
  Check,
  Store,
  RefreshCw,
  Eye,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { formatINR } from '../../utils/engine.js';
import { OrderStatus, PaymentStatus } from '../../types/index.js';

export const SuperAdminDashboard: React.FC = () => {
  const {
    restaurants,
    ownerAccounts,
    orders,
    auditLogs,
    platformSettings,
    updatePlatformSettings,
    approveRestaurantOwner,
    toggleRestaurantStatus,
    addRestaurantTenant,
    changeRestaurantPlan,
    resetAllDemoData,
    navigateToOwnerDashboard,
    navigateToCustomerMenu,
    logoutSuperAdmin,
    paymentSubmissions,
    approvePayment,
    rejectPayment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'tenants' | 'orders' | 'subscriptions' | 'settings' | 'support' | 'approvals'
  >('analytics');

  const [resetConfirm, setResetConfirm] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [tenantSearchQuery, setTenantSearchQuery] = useState('');

  // Add Restaurant Modal
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPlan, setNewPlan] = useState<'STARTER' | 'PRO' | 'ENTERPRISE'>('PRO');

  // Platform Metrics
  const totalPlatformOrders = orders.length;
  const totalPlatformGMV = orders.reduce((sum, o) => sum + o.finalTotal, 0);
  const activeTenantsCount = ownerAccounts.filter((o) => o.status === 'ACTIVE').length;
  const pendingApprovalsCount = ownerAccounts.filter((o) => o.status === 'PENDING_APPROVAL').length;
  const suspendedCount = ownerAccounts.filter((o) => o.status === 'SUSPENDED').length;

  // SaaS Monthly Recurring Revenue calculation based on active plans
  const totalMRR = ownerAccounts
    .filter((o) => o.status === 'ACTIVE')
    .reduce((sum, o) => {
      if (o.plan === 'ENTERPRISE') return sum + 9999;
      if (o.plan === 'PRO') return sum + 4999;
      if (o.plan === 'STARTER') return sum + 1999;
      return sum + 0;
    }, 0);

  // Platform commission earnings
  const platformCommissionEarnings = Math.round(
    totalPlatformGMV * ((platformSettings?.commissionPercent || 2.5) / 100)
  );

  // Filtered Orders for Master Ledger
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerPhone.includes(orderSearchQuery) ||
      o.restaurantId.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Tenants
  const filteredTenants = ownerAccounts.filter((acc) => {
    const rest = restaurants.find((r) => r.id === acc.restaurantId);
    const text = `${acc.name} ${acc.email} ${rest?.name || ''}`.toLowerCase();
    return text.includes(tenantSearchQuery.toLowerCase());
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName || !newOwnerEmail) return;

    addRestaurantTenant({
      name: newRestName,
      ownerName: newOwnerName || 'Restaurant Owner',
      ownerEmail: newOwnerEmail,
      ownerPhone: newOwnerPhone || '+91 98200 00000',
      city: newCity || 'Mumbai, Maharashtra',
      plan: newPlan,
    });

    setIsAddTenantOpen(false);
    setNewRestName('');
    setNewOwnerName('');
    setNewOwnerEmail('');
    setNewOwnerPhone('');
    setNewCity('');
  };

  return (
    <div className="min-h-screen bg-[#FAF5ED] p-4 sm:p-6 lg:p-8 text-[#211B17]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header / Platform Owner Master Identity */}
        <div className="p-6 bg-gradient-to-r from-[#29170F] via-[#3D1E11] to-[#542B17] text-white rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#D99A4E]/20">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#D99A4E] text-[#29170F] text-[10px] font-black uppercase tracking-wider shadow-xs">
                Platform Master Control
              </span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="text-xs text-[#EDE0CE]/90 font-mono">DineFlow Cloud Infrastructure</span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                2FA Verified
              </span>
            </div>
            <h1 className="font-serif-luxury font-bold text-2xl sm:text-3xl text-white tracking-wide">
              Super Admin — Mayur Gorule
            </h1>
            <p className="text-xs text-[#EDE0CE]/80 flex flex-wrap items-center gap-2">
              <span>Sole Authorized Platform Owner:</span>
              <strong className="text-white font-mono bg-black/30 px-2 py-0.5 rounded">
                mayurgorulemg@gmail.com
              </strong>
              <span>· Complete multi-tenant isolation & data sovereignty.</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddTenantOpen(true)}
              className="px-3.5 py-2 bg-[#D99A4E] hover:bg-[#c4873d] text-[#29170F] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard Restaurant</span>
            </button>

            <button
              onClick={() => {
                if (resetConfirm) {
                  resetAllDemoData();
                  setResetConfirm(false);
                } else {
                  setResetConfirm(true);
                  setTimeout(() => setResetConfirm(false), 4000);
                }
              }}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
              title="Reset all demo data to initial defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{resetConfirm ? 'Confirm Reset All?' : 'Reset Data'}</span>
            </button>

            <button
              onClick={logoutSuperAdmin}
              className="px-3.5 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              title="Log out of Super Admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>

        {/* Global SaaS Platform Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685E] block">
              Total Outlets
            </span>
            <div className="text-2xl font-bold font-mono text-[#211B17]">
              {restaurants.length} Outlets
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              {activeTenantsCount} active · {pendingApprovalsCount} pending
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685E] block">
              Platform GMV
            </span>
            <div className="text-2xl font-bold font-mono text-[#211B17]">
              {formatINR(totalPlatformGMV)}
            </div>
            <div className="text-[11px] text-[#B87532] font-semibold">
              Total customer QR spends
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685E] block">
              Total Orders Processed
            </span>
            <div className="text-2xl font-bold font-mono text-[#211B17]">
              {totalPlatformOrders} Orders
            </div>
            <div className="text-[11px] text-[#75685E]">
              Across all restaurant tables
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685E] block">
              Monthly SaaS (MRR)
            </span>
            <div className="text-2xl font-bold font-mono text-[#211B17]">
              {formatINR(totalMRR)}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              Subscription revenue
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685E] block">
              Platform Cut ({platformSettings?.commissionPercent || 2.5}%)
            </span>
            <div className="text-2xl font-bold font-mono text-[#B87532]">
              {formatINR(platformCommissionEarnings)}
            </div>
            <div className="text-[11px] text-stone-500">
              Gateway commission
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E9DFD3] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#542B17] text-white shadow-md'
                : 'text-[#75685E] hover:bg-white hover:text-[#211B17]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#D99A4E]" />
            <span>Platform Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'tenants'
                ? 'bg-[#542B17] text-white shadow-md'
                : 'text-[#75685E] hover:bg-white hover:text-[#211B17]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#D99A4E]" />
            <span>Restaurant Outlets & Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-black">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#542B17] text-white shadow-md'
                : 'text-[#75685E] hover:bg-white hover:text-[#211B17]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#D99A4E]" />
            <span>Platform Orders & Transaction Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'bg-[#542B17] text-white shadow-md'
                : 'text-[#75685E] hover:bg-white hover:text-[#211B17]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#D99A4E]" />
            <span>SaaS Plans & Billing</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#542B17] text-white shadow-md'
                : 'text-[#75685E] hover:bg-white hover:text-[#211B17]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#D99A4E]" />
            <span>Platform Settings & Maintenance</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'support'
                ? 'bg-[#542B17] text-white shadow-md'
                : 'text-[#75685E] hover:bg-white hover:text-[#211B17]'
            }`}
          >
            <History className="w-4 h-4 text-[#D99A4E]" />
            <span>Support & Security Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-[#542B17] text-white shadow-md'
                : 'text-[#75685E] hover:bg-white hover:text-[#211B17]'
            }`}
          >
            <Check className="w-4 h-4 text-[#D99A4E]" />
            <span>Payment Approvals</span>
          </button>
        </div>

        {/* TAB 1: PLATFORM OVERVIEW & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Outlets Performance Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E9DFD3] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                      Outlet Performance & Revenue Split
                    </h3>
                    <p className="text-xs text-[#75685E]">
                      Real-time gross transaction volumes across independent restaurant tenants.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#B87532]">
                    Total GMV: {formatINR(totalPlatformGMV)}
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  {restaurants.map((rest) => {
                    const restOrders = orders.filter((o) => o.restaurantId === rest.id);
                    const restRevenue = restOrders.reduce((sum, o) => sum + o.finalTotal, 0);
                    const percentOfTotal = totalPlatformGMV > 0 ? (restRevenue / totalPlatformGMV) * 100 : 0;
                    const ownerAcc = ownerAccounts.find((o) => o.restaurantId === rest.id);

                    return (
                      <div key={rest.id} className="p-4 bg-[#FAF5ED] rounded-2xl border border-[#E9DFD3] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-[#211B17] text-sm">{rest.name}</span>
                            <span className="text-[10px] text-stone-500 font-mono">({rest.slug})</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                ownerAcc?.status === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ownerAcc?.status || 'ACTIVE'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-[#542B17]">
                              {formatINR(restRevenue)}
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              {restOrders.length} orders ({percentOfTotal.toFixed(1)}%)
                            </span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#B87532] to-[#542B17] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, percentOfTotal)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1">
                          <span>Owner: {ownerAcc?.name || 'Assigned'} ({ownerAcc?.email})</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => navigateToOwnerDashboard(rest.id)}
                              className="text-[#542B17] font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>Enter Workspace</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => navigateToCustomerMenu(rest.slug, '01')}
                              className="text-[#B87532] font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>Open QR Menu</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Platform Health & Infrastructure Card */}
              <div className="bg-white rounded-3xl border border-[#E9DFD3] p-6 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
                      Platform Status & Health
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-stone-600">UPI Payment Gateways</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Operational (GPay / PhonePe)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-stone-600">QR Code Routing</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        100% Deterministic (Zero Broken Links)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-stone-600">Database Multi-Tenancy</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Isolated & Synchronized
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-stone-600">Super Admin Authentication</span>
                      <span className="px-2 py-0.5 rounded bg-[#D99A4E]/20 text-[#542B17] font-bold text-[10px] border border-[#D99A4E]/40">
                        Restricted (Mayur Gorule)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#29170F] text-white rounded-2xl space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#D99A4E]">Platform Owner Direct Hotline</span>
                    <span className="text-[10px] text-stone-300">Mayur Gorule</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>+91 9137043953</span>
                  </div>
                  <div className="text-[10px] text-stone-300 font-mono truncate">
                    mayurgorulemg4444@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TENANTS & RESTAURANTS MANAGEMENT */}
        {activeTab === 'tenants' && (
          <div className="bg-white rounded-3xl border border-[#E9DFD3] overflow-hidden shadow-xs space-y-4 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                  Registered Restaurants & Owner Approvals
                </h3>
                <p className="text-xs text-[#75685E]">
                  Full administrative control. Approve, reject, activate, or suspend restaurant accounts.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={tenantSearchQuery}
                    onChange={(e) => setTenantSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-8 pr-3 py-2 bg-[#FAF5ED] border border-[#E9DFD3] rounded-xl text-xs outline-none focus:border-[#B87532]"
                  />
                </div>

                <button
                  onClick={() => setIsAddTenantOpen(true)}
                  className="px-3.5 py-2 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D99A4E]" />
                  <span>New Restaurant</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5ED] text-[#542B17] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Restaurant & Tenant ID</th>
                    <th className="p-3">Owner Contact</th>
                    <th className="p-3">Subscription Tier</th>
                    <th className="p-3">Joined Date</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3 text-right">Super Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredTenants.map((acc) => {
                    const rest = restaurants.find((r) => r.id === acc.restaurantId);
                    return (
                      <tr key={acc.id} className="hover:bg-stone-50">
                        <td className="p-3">
                          <div className="font-bold text-[#211B17] text-xs">
                            {rest ? rest.name : acc.name + "'s Cafe"}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            Tenant ID: {acc.restaurantId} · Slug: {rest?.slug || 'unknown'}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-[#211B17]">{acc.name}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{acc.email}</div>
                          <div className="text-[10px] text-[#B87532] font-mono">{rest?.phone || 'N/A'}</div>
                        </td>
                        <td className="p-3">
                          <select
                            value={acc.plan}
                            onChange={(e) =>
                              changeRestaurantPlan(
                                acc.restaurantId,
                                e.target.value as 'STARTER' | 'PRO' | 'ENTERPRISE'
                              )
                            }
                            className="p-1 border border-stone-200 rounded text-xs font-bold text-[#542B17] bg-[#FAF5ED]"
                          >
                            <option value="STARTER">Starter (₹1,999/mo)</option>
                            <option value="PRO">Growth Pro (₹4,999/mo)</option>
                            <option value="ENTERPRISE">Enterprise (₹9,999/mo)</option>
                          </select>
                        </td>
                        <td className="p-3 text-stone-500 font-mono text-[11px]">
                          {acc.joinedDate}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              acc.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : acc.status === 'PENDING_APPROVAL'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {acc.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {acc.status === 'PENDING_APPROVAL' && (
                              <button
                                onClick={() => approveRestaurantOwner(acc.id)}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                            )}

                            <button
                              onClick={() => toggleRestaurantStatus(acc.restaurantId)}
                              className={`px-2.5 py-1 rounded text-[10px] font-semibold border ${
                                acc.status === 'ACTIVE'
                                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {acc.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>

                            {rest && (
                              <button
                                onClick={() => navigateToOwnerDashboard(rest.id)}
                                className="px-2 py-1 bg-[#542B17] text-white rounded text-[10px] font-semibold hover:bg-[#29170F]"
                                title="Login directly to this restaurant's workspace"
                              >
                                Workspace
                              </button>
                            )}

                            {rest && (
                              <button
                                onClick={() => navigateToCustomerMenu(rest.slug, '01')}
                                className="p-1 bg-white border border-stone-200 text-stone-600 rounded text-[10px] hover:bg-stone-50"
                                title="Open digital menu"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PLATFORM ORDERS & TRANSACTION LEDGER */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#E9DFD3] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                  Platform-Wide Order & Transaction Ledger
                </h3>
                <p className="text-xs text-[#75685E]">
                  Master ledger of all orders placed across all restaurants with transaction verification.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by order #, phone, customer..."
                    className="w-full pl-8 pr-3 py-2 bg-[#FAF5ED] border border-[#E9DFD3] rounded-xl text-xs outline-none"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value as 'ALL' | OrderStatus)}
                  className="px-3 py-2 bg-[#FAF5ED] border border-[#E9DFD3] rounded-xl text-xs font-semibold text-[#542B17] outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="PREPARING">PREPARING</option>
                  <option value="READY">READY</option>
                  <option value="SERVED">SERVED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5ED] text-[#542B17] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Restaurant</th>
                    <th className="p-3">Table</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items Ordered</th>
                    <th className="p-3">Gross Total</th>
                    <th className="p-3">Payment Method & Status</th>
                    <th className="p-3">Order Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-400">
                        No orders matching current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => {
                      const rest = restaurants.find((r) => r.id === ord.restaurantId);
                      return (
                        <tr key={ord.id} className="hover:bg-stone-50">
                          <td className="p-3 font-mono font-bold text-[#542B17]">
                            {ord.orderNumber}
                            <div className="text-[10px] text-stone-400 font-normal">
                              {new Date(ord.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-[#211B17]">
                            {rest?.name || ord.restaurantId}
                          </td>
                          <td className="p-3 font-mono font-bold">
                            T-{ord.tableNumber}
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-[#211B17]">{ord.customerName}</div>
                            <div className="text-[10px] text-stone-400 font-mono">{ord.customerPhone}</div>
                          </td>
                          <td className="p-3 max-w-[220px] truncate text-stone-600">
                            {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </td>
                          <td className="p-3 font-mono font-bold text-[#211B17]">
                            {formatINR(ord.finalTotal)}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.paymentStatus === 'PAID_ONLINE' || ord.paymentStatus === 'PAID_CASH'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                              {ord.paymentMethod} {ord.paymentTransactionId ? `· ${ord.paymentTransactionId}` : ''}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-[#542B17] font-bold text-[10px]">
                              {ord.orderStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SUBSCRIPTIONS & PRICING */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-3xl border border-[#E9DFD3] shadow-xs space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B87532]">
                  Starter Plan
                </span>
                <div className="text-3xl font-bold font-mono text-[#211B17]">
                  ₹1,999 <span className="text-xs text-stone-500 font-normal">/ month</span>
                </div>
                <ul className="text-xs text-stone-600 space-y-2">
                  <li>✓ Up to 10 Table QR Codes</li>
                  <li>✓ Digital Menu & Direct Ordering</li>
                  <li>✓ UPI & Cash at Table</li>
                  <li>✓ Basic Daily Analytics</li>
                </ul>
                <div className="pt-2 text-[11px] text-[#75685E] font-medium border-t border-stone-100">
                  {ownerAccounts.filter((o) => o.plan === 'STARTER').length} Restaurants Enrolled
                </div>
              </div>

              <div className="p-6 bg-white rounded-3xl border-2 border-[#542B17] shadow-lg space-y-4 relative">
                <span className="absolute -top-3 right-4 px-3 py-0.5 bg-[#542B17] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Platform Recommended
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B87532]">
                  Growth Pro
                </span>
                <div className="text-3xl font-bold font-mono text-[#211B17]">
                  ₹4,999 <span className="text-xs text-stone-500 font-normal">/ month</span>
                </div>
                <ul className="text-xs text-stone-600 space-y-2">
                  <li>✓ Unlimited Table QR Codes</li>
                  <li>✓ Table Standee PDF/PNG Print Generator</li>
                  <li>✓ Live Kitchen Display POS (KDS)</li>
                  <li>✓ Customer Loyalty & Google Reviews System</li>
                  <li>✓ Audio Order Notifications (Web Audio Chime)</li>
                </ul>
                <div className="pt-2 text-[11px] text-[#542B17] font-semibold border-t border-stone-100">
                  {ownerAccounts.filter((o) => o.plan === 'PRO').length} Restaurants Enrolled
                </div>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-[#E9DFD3] shadow-xs space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B87532]">
                  Hotel & Multi-Outlet Enterprise
                </span>
                <div className="text-3xl font-bold font-mono text-[#211B17]">
                  ₹9,999 <span className="text-xs text-stone-500 font-normal">/ month</span>
                </div>
                <ul className="text-xs text-stone-600 space-y-2">
                  <li>✓ Unlimited Outlets & Tables</li>
                  <li>✓ Custom Subdomain Integration</li>
                  <li>✓ Dedicated Direct WhatsApp Alert Webhooks</li>
                  <li>✓ 24/7 Priority Manager (Mayur Gorule)</li>
                </ul>
                <div className="pt-2 text-[11px] text-[#75685E] font-medium border-t border-stone-100">
                  {ownerAccounts.filter((o) => o.plan === 'ENTERPRISE').length} Restaurants Enrolled
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PLATFORM SETTINGS & MAINTENANCE */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-[#E9DFD3] p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                Global Platform Settings & Maintenance Mode
              </h3>
              <p className="text-xs text-[#75685E]">
                Configure platform-wide transaction fees, UPI gateway modes, and platform owner contacts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 bg-[#FAF5ED] rounded-2xl border border-[#E9DFD3] space-y-4">
                <span className="font-bold text-[#542B17] text-sm block">
                  Platform Identity & Official Contact
                </span>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Platform Owner</label>
                  <input
                    type="text"
                    readOnly
                    value="Mayur Gorule"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-medium text-stone-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Authorized Super Admin Email</label>
                  <input
                    type="email"
                    readOnly
                    value="mayurgorulemg@gmail.com"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-mono text-stone-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Official WhatsApp Support</label>
                  <input
                    type="text"
                    value={platformSettings?.whatsappNumber || '+91 9137043953'}
                    onChange={(e) => updatePlatformSettings({ whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-mono text-stone-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Official Contact Email</label>
                  <input
                    type="email"
                    value={platformSettings?.contactEmail || 'mayurgorulemg4444@gmail.com'}
                    onChange={(e) => updatePlatformSettings({ contactEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800"
                  />
                </div>
              </div>

              <div className="p-5 bg-[#FAF5ED] rounded-2xl border border-[#E9DFD3] space-y-4">
                <span className="font-bold text-[#542B17] text-sm block">
                  Monetization & Gateway Controls
                </span>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Platform Commission Rate (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="15"
                      value={platformSettings?.commissionPercent ?? 2.5}
                      onChange={(e) => updatePlatformSettings({ commissionPercent: Number(e.target.value) })}
                      className="w-32 px-3 py-2 bg-white border border-stone-200 rounded-xl font-mono text-stone-800"
                    />
                    <span className="text-stone-500">% of order volume</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 space-y-3">
                  <label className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl cursor-pointer">
                    <div>
                      <div className="font-bold text-[#211B17]">Direct UPI to Merchant Accounts</div>
                      <div className="text-[10px] text-stone-500">
                        Orders pay directly into restaurant owner's VPA / UPI ID
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings?.directUpiMode ?? true}
                      onChange={(e) => updatePlatformSettings({ directUpiMode: e.target.checked })}
                      className="rounded text-[#542B17]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl cursor-pointer">
                    <div>
                      <div className="font-bold text-[#211B17]">Global Announcement Banner</div>
                      <div className="text-[10px] text-stone-500">
                        Display top banner across all public customer menus
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings?.showAnnouncement ?? false}
                      onChange={(e) => updatePlatformSettings({ showAnnouncement: e.target.checked })}
                      className="rounded text-[#542B17]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl cursor-pointer">
                    <div>
                      <div className="font-bold text-red-700">Planned Maintenance Mode</div>
                      <div className="text-[10px] text-stone-500">
                        Temporarily pause customer ordering for server upgrades
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformSettings?.maintenanceMode ?? false}
                      onChange={(e) => updatePlatformSettings({ maintenanceMode: e.target.checked })}
                      className="rounded text-red-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SUPPORT & AUDIT TRAIL */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-3xl border border-[#E9DFD3] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                  Platform Security & Audit Trail
                </h3>
                <p className="text-xs text-[#75685E]">
                  Immutable log of administrative events, tenant status changes, and platform actions.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Audit Logging Active
              </span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#542B17]">{log.action}</span>
                    <p className="text-stone-600 text-[11px]">{log.details}</p>
                    <span className="text-[10px] text-stone-400 font-mono">Actor: {log.actor}</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        {activeTab === 'approvals' && (
          <div className="bg-white rounded-3xl border border-[#E9DFD3] p-6 shadow-xs space-y-4">
            <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
              Pending Payment Approvals
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5ED] text-[#542B17] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Restaurant</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paymentSubmissions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="p-3 font-semibold">{sub.ownerName} ({sub.ownerEmail})</td>
                      <td className="p-3">{sub.plan}</td>
                      <td className="p-3">{formatINR(sub.amount)}</td>
                      <td className="p-3">{sub.status}</td>
                      <td className="p-3 text-right">
                        {sub.status === 'PENDING' && (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => approvePayment(sub.id)} className="px-2 py-1 bg-emerald-600 text-white rounded">Approve</button>
                            <button onClick={() => rejectPayment(sub.id)} className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Onboard Restaurant Modal */}
      {isAddTenantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateTenant}
            className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#E9DFD3]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-serif-luxury font-bold text-lg text-[#211B17]">
                Onboard New Restaurant Tenant
              </h3>
              <button
                type="button"
                onClick={() => setIsAddTenantOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Restaurant / Cafe Name *</label>
                <input
                  type="text"
                  required
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  placeholder="e.g. Royal Bengal Sweets & Cafe"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none focus:border-[#B87532]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Owner Full Name</label>
                <input
                  type="text"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Owner Email *</label>
                  <input
                    type="email"
                    required
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    placeholder="owner@royalbengal.com"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newOwnerPhone}
                    onChange={(e) => setNewOwnerPhone(e.target.value)}
                    placeholder="+91 98200 11223"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Location / City</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">SaaS Subscription Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) =>
                      setNewPlan(e.target.value as 'STARTER' | 'PRO' | 'ENTERPRISE')
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none font-semibold text-[#542B17]"
                  >
                    <option value="STARTER">Starter (₹1,999/month)</option>
                    <option value="PRO">Growth Pro (₹4,999/month)</option>
                    <option value="ENTERPRISE">Enterprise (₹9,999/month)</option>
                  </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddTenantOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#542B17] hover:bg-[#29170F] text-white rounded-xl text-xs font-bold"
              >
                Provision Tenant
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
