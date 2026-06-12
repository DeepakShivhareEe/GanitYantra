// ============================================================
// GANITYANTRA — MAIN APP
// File: src/App.jsx
//
// PURPOSE:
// Sirf state management aur UI structure yahan hai.
// Koi bhi logic, config, ya utility function yahan nahi hai.
// Sab kuch separate files mein hai — yahan sirf wiring hai.
//
// STRUCTURE:
// State → handleSolve → solveLocally → getAIExplanation
//       ↓
// Components render karo with state as props
// ============================================================

import { useState, useEffect }   from "react";

// ── Config ──
import { LEVELS, EXAMPLE_PROBLEMS, DEFAULT_LEVEL } from './config/levels.js';

// ── Utils ──
import { detectLevel }   from './utils/detectLevel.js';
import { detectTopic }   from './utils/detectTopic.js';
import { solveLocally }  from './utils/solveLocally.js';

// ── Services ──
import { getAIExplanation } from './services/aiService.js';

// ── Components ──
import Header        from './components/Header.jsx';
import LevelSelector from './components/LevelSelector.jsx';
import InputArea     from './components/InputArea.jsx';
import StepDisplay   from './components/StepDisplay.jsx';
import FinalAnswer   from './components/FinalAnswer.jsx';
import AIExplanation from './components/AIExplanation.jsx';

// ─────────────────────────────────────────────────────────────

export default function MathEngine() {

  // ── State ──────────────────────────────────────────────
  const [input,         setInput]         = useState("");
  const [level,         setLevel]         = useState(DEFAULT_LEVEL);
  const [autoDetected,  setAutoDetected]  = useState(null);
  const [solving,       setSolving]       = useState(false);
  const [result,        setResult]        = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading,     setAiLoading]     = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [katexLoaded,   setKatexLoaded]   = useState(false);

  // ── Load KaTeX from CDN on startup ─────────────────────
  useEffect(() => {
    if (window.katex) { setTimeout(() => setKatexLoaded(true), 0); return; }
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.href  = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
    document.head.appendChild(link);
    const script    = document.createElement("script");
    script.src      = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
    script.onload   = () => setKatexLoaded(true);
    document.head.appendChild(script);
  }, []);

  // ── Auto-detect level as user types ────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim().length > 3) setAutoDetected(detectLevel(input));
      else setAutoDetected(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [input]);

  // ── Main Solve Handler ──────────────────────────────────
  const handleSolve = async () => {
    if (!input.trim()) return;

    const activeLevel = autoDetected || level;
    const topic       = detectTopic(input);

    // Reset state
    setSolving(true);
    setResult(null);
    setAiExplanation(null);
    setRevealedSteps(0);

    await new Promise(r => setTimeout(r, 300));

    // Step 1 — Solve locally (math engine)
    const solved = solveLocally(input, topic);

    if (!solved) {
      setResult({
        error: true,
        message: "Yeh problem abhi engine mein support nahi hai. Try karo: quadratic (x^2 - 5x + 6 = 0), LCM/HCF (LCM of 12 and 18), arithmetic (4 + 3 * 2), fractions (3/4 + 1/2), percentage (15% of 240).",
      });
      setSolving(false);
      return;
    }

    setResult({ ...solved, level: activeLevel, topic });
    setSolving(false);

    // Step 2 — Reveal steps one by one (animation)
    for (let i = 1; i <= solved.steps.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setRevealedSteps(i);
    }

    // Step 3 — Get AI Hinglish explanation
    setAiLoading(true);
    const explanation = await getAIExplanation(input, solved.steps, activeLevel, topic);
    setAiExplanation(explanation);
    setAiLoading(false);
  };

  // ── Derived Values ──────────────────────────────────────
  const activeLevel = autoDetected || level;
  const levelConfig = LEVELS.find(l => l.id === activeLevel) || LEVELS[0];
  const examples    = EXAMPLE_PROBLEMS[level] || [];

  // ── Render ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'Georgia', serif" }}>

      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Header */}
      <Header levelConfig={levelConfig} />

      <main style={{ position: "relative", zIndex: 10, maxWidth: 780, margin: "0 auto", padding: "32px 20px" }}>

        {/* Level Selector */}
        <LevelSelector
          levels={LEVELS}
          level={level}
          setLevel={setLevel}
          setAutoDetected={setAutoDetected}
        />

        {/* Input + Examples + Solve Button */}
        <InputArea
          input={input}
          setInput={setInput}
          onSolve={handleSolve}
          examples={examples}
          autoDetected={autoDetected}
          levelConfig={levelConfig}
          levels={LEVELS}
          katexLoaded={katexLoaded}
          solving={solving}
        />

        {/* Error Message */}
        {result?.error && (
          <div style={{
            marginTop: 24, padding: 20, borderRadius: 12,
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171", fontSize: 13, lineHeight: 1.7,
          }}>
            {result.message}
          </div>
        )}

        {/* Solution Area */}
        {result && !result.error && (
          <div style={{ marginTop: 28 }}>

            {/* Animated Steps */}
            <StepDisplay
              steps={result.steps}
              revealedSteps={revealedSteps}
              levelConfig={levelConfig}
              katexLoaded={katexLoaded}
            />

            {/* Final Answer — show after all steps revealed */}
            {revealedSteps >= result.steps.length && (
              <FinalAnswer
                answer={result.answer}
                answerLatex={result.answerLatex}
                levelConfig={levelConfig}
                katexLoaded={katexLoaded}
              />
            )}

            {/* AI Hinglish Explanation */}
            <AIExplanation
              explanation={aiExplanation}
              loading={aiLoading}
              levelConfig={levelConfig}
            />

          </div>
        )}

        {/* Footer — shows which engines are active */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Arithmetic", val: "arithmeticSolver.js" },
              { label: "Quadratic",  val: "quadraticSolver.js"  },
              { label: "Rendering",  val: "KaTeX"               },
              { label: "AI Layer",   val: "Groq — Llama 3.3"    },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#303050", letterSpacing: "1px", textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "#505070", marginTop: 2 }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        textarea::placeholder { color: #303050; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}
