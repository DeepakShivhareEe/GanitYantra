// ============================================================
// GANITYANTRA — LOCAL SOLVER ROUTER
// File: src/utils/solveLocally.js
//
// PURPOSE:
// Topic string lekar sahi engine function call karta hai.
// Yeh ek "traffic controller" ki tarah hai —
// topic aaya → sahi solver ko bhejo.
//
// HOW IT WORKS:
// detectTopic() se topic aata hai (e.g. "quadratic")
// solveLocally() us topic ke liye sahi engine call karta hai
// Engine ek object return karta hai: { steps, answer, answerLatex }
// Agar koi solver nahi mila toh null return karta hai
//
// ADDING NEW SOLVERS:
// Jab Week 2 mein calculus solver banao:
// 1. calculusSolver.js mein solveDifferentiation() banao
// 2. engines/index.js mein export karo
// 3. Yahan import karo aur case add karo
//
// USED IN:
// App.jsx → handleSolve()
// ============================================================

import { solveQuadratic }        from '../engines/index.js';
import { solveArithmeticMaster } from '../engines/index.js';

// ── Week 2 imports (uncomment when ready) ──
// import { solveDifferentiation, solveIntegration, solveLimit } from '../engines/index.js';

// ── Week 3 imports (uncomment when ready) ──
// import { solveMatrix, solveLinearSystem } from '../engines/index.js';
// import { solveLaplace, solveFourier }     from '../engines/index.js';

// ── Week 4 imports (uncomment when ready) ──
// import { solveStatistics, solveProbability } from '../engines/index.js';
// import { solveGeometry, solveTrigonometry }  from '../engines/index.js';

/**
 * solveLocally(input, topic)
 *
 * @param {string} input — user ka original problem string
 * @param {string} topic — detectTopic() se aaya topic ID
 * @returns {object|null} — { steps, answer, answerLatex } ya null
 *
 * Examples:
 *   solveLocally("x^2 - 5x + 6 = 0", "quadratic")  → steps + roots
 *   solveLocally("LCM of 12 and 18", "lcm_hcf")     → steps + LCM
 *   solveLocally("some PG topic", "general")         → null (not supported yet)
 */
export function solveLocally(input, topic) {
  // Normalize Unicode before passing to engines
  input = input
    .replace(/−/g, "-")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\n/g, "")
    .trim();
  switch (topic) {

    // ── Currently Supported ──────────────────────────────
    case "quadratic":
      return solveQuadratic(input);

    case "lcm_hcf":
    case "prime_factorization":
    case "fraction":
    case "percentage":
    case "ratio":
    case "exponent":
    case "arithmetic":
      return solveArithmeticMaster(input);

    // ── Week 2 — Calculus (coming soon) ─────────────────
    // case "differentiation":
    //   return solveDifferentiation(input);
    // case "integration":
    //   return solveIntegration(input);
    // case "limit":
    //   return solveLimit(input);

    // ── Week 3 — Linear Algebra + Transforms ─────────────
    // case "matrix":
    //   return solveMatrix(input);
    // case "laplace":
    //   return solveLaplace(input);

    // ── Week 4 — Statistics + Geometry ───────────────────
    // case "statistics":
    //   return solveStatistics(input);
    // case "trigonometry":
    //   return solveTrigonometry(input);

    // ── Not supported yet ─────────────────────────────────
    default:
      return null;
  }
}
