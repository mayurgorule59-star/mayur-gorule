import React from 'react';
import { UtensilsCrossed, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext.js';

export const Footer: React.FC = () => {
  const { navigateToLanding, navigateToCustomerMenu, navigateToOwnerDashboard, navigateToSuperAdmin } = useApp();

  return (
    <footer className="bg-[#29170F] text-[#EDE0CE] pt-16 pb-12 border-t border-[#542B17]/40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#542B17]/40">
          {/* Column 1: Brand & Platform Owner */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#B87532] text-white flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif-luxury text-xl font-bold tracking-tight text-white">
                  DINEFLOW
                </span>
                <p className="text-[10px] tracking-widest uppercase text-[#D99A4E] font-semibold">
                  Scan · Order · Enjoy
                </p>
              </div>
            </div>
            <p className="text-xs text-[#EDE0CE]/80 leading-relaxed">
              Premium multi-restaurant QR table ordering, digital menu management, and real-time kitchen dispatch for cafes, restaurants, and hotels.
            </p>
            <div className="pt-2 text-xs text-[#D99A4E]">
              <span>Platform Architect & Owner:</span>{' '}
              <strong className="text-white font-semibold">Mayur Gorule</strong>
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div>
            <h4 className="font-serif-luxury text-sm font-bold text-white mb-4 tracking-wider uppercase">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EDE0CE]/80">
              <li>
                <button onClick={() => navigateToCustomerMenu('brew-and-bliss', '01')} className="hover:text-white transition-colors">
                  Digital QR Menus
                </button>
              </li>
              <li>
                <button onClick={() => navigateToOwnerDashboard()} className="hover:text-white transition-colors">
                  Kitchen Display & Orders
                </button>
              </li>
              <li>
                <button onClick={() => navigateToOwnerDashboard()} className="hover:text-white transition-colors">
                  UPI & Cash at Table Payments
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCustomerMenu('brew-and-bliss', '01')} className="hover:text-white transition-colors">
                  Customer Loyalty & Reviews
                </button>
              </li>
              <li>
                <button onClick={navigateToSuperAdmin} className="hover:text-white transition-colors">
                  Multi-Tenant Platform SaaS
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Navigation */}
          <div>
            <h4 className="font-serif-luxury text-sm font-bold text-white mb-4 tracking-wider uppercase">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EDE0CE]/80">
              <li>
                <button onClick={navigateToLanding} className="hover:text-white transition-colors">
                  Platform Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCustomerMenu('brew-and-bliss', '03')} className="hover:text-white transition-colors">
                  Sample Digital QR Menu
                </button>
              </li>
              <li>
                <button onClick={() => navigateToOwnerDashboard()} className="hover:text-white transition-colors">
                  Restaurant Owner Portal
                </button>
              </li>
              <li>
                <button onClick={navigateToSuperAdmin} className="hover:text-white transition-colors">
                  Super Admin Portal
                </button>
              </li>
            </ul>
          </div>

            {/* Column 4: Contact & Inquiries */}
            <div className="space-y-3">
              <h4 className="font-serif-luxury text-sm font-bold text-white mb-4 tracking-wider uppercase">
                Get Started
              </h4>
              <a
                href="https://wa.me/919137043953"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 text-xs text-[#EDE0CE]/80 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 text-[#D99A4E] group-hover:text-[#25D366] shrink-0 mt-0.5 transition-colors" />
                <span>+91 9137043953 (WhatsApp Direct)</span>
              </a>
              <a
                href="mailto:mayurgorulemg4444@gmail.com"
                className="flex items-start gap-2.5 text-xs text-[#EDE0CE]/80 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 text-[#D99A4E] group-hover:text-white shrink-0 mt-0.5 transition-colors" />
                <span>mayurgorulemg4444@gmail.com</span>
              </a>
              <div className="flex items-start gap-2.5 text-xs text-[#EDE0CE]/80">
                <MapPin className="w-4 h-4 text-[#D99A4E] shrink-0 mt-0.5" />
                <span>Mumbai & Gurugram, India</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/919137043953"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
              <p className="text-[11px] text-[#EDE0CE]/60 pt-1">
                Free setup & table QR standee consultation available for Indian restaurant owners.
              </p>
            </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EDE0CE]/60 gap-4">
          <p>© {new Date().getFullYear()} DineFlow SaaS. All rights reserved. Built with precision for hospitality.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted for premium hospitality by</span>
            <span className="text-[#D99A4E] font-medium">Mayur Gorule</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
