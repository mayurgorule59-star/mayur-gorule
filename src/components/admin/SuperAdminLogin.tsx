import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.js';

interface SuperAdminLoginProps {
  onSuccess?: () => void;
}

export const SuperAdminLogin: React.FC<SuperAdminLoginProps> = ({ onSuccess }) => {
  const { loginSuperAdmin, navigateToLanding } = useApp();

  const [email, setEmail] = useState('mayurgorulemg4444@gmail.com');
  const [password, setPassword] = useState('');
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showCredsHint, setShowCredsHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const result = await loginSuperAdmin(email, password, passkey);
      if (result.success) {
        setSuccessMsg('Authentication verified. Accessing Platform Master Control...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 600);
      } else {
        setErrorMsg(result.message || 'Authentication failed. Please check your credentials and security passkey.');
      }
    } catch {
      setErrorMsg('Network error connecting to backend authorization service.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillOwnerCredentials = () => {
    setEmail('mayurgorulemg4444@gmail.com');
    setPassword('Mayur@2026Admin');
    setPasskey('913704');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#FAF5ED] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E9DFD3] shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Top Decorative Amber Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#29170F] via-[#D99A4E] to-[#542B17]" />

        {/* Security Shield Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#29170F] to-[#542B17] text-[#D99A4E] flex items-center justify-center mx-auto shadow-lg border border-[#D99A4E]/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-[#FAF5ED] border border-[#E9DFD3] text-[10px] font-bold uppercase tracking-wider text-[#B87532]">
            Platform Master Access
          </div>
          <h1 className="font-serif-luxury font-bold text-2xl text-[#29170F]">
            Super Admin Portal
          </h1>
          <p className="text-xs text-[#75685E] max-w-xs mx-auto leading-relaxed">
            Exclusive platform command center for <strong>Mayur Gorule</strong>. Two-layer authentication required.
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2.5 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Authorization Failed</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Dual-Layer Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Layer 1A: Authorized Email */}
          <div>
            <label className="font-bold text-[#542B17] block mb-1">
              Authorized Platform Owner Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mayurgorulemg4444@gmail.com"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-[#B87532] text-xs font-medium text-[#211B17] bg-[#FAF5ED]/50"
            />
            <span className="text-[10px] text-stone-500 mt-0.5 block">
              Sole authorized Super Admin account: <strong className="text-[#542B17]">mayurgorulemg4444@gmail.com</strong>
            </span>
          </div>

          {/* Layer 1B: Master Administrative Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#542B17]">Master Password *</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] text-[#B87532] hover:underline"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Super Admin password"
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-[#B87532] text-xs font-mono"
              />
            </div>
          </div>

          {/* Layer 2: Private Security Passkey */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#542B17] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#D99A4E]" />
                <span>Private Security Passkey (2nd Layer) *</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="text-[10px] text-[#B87532] hover:underline"
              >
                {showPasskey ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPasskey ? 'text' : 'password'}
                required
                maxLength={10}
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="6-digit security passkey (e.g. 913704)"
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-[#B87532] text-xs font-mono tracking-widest"
              />
            </div>
            <span className="text-[10px] text-stone-500 mt-0.5 block">
              Second factor hardware / private passkey verified on server.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#29170F] to-[#542B17] hover:from-[#1F110B] hover:to-[#422112] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>Verifying Two-Layer Credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-[#D99A4E]" />
                <span>Authenticate & Access Command Center</span>
              </>
            )}
          </button>
        </form>

        {/* Verification Helper for Platform Owner Mayur Gorule */}
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setShowCredsHint(!showCredsHint)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-[#75685E] hover:text-[#542B17] py-1"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#B87532]" />
              <span>Owner Access Credentials Verification Guide</span>
            </span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showCredsHint ? 'rotate-90' : ''}`} />
          </button>

          {showCredsHint && (
            <div className="p-3.5 mt-2 bg-[#FAF5ED] rounded-xl border border-[#E9DFD3] text-[11px] space-y-2 text-[#542B17]">
              <div className="font-semibold text-xs text-[#29170F]">
                Mayur Gorule Master Security Protocol:
              </div>
              <ul className="space-y-1 font-mono text-[10px] text-stone-700">
                <li>• Authorized Email: <span className="font-bold text-[#29170F]">mayurgorulemg4444@gmail.com</span></li>
                <li>• Master Password: <span className="font-bold text-[#29170F]">Mayur@2026Admin</span></li>
                <li>• Private Passkey: <span className="font-bold text-[#29170F]">913704</span></li>
              </ul>
              <button
                type="button"
                onClick={fillOwnerCredentials}
                className="w-full mt-1 py-1.5 px-3 bg-white hover:bg-stone-50 border border-[#B87532] text-[#542B17] rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors"
              >
                Auto-Fill Owner Credentials
              </button>
            </div>
          )}
        </div>

        {/* Back to Public Site */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={navigateToLanding}
            className="text-xs text-[#75685E] hover:text-[#542B17] font-semibold transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
