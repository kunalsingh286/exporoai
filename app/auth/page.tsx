'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AuthGate() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isSignUp, setIsSignUp] = useState(true);
  const [role, setRole] = useState<'CHA' | 'CA'>('CHA');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setErrorMsg('');
    
    if (isSignUp) {
      if (!orgName) {
        setErrorMsg('Firm / Desk Name is required for Registration.');
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            orgName: orgName
          }
        }
      });
      setIsLoading(false);
      
      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/dashboard');
      } else {
        // If confirm email is on (even if we told user to turn it off)
        setErrorMsg('Registration successful! Please check your email to verify your account (if email confirmation is active in Supabase).');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      setIsLoading(false);
      
      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 selection:bg-emerald-500/30">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-900 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Access Trade Desk OS</h2>
          <p className="text-zinc-500 text-xs font-mono mt-1">Zero configuration secure gatekeeper bridge</p>
        </div>

        {isSignUp && (
          <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-lg border border-zinc-800/40 mb-6">
            <button
              type="button"
              onClick={() => setRole('CHA')}
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
              onClick={() => setRole('CA')}
              className={`py-2 text-xs font-mono font-medium rounded-md transition duration-200 ${
                role === 'CA' 
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/50 shadow-inner' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              💻 Chartered Accountant (CA)
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-xs font-mono text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
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
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-700 font-mono transition"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Firm / Desk Name</label>
              <input
                type="text"
                required={isSignUp}
                placeholder="e.g., Mehta Logistics Ltd"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-700 transition"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-sm transition shadow-lg shadow-emerald-900/20 disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Verifying Identity Vector...' : isSignUp ? 'Create Workspace Account' : 'Authenticate & Enter'}
          </button>

          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="w-full text-center text-xs font-mono text-zinc-500 hover:text-zinc-300 transition pt-4 block"
          >
            {isSignUp ? "Already have an account? Sign In" : "New to ExporoAI? Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
