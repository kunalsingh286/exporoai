"use client";

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ShieldCheck, Zap, Server, Code2, Play, AlertCircle, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

type WorkspaceMode = 'PHYSICAL_GOODS' | 'INTANGIBLE_SERVICES';
type PipelineStatus = 'PARSING' | 'READY_FOR_REVIEW' | 'SCHEMA_COMPILED';

export default function TerminalWorkspace() {
  const supabase = createClient();
  const [workspace, setWorkspace] = useState<WorkspaceMode>('PHYSICAL_GOODS');
  const [status, setStatus] = useState<PipelineStatus>('PARSING');

  // Paywall State
  const [isPaywallActive, setIsPaywallActive] = useState(false);
  const [utrReference, setUtrReference] = useState("");
  const [isUtrSubmitted, setIsUtrSubmitted] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  // Simulated AI Output Form State
  const [formData, setFormData] = useState({
    description: "Personal computers (laptops)",
    invoice_value: "45000",
    currency: "USD",
    carton_quantity: "150",
    net_weight_kg: "450.5",
    hs_code: "84713010",
    shipping_bill_no: "SB-998234-IN",
    remittance_amount: "45000",
    banking_reference: "FIRC-00921"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus('READY_FOR_REVIEW');
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'PARSING':
        return { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: <Zap className="w-4 h-4 animate-pulse" />, text: 'PARSING' };
      case 'READY_FOR_REVIEW':
        return { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: <ShieldCheck className="w-4 h-4" />, text: 'READY FOR REVIEW' };
      case 'SCHEMA_COMPILED':
        return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: <CheckCircle2 className="w-4 h-4" />, text: 'SCHEMA COMPILED' };
    }
  };

  const activeStatus = getStatusConfig();

  // Dynamic Schema Generation based on Workspace and Form Data
  const generateSchema = () => {
    if (workspace === 'PHYSICAL_GOODS') {
      return {
        SB_CACHE01: {
          header: {
            version: "2.0",
            timestamp: new Date().toISOString(),
            status: status
          },
          cargo_details: {
            hs_code: formData.hs_code,
            item_description: formData.description,
            package_qty: parseInt(formData.carton_quantity) || 0,
            net_weight_kgs: parseFloat(formData.net_weight_kg) || 0,
            valuation: {
              value: parseFloat(formData.invoice_value) || 0,
              currency: formData.currency
            }
          }
        }
      };
    } else {
      return {
        UNIFIED_EDF: {
          header: {
            version: "1.1",
            timestamp: new Date().toISOString(),
            status: status
          },
          remittance_details: {
            invoice_value: parseFloat(formData.invoice_value) || 0,
            received_amount: parseFloat(formData.remittance_amount) || 0,
            firc_reference: formData.banking_reference,
            currency: formData.currency
          }
        }
      };
    }
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    const schema = generateSchema();

    try {
      const response = await fetch('/api/trade/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schema)
      });

      if (response.status === 402) {
        // Ironclad wrapper engages the paywall mask
        setIsPaywallActive(true);
      } else if (response.ok) {
        setStatus('SCHEMA_COMPILED');
        // Handle successful download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schema_compiled.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("An error occurred during compilation.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleUtrSubmit = async () => {
    if (utrReference.length !== 12) {
      alert("UTR must be exactly 12 digits.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.app_metadata?.organization_id) {
        alert("User session invalid.");
        return;
    }

    const { error } = await supabase
      .from('payment_verifications')
      .insert({
        organization_id: user.app_metadata.organization_id,
        utr_reference: utrReference
      });

    if (!error) {
      setIsUtrSubmitted(true);
    } else {
      alert(`Failed to submit UTR: ${error.message}`);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B0B0F] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative">
      
      {/* 402 PAYWALL MASK */}
      <AnimatePresence>
        {isPaywallActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#0B0B0F]/60 backdrop-blur-md"
          >
            <div className="bg-[#0F0F13] border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-[60px] pointer-events-none" />

              {!isUtrSubmitted ? (
                <>
                  <div className="flex items-center gap-3 mb-6 text-red-400">
                    <AlertCircle className="w-8 h-8" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Compliance Balance Exhausted</h2>
                  </div>
                  
                  <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-black/50 p-4 flex justify-center">
                    <img src="/upi-qr.png" alt="UPI QR Code" className="w-48 h-48 rounded-lg shadow-lg" />
                  </div>

                  <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                    Please allow up to 60 minutes for your credits to reflect while our admin verifies the UPI UTR reference.
                  </p>

                  <div className="flex gap-3">
                    <input 
                      type="text"
                      maxLength={12}
                      placeholder="Enter 12-Digit UTR"
                      value={utrReference}
                      onChange={(e) => setUtrReference(e.target.value.replace(/[^0-9]/g, ''))}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                    />
                    <button 
                      onClick={handleUtrSubmit}
                      disabled={utrReference.length !== 12}
                      className="flex items-center justify-center gap-2 px-6 bg-red-500 hover:bg-red-400 disabled:bg-red-500/20 disabled:text-red-500/50 text-white font-bold rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mb-2">UTR Submitted</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    We have queued your payment reference for verification. Your workspace will unlock once credits are dispatched.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex flex-col h-full w-full transition-all duration-700 ${isPaywallActive ? 'blur-md opacity-40 pointer-events-none' : ''}`}>
        
        {/* 1. TOP BAR: Workspace Switching & Status */}
        <header className="h-16 shrink-0 border-b border-white/10 flex items-center justify-between px-6 bg-white/[0.02] backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h1 className="font-bold text-lg tracking-tight text-white">ExporoAI Terminal</h1>
            </div>
            
            <div className="h-8 w-[1px] bg-white/10" />
            
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setWorkspace('PHYSICAL_GOODS')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${workspace === 'PHYSICAL_GOODS' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Physical Goods
              </button>
              <button 
                onClick={() => setWorkspace('INTANGIBLE_SERVICES')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${workspace === 'INTANGIBLE_SERVICES' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Financial Services
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.div 
                key={status}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${activeStatus.bg} ${activeStatus.border} ${activeStatus.color}`}
              >
                {activeStatus.icon}
                <span className="text-xs font-bold tracking-wider">{activeStatus.text}</span>
              </motion.div>
            </AnimatePresence>

            <button 
              onClick={handleCompile}
              disabled={status === 'SCHEMA_COMPILED' || isCompiling}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/20 disabled:text-emerald-500/50 text-emerald-950 font-bold rounded-lg transition-colors text-sm"
            >
              {isCompiling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              COMPILE SCHEMA
            </button>
          </div>
        </header>

        {/* 2. SPLIT SCREEN WORKSPACE */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* LEFT WINDOW: Ground Reality Context (Document Viewer) */}
          <div className="w-1/2 h-full border-r border-white/10 bg-[#0B0B0F]/50 flex flex-col relative overflow-y-auto">
            <div className="sticky top-0 p-4 border-b border-white/5 bg-[#0B0B0F]/80 backdrop-blur-sm z-10 flex justify-between items-center">
              <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Ground Reality Context</h2>
              <span className="text-xs font-mono text-zinc-600">INPUT_SOURCE_ASSET</span>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-6">
              <div className="border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-white">Drop commercial asset here</p>
                <p className="text-xs text-zinc-500 mt-2">Supports PDF, JPEG, PNG (Max 50MB)</p>
              </div>

              {/* Simulated Document View */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0B0F] pointer-events-none" />
                <div className="font-mono text-xs text-zinc-600 space-y-4 opacity-50">
                  <p>INVOICE NO: INV-2026-9081</p>
                  <p>DATE: 2026-06-21</p>
                  <br/>
                  <p>CONSIGNEE: TECH IMPORTS LLC, NY, USA</p>
                  <p>SHIPPER: EXPOROAI V1 TEST ENTITY, MUMBAI, INDIA</p>
                  <br/>
                  <div className="h-px w-full bg-white/5 my-4" />
                  <div className="grid grid-cols-4 gap-4 text-zinc-500">
                    <span>ITEM</span>
                    <span>QTY</span>
                    <span>WEIGHT</span>
                    <span>VALUE</span>
                    <span>Personal computers</span>
                    <span>150 CTN</span>
                    <span>450.5 KG</span>
                    <span>$45,000.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT WINDOW: Interactive Correction Matrix */}
          <div className="w-1/2 h-full flex flex-col overflow-y-auto bg-[#0F0F13]">
            <div className="sticky top-0 p-4 border-b border-white/5 bg-[#0F0F13]/80 backdrop-blur-sm z-10 flex justify-between items-center">
              <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Correction Matrix</h2>
              <span className="text-xs font-mono text-emerald-500/50">AI_PREDICTIONS_ACTIVE</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-zinc-400">ITEM DESCRIPTION</label>
                  <input 
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                  />
                </div>

                {workspace === 'PHYSICAL_GOODS' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 flex items-center justify-between">
                        HS TARIFF CODE
                        <span className="text-[10px] text-emerald-500">Matched: 98%</span>
                      </label>
                      <input 
                        type="text"
                        name="hs_code"
                        value={formData.hs_code}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-emerald-500/30 rounded-lg px-4 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">SHIPPING BILL NO</label>
                      <input 
                        type="text"
                        name="shipping_bill_no"
                        value={formData.shipping_bill_no}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">CARTON QTY</label>
                      <input 
                        type="text"
                        name="carton_quantity"
                        value={formData.carton_quantity}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">NET WEIGHT (KG)</label>
                      <input 
                        type="text"
                        name="net_weight_kg"
                        value={formData.net_weight_kg}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      />
                    </div>
                  </>
                )}

                {workspace === 'INTANGIBLE_SERVICES' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">FIRC REFERENCE</label>
                      <input 
                        type="text"
                        name="banking_reference"
                        value={formData.banking_reference}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">REMITTANCE RECEIVED</label>
                      <input 
                        type="text"
                        name="remittance_amount"
                        value={formData.remittance_amount}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">INVOICE VALUE</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 font-mono text-center"
                    />
                    <input 
                      type="text"
                      name="invoice_value"
                      value={formData.invoice_value}
                      onChange={handleInputChange}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

        {/* 3. FOOTER: Live Schema Serialization Drawer */}
        <footer className="h-64 shrink-0 border-t border-white/10 bg-[#060608] flex flex-col relative">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Live JSON Serialization</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-500/50">OUTPUT_STREAM_ACTIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <pre className="font-mono text-xs text-emerald-400/80 leading-relaxed">
              {JSON.stringify(generateSchema(), null, 2)}
            </pre>
          </div>
        </footer>
      </div>
    </div>
  );
}
