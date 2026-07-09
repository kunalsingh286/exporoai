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
          <Link href="#workflows" className="text-sm text-zinc-400 hover:text-white transition">Workflows</Link>
          <Link href="#pricing" className="text-sm text-zinc-400 hover:text-white transition">Pricing</Link>
          <Link href="#lending" className="text-sm text-zinc-400 hover:text-white transition">Lending</Link>
          <Link href="#security" className="text-sm text-zinc-400 hover:text-white transition">Security</Link>
        </nav>
        <div className="flex items-center">
          <Link href="/auth" className="text-sm px-4 py-2 bg-zinc-100 text-zinc-950 rounded font-medium hover:bg-white transition shadow-lg shadow-white/5">
            Access Workspace
          </Link>
        </div>
      </header>

      {/* SECTION 1: THE HERO THEME (The Hook) */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>⚡ India’s First AI-Native Cross-Border Trade Operating System</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-5xl mx-auto">
          Stop Typing Documents. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-zinc-400 bg-clip-text text-transparent">Streamline Your International Trade Ledger.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-4xl mx-auto mb-10 leading-relaxed">
          From factory floor packing lists to complex central bank wire reconciliation, ExporoAI maps physical logistics and financial flows into a single unified corporate PAN dashboard. Built natively for the modern October 1, 2026 FEMA Overhaul and ICEGATE architectures.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/auth" className="px-8 py-4 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/50 w-full sm:w-auto">
            Initialize Free Workspace
          </Link>
          <a href="#pricing" className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium rounded hover:bg-zinc-800 transition w-full sm:w-auto">
            Request Enterprise Demo
          </a>
        </div>
      </main>

      {/* SECTION 2: THE PROBLEM BOX (The $2 Trillion Friction) */}
      <section className="max-w-5xl mx-auto px-6 pb-24 relative z-10 -mt-8">
        <div className="p-1 border border-zinc-800/80 bg-zinc-900/50 rounded-2xl shadow-2xl backdrop-blur">
          <div className="p-8 md:p-12 bg-zinc-950 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl pointer-events-none rounded-full"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Cross-Border Trade is a Bank Ledger Problem, Not a Design Problem.</h2>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              Traditional document utilities leave you stranded with simple PDF templates. But under modern trade regulations, every physical shipment or digital microtransaction leaves behind open regulatory positions. If your logistics logs don’t match your inward bank receipts down to the exact dollar within strict central banking horizons, your business lands on the federal list—freezing your shipping permissions and locking away your domestic tax credits.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE ARCHITECTURE (The V2 Split-Engine Dual Workflows) */}
      <section id="workflows" className="py-24 border-y border-zinc-900 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The V2 Split-Engine Dual Workflows</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Natively architected for both physical logistics handlers and intangible digital service exporters.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* WORKFLOW A: Physical Goods */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full transition duration-500 group-hover:bg-emerald-500/10"></div>
              <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-3 py-1.5 rounded-full inline-block mb-6 relative z-10">
                📦 Track A: Terminal Gate-In to Bank Realization
              </div>
              <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Physical Merchandise Flow <span className="text-zinc-500 text-sm block mt-1 font-normal">(Engineered for Goods Exporters & CHAs)</span></h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center font-mono text-emerald-500 text-sm">1</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Zero-Template Ingestion</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Drop messy multi-page commercial invoices, warehouse weight sheets, or raw smartphone photos into the drop-zone or our dedicated WhatsApp Bot. Localized Vision-SLMs extract 50+ logistics parameters with zero pre-formatted template dependencies.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center font-mono text-emerald-500 text-sm">2</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Automated HS Classification</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Semantic text lookups match line-item syntax against digital global tariff books to automatically append precise 8-digit HS Code variables, removing clerical errors.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center font-mono text-emerald-500 text-sm">3</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Direct ICEGATE Submission Proxy</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">ExporoAI automatically serializes your data tree into the strict, nested ICEGATE SB_CACHE01 JSON schema, clearing customs queues inside your dedicated staging window.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center font-mono text-emerald-500 text-sm">4</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Asynchronous ULIP Telemetry Webhooks</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Background workers monitor live container states via the National Logistics Platform (NIC ULIP node). The exact millisecond your container gates-in at the terminal, the system updates customs, securing an Auto Let Export Order (Auto-LEO).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center font-mono text-emerald-500 text-sm">5</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">EDPMS Ledger Closure</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">The engine pulls incoming bank Foreign Inward Remittance Certificates (FIRCs). If conversion spreads track inside the statutory ±0.5% central banking variance boundary, the platform executes a deterministic match, programmatically closing your open transaction record inside your bank's EDPMS panel.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WORKFLOW B: Intangible Services */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full transition duration-500 group-hover:bg-blue-500/10"></div>
              <div className="text-xs font-mono text-blue-400 bg-blue-950/40 border border-blue-900/50 px-3 py-1.5 rounded-full inline-block mb-6 relative z-10">
                💻 Track B: Micropayment Pooling to Tax Recovery
              </div>
              <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Intangible Services & SaaS Flow <span className="text-zinc-500 text-sm block mt-1 font-normal">(Engineered for Tech Founders & CAs)</span></h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-950/50 border border-blue-900/50 flex items-center justify-center font-mono text-blue-500 text-sm">1</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Billing & Remittance Convergence</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Natively connect read-only global merchant gates (Stripe, Wise, PayPal) or upload monthly invoice registers alongside multi-page bank SWIFT MT103 logs.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-950/50 border border-blue-900/50 flex items-center justify-center font-mono text-blue-500 text-sm">2</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Micro-Value Aggregation</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">For high-frequency SaaS payments under ₹10 Lakhs, background handlers automatically pool disparate transaction line items by country code and purpose identifiers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-950/50 border border-blue-900/50 flex items-center justify-center font-mono text-blue-500 text-sm">3</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Dual-Ledger Exchange Reconciliation</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">The engine isolates intermediate global routing fees and checks bank exchange conversions against outstanding invoices, enforcing the strict legal ±0.5% spreadsheet variance boundary.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-950/50 border border-blue-900/50 flex items-center justify-center font-mono text-blue-500 text-sm">4</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Automated Monthly Unified EDF Token</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Legacy SOFTEX pathways are completely phased out. ExporoAI programmatically compiles your cleared transactions into the official monthly Unified Export Declaration Form (EDF) framework and injects it straight into your AD Bank Portal.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-950/50 border border-blue-900/50 flex items-center justify-center font-mono text-blue-500 text-sm">5</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">GST RFD-01 Tax Credit Injection</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">The cleared trade dataset instantly auto-populates the strict matrix tables of a federal GST RFD-01 tax refund application, un-trapping lakhs in domestic Input Tax Credits (ITC) while cleanly managing active Letter of Undertaking (LUT) lifecycles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE TRANSPARENT VALUE PRICING MATRIX */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">The Transparent Value Pricing Matrix</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Eliminate Subscription Fatigue. Pay for Successful Milestones Only.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tier 1 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 flex flex-col hover:border-zinc-700 transition">
            <h3 className="text-xl font-bold text-white mb-2">🕊️ The Gatekeeper Desk</h3>
            <p className="text-xs font-mono text-zinc-500 mb-6 uppercase tracking-widest">(V1 Workspace)</p>
            <div className="text-3xl font-extrabold text-white mb-2">₹0</div>
            <div className="text-sm text-emerald-500 font-medium mb-8">Free Forever</div>
            <p className="text-sm text-zinc-400 mb-6">Target: CHAs and Chartered Accountants (CAs).</p>
            <ul className="text-sm text-zinc-300 space-y-3 mb-8 flex-1">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                Asynchronous template-free AI document parsing and character extraction.
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                Side-by-side visual exception view screen.
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                Multi-file compliance anomaly scanning and red-line warnings.
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                Manual copy-paste payload download formats.
              </li>
            </ul>
            <Link href="/auth" className="block text-center px-4 py-3 bg-zinc-900 border border-zinc-800 text-white rounded hover:bg-zinc-800 transition text-sm font-medium mt-auto">
              Onboard Your Clients Free
            </Link>
          </div>

          {/* Tier 2 */}
          <div className="bg-zinc-900 border border-emerald-900/50 rounded-xl p-8 flex flex-col relative shadow-2xl shadow-emerald-900/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full"></div>
            <h3 className="text-xl font-bold text-white mb-2">⚡ The Transactional Engine</h3>
            <p className="text-xs font-mono text-zinc-500 mb-6 uppercase tracking-widest">(V2 Core)</p>
            <div className="text-3xl font-extrabold text-white mb-2">₹499</div>
            <div className="text-sm text-emerald-400 font-medium mb-8">Per Successful Batch Filing</div>
            <p className="text-sm text-zinc-400 mb-6">Target: Growing MSMEs and seasonal shippers.</p>
            <ul className="text-sm text-zinc-300 space-y-3 mb-8 flex-1 relative z-10">
              <li className="flex items-start font-medium text-white mb-2">All features from Tier 1, plus:</li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                Direct programmatic data injection via proxy into active government sessions.
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                Live NIC ULIP terminal container telemetry webhooks.
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                Automatic dollar-for-dollar bank FIRC matching inside the legal ±0.5% spread.
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                Single-click RBI EDPMS ledger queue closure.
              </li>
            </ul>
            <button className="block w-full text-center px-4 py-3 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition text-sm font-medium mt-auto relative z-10">
              Pay-Per-Filings via UPI
            </button>
          </div>

          {/* Tier 3 */}
          <div className="bg-zinc-900 border border-blue-900/50 rounded-xl p-8 flex flex-col relative shadow-2xl shadow-blue-900/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full"></div>
            <h3 className="text-xl font-bold text-white mb-2">💻 The Connected Trade OS</h3>
            <p className="text-xs font-mono text-zinc-500 mb-6 uppercase tracking-widest">(V2 Continuous SaaS)</p>
            <div className="text-3xl font-extrabold text-white mb-2">₹2,999</div>
            <div className="text-sm text-blue-400 font-medium mb-8">Per Month Retainer</div>
            <p className="text-sm text-zinc-400 mb-6">Target: Continuous B2B SaaS startups & regular exporters.</p>
            <ul className="text-sm text-zinc-300 space-y-3 mb-8 flex-1 relative z-10">
              <li className="flex items-start font-medium text-white mb-2">All features from Tier 2, plus:</li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Always-on read-only automated billing gateway endpoints (Stripe, PayPal, Wise).
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Automated batch rollup engines for global micropayments under ₹10 Lakhs.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Continuous Consolidated Monthly Unified EDF dataset generation.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Direct mapping into the federal GST RFD-01 grid to un-trap ITC instantly.
              </li>
            </ul>
            <button className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition text-sm font-medium mt-auto relative z-10">
              Activate Trade OS Desk
            </button>
          </div>

          {/* Tier 4 */}
          <div className="bg-[#050505] border border-zinc-800 rounded-xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">🏢 Enterprise Custom</h3>
            <p className="text-xs font-mono text-zinc-600 mb-6 uppercase tracking-widest">(Infrastructure Scale)</p>
            <div className="text-3xl font-extrabold text-white mb-2">Custom</div>
            <div className="text-sm text-zinc-400 font-medium mb-8">Tailored Corporate Scale</div>
            <p className="text-sm text-zinc-500 mb-6">Target: High-volume manufacturing plants & multi-nationals.</p>
            <ul className="text-sm text-zinc-400 space-y-3 mb-8 flex-1">
              <li className="flex items-start font-medium text-white mb-2">All features from Tier 3, plus:</li>
              <li className="flex items-start">
                <span className="text-zinc-500 mr-2">✓</span>
                Dedicated server static egress proxy whitelisting profiles.
              </li>
              <li className="flex items-start">
                <span className="text-zinc-500 mr-2">✓</span>
                Custom API pipelines linking straight into enterprise software infrastructure (SAP, Oracle ERP).
              </li>
              <li className="flex items-start">
                <span className="text-zinc-500 mr-2">✓</span>
                24/7 dedicated trade compliance advisory cell support.
              </li>
            </ul>
            <button className="block w-full text-center px-4 py-3 bg-white text-black rounded hover:bg-zinc-200 transition text-sm font-bold mt-auto">
              Contact Systems Architect
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE LENDING MULTIPLIER (The Core Feature Highlight) */}
      <section id="lending" className="py-24 border-y border-zinc-900 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 blur-[100px] pointer-events-none rounded-full"></div>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="text-xs font-mono text-emerald-500 mb-4 uppercase tracking-widest border border-emerald-900/50 bg-emerald-950/30 inline-block px-3 py-1 rounded">The Lending Multiplier</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Introducing the <span className="text-emerald-400">"Get Paid Now"</span> Switch. Zero-Risk Capital Factor Allocation.</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Supply-chain factoring is broken because banks are blind to logistics reality. ExporoAI holds complete data symmetry. By pairing <strong>Physical Proof</strong> (live terminal gate-in records verified via ULIP webhooks) natively with <strong>Financial Compliance Proof</strong> (FIRC records matched to the dollar under a single corporate PAN), we build fraud risk profiles that hit absolute zero.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Flip the native dashboard switch to stream this secure profile directly to partner funding pools—unlocking an instant 80% working capital advance within minutes while we clip an automated spread with zero balance-sheet liability for your firm.
            </p>
          </div>
          <div className="p-8 border border-zinc-800 bg-zinc-900/50 rounded-2xl flex flex-col items-center justify-center min-h-[300px] relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-2xl"></div>
            <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                <span className="text-sm text-zinc-400">Invoice Factoring</span>
                <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-1 rounded font-mono border border-emerald-900/50">Risk: 0.00%</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Get Paid Now</span>
                {/* Visual Toggle Switch */}
                <div className="w-12 h-6 bg-emerald-500 rounded-full p-1 cursor-pointer shadow-lg shadow-emerald-500/20">
                  <div className="w-4 h-4 bg-white rounded-full translate-x-6 shadow"></div>
                </div>
              </div>
              <p className="text-xs text-zinc-500">Funds route to corporate PAN in ~4 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE AIRTIGHT SECURITY COMPLIANCE DEEP DIVE */}
      <section id="security" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Airtight Security & Compliance Deep Dive</h2>
          <p className="text-zinc-400">Built to withstand multi-year central bank audit audits.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 border border-zinc-900 rounded-xl bg-zinc-900/20 flex items-start space-x-6">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-2xl flex-shrink-0 border border-zinc-700">🔒</div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">6-Year Immutable Vault</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                All processed customs configurations, bank declaration handshakes, and ledger balances are committed to an append-only cloud storage model in WORM (Write Once, Read Many) mode to shield your entity against multi-year central bank audits.
              </p>
            </div>
          </div>
          <div className="p-8 border border-zinc-900 rounded-xl bg-zinc-900/20 flex items-start space-x-6">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-2xl flex-shrink-0 border border-zinc-700">🛡️</div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">CERT-In Certified Security Boundaries</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Airtight production database systems protected by strict, multi-tenant row-level authorization scripts (Supabase RLS), isolating competing company records natively. Data leakage is cryptographically impossible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-950 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-zinc-950 via-emerald-500/50 to-zinc-950"></div>
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
           <h2 className="text-4xl font-bold text-white mb-6">Ready to Protect Your Roster From EDPMS Delinquency Lists?</h2>
           <p className="text-zinc-400 mb-8 max-w-2xl mx-auto text-lg">
             Join thousands of forward-thinking Indian exporters, Chartered Accountants, and trade specialists running their infrastructure on an AI-native operating layer.
           </p>
           <Link href="/auth" className="px-8 py-4 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/50 inline-block border border-emerald-500/20">
              Initialize Your Workspace Now
           </Link>
         </div>
      </section>

      {/* Professional Footer */}
      <footer className="border-t border-zinc-900 bg-[#050505] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
             <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent mb-4 inline-block">
              EXPORO<span className="text-emerald-500">AI</span>
            </span>
            <p className="text-zinc-500 text-sm max-w-xs mb-6">
              The AI-Native Trade Desk Operating System for modern Indian exporters, CHAs, and CAs. Secure Vertical Architecture. Connected Natively to India Stack DPI.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons (Placeholders) */}
              <a href="#" className="text-zinc-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
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
              <li><Link href="#workflows" className="text-zinc-400 hover:text-white text-sm transition">Goods Desk</Link></li>
              <li><Link href="#workflows" className="text-zinc-400 hover:text-white text-sm transition">Services Desk</Link></li>
              <li><Link href="#pricing" className="text-zinc-400 hover:text-white text-sm transition">Pricing</Link></li>
              <li><Link href="#lending" className="text-zinc-400 hover:text-white text-sm transition">Capital Factor</Link></li>
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
            © {new Date().getFullYear()} EXPOROAI 2026. All rights reserved. Not affiliated with ICEGATE or FEMA.
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
