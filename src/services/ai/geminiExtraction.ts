import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const JSON_SCHEMA = `
{
  "description": "Extracted item details",
  "hs_code_description": "String - The best description to use for tariff lookup",
  "invoice_value": "Number - The total invoice value",
  "currency": "String - 3 letter currency code",
  "carton_quantity": "Number - Total cartons or packages",
  "net_weight_kg": "Number - Net weight in KG",
  "remittance_amount": "Number - (If FIRC/Banking document) The amount received",
  "banking_reference": "String - SWIFT or FIRC reference code",
  "shipping_bill_no": "String - Customs shipping bill number if present"
}
`;

export async function extractDocumentData(fileBase64: string, mimeType: string, streamType: string) {
  try {
    const prompt = `
      You are an expert global trade compliance extraction engine.
      Analyze the provided document for a ${streamType} transaction.
      Extract the variables matching the exact JSON structure provided below.
      Return ONLY a pure JSON object. Do not wrap it in markdown blockquotes or add any conversational text.
      If a value is not found, return null for that field.

      JSON SCHEMA:
      ${JSON_SCHEMA}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    { inlineData: { data: fileBase64, mimeType } },
                    { text: prompt }
                ]
            }
        ]
    });

    const text = response.text || "{}";
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Failed to extract document data via AI.");
  }
}
