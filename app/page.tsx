import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-400 overflow-x-hidden">
      {/* Premium Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            EXPORO<span className="text-emerald-500">AI</span>
          </span>
          <span className="text-xs px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full font-mono">
            v2.0 Enterprise
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#capabilities" className="text-sm text-zinc-400 hover:text-white transition">Capabilities</Link>
          <Link href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition">Workflow</Link>
          <Link href="#testimonials" className="text-sm text-zinc-400 hover:text-white transition">Proof</Link>
          <Link href="#pricing" className="text-sm text-zinc-400 hover:text-white transition">Pricing</Link>
        </nav>
        <div className="flex items-center">
          <Link href="/auth" className="text-sm px-4 py-2 bg-zinc-100 text-zinc-950 rounded font-medium hover:bg-white transition shadow-lg shadow-white/5">
            Access Workspace
          </Link>
        </div>
      </header>

      {/* Hero Core Segment */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>FEMA 2026 Compliance & ICEGATE Core Infrastructure Ready</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-5xl mx-auto">
          India’s First AI-Native, DPI-Linked <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-zinc-400 bg-clip-text text-transparent">Trade Desk Operating System</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Transform unstructured shipping paperwork and complex cross-border financial statements into instant legal tokens, clearing backlogs in under 60 seconds.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/auth" className="px-8 py-4 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/50 w-full sm:w-auto">
            Deploy Free Gatekeeper Sandbox
          </Link>
          <a href="#how-it-works" className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium rounded hover:bg-zinc-800 transition w-full sm:w-auto">
            See How it Works
          </a>
        </div>
      </main>

      {/* Trusted Technology Banner */}
      <section className="py-12 border-y border-zinc-900 bg-zinc-950/50 backdrop-blur-sm relative overflow-hidden">
        <p className="text-center text-xs font-mono text-zinc-500 mb-8 uppercase tracking-widest">Built On Enterprise-Grade AI Infrastructure</p>
        <div className="flex justify-center items-center flex-wrap gap-8 md:gap-16 opacity-60 grayscale px-6">
           <div className="text-xl font-bold font-sans tracking-tight text-white flex items-center space-x-2"><span>Supabase</span></div>
           <div className="text-xl font-extrabold tracking-widest text-white">Google GenAI</div>
           <div className="text-xl font-medium font-serif italic text-white flex items-center space-x-2"><span>pgvector</span></div>
           <div className="text-xl font-bold tracking-tighter text-white">Next.js 15</div>
           <div className="text-xl font-bold tracking-tight text-white">PostgreSQL</div>
        </div>
      </section>

      {/* Technical Moat Metrics */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-zinc-900 rounded-xl bg-zinc-900/20 text-center">
            <div className="text-4xl font-extrabold text-white mb-2">100%</div>
            <div className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Deterministic Extraction</div>
          </div>
          <div className="p-8 border border-zinc-900 rounded-xl bg-zinc-900/20 text-center">
            <div className="text-4xl font-extrabold text-white mb-2">768-Dim</div>
            <div className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Semantic Vector Matching</div>
          </div>
          <div className="p-8 border border-zinc-900 rounded-xl bg-zinc-900/20 text-center">
            <div className="text-4xl font-extrabold text-white mb-2">&lt; 3s</div>
            <div className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Avg Pipeline Latency</div>
          </div>
        </div>
      </section>

      {/* How It Works - Visual Timeline */}
      <section id="how-it-works" className="py-24 bg-zinc-900/30 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Autonomous Trade Compliance</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">A deterministic 3-step engine that ingests chaos and exports validated legal payloads.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-zinc-800 via-emerald-900 to-zinc-800 -z-10"></div>
            
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-xl shadow-zinc-950/50">
                📄
              </div>
              <h4 className="text-lg font-bold text-white mb-2">1. Multimodal Ingestion</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">Upload chaotic commercial invoices, shipping bills, or SWIFT MT103 logs. Our SLMs extract 50+ variables instantly.</p>
            </div>
            
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-emerald-950/30 border border-emerald-900/50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-xl shadow-emerald-900/20 relative">
                <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl animate-ping opacity-20"></div>
                ⚙️
              </div>
              <h4 className="text-lg font-bold text-white mb-2">2. Deterministic AI Engine</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">Validates parameters against RBI/FEMA boundaries with +/-0.5% tolerance. Maps HS codes perfectly.</p>
            </div>
            
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-xl shadow-zinc-950/50">
                ✅
              </div>
              <h4 className="text-lg font-bold text-white mb-2">3. WORM Vault Execution</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">Generates ICEGATE Cache payloads and permanently commits transactions to a 6-year immutable WORM vault.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Block Matrix */}
      <section id="capabilities" className="pt-32 pb-16 max-w-6xl mx-auto px-6 text-left grid md:grid-cols-2 gap-8">
        <div className="p-8 bg-zinc-900/40 border border-zinc-900 rounded-xl hover:border-zinc-800 transition backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition rounded-full"></div>
          <span className="text-3xl mb-6 block">📦</span>
          <h3 className="text-2xl font-bold text-white mb-3 font-sans">The Physical Flow <span className="text-emerald-500/80 text-sm ml-2 font-mono">(Goods Desk)</span></h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Ingest chaotic factory bills and multi-page commercial files with fine-tuned Vision Small Language Models. Auto-populates 50+ variables and maps exact 8-digit HS classifications directly onto government portals.
          </p>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-3 py-2 rounded inline-flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ICEGATE SB_CACHE01 Generation Live</span>
          </div>
        </div>

        <div className="p-8 bg-zinc-900/40 border border-zinc-900 rounded-xl hover:border-zinc-800 transition backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-2xl group-hover:bg-teal-500/10 transition rounded-full"></div>
          <span className="text-3xl mb-6 block">💻</span>
          <h3 className="text-2xl font-bold text-white mb-3 font-sans">The Intangible Flow <span className="text-teal-500/80 text-sm ml-2 font-mono">(Services Desk)</span></h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Shield software and service exporters from the extreme October 1, 2026 FEMA Overhaul rules. Run automatic matching logic mapping incoming dollar bank credits against invoices with zero spreadsheet maintenance.
          </p>
          <div className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-2 rounded inline-flex items-center space-x-2 border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
            <span>Direct Bank API: Connecting Production Rails...</span>
          </div>
        </div>
      </section>

      {/* Security & Compliance Badges */}
      <section className="py-16 max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-sm font-mono text-zinc-500 mb-8 uppercase tracking-widest">Enterprise-Grade Infrastructure</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center space-x-3 px-4 py-2 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300 text-sm font-medium">
            <span className="text-emerald-500">🔒</span>
            <span>AES-256 Encryption at Rest</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300 text-sm font-medium">
            <span className="text-emerald-500">🛡️</span>
            <span>WORM Immutable 6-Year Vault</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300 text-sm font-medium">
            <span className="text-emerald-500">✅</span>
            <span>FEMA 2026 Audit Ready</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300 text-sm font-medium">
            <span className="text-emerald-500">📜</span>
            <span>SOC2 Type II Compliant</span>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section id="testimonials" className="py-24 bg-zinc-900/30 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">Built for the Future of Compliance</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-xl relative hover:border-zinc-700 transition">
              <span className="text-4xl block mb-4">🎯</span>
              <h3 className="text-xl font-bold text-white mb-4">Strict Separation of Concerns</h3>
              <p className="text-zinc-400 relative z-10 text-sm leading-relaxed">
                We believe AI should read, but math should decide. ExporoAI strictly isolates generative language models for unstructured OCR extraction, while executing 100% of tariff classifications and FEMA variance checks via deterministic PostgreSQL logic gates.
              </p>
            </div>
            <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-xl relative hover:border-zinc-700 transition">
              <span className="text-4xl block mb-4">⚡</span>
              <h3 className="text-xl font-bold text-white mb-4">Zero-Paywall Infrastructure</h3>
              <p className="text-zinc-400 relative z-10 text-sm leading-relaxed">
                We are launching with a fully unhindered V1 workspace. No synthetic credit blockages, no hidden API paywalls. Your compliance organization gets immediate, unrestricted access to the semantic matching engine and workbook export APIs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Tier Pricing Grid */}
      <section id="pricing" className="py-32 max-w-7xl mx-auto px-6 text-left">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Uncompromising, Transparent Economics</h2>
        <p className="text-zinc-400 text-sm text-center mb-16 max-w-md mx-auto">Zero subscription friction for industry gatekeepers. Scale as you scale.</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-zinc-900/40 border border-emerald-900/50 shadow-[0_0_30px_rgba(16,185,129,0.05)] rounded-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500"></div>
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Gatekeeper Sandbox</h4>
              <div className="text-3xl font-bold text-white mb-4">₹0 <span className="text-sm font-normal text-zinc-500">/ forever</span></div>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6">Permanently free for CHAs and CAs. Extract, validate, and download pre-compiled legal payloads instantly.</p>
            </div>
            <div className="text-xs font-mono font-medium text-emerald-500 bg-emerald-950/20 text-center py-2 rounded border border-emerald-900/30">Active V1 Tier</div>
          </div>

          <div className="p-6 bg-zinc-900/20 border border-zinc-900 rounded-xl flex flex-col justify-between opacity-60 relative group">
            <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[0.5px] rounded-xl pointer-events-none"></div>
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Outcome SaaS</h4>
              <div className="text-3xl font-bold text-white mb-4">₹499 <span className="text-sm font-normal text-zinc-500">/ filing</span></div>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6">Programmatic single-click direct auto-submit to customs and bank gates. Charged only upon formal state acceptance.</p>
            </div>
            <div className="text-xs font-mono font-medium text-zinc-500 bg-zinc-900 text-center py-2 rounded border border-zinc-800">V2 API Egress Coming</div>
          </div>

          <div className="p-6 bg-zinc-900/20 border border-zinc-900 rounded-xl flex flex-col justify-between opacity-60 relative">
            <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[0.5px] rounded-xl pointer-events-none"></div>
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Corporate OS</h4>
              <div className="text-3xl font-bold text-white mb-4">₹2,999 <span className="text-sm font-normal text-zinc-500">/ month</span></div>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6">Full business organization dashboard workspace partitioning, team telemetry, and 6-Year Vault extraction rules.</p>
            </div>
            <div className="text-xs font-mono font-medium text-zinc-500 bg-zinc-900 text-center py-2 rounded border border-zinc-800">Upgrading Soon</div>
          </div>

          <div className="p-6 bg-zinc-900/20 border border-zinc-900 rounded-xl flex flex-col justify-between opacity-60 relative">
            <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[0.5px] rounded-xl pointer-events-none"></div>
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Enterprise Vault</h4>
              <div className="text-3xl font-bold text-white mb-4">Custom</div>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6">Dedicated private cloud partitions, custom database indexing triggers, and unified multi-PAN legal matching suites.</p>
            </div>
            <div className="text-xs font-mono font-medium text-zinc-500 bg-zinc-900 text-center py-2 rounded border border-zinc-800">Requires Advisory Contract</div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-950 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-zinc-950 via-emerald-500/50 to-zinc-950"></div>
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
           <h2 className="text-4xl font-bold text-white mb-6">Ready to digitize your compliance flow?</h2>
           <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">Join the new standard of cross-border trade operations in India. Fast, secure, and compliant.</p>
           <Link href="/auth" className="px-8 py-4 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/50 inline-block">
              Create Workspace Account
           </Link>
         </div>
      </section>

      {/* Professional Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
             <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent mb-4 inline-block">
              EXPORO<span className="text-emerald-500">AI</span>
            </span>
            <p className="text-zinc-500 text-sm max-w-xs mb-6">
              The AI-Native Trade Desk Operating System for modern Indian exporters, CHAs, and CAs.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons (Placeholders) */}
              <a href="#" className="text-zinc-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-4 text-sm">Product</h5>
            <ul className="space-y-3">
              <li><Link href="#capabilities" className="text-zinc-400 hover:text-white text-sm transition">Goods Desk</Link></li>
              <li><Link href="#capabilities" className="text-zinc-400 hover:text-white text-sm transition">Services Desk</Link></li>
              <li><Link href="#pricing" className="text-zinc-400 hover:text-white text-sm transition">Pricing</Link></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-4 text-sm">Developers</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition">API Documentation</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition">System Status</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition">GitHub</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition">Security Hub</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-4 text-sm">Legal</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition">Privacy Policy</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition">Terms of Service</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition">Data Processing</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition">Compliance Vault</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between">
          <p className="text-zinc-600 text-xs mb-4 md:mb-0">
            © {new Date().getFullYear()} ExporoAI Pvt. Ltd. All rights reserved. Not affiliated with ICEGATE or FEMA.
          </p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-zinc-500">All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
