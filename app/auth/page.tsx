'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AuthGate() {
  const router = useRouter();
  const supabase = createClient();
  
  const [role, setRole] = useState<'CHA' | 'CA'>('CHA');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTriggerOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setErrorMsg('');
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          role: role,
          orgName: orgName || 'Unknown Firm'
        }
      }
    });

    setIsLoading(false);
    
    if (error) {
      setErrorMsg(error.message);
    } else {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setIsLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'email'
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else if (data.session) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 selection:bg-emerald-500/30">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-900 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Access Trade Desk OS</h2>
          <p className="text-zinc-500 text-xs font-mono mt-1">Zero configuration secure gatekeeper bridge</p>
        </div>

        {/* High Density Binary Role Selector */}
        <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-lg border border-zinc-800/40 mb-6">
          <button
            type="button"
            onClick={() => !otpSent && setRole('CHA')}
            disabled={otpSent}
            className={`py-2 text-xs font-mono font-medium rounded-md transition duration-200 ${
              role === 'CHA' 
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/50 shadow-inner' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            📦 Customs House Agent (CHA)
          </button>
          <button
            type="button"
            onClick={() => !otpSent && setRole('CA')}
            disabled={otpSent}
            className={`py-2 text-xs font-mono font-medium rounded-md transition duration-200 ${
              role === 'CA' 
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/50 shadow-inner' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            💻 Chartered Accountant (CA)
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-xs font-mono text-center">
            {errorMsg}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleTriggerOTP} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Corporate Email Identifier</label>
              <input
                type="email"
                required
                placeholder="name@firm.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-700 font-mono transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Firm / Desk Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Mehta Logistics Ltd"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-700 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded font-medium text-sm transition shadow-lg shadow-white/5 disabled:opacity-50"
            >
              {isLoading ? 'Verifying Identity Vector...' : 'Request Security Passkey'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-1.5">
                🔒 Security Passkey Dispatched to {email}
              </label>
              <input
                type="text"
                required
                maxLength={8}
                placeholder="0 0 0 0 0 0 0 0"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-3 py-2 text-center text-lg tracking-[0.5em] font-mono bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder:text-zinc-800 focus:outline-none focus:border-zinc-700 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-sm transition disabled:opacity-50"
            >
              {isLoading ? 'Decrypting Secure Token...' : 'Enter Safe Desk Workspace'}
            </button>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-xs font-mono text-zinc-600 hover:text-zinc-400 transition pt-2"
            >
              ← Terminate and Modify Parameters
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
