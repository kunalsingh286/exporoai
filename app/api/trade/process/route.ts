import { NextRequest, NextResponse, after } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenAI } from '@google/genai';

// Mapped into server configurations via runtime env keys
const aiStudio = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized payload exception' }, { status: 401 });
    }

    const formData = await req.formData();
    const profileId = user.id; // Force RLS compliance
    const flowType = formData.get('flowType') as 'GOODS_PHYSICAL' | 'SERVICES_INTANGIBLE';
    const files = formData.getAll('files') as File[];

    if (!flowType || files.length === 0) {
      return NextResponse.json({ error: 'Missing mandatory payload properties' }, { status: 400 });
    }

    // CRITICAL FIX: Read all file buffers into memory BEFORE the response is sent and Next.js destroys the request context and temp files.
    const preloadedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        buffer: Buffer.from(await file.arrayBuffer())
      }))
    );

    // TASK 3.1: Initialize transaction entry inside Supabase to yield immediate execution row trace ID
    const { data: txn, error: txnInsertError } = await supabase
      .from('transactions')
      .insert({
        profile_id: profileId,
        flow_type: flowType,
        status: 'PARSING',
        raw_payload_context: { total_ingested_files: files.length }
      })
      .select()
      .single();

    if (txnInsertError || !txn) {
      console.error("Txn Insert Error: ", txnInsertError);
      return NextResponse.json({ error: 'Failed to provision tracking state row context: ' + (txnInsertError?.message || 'Unknown') }, { status: 500 });
    }

    // FLUSH IMMEDIATE 202 ACCEPTED CONTAINER PACKET BACK TO CLIENT
    // Bypasses synchronous request timeout limitations on cloud infrastructure
    const backgroundTaskLoop = async () => {
      try {
        let aggregatedTextContext = '';
        let fileDataUrls: { name: string, type: string, url: string, path: string }[] = [];

        for (const file of preloadedFiles) {
          const { buffer, type: fileType, name: fileName } = file;

          // Upload to Supabase Storage Bucket securely via RLS
          const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
          const filePath = `${profileId}/${safeName}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('trade-assets')
            .upload(filePath, buffer, {
              contentType: fileType,
              upsert: false
            });

          if (uploadError) {
            console.error('Storage Upload Error:', uploadError);
            throw new Error('Failed to persist unstructured asset to vault storage.');
          }

          // Generate a signed URL for Dashboard viewing without base64 bloat
          const { data: signedUrlData } = await supabase.storage
            .from('trade-assets')
            .createSignedUrl(uploadData.path, 60 * 60 * 24 * 7); // 7 days valid

          fileDataUrls.push({ 
            name: fileName, 
            type: fileType, 
            url: signedUrlData?.signedUrl || '', 
            path: uploadData.path 
          });

          aggregatedTextContext += `\n--- File Content Fragment: ${file.name} ---\n`;
          aggregatedTextContext += buffer.toString('utf-8'); // Read ASCII logs/text fields
        }

        // Target Output Instructions perfectly matched to schemas
        const targetOutputInstruction = flowType === 'GOODS_PHYSICAL'
          ? `{\n  "invoiceModel": [\n    {\n      "invoiceNumber": "",\n      "invoiceDate": "",\n      "purchaseOrderNumber": "",\n      "termsOfPayment": "",\n      "currencyCode": "",\n      "itemModel": [\n        {\n          "hsCode": "",\n          "commercialDescription": "",\n          "quantity": "",\n          "unitOfMeasurement": "",\n          "unitPrice": ""\n        }\n      ]\n    }\n  ],\n  "containerModel": {\n    "containerNumber": "",\n    "sealNumber": "",\n    "packageCount": 0\n  }\n}`
          : `{\n  "edf_header": {\n    "framework_version": "FEMA_2026_UNIFIED",\n    "corporate_pan": "",\n    "iec_code": ""\n  },\n  "invoice_record": {\n    "invoice_number": "",\n    "invoice_date": "",\n    "contracted_currency": "",\n    "invoice_value_foreign_currency": 0.0,\n    "invoice_value_inr": 0.0,\n    "purpose_code_rbi": ""\n  },\n  "bank_remittance_firc_node": {\n    "inward_remittance_reference_number": "",\n    "realization_date": "",\n    "remitted_currency": "",\n    "gross_amount_received_foreign_currency": 0.0,\n    "intermediary_bank_deductions": 0.0,\n    "net_amount_credited_inr": 0.0,\n    "authorized_dealer_bank_code": ""\n  },\n  "reconciliation_analytics": {\n    "calculated_variance_percentage": 0.0,\n    "spread_exception_triggered": false,\n    "small_value_threshold_bypass": false\n  },\n  "compliance_outputs": {\n    "gst_rfd01_payload_ready": false,\n    "edpms_token_closure_status": ""\n  }\n}`;

        const systemInstruction = `You are the primary schema synthesis core for ExporoAI, an enterprise cross-border operating system running under 2026 Indian regulatory rules. Analyze the provided unstructured trade assets character-by-character. Extract all available trade parameters. Do not assume or guess values; if a parameter is missing, return an empty string. Programmatically evaluate conversion fees to see if they break the +/-0.5% FEMA boundary. Your absolute requirement is to output a valid JSON object that adheres strictly to the specified target schema:

${targetOutputInstruction}`;

        const icegateSchema = {
          type: "OBJECT",
          properties: {
            invoiceModel: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  invoiceNumber: { type: "STRING" },
                  invoiceDate: { type: "STRING" },
                  purchaseOrderNumber: { type: "STRING" },
                  termsOfPayment: { type: "STRING" },
                  currencyCode: { type: "STRING" },
                  itemModel: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        hsCode: { type: "STRING" },
                        commercialDescription: { type: "STRING" },
                        quantity: { type: "STRING" },
                        unitOfMeasurement: { type: "STRING" },
                        unitPrice: { type: "STRING" }
                      }
                    }
                  }
                }
              }
            },
            containerModel: {
              type: "OBJECT",
              properties: {
                containerNumber: { type: "STRING" },
                sealNumber: { type: "STRING" },
                packageCount: { type: "NUMBER" }
              }
            }
          }
        };

        const edfSchema = {
          type: "OBJECT",
          properties: {
            edf_header: {
              type: "OBJECT",
              properties: {
                framework_version: { type: "STRING", enum: ["FEMA_2026_UNIFIED"] },
                corporate_pan: { type: "STRING" },
                iec_code: { type: "STRING" }
              }
            },
            invoice_record: {
              type: "OBJECT",
              properties: {
                invoice_number: { type: "STRING" },
                invoice_date: { type: "STRING" },
                contracted_currency: { type: "STRING" },
                invoice_value_foreign_currency: { type: "NUMBER" },
                invoice_value_inr: { type: "NUMBER" },
                purpose_code_rbi: { type: "STRING" }
              }
            },
            bank_remittance_firc_node: {
              type: "OBJECT",
              properties: {
                inward_remittance_reference_number: { type: "STRING" },
                realization_date: { type: "STRING" },
                remitted_currency: { type: "STRING" },
                gross_amount_received_foreign_currency: { type: "NUMBER" },
                intermediary_bank_deductions: { type: "NUMBER" },
                net_amount_credited_inr: { type: "NUMBER" },
                authorized_dealer_bank_code: { type: "STRING" }
              }
            },
            reconciliation_analytics: {
              type: "OBJECT",
              properties: {
                calculated_variance_percentage: { type: "NUMBER" },
                spread_exception_triggered: { type: "BOOLEAN" },
                small_value_threshold_bypass: { type: "BOOLEAN" }
              }
            },
            compliance_outputs: {
              type: "OBJECT",
              properties: {
                gst_rfd01_payload_ready: { type: "BOOLEAN" },
                edpms_token_closure_status: { type: "STRING" }
              }
            }
          }
        };

        const targetSchema = flowType === 'GOODS_PHYSICAL' ? icegateSchema : edfSchema;

        // Tariff Resolution Node: Real pgvector Lookup
        let vectorContext = "Vector Lookup Resolution Results:\n";
        try {
          // Truncate text to avoid exceeding embedding token limits
          const textForEmbedding = aggregatedTextContext.substring(0, 8000);
          
          const embeddingResponse = await aiStudio.models.embedContent({
            model: 'text-embedding-004',
            contents: textForEmbedding,
          });
          
          const embedding = embeddingResponse.embeddings?.[0]?.values;
          
          if (!embedding) {
            throw new Error("Failed to generate vector embeddings from GenAI");
          }
          // Query Supabase pgvector RPC
          const { data: vectorResults, error: vectorError } = await supabase.rpc('match_hs_codes', {
            query_embedding: `[${embedding.join(',')}]`,
            match_threshold: 0.5,
            match_count: 3
          });
          
          if (!vectorError && vectorResults && vectorResults.length > 0) {
            vectorResults.forEach((match: any) => {
              vectorContext += `- High confidence match: ${match.hs_code} (${match.description})\n`;
            });
          } else {
             vectorContext += "No highly confident semantic HS code matches found.\n";
          }
        } catch (embeddingError) {
          console.error("Vector Semantic Search Error:", embeddingError);
          // Fallback if API key has no embedding access
          const lower = aggregatedTextContext.toLowerCase();
          if (lower.includes('laptop') || lower.includes('computer')) vectorContext += "- Fallback match: 84713010 (Personal computers / Laptops)\n";
          if (lower.includes('software') || lower.includes('consulting')) vectorContext += "- Fallback match: P0802 (Software Consultancy Services)\n";
          if (lower.includes('cotton') || lower.includes('shirt')) vectorContext += "- Fallback match: 61091000 (T-shirts, singlets and other vests, of cotton)\n";
        }

        const contentsParts: any[] = [];
        
        // Feed the raw binary buffers directly to Gemini without Base64 URL padding
        for (const file of preloadedFiles) {
          if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            contentsParts.push({
              inlineData: {
                data: file.buffer.toString('base64'),
                mimeType: file.type
              }
            });
          }
        }
        contentsParts.push({
          text: `Telemetry Logs Data Body:\n${aggregatedTextContext}\n\n${vectorContext}`
        });

        const aiResponse = await aiStudio.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contentsParts,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.1, // Low temperature for deterministic schema generation
            responseMimeType: 'application/json'
          }
        });

        let rawJsonText = aiResponse.text?.trim() || '{}';
        
        // Ingestion Cleaning Layer: Strip markdown code blocks
        if (rawJsonText.startsWith('```')) {
          rawJsonText = rawJsonText.replace(/^```(json)?\n?/i, '').replace(/\n?```$/i, '').trim();
        }

        const extractedData = JSON.parse(rawJsonText);
        let finalCompiledPayload = { ...extractedData };

        // UQC Programmatic Normalization Dictionary for CACHE01 Master Directory mapping
        const uqcDictionary: Record<string, string> = {
          'pieces': 'PCS', 'piece': 'PCS', 'pcs': 'PCS', 'numbers': 'PCS', 'number': 'PCS', 'nos': 'PCS',
          'sets': 'SET', 'set': 'SET',
          'boxes': 'BOX', 'box': 'BOX',
          'kilograms': 'KGS', 'kilogram': 'KGS', 'kgs': 'KGS', 'kg': 'KGS',
          'grams': 'GMS', 'gram': 'GMS', 'gms': 'GMS', 'gm': 'GMS',
          'liters': 'LTR', 'liter': 'LTR', 'litres': 'LTR', 'litre': 'LTR', 'ltr': 'LTR',
          'meters': 'MTR', 'meter': 'MTR', 'mtr': 'MTR',
          'rolls': 'ROL', 'roll': 'ROL', 'pallets': 'PAL', 'pallet': 'PAL',
          'cartons': 'CTN', 'carton': 'CTN', 'ctn': 'CTN', 'ctns': 'CTN'
        };

        if (flowType === 'GOODS_PHYSICAL') {
          // Mathematical Gates & Invariances
          const invoiceModel = finalCompiledPayload.invoiceModel || [];
          
          invoiceModel.forEach((invoice: any) => {
            if (invoice.itemModel) {
              let currentSequence = 1;
              const normalizedItems: any[] = [];
              
              invoice.itemModel.forEach((rawItem: any) => {
                // Ensure zero whitespace keys in item mapping
                const item: any = {};
                for (const key in rawItem) {
                  // Catch Gemini hallucinating spaces in keys
                  let cleanKey = key;
                  if (key.toLowerCase() === 'commercial description') {
                    cleanKey = 'commercialDescription';
                  } else {
                    cleanKey = key.replace(/\s+/g, '');
                  }
                  item[cleanKey] = rawItem[key];
                }

                // Auto-increment sequence
                item.itemSequence = currentSequence++;
                
                // UQC Normalization
                if (item.unitOfMeasurement) {
                  const rawUqc = item.unitOfMeasurement.toString().toLowerCase().trim();
                  item.unitOfMeasurement = uqcDictionary[rawUqc] || rawUqc.toUpperCase();
                }

                // Clean formatting and cast to float
                const cleanQuantity = parseFloat(item.quantity?.toString().replace(/[^\d.]/g, '') || '0');
                const cleanUnitPrice = parseFloat(item.unitPrice?.toString().replace(/[^\d.]/g, '') || '0');
                
                item.quantity = cleanQuantity;
                item.unitPrice = cleanUnitPrice;
                
                // Deterministic Math Node
                item.fobValue = parseFloat((cleanQuantity * cleanUnitPrice).toFixed(2));
                
                normalizedItems.push(item);
              });
              
              invoice.itemModel = normalizedItems;
            }
          });

          // Compile Three-Tier Separation Pipeline Envelope
          finalCompiledPayload = {
            headerField: {
              msgId: "EXPOROAI-" + Date.now(),
              version: "2026.1",
              msgSource: "CHA_WEDGE",
              senderId: "EXPOROAI_SYS"
            },
            master: {
              invoiceModel: invoiceModel,
              containerModel: finalCompiledPayload.containerModel || {}
            },
            digSign: []
          };
        }

        let finalStatus = 'READY_FOR_REVIEW';
        
        // Post-processing math check for FEMA boundaries (if AI didn't catch it precisely)
        if (flowType === 'SERVICES_INTANGIBLE' && finalCompiledPayload.invoice_record && finalCompiledPayload.bank_remittance_firc_node) {
          const baseInvoiceUsd = finalCompiledPayload.invoice_record.invoice_value_foreign_currency || 0;
          const receivedWireUsd = finalCompiledPayload.bank_remittance_firc_node.gross_amount_received_foreign_currency || 0;
          
          let variancePct = 0;
          if (baseInvoiceUsd > 0) {
            variancePct = ((receivedWireUsd - baseInvoiceUsd) / baseInvoiceUsd) * 100;
          }
          
          const spreadExceptionTriggered = Math.abs(variancePct) > 0.5;

          finalCompiledPayload.reconciliation_analytics = {
            ...finalCompiledPayload.reconciliation_analytics,
            calculated_variance_percentage: parseFloat(variancePct.toFixed(3)),
            spread_exception_triggered: spreadExceptionTriggered,
            small_value_threshold_bypass: baseInvoiceUsd < 12000 // approx 10 Lakhs INR
          };
          
          if (!finalCompiledPayload.compliance_outputs) {
            finalCompiledPayload.compliance_outputs = {};
          }
          finalCompiledPayload.compliance_outputs.gst_rfd01_payload_ready = !spreadExceptionTriggered;
          finalCompiledPayload.compliance_outputs.edpms_token_closure_status = spreadExceptionTriggered ? 'PENDING_VARIANCE_APPROVAL' : 'AUTO_CLOSED';
          
          // Step 4 state transition logic:
          if (!spreadExceptionTriggered) {
            finalStatus = 'SCHEMA_COMPILED';
          }
        } else if (flowType === 'GOODS_PHYSICAL') {
          // Goods flow defaults to review unless fully automated
          finalStatus = 'READY_FOR_REVIEW';
        }

        // Advance row traces state
        await supabase
          .from('transactions')
          .update({
            status: finalStatus,
            compiled_government_payload: finalCompiledPayload,
            raw_payload_context: { 
              total_ingested_files: files.length,
              files: fileDataUrls // Clean bucket URLs instead of raw Base64
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', txn.id);

      } catch (innerError: any) {
        // Transition records to FAILED state gracefully and logging exception tracking data safely
        await supabase
          .from('transactions')
          .update({
            status: 'FAILED',
            exception_logs: innerError?.message || 'Asynchronous Token Processing Exception Exception',
            updated_at: new Date().toISOString()
          })
          .eq('id', txn.id);
      }
    };

    // Execute out of band asynchronous background runner loop process instantly via Vercel's after()
    after(() => backgroundTaskLoop());

    return NextResponse.json({
      message: 'Transaction telemetry queued for out-of-band validation processing',
      transaction_id: txn.id,
      status: 'PARSING'
    }, { status: 202 });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal processing compute fault execution exception' }, { status: 500 });
  }
}
