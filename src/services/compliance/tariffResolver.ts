// Lightweight Levenshtein distance algorithm for zero-dependency Phase 1
function levenshteinDistance(a: string, b: string): number {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Temporary hardcoded subset for testing. In Phase 3, this will be replaced by a pgvector search.
const MOCK_HS_DICTIONARY = [
  { code: '84713010', description: 'Personal computers (laptops)' },
  { code: '85171200', description: 'Smartphones and cellular devices' },
  { code: '62034200', description: 'Men or boys trousers of cotton' },
  { code: '30049099', description: 'Medicaments and pharmaceuticals' },
  { code: '09024020', description: 'Black tea leaf in bulk' }
];

export function resolveHsCode(description: string | null | undefined): string | null {
  if (!description) return null;

  const descLower = description.toLowerCase();
  
  let bestMatch = null;
  let minDistance = Infinity;

  for (const item of MOCK_HS_DICTIONARY) {
    const dist = levenshteinDistance(descLower, item.description.toLowerCase());
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = item.code;
    }
  }

  // Basic threshold to avoid completely wrong matches
  if (minDistance > Math.max(10, descLower.length * 0.5)) {
    return null; 
  }

  return bestMatch;
}
