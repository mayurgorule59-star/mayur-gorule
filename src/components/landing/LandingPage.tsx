import React, { useState } from 'react';
import {
  UtensilsCrossed,
  QrCode,
  Smartphone,
  Star,
  Gift,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Zap,
  Phone,
  Mail,
  HelpCircle,
  Clock,
  Banknote,
  Flame,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { formatINR } from '../../utils/engine.js';
import { QRStandeeModal } from '../qr/QRStandeeModal.js';

export const LandingPage: React.FC = () => {
  const {
    navigateToCustomerMenu,
    navigateToOwnerDashboard,
    navigateToSuperAdmin,
    restaurants,
    tables,
  } = useApp();

  const [standeePreviewTable, setStandeePreviewTable] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    restaurantName: '',
    message: '',
  });

  const previewRest = restaurants[0];
  const previewTbl = tables[0];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', phone: '', restaurantName: '', message: '' });
    }, 3000);
  };

  return (
    <div className="space-y-24 py-8">
      {/* 1. HERO SECTION (Prompt Section 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B87532]/10 border border-[#B87532]/25 rounded-full text-xs font-bold uppercase tracking-widest text-[#542B17]">
              <Sparkles className="w-3.5 h-3.5 text-[#B87532]" />
              <span>THE SMARTER WAY TO RUN YOUR RESTAURANT</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#29170F] leading-[1.15] text-balance">
              YOUR RESTAURANT.{' '}
              <span className="text-[#B87532] underline decoration-[#D99A4E]/40 decoration-4">
                ONE SCAN.
              </span>{' '}
              ENDLESS POSSIBILITIES.
            </h1>

            <p className="text-base sm:text-lg text-[#75685E] leading-relaxed max-w-xl">
              Transform your cafe, restaurant, or hotel with instant QR table ordering, digital menus with live updates, UPI & cash payments, customer reviews, and multi-outlet management.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigateToOwnerDashboard()}
                className="px-6 py-3.5 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>START FREE AS RESTAURANT →</span>
              </button>

              <button
                onClick={() => navigateToCustomerMenu('brew-and-bliss', '03')}
                className="px-6 py-3.5 bg-white border border-[#542B17]/25 text-[#542B17] hover:bg-[#FAF5ED] rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-2 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-[#B87532]" />
                <span>TRY CUSTOMER QR SCAN</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[#E9DFD3] grid grid-cols-3 gap-4 text-xs font-semibold text-[#542B17]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#268A55] shrink-0" />
                <span>Zero-App QR Menu</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#268A55] shrink-0" />
                <span>UPI & Cash at Table</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#268A55] shrink-0" />
                <span>Direct Google Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Smartphone Mockup (Inspired by Reference Image 1) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] bg-[#29170F] p-3 rounded-[44px] shadow-2xl border-4 border-stone-800">
              {/* Dynamic island notch */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2" />

              {/* Phone Screen Display */}
              <div className="bg-[#FAF5ED] rounded-[36px] overflow-hidden p-3.5 space-y-3 shadow-inner">
                {/* Header in App */}
                <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#542B17] text-white flex items-center justify-center text-xs">
                      ☕
                    </div>
                    <div>
                      <div className="font-serif-luxury font-bold text-xs text-[#29170F]">
                        Brew & Bliss
                      </div>
                      <div className="text-[9px] text-[#B87532] font-semibold">Table 03 · Dine-In</div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Hero Banner in Phone */}
                <div className="rounded-xl overflow-hidden bg-[#29170F] text-white p-3 relative">
                  <span className="text-[9px] text-[#D99A4E] font-serif-luxury italic">Good Food Good Vibes</span>
                  <div className="text-xs font-bold leading-tight mt-0.5">Artisanal Coffee & Bakes</div>
                  <div className="mt-1 text-[8px] px-2 py-0.5 bg-[#D99A4E] text-stone-900 font-bold inline-block rounded">
                    ORDER NOW →
                  </div>
                </div>

                {/* Categories */}
                <div className="flex justify-between text-[9px] font-semibold text-center text-[#542B17]">
                  <div className="space-y-1">
                    <div className="w-9 h-9 rounded-full bg-[#542B17] text-[#D99A4E] flex items-center justify-center mx-auto">
                      ☕
                    </div>
                    <span>Coffee</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto">
                      🥐
                    </div>
                    <span>Pastries</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto">
                      🥪
                    </div>
                    <span>Snacks</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto">
                      🍰
                    </div>
                    <span>Desserts</span>
                  </div>
                </div>

                {/* Product Preview Cards */}
                <div className="space-y-2">
                  <div className="p-2 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-2 shadow-2xs">
                    <img
                      src="/src/assets/images/hero_latte_art_cup_1793552349663.jpg"
                      alt="Cappuccino"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-[10px]">
                      <div className="font-semibold text-stone-900">Artisan Cappuccino</div>
                      <div className="text-[9px] text-stone-500">Smooth espresso & velvet milk</div>
                      <div className="font-mono font-bold text-[#542B17]">₹149</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#542B17] text-white flex items-center justify-center text-xs">
                      +
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-2 shadow-2xs">
                    <img
                      src="/src/assets/images/chocolate_lava_muffin_1793552350693.jpg"
                      alt="Muffin"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-[10px]">
                      <div className="font-semibold text-stone-900">Molten Choco Muffin</div>
                      <div className="text-[9px] text-stone-500">Gooey Belgian chocolate</div>
                      <div className="font-mono font-bold text-[#542B17]">₹99</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#542B17] text-white flex items-center justify-center text-xs">
                      +
                    </div>
                  </div>
                </div>

                {/* Mock Phone CTA */}
                <button
                  onClick={() => navigateToCustomerMenu('brew-and-bliss', '03')}
                  className="w-full py-2 bg-[#542B17] hover:bg-[#29170F] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-md"
                >
                  <span>Open Full Interactive Mobile Menu</span>
                  <ExternalLink className="w-3 h-3 text-[#D99A4E]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QR CODE ECOSYSTEM SECTION (Prompt Section 7 & Reference Image 2) */}
      <section id="qr-ecosystem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87532]">
            CONNECTED RESTAURANT HARDWARE & SOFTWARE
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#29170F]">
            ONE QR CODE. A COMPLETE RESTAURANT EXPERIENCE.
          </h2>
          <p className="text-sm text-[#75685E]">
            Give your guests everything they need right at their table with just one smartphone camera scan.
          </p>
        </div>

        {/* Centerpiece: Physical Table Tent Standee + 4 Floating Connected Cards */}
        <div className="mt-14 relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left Cards */}
          <div className="space-y-6">
            {/* Card 1: Digital Menu */}
            <div className="p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-2 hover:border-[#B87532] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] text-[#542B17] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-[#B87532]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
                01. Digital Menu
              </h3>
              <p className="text-xs text-[#75685E] leading-relaxed">
                Let customers explore your complete menu with appetizing food photography, dietary tags (Veg/Non-Veg), and live prices.
              </p>
            </div>

            {/* Card 2: Online Ordering */}
            <div className="p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-2 hover:border-[#B87532] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] text-[#542B17] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#B87532]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
                02. Order Online & Pay
              </h3>
              <p className="text-xs text-[#75685E] leading-relaxed">
                Customers customize sizes, add special instructions, and pay via Google Pay, PhonePe UPI, or Cash at Table.
              </p>
            </div>
          </div>

          {/* Center Table Standee Mockup (Matches Reference Image 2) */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[280px] bg-[#FFFDF9] p-6 rounded-2xl border-2 border-[#D99A4E] shadow-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#542B17] text-white flex items-center justify-center mx-auto text-xl shadow-md">
                ☕
              </div>
              <div>
                <h4 className="font-serif-luxury font-bold text-base text-[#29170F]">
                  Brew & Bliss Coffee House
                </h4>
                <p className="text-[10px] uppercase font-bold text-[#B87532] tracking-wider">
                  GOOD FOOD · GREAT EXPERIENCE
                </p>
              </div>

              {/* Scannable Real QR Graphic */}
              <div className="p-3 bg-white rounded-xl border border-[#D99A4E] shadow-inner mx-auto w-44 h-44 flex items-center justify-center">
                <img
                  src="/src/assets/images/restaurant_table_standee_1793552351244.jpg"
                  alt="Scannable QR standee"
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div>
                <span className="font-serif-luxury text-sm font-semibold italic text-[#542B17]">
                  ~ Scan Me ~
                </span>
                <p className="text-[11px] text-[#75685E]">Tap · Explore · Enjoy</p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#542B17] text-white rounded-md text-xs font-semibold">
                <span>Table 03</span>
                <span className="text-[#D99A4E]">·</span>
                <span className="text-[10px] text-stone-200">Window Patio</span>
              </div>

              <button
                onClick={() => setStandeePreviewTable(true)}
                className="w-full py-2 bg-[#D99A4E] hover:bg-[#B87532] text-stone-900 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Inspect Print Standee
              </button>
            </div>
          </div>

          {/* Right Cards */}
          <div className="space-y-6">
            {/* Card 3: Customer Reviews */}
            <div className="p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-2 hover:border-[#B87532] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] text-[#542B17] flex items-center justify-center">
                <Star className="w-5 h-5 text-[#B87532]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
                03. Google Reviews
              </h3>
              <p className="text-xs text-[#75685E] leading-relaxed">
                Direct customers to your official Google Maps business profile to boost 5-star ratings and local SEO visibility.
              </p>
            </div>

            {/* Card 4: Loyalty Program */}
            <div className="p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-2 hover:border-[#B87532] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] text-[#542B17] flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#B87532]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
                04. Customer Loyalty
              </h3>
              <p className="text-xs text-[#75685E] leading-relaxed">
                Reward returning diners with 10 points per ₹100, custom promo coupons, and repeat customer incentives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Prompt Section 8) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87532]">
            EFFORTLESS SETUP
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#29170F]">
            GET YOUR RESTAURANT READY IN MINUTES
          </h2>
          <p className="text-sm text-[#75685E]">
            From registration to printing table standees, start taking digital orders without technical hurdles.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-3">
            <span className="text-2xl font-serif-luxury font-bold text-[#B87532]">01</span>
            <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
              Create Your Account
            </h3>
            <p className="text-xs text-[#75685E] leading-relaxed">
              Register your restaurant, upload your logo, and configure contact details and timings.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-3">
            <span className="text-2xl font-serif-luxury font-bold text-[#B87532]">02</span>
            <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
              Build Your Digital Menu
            </h3>
            <p className="text-xs text-[#75685E] leading-relaxed">
              Add food categories, dishes, prices in ₹, mouthwatering photos, and customization options.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-3">
            <span className="text-2xl font-serif-luxury font-bold text-[#B87532]">03</span>
            <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
              Generate Table QRs
            </h3>
            <p className="text-xs text-[#75685E] leading-relaxed">
              Download high-res PNG or print-ready table tent standees for every table with 1-click.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E9DFD3] shadow-2xs space-y-3">
            <span className="text-2xl font-serif-luxury font-bold text-[#B87532]">04</span>
            <h3 className="font-serif-luxury font-bold text-base text-[#211B17]">
              Receive Orders in Real-Time
            </h3>
            <p className="text-xs text-[#75685E] leading-relaxed">
              Listen for kitchen chimes, manage KDS tickets, accept UPI or cash payments seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87532]">
            TRANSPARENT VALUE
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#29170F]">
            PLANS DESIGNED FOR GROWING FOOD BUSINESSES
          </h2>
          <p className="text-sm text-[#75685E]">
            All plans include free table QR ordering and full multi-tenant data isolation.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="p-8 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#75685E]">
                For Cafes & Small Bistros
              </span>
              <div className="text-3xl font-bold font-mono text-[#211B17]">
                ₹1,999 <span className="text-xs font-normal text-stone-500">/ month</span>
              </div>
              <p className="text-xs text-[#75685E]">
                Essential QR ordering and digital menu for boutique cafes.
              </p>
              <ul className="text-xs text-[#211B17] space-y-2.5">
                <li className="flex items-center gap-2">✓ Up to 10 Table QR Codes</li>
                <li className="flex items-center gap-2">✓ High-res QR Standee Downloads</li>
                <li className="flex items-center gap-2">✓ UPI & Cash at Table Payments</li>
                <li className="flex items-center gap-2">✓ Kitchen Order Ticket (KOT) Printing</li>
              </ul>
            </div>
            <button
              onClick={() => navigateToOwnerDashboard()}
              className="w-full py-3 bg-white border border-[#542B17] text-[#542B17] hover:bg-[#FAF5ED] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Growth Pro Plan */}
          <div className="p-8 bg-white rounded-2xl border-2 border-[#542B17] shadow-xl space-y-5 flex flex-col justify-between relative">
            <span className="absolute -top-3.5 right-6 px-3 py-1 bg-[#542B17] text-[#D99A4E] rounded-full text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </span>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B87532]">
                For Busy Restaurants & Bars
              </span>
              <div className="text-3xl font-bold font-mono text-[#211B17]">
                ₹4,999 <span className="text-xs font-normal text-stone-500">/ month</span>
              </div>
              <p className="text-xs text-[#75685E]">
                Complete table management with real-time audio chimes and loyalty.
              </p>
              <ul className="text-xs text-[#211B17] space-y-2.5">
                <li className="flex items-center gap-2">✓ <strong>Unlimited</strong> Table QR Codes</li>
                <li className="flex items-center gap-2">✓ Real-time Kitchen Audio Alerts</li>
                <li className="flex items-center gap-2">✓ Customer Loyalty Points Engine</li>
                <li className="flex items-center gap-2">✓ Direct Google Review Redirect</li>
                <li className="flex items-center gap-2">✓ Discount Coupons & Promo Banners</li>
              </ul>
            </div>
            <button
              onClick={() => navigateToOwnerDashboard()}
              className="w-full py-3 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
            >
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 bg-white rounded-2xl border border-[#E9DFD3] shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#75685E]">
                For Hotels & Multi-Outlet Chains
              </span>
              <div className="text-3xl font-bold font-mono text-[#211B17]">
                ₹9,999 <span className="text-xs font-normal text-stone-500">/ month</span>
              </div>
              <p className="text-xs text-[#75685E]">
                Dedicated white-label restaurant domains and chain-wide reporting.
              </p>
              <ul className="text-xs text-[#211B17] space-y-2.5">
                <li className="flex items-center gap-2">✓ Unlimited Locations & Outlets</li>
                <li className="flex items-center gap-2">✓ Custom Domain (`menu.yourbrand.in`)</li>
                <li className="flex items-center gap-2">✓ Dedicated Account Manager</li>
                <li className="flex items-center gap-2">✓ WhatsApp Business API Integration</li>
              </ul>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3 bg-white border border-[#542B17] text-[#542B17] hover:bg-[#FAF5ED] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* 5. CONTACT & CONSULTATION FORM (Prompt Section 23) */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E9DFD3] p-8 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B87532]">
              WE'RE HERE TO HELP
            </span>
            <h3 className="font-serif-luxury font-bold text-2xl text-[#29170F]">
              Ready to Upgrade Your Cafe or Restaurant?
            </h3>
            <p className="text-xs text-[#75685E] leading-relaxed">
              Talk directly with platform owner <strong>Mayur Gorule</strong>. Get a personalized demo and free table QR standee samples for your restaurant.
            </p>

            <div className="space-y-3 text-xs text-[#542B17] pt-2">
              <a
                href="https://wa.me/919137043953"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#B87532] transition-colors group"
              >
                <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
                <span className="font-semibold">+91 9137043953 (WhatsApp Direct)</span>
              </a>
              <a
                href="mailto:mayurgorulemg4444@gmail.com"
                className="flex items-center gap-2 hover:text-[#B87532] transition-colors group"
              >
                <Mail className="w-4 h-4 text-[#B87532] shrink-0" />
                <span className="font-semibold">mayurgorulemg4444@gmail.com</span>
              </a>
              <div className="pt-1">
                <a
                  href="https://wa.me/919137043953"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Start Direct WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
            {contactSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="font-bold">Thank You for Reaching Out!</div>
                <p className="text-[11px]">Mayur Gorule will contact you within 2 business hours.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="font-semibold block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Sanjay Verma"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="+91 9137043953"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Restaurant / Cafe Name</label>
                  <input
                    type="text"
                    value={contactForm.restaurantName}
                    onChange={(e) => setContactForm({ ...contactForm, restaurantName: e.target.value })}
                    placeholder="e.g. Cafe Mocha Delight"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Message</label>
                  <textarea
                    rows={2}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How many tables do you have?"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#542B17] text-white hover:bg-[#29170F] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Request Free QR Demo Setup
                </button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Floating Direct WhatsApp Button */}
      <a
        href="https://wa.me/919137043953"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl transition-transform hover:scale-105 group no-print"
        aria-label="Direct WhatsApp Chat with Mayur Gorule"
      >
        <Phone className="w-5 h-5 fill-white text-white" />
        <span className="text-xs font-bold tracking-wide">WhatsApp Mayur (+91 9137043953)</span>
      </a>

      {/* Standee Preview Modal */}
      {standeePreviewTable && (
        <QRStandeeModal
          restaurant={previewRest}
          table={previewTbl}
          onClose={() => setStandeePreviewTable(false)}
          onTestOpen={(slug, tableNum) => {
            setStandeePreviewTable(false);
            navigateToCustomerMenu(slug, tableNum);
          }}
        />
      )}
    </div>
  );
};
