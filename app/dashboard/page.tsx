'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileId, setProfileId] = useState<string | null>(null);
  const [firmName, setFirmName] = useState('Workspace');
  const [userRole, setUserRole] = useState<'CHA' | 'CA'>('CHA');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New editor states
  const [editorText, setEditorText] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Premium UI states
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      
      setProfileId(user.id);
      
      // Grab metadata we pushed during auth
      const role = (user.user_metadata?.role as 'CHA' | 'CA') || 'CHA';
      const org = user.user_metadata?.orgName || 'Workspace';
      
      setUserRole(role);
      setFirmName(org);
      setActiveTab(role === 'CA' ? 'services' : 'goods');
      
      fetchTransactions(user.id, role);
    };

    fetchSession();

    const interval = setInterval(() => {
      if (profileId) {
        fetchTransactions(profileId, userRole);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router, profileId, userRole]);

  useEffect(() => {
    if (selectedTxn) {
      setEditorText(JSON.stringify(selectedTxn.compiled_government_payload, null, 2));
    }
  }, [selectedTxn]);

  const fetchTransactions = async (id: string, role: string) => {
    const flowTypeFilter = role === 'CA' ? 'SERVICES_INTANGIBLE' : 'GOODS_PHYSICAL';
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('profile_id', id)
      .eq('flow_type', flowTypeFilter)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setTransactions(data);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !profileId) return;

    const flowType = activeTab === 'services' ? 'SERVICES_INTANGIBLE' : 'GOODS_PHYSICAL';
    
    if (flowType === 'SERVICES_INTANGIBLE' && files.length < 2) {
      showToast('Reconciliation requires at least 2 contrasting documents (Invoice + SWIFT/FIRC).', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('profileId', profileId);
    formData.append('flowType', flowType);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/trade/process', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        showToast('Upload failed: ' + err.error, 'error');
      } else {
        showToast('Documents ingested successfully. AI extraction initiated.');
        fetchTransactions(profileId, userRole);
      }
    } catch (e) {
      showToast('Upload exception occurred.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveOverrides = async () => {
    try {
      setIsSaving(true);
      const parsed = JSON.parse(editorText);
      
      let newStatus = selectedTxn.status;
      if (selectedTxn.flow_type === 'SERVICES_INTANGIBLE' && !parsed.reconciliation_analytics?.spread_exception_triggered) {
        newStatus = 'SCHEMA_COMPILED';
      }

      await supabase
        .from('transactions')
        .update({ compiled_government_payload: parsed, status: newStatus })
        .eq('id', selectedTxn.id);

      setSelectedTxn({ ...selectedTxn, compiled_government_payload: parsed, status: newStatus });
      showToast('Schema overrides saved to ledger.');
      fetchTransactions(profileId as string, userRole);
    } catch (e) {
      showToast("Invalid JSON structure. Please fix syntax errors before saving.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadJson = async (filename: string, transactionId: string) => {
    try {
      // Backend handles vault integration and serialization securely
      window.location.href = `/api/trade/export?id=${transactionId}`;
      showToast(`Export route triggered for trace ${transactionId.split('-')[0]}.`);
    } catch (e) {
      showToast("Download stream initialization failed.", "error");
    }
  };

  const downloadPdf = async (filename: string, transactionId: string) => {
    try {
      const parsed = JSON.parse(editorText);
      const doc = new jsPDF();
      doc.setFontSize(10);
      const textLines = doc.splitTextToSize(JSON.stringify(parsed, null, 2), 180);
      doc.text(textLines, 10, 10);
      doc.save(filename);
      showToast(`${filename} verified and downloaded.`);
    } catch (e) {
      showToast("Invalid JSON format in editor. Cannot export.", "error");
    }
  };

  const downloadBankArrayXlsx = async (filename: string, transactionId: string) => {
    try {
      const parsed = JSON.parse(editorText);

      if (!parsed.edf_header) {
        showToast("Services Schema Payload missing. Cannot export Bank Array.", "error");
        return;
      }

      const inv = parsed.invoice_record || {};
      const bank = parsed.bank_remittance_firc_node || {};
      const analytics = parsed.reconciliation_analytics || {};

      const edpmsData = [
        {
          "Invoice": inv.invoice_number || "",
          "Date": inv.invoice_date || "",
          "Bank Reference": bank.inward_remittance_reference_number || "",
          "Purpose Code": inv.purpose_code_rbi || "",
          "Reconciled Amount": parseFloat(Number(bank.gross_amount_received_foreign_currency || 0).toFixed(2)),
          "Variance": parseFloat(Number(analytics.calculated_variance_percentage || 0).toFixed(3))
        }
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(edpmsData);
      XLSX.utils.book_append_sheet(wb, ws, "AD Bank Tokens");
      XLSX.writeFile(wb, filename);
      showToast(`${filename} generated and downloaded.`);
    } catch (e) {
      showToast("Error generating Bank Array workbook.", "error");
    }
  };

  const downloadGstRfd01Xlsx = async (filename: string, transactionId: string) => {
    try {
      const parsed = JSON.parse(editorText);

      if (!parsed.edf_header) {
        showToast("Services Schema Payload missing. Cannot export GST Sheet.", "error");
        return;
      }

      const inv = parsed.invoice_record || {};
      const bank = parsed.bank_remittance_firc_node || {};
      const analytics = parsed.reconciliation_analytics || {};
      const compliance = parsed.compliance_outputs || {};

      const rfd01Data = [
        {
          "Invoice Number": inv.invoice_number,
          "Contracted Currency": inv.contracted_currency,
          "Invoice USD": parseFloat(Number(inv.invoice_value_foreign_currency || 0).toFixed(2)),
          "FIRC Number": bank.inward_remittance_reference_number,
          "Received USD": parseFloat(Number(bank.gross_amount_received_foreign_currency || 0).toFixed(2)),
          "Variance %": parseFloat(Number(analytics.calculated_variance_percentage || 0).toFixed(3)),
          "Spread Exception": analytics.spread_exception_triggered,
          "GST Ready": compliance.gst_rfd01_payload_ready
        }
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rfd01Data);
      XLSX.utils.book_append_sheet(wb, ws, "GST RFD-01 Matrix");
      XLSX.writeFile(wb, filename);
      showToast(`${filename} generated and downloaded.`);
    } catch (e) {
      showToast("Error generating GST RFD-01 workbook.", "error");
    }
  };

  // Render Split-Pane Workspace if a transaction is selected
  if (selectedTxn) {
    const isException = selectedTxn.compiled_government_payload?.reconciliation_analytics?.spread_exception_triggered;

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col selection:bg-emerald-500/30">
        {/* Global Toast */}
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <div className={`px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border text-sm font-medium flex items-center space-x-2 ${toast.type === 'error' ? 'bg-red-950/80 border-red-900/50 text-red-200' : 'bg-emerald-950/80 border-emerald-900/50 text-emerald-200'}`}>
              <span>{toast.type === 'error' ? '⚠️' : '✓'}</span>
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        <header className="h-16 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-6 z-10 shadow-md">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedTxn(null)} className="group text-zinc-400 hover:text-white transition px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 text-sm flex items-center space-x-2">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Ledger</span>
            </button>
            <span className="font-mono text-sm text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded">Trace: {selectedTxn.id.split('-')[0]}</span>
          </div>
          <div className="flex items-center space-x-3">
            {selectedTxn.flow_type === 'GOODS_PHYSICAL' ? (
              <>
                <button onClick={() => downloadJson(`ICEGATE_CACHE01_${selectedTxn.id.split('-')[0]}.json`, selectedTxn.id)} className="px-4 py-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-emerald-900/20 border border-emerald-400/20 flex items-center space-x-2">
                  <span>↓</span><span>ICEGATE JSON</span>
                </button>
                <button onClick={() => downloadPdf(`ICEGATE_CACHE01_${selectedTxn.id.split('-')[0]}.pdf`, selectedTxn.id)} className="px-4 py-2 bg-gradient-to-b from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-white font-medium rounded-lg text-sm transition border border-zinc-700 flex items-center space-x-2">
                  <span>📄</span><span>Export PDF</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => downloadBankArrayXlsx(`AD_BANK_ARRAY_${selectedTxn.id.split('-')[0]}.xlsx`, selectedTxn.id)} 
                  disabled={selectedTxn.status === 'READY_FOR_REVIEW'}
                  className="px-4 py-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-blue-900/20 border border-blue-400/20 flex items-center space-x-2"
                >
                  <span>🏦</span><span>AD Bank Array (.xlsx)</span>
                </button>
                <button 
                  onClick={() => downloadGstRfd01Xlsx(`GST_RFD01_MATRIX_${selectedTxn.id.split('-')[0]}.xlsx`, selectedTxn.id)} 
                  disabled={selectedTxn.status === 'READY_FOR_REVIEW'}
                  className="px-4 py-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-emerald-900/20 border border-emerald-400/20 flex items-center space-x-2"
                >
                  <span>🏛️</span><span>GST RFD-01 Sheet (.xlsx)</span>
                </button>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Source Context */}
          <div className="w-1/2 border-r border-zinc-900 bg-zinc-950 flex flex-col relative">
            <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none z-10 flex justify-between items-center bg-gradient-to-b from-zinc-950 to-transparent">
              <h3 className="text-lg font-bold text-white drop-shadow-md">Original Assets</h3>
              <span className="bg-zinc-900/80 border border-zinc-700/50 text-zinc-300 text-[10px] uppercase px-3 py-1.5 rounded-full font-mono shadow-xl backdrop-blur-md">
                {selectedTxn.raw_payload_context?.total_ingested_files || 1} File(s)
              </span>
            </div>
            <div className="flex-1 bg-zinc-950 overflow-hidden relative">
              {selectedTxn.raw_payload_context?.files && selectedTxn.raw_payload_context.files.length > 0 ? (
                <div className="w-full h-full overflow-auto p-6 pt-24 space-y-8">
                  {selectedTxn.raw_payload_context.files.map((f: any, i: number) => (
                    <div key={i} className="group">
                      <div className="text-xs text-zinc-500 font-mono mb-3 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                        <span>{f.name}</span>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-zinc-800/50 bg-zinc-900/20 shadow-2xl transition-all duration-500 group-hover:border-zinc-700/50 group-hover:shadow-emerald-900/5">
                        {f.type === 'application/pdf' ? (
                          <iframe src={f.url} className="w-full h-[600px] bg-white" />
                        ) : f.type.startsWith('image/') ? (
                          <img src={f.url} className="w-full object-contain" alt={f.name} />
                        ) : (
                          <div className="p-8 text-center text-zinc-500 text-xs font-mono break-all">
                            No visual preview for {f.type}.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-2xl opacity-50">📄</div>
                    <div className="text-zinc-600 text-sm max-w-xs mx-auto">
                      Source document viewer unavailable for this legacy record.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Parsed Schema Verification */}
          <div className="w-1/2 bg-zinc-950 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-bold text-white">Compiled Matrix</h3>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase px-2 py-0.5 rounded font-bold tracking-wider animate-pulse">Live</span>
              </div>
              <div className="flex items-center space-x-3">
                {isException && (
                  <span className="px-3 py-1.5 bg-red-950 border border-red-900/50 text-red-400 text-[10px] uppercase tracking-wider font-bold rounded-lg flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    <span>Variance Exception</span>
                  </span>
                )}
                <button
                  onClick={handleSaveOverrides}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-lg text-xs transition shadow-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  <span>{isSaving ? "Saving..." : "Save Edits"}</span>
                </button>
              </div>
            </div>
            
            {selectedTxn.flow_type === 'SERVICES_INTANGIBLE' ? (
              <div className="flex-1 bg-[#0a0a0a] border border-zinc-800/80 rounded-xl overflow-auto shadow-2xl relative p-6">
                <h4 className="text-zinc-400 font-mono text-xs mb-6 uppercase tracking-wider border-b border-zinc-800 pb-2">Financial Reconciliation Ledger</h4>
                
                {(() => {
                  try {
                    const data = JSON.parse(editorText);
                    const updateField = (path: string[], value: any) => {
                      const newData = { ...data };
                      let current = newData;
                      for (let i = 0; i < path.length - 1; i++) {
                        current = current[path[i]];
                      }
                      current[path[path.length - 1]] = value;
                      
                      // Auto-recalculate variance if invoice or wire changes
                      if (path.includes('invoice_value_foreign_currency') || path.includes('gross_amount_received_foreign_currency') || path.includes('intermediary_bank_deductions')) {
                        const invVal = newData.invoice_record?.invoice_value_foreign_currency || 0;
                        const recvVal = newData.bank_remittance_firc_node?.gross_amount_received_foreign_currency || 0;
                        const feeVal = newData.bank_remittance_firc_node?.intermediary_bank_deductions || 0;
                        
                        let pct = 0;
                        if (invVal > 0) {
                          pct = (((recvVal + feeVal) - invVal) / invVal) * 100;
                        }
                        
                        const exc = Math.abs(pct) > 0.5 && invVal >= 12000;
                        
                        if (!newData.reconciliation_analytics) newData.reconciliation_analytics = {};
                        newData.reconciliation_analytics.calculated_variance_percentage = parseFloat(pct.toFixed(3));
                        newData.reconciliation_analytics.spread_exception_triggered = exc;
                        
                        if (!newData.compliance_outputs) newData.compliance_outputs = {};
                        newData.compliance_outputs.gst_rfd01_payload_ready = !exc;
                        newData.compliance_outputs.edpms_token_closure_status = exc ? 'PENDING_VARIANCE_APPROVAL' : 'AUTO_CLOSED';
                      }
                      
                      setEditorText(JSON.stringify(newData, null, 2));
                    };

                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase text-zinc-500 mb-1">Invoice Number</label>
                            <input 
                              type="text" 
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                              value={data.invoice_record?.invoice_number || ''} 
                              onChange={(e) => updateField(['invoice_record', 'invoice_number'], e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-zinc-500 mb-1">Invoice USD Value</label>
                            <input 
                              type="number" 
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                              value={data.invoice_record?.invoice_value_foreign_currency || 0} 
                              onChange={(e) => updateField(['invoice_record', 'invoice_value_foreign_currency'], parseFloat(e.target.value))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase text-zinc-500 mb-1">FIRC UTR Reference</label>
                            <input 
                              type="text" 
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                              value={data.bank_remittance_firc_node?.inward_remittance_reference_number || ''} 
                              onChange={(e) => updateField(['bank_remittance_firc_node', 'inward_remittance_reference_number'], e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-zinc-500 mb-1">Received Wire USD</label>
                            <input 
                              type="number" 
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                              value={data.bank_remittance_firc_node?.gross_amount_received_foreign_currency || 0} 
                              onChange={(e) => updateField(['bank_remittance_firc_node', 'gross_amount_received_foreign_currency'], parseFloat(e.target.value))}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-emerald-500 font-bold mb-1">Bank Fee Deductions</label>
                            <input 
                              type="number" 
                              className="w-full bg-emerald-950/20 border border-emerald-900/50 rounded px-3 py-2 text-sm text-emerald-100 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner" 
                              value={data.bank_remittance_firc_node?.intermediary_bank_deductions || 0} 
                              onChange={(e) => updateField(['bank_remittance_firc_node', 'intermediary_bank_deductions'], parseFloat(e.target.value))}
                            />
                          </div>
                        </div>

                        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                          <h5 className="text-[10px] uppercase text-zinc-500 mb-3">Reconciliation Analytics</h5>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-[10px] text-zinc-600">Variance %</div>
                              <div className={`text-lg font-mono ${data.reconciliation_analytics?.spread_exception_triggered ? 'text-red-400' : 'text-emerald-400'}`}>
                                {data.reconciliation_analytics?.calculated_variance_percentage || 0}%
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-zinc-600">GST RFD-01 Status</div>
                              <div className={`text-xs font-bold mt-1 ${data.compliance_outputs?.gst_rfd01_payload_ready ? 'text-emerald-400' : 'text-red-400'}`}>
                                {data.compliance_outputs?.gst_rfd01_payload_ready ? 'READY' : 'BLOCKED'}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-zinc-600">EDPMS Token</div>
                              <div className="text-xs font-bold mt-1 text-blue-400">
                                {data.compliance_outputs?.edpms_token_closure_status || 'PENDING'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return <div className="text-red-400 text-sm">Failed to render visual matrix (Invalid schema).</div>;
                  }
                })()}
              </div>
            ) : (
              <div className="flex-1 bg-[#0d0d0d] border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col shadow-2xl relative group">
                {/* Mac-Style Code Window */}
                <div className="h-8 bg-zinc-900/50 border-b border-zinc-800/50 flex items-center px-4 space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  <div className="mx-auto font-mono text-[10px] text-zinc-500 tracking-wider">payload.json</div>
                </div>
                <textarea
                  className="flex-1 w-full h-full bg-transparent text-emerald-400/90 font-mono text-[13px] leading-relaxed p-6 resize-none focus:outline-none selection:bg-emerald-500/30"
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  spellCheck="false"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex selection:bg-emerald-500/30">
      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
          <div className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-medium flex items-center space-x-3 ${toast.type === 'error' ? 'bg-red-950/90 border-red-900/50 text-red-200' : 'bg-zinc-900/90 border-zinc-700 text-white'}`}>
            <span className={toast.type === 'error' ? 'text-red-500' : 'text-emerald-500'}>{toast.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950/80 border-r border-zinc-900/80 flex flex-col justify-between backdrop-blur-xl relative z-20 h-full overflow-hidden hidden md:flex">
        <div>
          <div className="p-8 border-b border-zinc-900/50">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded flex items-center justify-center">
                <span className="text-black text-[10px] font-black tracking-tighter">AI</span>
              </div>
              <span>ExporoAI</span>
            </h2>
            <p className="text-zinc-500 text-xs font-mono break-all opacity-60">{profileId}</p>
          </div>
          <nav className="p-4 space-y-1.5 mt-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-zinc-900/80 text-white shadow-sm border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/30'}`}>
              <span className="text-lg opacity-80">⊞</span>
              <span>Overview</span>
            </button>
            {userRole === 'CHA' && (
              <button onClick={() => setActiveTab('goods')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'goods' ? 'bg-zinc-900/80 text-white shadow-sm border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/30'}`}>
                <span className="text-lg opacity-80">📦</span>
                <span>Physical Desk (CHA)</span>
              </button>
            )}
            {userRole === 'CA' && (
              <button onClick={() => setActiveTab('services')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'services' ? 'bg-zinc-900/80 text-white shadow-sm border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/30'}`}>
                <span className="text-lg opacity-80">💻</span>
                <span>Services Desk (CA)</span>
              </button>
            )}
            <button onClick={() => setActiveTab('vault')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'vault' ? 'bg-zinc-900/80 text-white shadow-sm border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/30'}`}>
              <span className="text-lg opacity-80">🛡️</span>
              <span>6-Year Vault</span>
            </button>
          </nav>
        </div>
        
        {/* V2 Vision Toggles */}
        <div className="mt-auto p-6 border-t border-zinc-900/50 bg-gradient-to-b from-transparent to-zinc-950">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-5 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mr-2"></span>
            V2 Network <span className="ml-1 opacity-50">(Locked)</span>
          </h4>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between opacity-40 cursor-not-allowed">
              <div>
                <div className="text-sm text-zinc-300 font-medium tracking-tight">Direct Auto-Submit</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">ICEGATE/RBI API Bridge</div>
              </div>
              <div className="w-8 h-4.5 bg-zinc-800 rounded-full flex items-center px-1">
                <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between opacity-40 cursor-not-allowed">
              <div>
                <div className="text-sm text-zinc-300 font-medium tracking-tight flex items-center gap-2">
                  Get Paid Now 
                  <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">NBFC</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Instant Invoice Factoring</div>
              </div>
              <div className="w-8 h-4.5 bg-zinc-800 rounded-full flex items-center px-1">
                <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a] relative">
        {/* Top Header */}
        <header className="h-20 border-b border-zinc-900/50 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-white tracking-tight">
            {userRole === 'CHA' ? 'Physical Desk Workspace' : 'Services Desk Workspace'}
          </h1>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-xs font-medium bg-emerald-950/30 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>V1 Active</span>
            </div>
            <button 
              onClick={async () => {
                const newRole = userRole === 'CA' ? 'CHA' : 'CA';
                await supabase.auth.updateUser({ data: { role: newRole } });
                setUserRole(newRole);
                setActiveTab(newRole === 'CA' ? 'services' : 'goods');
                showToast(`Switched workspace to ${newRole}`);
              }}
              className="text-zinc-400 hover:text-white transition text-xs font-mono bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded border border-zinc-800"
            >
              Switch to {userRole === 'CA' ? 'CHA' : 'CA'}
            </button>
            <button className="text-zinc-500 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-900">
              ⚙️
            </button>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} className="text-zinc-500 hover:text-red-400 transition text-sm font-medium">
              Sign Out
            </button>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-auto p-10 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto space-y-10 relative z-10">

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl hover:border-zinc-700/50 transition-colors">
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-3">Processing Queues</div>
                <div className="text-4xl font-bold text-white tracking-tight">
                  {transactions.filter(t => t.status === 'PARSING').length}
                </div>
                <div className="text-xs text-emerald-500/80 mt-3 font-medium flex items-center space-x-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                  <span>Live AI Ingestion</span>
                </div>
              </div>
              <div className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl hover:border-zinc-700/50 transition-colors">
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-3">Vaulted Artifacts</div>
                <div className="text-4xl font-bold text-white tracking-tight">
                  {transactions.filter(t => t.status === 'COMPILED' || t.status === 'SCHEMA_COMPILED' || t.status === 'READY_FOR_REVIEW').length}
                </div>
                <div className="text-xs text-zinc-400 mt-3 font-medium">
                  {userRole === 'CHA' ? '100% ICEGATE Ready' : 'Unified EDF / GST Ready'}
                </div>
              </div>
              <div className={`p-6 bg-zinc-900/20 rounded-2xl relative overflow-hidden group transition-all ${userRole === 'CA' ? 'hover:border-red-900/50 border border-zinc-800/50' : 'hover:border-blue-900/50 border border-zinc-800/50'}`}>
                <div className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl rounded-full transition-opacity opacity-20 group-hover:opacity-40 ${userRole === 'CA' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                <div className={`text-xs font-mono uppercase tracking-wider mb-3 ${userRole === 'CA' ? 'text-red-400/80' : 'text-blue-400/80'}`}>
                  {userRole === 'CHA' ? 'Tariff Classifications' : 'Variance Alerts'}
                </div>
                <div className="text-4xl font-bold text-white tracking-tight relative z-10">
                  {userRole === 'CA'
                    ? transactions.filter(t => t.compiled_government_payload?.reconciliation_analytics?.spread_exception_triggered).length
                    : transactions.filter(t => t.compiled_government_payload?.invoice_master?.[0]?.line_items?.length > 0).length}
                </div>
                <div className={`text-xs mt-3 font-medium relative z-10 ${userRole === 'CA' ? 'text-red-400/80' : 'text-blue-400/80'}`}>
                  {userRole === 'CHA' ? 'Auto-mapped via Vector DB' : 'Requires CA Sign-off'}
                </div>
              </div>
            </div>

            {/* Premium Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFileUpload(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 group cursor-pointer overflow-hidden
                ${isUploading 
                  ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] scale-[0.99]' 
                  : 'border-zinc-800 hover:border-emerald-500/30 bg-zinc-900/10 hover:bg-zinc-900/30'}`}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e.target.files)} className="hidden" multiple />
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className={`w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-xl transition-all duration-500 ${isUploading ? 'animate-bounce border-emerald-500/50 shadow-emerald-500/20' : 'group-hover:-translate-y-2 group-hover:shadow-2xl'}`}>
                  {isUploading ? '⚙️' : '📄'}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {isUploading ? 'Ingesting and Parsing via Super-Compiler...' : 'Smart Drop-Zone'}
                </h3>
                <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                  {userRole === 'CA'
                    ? 'Drag and drop unstructured commercial invoices, SWIFT MT103 logs, or FIRC PDFs here. The AI will instantly parse and validate them against FEMA boundaries.'
                    : 'Drag and drop unstructured commercial invoices, packing lists, or factory receipts here. The AI will extract fields and map 8-digit HS Tariff Codes automatically.'}
                </p>
                <button disabled={isUploading} className="px-8 py-3 bg-white text-zinc-950 font-bold rounded-xl text-sm hover:bg-zinc-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] disabled:opacity-50 disabled:shadow-none">
                  Select Files
                </button>
              </div>
            </div>

            {/* Transaction Ledger */}
            <div>
              <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center space-x-3">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                  <span>{userRole === 'CHA' ? 'ICEGATE Generation Ledger' : 'FEMA Reconciliation Ledger'}</span>
                </h3>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-zinc-800/50">Click row for Verification</span>
              </div>
              
              <div className="bg-[#0f0f0f] border border-zinc-800/60 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#0a0a0a] border-b border-zinc-800/60">
                    <tr>
                      <th className="px-8 py-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Trace ID</th>
                      <th className="px-8 py-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                      <th className="px-8 py-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Flow Type</th>
                      <th className="px-8 py-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Context</th>
                      <th className="px-8 py-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Status</th>
                      <th className="px-4 py-5 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
                              ⊘
                            </div>
                            <div className="text-zinc-300 font-medium text-base mb-1">No transactions yet</div>
                            <div className="text-zinc-500 text-sm">Upload your first document above to populate the ledger.</div>
                          </div>
                        </td>
                      </tr>
                    ) : transactions.map((txn, idx) => {
                      const clickable = txn.status === 'READY_FOR_REVIEW' || txn.status === 'COMPILED' || txn.status === 'SCHEMA_COMPILED';
                      return (
                        <tr
                          key={idx}
                          onClick={() => clickable ? setSelectedTxn(txn) : null}
                          className={`group transition-all duration-200 ${clickable ? 'hover:bg-zinc-800/30 cursor-pointer' : 'opacity-60 bg-zinc-950/20'}`}
                        >
                          <td className="px-8 py-5 font-mono text-zinc-400 text-xs">
                            {txn.id.split('-')[0]}
                          </td>
                          <td className="px-8 py-5 text-zinc-300">
                            {new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-[10px] font-mono tracking-wider bg-zinc-900 border border-zinc-700/50 px-2 py-1 rounded text-zinc-400 uppercase">
                              {txn.flow_type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-zinc-400 truncate max-w-[200px]">
                            {txn.raw_payload_context?.total_ingested_files || 1} file(s)
                          </td>
                          <td className="px-8 py-5 text-right">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border shadow-sm flex inline-flex items-center space-x-1.5 ml-auto w-max
                                ${txn.status === 'COMPILED' || txn.status === 'SCHEMA_COMPILED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                txn.status === 'READY_FOR_REVIEW' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                  txn.status === 'PARSING' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/10 border-red-500/20 text-red-400'
                              }`}>
                              {txn.status === 'PARSING' && <span className="w-1 h-1 rounded-full bg-yellow-400 animate-ping mr-1"></span>}
                              <span>{txn.status.replace(/_/g, ' ')}</span>
                            </span>
                          </td>
                          <td className="px-4 py-5 text-right text-zinc-600 group-hover:text-white transition-colors">
                            {clickable && '→'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
