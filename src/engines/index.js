// ============================================================
// GANITYANTRA — ENGINES INDEX
// Single import point for all math solvers
// Import everything from here into App.jsx
// ============================================================

// ── Arithmetic (Class 6-8) ──────────────────────────────────
export {
  solveLCMHCF,
  solveArithmetic,
  solveFraction,
  solvePercentage,
  solveRatio,
  solveExponents,
  solvePrimeFactorization,
  solveArithmeticMaster,
  detectArithmeticTopic,
} from './arithmeticSolver.js';

// ── Quadratic (Class 9-12) ──────────────────────────────────
export {
  solveQuadratic,
  detectQuadraticType,
} from './quadraticSolver.js';

// ── Coming in Week 2 ────────────────────────────────────────
// export { solveDifferentiation, solveIntegration } from './calculusSolver.js';
// export { solveMatrix, solveEigenvalues } from './matrixSolver.js';
// export { solveLaplace, solveFourier } from './transformSolver.js';
// export { solveMean, solveSD, solveProbability } from './statisticsSolver.js';
// export { solveTriangle, solveCoordinate } from './geometrySolver.js';
// export { solveTrigIdentity, solveTrigEquation } from './trigSolver.js';
