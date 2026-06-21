"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Box, FileText, Activity, Network, ArrowRightCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const [activeDiagram, setActiveDiagram] = useState<'V1' | 'V2'>('V1');

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      
      {/* 1. THE HERO COMPONENT */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8"
        >
          <Activity className="w-4 h-4" />
          <span>System Status: Fully Operational</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.1]"
        >
          The AI-Native Vertical OS for Indian Trade.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-xl text-zinc-400 max-w-3xl leading-relaxed"
        >
          Pre-validate unstructured factory paperwork into verified government schemas in 60 seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <Link 
            href="/dashboard"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-lg rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.6)]"
          >
            Launch Workspace
            <span className="text-emerald-900/70 font-medium text-sm">(20 Free Credits — No Card Required)</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* 2. DUAL-FLOW VALUE MATRIX */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Enterprise Schema Compilation</h2>
          <p className="mt-4 text-zinc-400">Two highly specialized AI engines. One unified terminal.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Card A: Physical Flow Engine */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-10 hover:border-emerald-500/30 transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Box className="w-32 h-32 text-emerald-500" />
            </div>
            
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20">
              <Box className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">The Physical Flow Engine</h3>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Instantly reads unstructured factory packing lists and handwritten commercial invoices. Automatically resolves item descriptions to exact 8-digit HS Tariff Codes and pre-compiles packing specs into the strict ICEGATE SB_CACHE01 JSON layout, drastically reducing port clearance delays.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Zero-shot HS Code resolution
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Native ICEGATE JSON formatting
              </li>
            </ul>
          </motion.div>

          {/* Card B: Intangible Flow Engine */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-10 hover:border-blue-500/30 transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText className="w-32 h-32 text-blue-500" />
            </div>
            
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20">
              <FileText className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">The Intangible Flow Engine</h3>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Secures your audit trail by aligning global SaaS invoices and service billing rows dollar-for-dollar against inward wire remits. Automatically flags any intermediary banking fee spreads that deviate beyond the strict ±0.5% FEMA regulatory boundary before compiling the Unified EDF object.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                Automated ±0.5% FEMA variance tracking
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                FIRC linkage and Unified EDF readiness
              </li>
            </ul>
          </motion.div>

        </div>
      </section>

      {/* 3. LIVE TELEMETRY SANDBOX */}
      <section className="py-24 px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        
        <div className="bg-[#0A0A0F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Header & Toggle */}
          <div className="p-6 border-b border-white/5 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Network className="w-5 h-5 text-zinc-400" />
              <h2 className="font-bold tracking-widest text-zinc-300 uppercase text-sm">Direct Public Infrastructure Pipelines (Future Architecture)</h2>
            </div>

            <div className="flex p-1 bg-black/50 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveDiagram('V1')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeDiagram === 'V1' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                V1 Active Workspace
              </button>
              <button
                onClick={() => setActiveDiagram('V2')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeDiagram === 'V2' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                V2 Automated Rail
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold uppercase">Beta</span>
              </button>
            </div>
          </div>

          {/* Diagram Area */}
          <div className="h-64 sm:h-80 bg-[#050508] relative overflow-hidden flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {activeDiagram === 'V1' ? (
                <motion.div 
                  key="v1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center"
                >
                  <div className="w-32 p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                    <span className="block text-xs text-zinc-500 mb-2">INPUT</span>
                    <span className="font-bold text-white">Raw Invoices</span>
                  </div>
                  <ArrowRightCircle className="w-6 h-6 text-zinc-600" />
                  <div className="w-48 p-4 border border-emerald-500/30 rounded-xl bg-emerald-500/10 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                    <span className="block text-xs text-emerald-500 mb-2">ExporoAI Terminal</span>
                    <span className="font-bold text-white">Human Validation</span>
                  </div>
                  <ArrowRightCircle className="w-6 h-6 text-zinc-600" />
                  <div className="w-32 p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                    <span className="block text-xs text-zinc-500 mb-2">OUTPUT</span>
                    <span className="font-bold text-white">ICEGATE JSON</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="v2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center"
                >
                  <div className="w-32 p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                    <span className="block text-xs text-zinc-500 mb-2">INPUT</span>
                    <span className="font-bold text-white">ERP API Feeds</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 border-t-2 border-dashed border-emerald-500/50 w-full top-1/2 -z-10" />
                    <div className="flex gap-4">
                      <div className="w-40 p-4 border border-emerald-500/50 rounded-xl bg-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]">
                        <span className="block text-xs text-emerald-400 mb-2">ExporoAI Engine</span>
                        <span className="font-bold text-white">Autonomous Schema Generation</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRightCircle className="w-6 h-6 text-emerald-500" />
                  <div className="flex flex-col gap-3">
                    <div className="w-40 py-2 px-4 border border-blue-500/30 rounded-lg bg-blue-500/10">
                      <span className="font-bold text-xs text-blue-400">ICEGATE Nodes</span>
                    </div>
                    <div className="w-40 py-2 px-4 border border-purple-500/30 rounded-lg bg-purple-500/10">
                      <span className="font-bold text-xs text-purple-400">ULIP Transport Ports</span>
                    </div>
                    <div className="w-40 py-2 px-4 border border-orange-500/30 rounded-lg bg-orange-500/10">
                      <span className="font-bold text-xs text-orange-400">AD Banking Queues</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Strategic Copy */}
          <div className="p-8 border-t border-white/5 bg-black/40">
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              <strong className="text-white">ExporoAI is pre-architected to integrate with next-generation Indian DPI frameworks.</strong> While V1 operates as an Assisted SaaS Wedge producing verified schema files for single-click human portal uploads, our system contains direct hooks optimized for automated machine execution. Selected enterprises can request early whitelisting for upcoming V2 modules, linking customs clearances directly to live port telemetry and core Authorized Dealer banking mainframe API queues.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}
