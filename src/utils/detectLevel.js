// ============================================================
// GANITYANTRA — LEVEL DETECTOR
// File: src/utils/detectLevel.js
//
// PURPOSE:
// User jo problem type kare, usse automatically sahi level
// detect karo. Jaise "eigenvalue" type kiya toh PG level,
// "quadratic" type kiya toh Class 9-10.
//
// HOW IT WORKS:
// Regex patterns check karta hai input string mein.
// Top se neeche check karta hai — pehla match return karta hai.
// Agar kuch match nahi toh default "class68" return karta hai.
//
// USED IN:
// App.jsx → useEffect (auto-detect as user types)
// ============================================================

const LEVEL_PATTERNS = {
  pg:       /eigenvalue|eigenvector|laplace|fourier|pde|ode|jacobian|divergence|curl|manifold|tensor|hilbert|banach|topology|galois|lebesgue|stochastic|markov|riemannian|homology|cohomology/i,
  ug:       /transform|differential equation|partial derivative|double integral|triple integral|vector calculus|complex analysis|bessel|legendre|runge.kutta|svd|singular value|z.transform|convolution|fourier series/i,
  class1112:/differentiat|integrat|limit|continuity|matrix|determinant|inverse matrix|binomial theorem|permutation|combination|probability|sequence|series|conic|parabola|ellipse|hyperbola|vectors|3d geometry/i,
  class910: /quadratic|polynomial|linear equation|pythagoras|trigonometry|sin|cos|tan|coordinate|distance formula|section formula|arithmetic progression|geometric progression|statistics|surface area|volume/i,
  class68:  null,
};

/**
 * detectLevel(input)
 * @param {string} input — user ka problem string
 * @returns {string} — "class68" | "class910" | "class1112" | "ug" | "pg"
 *
 * Examples:
 *   detectLevel("find eigenvalue of matrix") → "pg"
 *   detectLevel("solve x^2 - 5x + 6 = 0")   → "class910"
 *   detectLevel("LCM of 12 and 18")           → "class68"
 */
export function detectLevel(input) {
  if (!input || input.trim().length === 0) return "class68";
  const lower = input.toLowerCase();
  for (const [levelId, pattern] of Object.entries(LEVEL_PATTERNS)) {
    if (pattern && pattern.test(lower)) return levelId;
  }
  return "class68";
}
