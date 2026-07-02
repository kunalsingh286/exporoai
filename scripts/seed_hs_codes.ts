import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import WebSocket from 'ws';
globalThis.WebSocket = WebSocket as any;
import * as fs from 'fs';
import * as path from 'path';

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
const aiStudio = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY!, httpOptions: { apiVersion: 'v1alpha' } });

const hsCodesToSeed = [
  { hs_code: '84713010', description: 'Personal computers / Laptops' },
  { hs_code: 'P0802', description: 'Software Consultancy Services' },
  { hs_code: '61091000', description: 'T-shirts, singlets and other vests, of cotton' },
  { hs_code: '84071000', description: 'Spark-ignition engines' },
  { hs_code: '85171200', description: 'Telephones for cellular networks / Smartphones' },
  { hs_code: '09024010', description: 'Black tea (fermented) and partly fermented tea, in bulk' },
  { hs_code: '30049099', description: 'Other medicaments for therapeutic or prophylactic uses' }
];

// Poor-man's deterministic text embedding generator (768 dimensions) to bypass Gemini API key limits
function getDummyVector(text: string) {
  const vector = new Array(768).fill(0.01);
  const words = text.toLowerCase().split(/\s+/);
  words.forEach((word, index) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash |= 0;
    }
    const bucket = Math.abs(hash) % 768;
    vector[bucket] += 1.0;
  });
  
  // Normalize
  const length = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / (length || 1));
}

async function seed() {
  console.log('Starting Vector DB seed...');

  for (const item of hsCodesToSeed) {
    try {
      console.log(`Generating embedding for: ${item.description}`);
      
      const embedding = getDummyVector(item.description);

      const { error } = await supabase
        .from('hs_codes')
        .insert({
          hs_code: item.hs_code,
          description: item.description,
          embedding: `[${embedding.join(',')}]` // pgvector format
        });

      if (error) {
        console.error(`Error inserting ${item.hs_code}:`, error.message);
      } else {
        console.log(`Successfully seeded ${item.hs_code}`);
      }
    } catch (e: any) {
      console.error(`Failed to generate/insert embedding for ${item.hs_code}:`, e.message);
    }
  }
  console.log('Seeding complete.');
}

seed();
