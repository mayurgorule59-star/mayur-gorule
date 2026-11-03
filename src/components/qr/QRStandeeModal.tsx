import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Utensils,
  Sparkles,
  QrCode as QrIcon,
  Wifi,
} from 'lucide-react';
import { RestaurantSettings, RestaurantTable } from '../../types/index.js';
import { buildTableQRUrl } from '../../utils/engine.js';

interface QRStandeeModalProps {
  restaurant: RestaurantSettings;
  table: RestaurantTable;
  onClose: () => void;
  onTestOpen: (slug: string, tableNumber: string) => void;
}

export const QRStandeeModal: React.FC<QRStandeeModalProps> = ({
  restaurant,
  table,
  onClose,
  onTestOpen,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const standeeRef = useRef<HTMLDivElement>(null);

  const baseUrl = window.location.origin;
  const qrDestinationUrl = buildTableQRUrl(baseUrl, restaurant.slug, table.tableNumber);

  useEffect(() => {
    QRCode.toDataURL(qrDestinationUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#29170F',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR Generation failed', err));
  }, [qrDestinationUrl]);

  const copyUrl = () => {
    navigator.clipboard.writeText(qrDestinationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `${restaurant.slug}-table-${table.tableNumber}-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-3xl bg-[#FAF5ED] rounded-2xl shadow-2xl border border-[#E9DFD3] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FFFDF9] border-b border-[#E9DFD3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#542B17]/10 flex items-center justify-center text-[#542B17]">
              <QrIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif-luxury font-bold text-[#211B17]">
                Table {table.tableNumber} QR Standee
              </h2>
              <p className="text-xs text-[#75685E]">
                Scannable permanent link: {restaurant.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#75685E] hover:text-[#211B17] hover:bg-[#FAF5ED] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: The Physical Table Tent Standee Mockup (Inspired by Reference Image 2) */}
          <div className="flex justify-center">
            <div
              ref={standeeRef}
              className="relative w-72 bg-[#FFFDF9] p-6 rounded-xl border-2 border-[#D99A4E] shadow-xl text-center flex flex-col items-center"
              style={{
                backgroundImage: 'radial-gradient(#FAF5ED 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              {/* Standee Header */}
              <div className="w-12 h-12 rounded-full bg-[#542B17] text-white flex items-center justify-center text-xl shadow-md mb-2">
                {restaurant.logo || <Utensils className="w-5 h-5" />}
              </div>
              <h3 className="font-serif-luxury font-bold text-base text-[#29170F] tracking-wide">
                {restaurant.name}
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-[#B87532] font-semibold mt-0.5">
                GOOD FOOD · GREAT EXPERIENCE
              </p>

              {/* Gold Filigree Line */}
              <div className="flex items-center justify-center gap-2 w-full my-3">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D99A4E]" />
                <Sparkles className="w-3 h-3 text-[#D99A4E]" />
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D99A4E]" />
              </div>

              {/* QR Code Container with Gold Inset */}
              <div className="p-3 bg-white rounded-lg border border-[#D99A4E] shadow-sm my-1">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Table ${table.tableNumber} QR`}
                    className="w-44 h-44 object-contain"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-xs text-stone-400">
                    Generating QR...
                  </div>
                )}
              </div>

              {/* Standee Footer */}
              <div className="mt-3">
                <span className="font-serif-luxury text-sm font-semibold italic text-[#542B17]">
                  ~ Scan Me ~
                </span>
                <p className="text-[11px] text-[#75685E] font-medium">
                  Tap · Explore Menu · Order & Pay
                </p>
              </div>

              {/* Table Pill */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#542B17] text-white rounded-md text-xs font-semibold">
                <span>Table {table.tableNumber}</span>
                <span className="text-[#D99A4E]">·</span>
                <span className="text-[10px] text-stone-200">
                  {table.tableName}
                </span>
              </div>

              {/* Wifi Credential if exists */}
              {restaurant.wifiName && (
                <div className="mt-2 text-[10px] text-[#75685E] flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5 text-[#B87532]" />
                  <span>Wi-Fi: {restaurant.wifiName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions, Destination, and Download options */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B87532]">
                Permanent Public QR URL
              </span>
              <div className="mt-1.5 flex items-center gap-2 p-2.5 bg-white border border-[#E9DFD3] rounded-lg">
                <input
                  type="text"
                  readOnly
                  value={qrDestinationUrl}
                  className="flex-1 text-xs text-[#211B17] bg-transparent outline-none truncate font-mono"
                />
                <button
                  onClick={copyUrl}
                  className="px-2.5 py-1 text-xs font-medium text-[#542B17] hover:bg-[#FAF5ED] rounded transition-colors flex items-center gap-1 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-[#75685E]">
                This link opens the restaurant menu directly with Table{' '}
                {table.tableNumber} pre-selected. No customer login required.
              </p>
            </div>

            <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#E9DFD3] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#542B17]">
                Connected Ecosystem Features
              </h4>
              <ul className="text-xs text-[#75685E] space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B87532]" />
                  <span>Digital Menu with Veg/Non-Veg filters and food photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B87532]" />
                  <span>Real-time table ordering into kitchen display</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B87532]" />
                  <span>UPI (GPay / PhonePe) & Cash at Table settlement</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B87532]" />
                  <span>Direct Google Reviews link after dining</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={downloadPNG}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#542B17]/20 text-[#542B17] hover:bg-[#FAF5ED] rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4 text-[#B87532]" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#542B17] text-white hover:bg-[#29170F] rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4 text-[#D99A4E]" />
                <span>Print Standee</span>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onTestOpen(restaurant.slug, table.tableNumber);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#B87532]/10 text-[#542B17] hover:bg-[#B87532]/20 border border-[#B87532]/30 rounded-xl text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#B87532]" />
              <span>Test: Open Table {table.tableNumber} Menu Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
