// ============================================================
// GANITYANTRA — TOPIC DETECTOR
// File: src/utils/detectTopic.js
//
// PURPOSE:
// User ka input dekh ke decide karo — konsa solver use karna hai.
// detectLevel  → "kitna hard hai?" (level)
// detectTopic  → "konsa topic hai?" (which engine to call)
//
// HOW IT WORKS:
// Input string pe regex patterns check karta hai.
// Pehla match jo mile woh topic return karta hai.
// Topic string engine/index.js mein routing ke liye use hoti hai.
//
// USED IN:
// App.jsx → handleSolve → solveLocally(input, topic)
// utils/solveLocally.js → topic se sahi solver choose karta hai
// backend/main.py → AI explanation context ke liye
// ============================================================

/**
 * detectTopic(input)
 * @param {string} input — user ka problem string
 * @returns {string} — topic ID string
 *
 * Examples:
 *   detectTopic("x^2 - 5x + 6 = 0")     → "quadratic"
 *   detectTopic("LCM of 12 and 18")       → "lcm_hcf"
 *   detectTopic("differentiate x^3")      → "differentiation"
 *   detectTopic("3/4 + 1/2")              → "fraction"
 */
export function detectTopic(input) {
  if (!input) return "general";

  // Normalize Unicode characters to ASCII
  const normalized = input
    .replace(/−/g, "-")    // Unicode minus → ASCII minus
    .replace(/×/g, "*")    // Unicode multiply
    .replace(/÷/g, "/")    // Unicode divide
    .replace(/\n/g, "")    // Remove newlines
    .trim();

  const lower = normalized.toLowerCase();

  // ── Quadratic ──
  const cleanedInput = normalized.replace(/\s+/g, "");
  if (/quadratic|x\^2|x²|x\^4|\(x[+-]|\d\(x|x\(x/i.test(cleanedInput)) return "quadratic";

   // ── Number Theory ──
  if (/lcm|hcf|gcd/i.test(lower))           return "lcm_hcf";
  if (/prime\s*factor/i.test(lower))         return "prime_factorization";

  // ── Fractions ──
  if (/\d+\/\d+/.test(input))               return "fraction";

  // ── Percentage / Finance ──
  if (/%\s*of|profit|loss|simple interest|compound interest|discount/i.test(lower)) return "percentage";

  // ── Ratio & Proportion ──
  if (/ratio|proportion/i.test(lower))       return "ratio";

  // ── Exponents ──
  if (/exponent|power|\d+\^\d+/i.test(lower)) return "exponent";

  // ── Calculus ──
  if (/differentiat|dy\/dx|d\/dx|derivative/i.test(lower)) return "differentiation";
  if (/integrat|∫|antiderivative/i.test(lower))            return "integration";
  if (/limit|lim\s*x|lim\s*\(/i.test(lower))               return "limit";

  // ── Linear Algebra ──
  if (/matrix|determinant|inverse|eigenvalue|eigenvector/i.test(lower)) return "matrix";
  if (/linear.*equation|simultaneous/i.test(lower))                     return "linear_eq";

  // ── Transforms ──
  if (/laplace/i.test(lower))   return "laplace";
  if (/fourier/i.test(lower))   return "fourier";
  if (/z.transform/i.test(lower)) return "z_transform";

  // ── Statistics ──
  if (/mean|median|mode|variance|standard deviation/i.test(lower)) return "statistics";
  if (/probability|permutation|combination/i.test(lower))           return "probability";

  // ── Geometry ──
  if (/triangle|pythagoras|angle|polygon/i.test(lower))  return "geometry";
  if (/circle|radius|diameter|circumference/i.test(lower)) return "circle";
  if (/distance formula|section formula|midpoint/i.test(lower)) return "coordinate";

  // ── Trigonometry ──
  if (/sin|cos|tan|cosec|sec|cot|trig/i.test(lower)) return "trigonometry";

  // ── Arithmetic — fallback for expressions with numbers ──
  if (/[+\-*/^()]/.test(input) && /\d/.test(input))  return "arithmetic";

  return "general";
}
