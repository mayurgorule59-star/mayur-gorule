import React from 'react';
import {
  UtensilsCrossed,
  LayoutDashboard,
  Phone,
  Lock,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';

export const Header: React.FC = () => {
  const {
    currentView,
    navigateToLanding,
    navigateToOwnerDashboard,
    navigateToSuperAdmin,
    isOwnerAuthenticated,
    isSuperAdminAuthenticated,
    logoutOwner,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF5ED]/95 backdrop-blur-md border-b border-[#E9DFD3] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single Element Brand Wordmark */}
        <button
          onClick={navigateToLanding}
          className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-[#542B17] text-[#D99A4E] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-luxury text-xl font-bold tracking-tight text-[#29170F] leading-none">
              DINEFLOW
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#B87532] font-semibold mt-0.5">
              Scan · Order · Enjoy
            </span>
          </div>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links (Hidden on small mobile) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#75685E]">
          <button
            onClick={() => {
              navigateToLanding();
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#542B17] transition-colors whitespace-nowrap shrink-0"
          >
            Features
          </button>
          <button
            onClick={() => {
              navigateToLanding();
              const el = document.getElementById('qr-ecosystem');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#542B17] transition-colors whitespace-nowrap shrink-0"
          >
            QR Ecosystem
          </button>
          <button
            onClick={() => {
              navigateToLanding();
              const el = document.getElementById('how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#542B17] transition-colors whitespace-nowrap shrink-0"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              navigateToLanding();
              const el = document.getElementById('pricing');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#542B17] transition-colors whitespace-nowrap shrink-0"
          >
            Pricing
          </button>
          <button
            onClick={() => {
              navigateToLanding();
              const el = document.getElementById('contact');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#542B17] transition-colors whitespace-nowrap shrink-0"
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Authenticated Restaurant Owner & Direct WhatsApp */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://wa.me/919137043953"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap shrink-0"
            title="Chat with Mayur Gorule on WhatsApp (+91 9137043953)"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* If Owner is Authenticated: Show Restaurant Workspace and Log Out */}
          {isOwnerAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateToOwnerDashboard()}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide shadow-xs transition-colors whitespace-nowrap shrink-0 ${
                  currentView === 'OWNER_DASHBOARD'
                    ? 'bg-[#B87532] text-white ring-2 ring-[#B87532]/40'
                    : 'bg-[#542B17] text-white hover:bg-[#29170F]'
                }`}
                title="Open Restaurant Workspace"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#D99A4E]" />
                <span>Restaurant Workspace</span>
              </button>
              {isSuperAdminAuthenticated && (
                <button
                  onClick={navigateToSuperAdmin}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide shadow-xs transition-colors whitespace-nowrap shrink-0 bg-[#542B17] text-[#D99A4E] border border-[#D99A4E]"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </button>
              )}
              <button
                onClick={() => {
                  logoutOwner();
                  navigateToLanding();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E9DFD3] text-[#75685E] hover:text-[#542B17] hover:bg-stone-50 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                title="Log Out of Restaurant Workspace"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : currentView === 'SUPER_ADMIN' ? (
            <button
              onClick={navigateToLanding}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#542B17] text-white hover:bg-[#29170F] rounded-lg text-xs font-semibold tracking-wide shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#D99A4E]" />
              <span>Back to Website</span>
            </button>
          ) : (
            /* Unauthenticated Public/Customer View: No Restaurant Workspace shown. Clean Owner Login button */
            <button
              onClick={() => navigateToOwnerDashboard()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#542B17] text-white hover:bg-[#29170F] rounded-lg text-xs font-semibold tracking-wide shadow-xs transition-colors whitespace-nowrap shrink-0"
              title="Restaurant Owner & Staff Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#D99A4E]" />
              <span>Owner Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
