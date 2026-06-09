import { useState, useEffect, useRef } from "react";

// ─── MATH ENGINE ──────────────────────────────────────────────────────────────
// Deterministic solver — no AI for computation, only for explanation

function detectLevel(input) {
  const lower = input.toLowerCase();
  if (/eigenvalue|eigenvector|laplace|fourier|pde|ode|jacobian|divergence|curl|manifold|tensor|hilbert|banach|topology|galois|lebesgue/i.test(lower)) return "pg";
  if (/transform|differential equation|partial derivative|double integral|triple integral|vector calculus|complex analysis|bessel|legendre|runge.kutta|svd|singular value/i.test(lower)) return "ug";
  if (/differentiat|integrat|limit|continuity|matrix|determinant|inverse matrix|binomial theorem|permutation|combination|probability|sequence|series|conic|parabola|ellipse|hyperbola/i.test(lower)) return "class1112";
  if (/quadratic|polynomial|linear equation|pythagoras|trigonometry|sin|cos|tan|coordinate|distance formula|section formula|arithmetic progression|geometric progression/i.test(lower)) return "class910";
  return "class68";
}

function detectTopic(input) {
  const lower = input.toLowerCase();
  if (/lcm|hcf|gcd|factor|prime|divisib/i.test(lower)) return "number_theory";
  if (/quadratic|x\^2|x²/i.test(lower)) return "quadratic";
  if (/linear.*equation|simultaneous|2x|3x/i.test(lower)) return "linear_eq";
  if (/differentiat|dy\/dx|d\/dx/i.test(lower)) return "differentiation";
  if (/integrat|∫/i.test(lower)) return "integration";
  if (/matrix|determinant/i.test(lower)) return "matrix";
  if (/lcm|hcf/i.test(lower)) return "lcm_hcf";
  if (/bodmas|simplify|\d+\s*[\+\-\*\/]/i.test(lower)) return "arithmetic";
  if (/fraction|ratio/i.test(lower)) return "fraction";
  if (/percentage|profit|loss|discount/i.test(lower)) return "percentage";
  if (/triangle|pythagoras|angle/i.test(lower)) return "geometry";
  return "general";
}

// ── Arithmetic / BODMAS ──
function solveArithmetic(expr) {
  try {
    const cleaned = expr.replace(/[^0-9+\-*/().\s^]/g, "").trim();
    if (!cleaned) return null;
    const result = Function('"use strict"; return (' + cleaned.replace(/\^/g, "**") + ")")();
    return {
      steps: [
        { latex: cleaned.replace(/\*\*/g, "^"), explanation: "Expression identify kiya" },
        { latex: `= ${result}`, explanation: `BODMAS rules apply karke simplify kiya` },
      ],
      answer: result,
    };
  } catch { return null; }
}

// ── LCM / HCF ──
function primeFactors(n) {
  const factors = {};
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { factors[d] = (factors[d] || 0) + 1; n = Math.floor(n / d); }
    d++;
  }
  if (n > 1) factors[n] = (factors[n] || 0) + 1;
  return factors;
}

function solveLCMHCF(input) {
  const nums = input.match(/\d+/g)?.map(Number);
  if (!nums || nums.length < 2) return null;
  const [a, b] = nums;
  const fa = primeFactors(a), fb = primeFactors(b);
  const allKeys = [...new Set([...Object.keys(fa), ...Object.keys(fb)])].map(Number);

  const hcfFactors = {}, lcmFactors = {};
  allKeys.forEach(k => {
    hcfFactors[k] = Math.min(fa[k] || 0, fb[k] || 0);
    lcmFactors[k] = Math.max(fa[k] || 0, fb[k] || 0);
  });

  const hcf = Object.entries(hcfFactors).filter(([,v])=>v>0).reduce((acc,[k,v])=>acc*Math.pow(Number(k),v),1);
  const lcm = Object.entries(lcmFactors).filter(([,v])=>v>0).reduce((acc,[k,v])=>acc*Math.pow(Number(k),v),1);

  const factStr = (n, f) => Object.entries(f).filter(([,v])=>v>0).map(([k,v])=>`${k}${v>1?`^${v}`:""}`).join(" \\times ") || `${n}`;

  const isLCM = /lcm/i.test(input);
  const isHCF = /hcf|gcd/i.test(input);

  return {
    steps: [
      { latex: `${a} = ${factStr(a, fa)}`, explanation: `${a} ke prime factors nikale` },
      { latex: `${b} = ${factStr(b, fb)}`, explanation: `${b} ke prime factors nikale` },
      { latex: `\\text{HCF} = ${factStr("hcf", hcfFactors)} = ${hcf}`, explanation: "Common factors ka minimum power liya → HCF" },
      { latex: `\\text{LCM} = ${factStr("lcm", lcmFactors)} = ${lcm}`, explanation: "Sabhi factors ka maximum power liya → LCM" },
    ],
    answer: isLCM ? lcm : isHCF ? hcf : `HCF = ${hcf}, LCM = ${lcm}`,
    answerLatex: isLCM ? `\\text{LCM} = ${lcm}` : isHCF ? `\\text{HCF} = ${hcf}` : `\\text{HCF} = ${hcf},\\ \\text{LCM} = ${lcm}`,
  };
}

// ── Quadratic ──
function solveQuadratic(input) {
  // Clean input
  let expr = input.replace(/\s+/g, "").replace(/=0$/, "").replace(/=0.*/, "");
  
  // Remove 'x^2' or 'x2' and collect coefficient
  let a = 0, b = 0, c = 0;

  // Normalize: x^2 → x2, make signs explicit
  expr = expr.replace(/\^/g, "");

  // Add + at start if not starting with -
  if (!expr.startsWith("-")) expr = "+" + expr;

  // Split by + or - keeping the sign
  const terms = expr.match(/[+\-][^+\-]*/g) || [];

  terms.forEach(term => {
    if (term.includes("x2")) {
      const coef = term.replace("x2", "") || "+1";
      a += parseFloat(coef === "+" ? "+1" : coef === "-" ? "-1" : coef);
    } else if (term.includes("x")) {
      const coef = term.replace("x", "") || "+1";
      b += parseFloat(coef === "+" ? "+1" : coef === "-" ? "-1" : coef);
    } else {
      c += parseFloat(term);
    }
  });

  if (a === 0) return null;

  const disc = b * b - 4 * a * c;
  const sign = (n) => n >= 0 ? `+${n}` : `${n}`;

  const steps = [
    { latex: `${a}x^2 ${sign(b)}x ${sign(c)} = 0`, explanation: "Sabhi x terms combine karke standard form banaya" },
    { latex: `a=${a},\\ b=${b},\\ c=${c}`, explanation: "Coefficients identify kiye" },
    { latex: `D = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${disc}`, explanation: "Discriminant calculate kiya: D = b² - 4ac" },
  ];

  let answer, answerLatex;

  if (disc < 0) {
    const realPart = (-b / (2 * a)).toFixed(2);
    const imagPart = (Math.sqrt(-disc) / (2 * a)).toFixed(2);
    steps.push({ latex: `x = \\frac{-b \\pm \\sqrt{D}}{2a}`, explanation: "D < 0, roots complex hain" });
    steps.push({ latex: `x = ${realPart} \\pm ${imagPart}i`, explanation: "Complex roots — real world mein solution nahi" });
    answer = `x = ${realPart} ± ${imagPart}i`;
    answerLatex = `x = ${realPart} \\pm ${imagPart}i`;
  } else if (disc === 0) {
    const x = (-b / (2 * a)).toFixed(4);
    steps.push({ latex: `D = 0 \\Rightarrow \\text{Equal roots}`, explanation: "D = 0, dono roots equal hain" });
    steps.push({ latex: `x = \\frac{-b}{2a} = \\frac{${-b}}{${2 * a}} = ${x}`, explanation: "Ek hi root hai" });
    answer = `x = ${x} (repeated root)`;
    answerLatex = `x = ${x}`;
  } else {
    const x1 = ((-b + Math.sqrt(disc)) / (2 * a)).toFixed(4);
    const x2 = ((-b - Math.sqrt(disc)) / (2 * a)).toFixed(4);
    steps.push({ latex: `x = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}}`, explanation: "Quadratic formula apply kiya" });
    steps.push({ latex: `x_1 = ${x1},\\quad x_2 = ${x2}`, explanation: "Dono roots calculate kiye" });
    answer = `x₁ = ${x1}, x₂ = ${x2}`;
    answerLatex = `x_1 = ${x1},\\ x_2 = ${x2}`;
  }

  return { steps, answer, answerLatex, disc };
}

// ── Master Solver ──
function solveLocally(input, topic) {
  if (topic === "quadratic") return solveQuadratic(input);
  if (topic === "lcm_hcf" || topic === "number_theory") return solveLCMHCF(input);
  if (topic === "arithmetic") return solveArithmetic(input);
  return null;
}

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
const LEVEL_PROMPTS = {
  class68: `Tum ek bahut friendly aur patient math teacher ho jo Class 6-8 ke students ko padhate ho. Sirf simple Hinglish mein explain karo (Hindi + English mix). Ek step mein ek hi cheez batao. Analogies use karo jaise "jaise hum apples count karte hain". Emojis bilkul mat use karo. Short sentences rakho.`,
  class910: `Tum ek CBSE board exam expert teacher ho. Class 9-10 ke students ke liye clear Hinglish mein explain karo. Har step clearly label karo. Common mistakes warn karo jaise "Yahan bahut log galti karte hain". Exam tips bhi do.`,
  class1112: `Tum JEE/NEET preparation expert ho. Class 11-12 ke students ke liye explain karo Hinglish mein. Multiple solving methods batao. Speed tricks aur shortcuts bhi mention karo. Common traps warn karo.`,
  ug: `Tum ek university professor ho. Engineering/Science undergrads ke liye Hinglish mein explain karo. Theorem ka naam batao. Mathematical rigor maintain karo lekin intuition bhi samjhao. Real-world applications mention karo.`,
  pg: `Tum ek PhD supervisor ho. Postgraduate students ke liye deep theory explain karo Hinglish mein. Research context do. Advanced concepts ke liye formal notation use karo lekin intuition bhi explain karo.`,
};

async function getAIExplanation(problem, steps, level, topic) {
  const response = await fetch("http://127.0.0.1:8000/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem, steps, level, topic }),
  });

  const data = await response.json();
  return data.explanation || "Explanation load nahi ho saki.";
}

// ─── KATEX RENDERER ───────────────────────────────────────────────────────────
function KaTeXRenderer({ latex, display = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !window.katex) return;
    try {
      window.katex.render(latex, ref.current, {
        displayMode: display,
        throwOnError: false,
        output: "html",
      });
    } catch (e) {
      if (ref.current) ref.current.textContent = latex;
    }
  }, [latex, display]);

  return <span ref={ref} />;
}

// ─── LEVEL CONFIG ─────────────────────────────────────────────────────────────
const LEVELS = [
  { id: "class68", label: "Class 6-8", color: "#10b981", desc: "Foundation" },
  { id: "class910", label: "Class 9-10", color: "#3b82f6", desc: "Secondary" },
  { id: "class1112", label: "Class 11-12", color: "#8b5cf6", desc: "JEE/NEET" },
  { id: "ug", label: "UG / B.Tech", color: "#f59e0b", desc: "Engineering" },
  { id: "pg", label: "PG / PhD", color: "#ef4444", desc: "Research" },
];

const EXAMPLE_PROBLEMS = {
  class68: ["LCM of 12 and 18", "HCF of 48 and 36", "Simplify: 4 + 3 * 2 - 1", "LCM and HCF of 24 and 60"],
  class910: ["x^2 - 5x + 6 = 0", "2x^2 + 7x + 3 = 0", "x^2 - 4x + 4 = 0", "3x^2 - 2x - 1 = 0"],
  class1112: ["x^2 + x + 1 = 0", "2x^2 - 3x + 1 = 0", "x^2 - 6x + 9 = 0", "4x^2 + 4x + 1 = 0"],
  ug: ["x^2 - 7x + 12 = 0", "LCM of 84 and 120", "5x^2 - 3x - 2 = 0"],
  pg: ["x^2 + 2x + 5 = 0", "6x^2 + x - 2 = 0"],
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MathEngine() {
  const [input, setInput] = useState("");
  const [level, setLevel] = useState("class68");
  const [autoDetected, setAutoDetected] = useState(null);
  const [solving, setSolving] = useState(false);
  const [result, setResult] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [katexLoaded, setKatexLoaded] = useState(false);

  // Load KaTeX
  useEffect(() => {
    if (window.katex) { setKatexLoaded(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
    script.onload = () => setKatexLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Auto-detect level as user types
  useEffect(() => {
    if (input.trim().length > 3) {
      const detected = detectLevel(input);
      setAutoDetected(detected);
    } else {
      setAutoDetected(null);
    }
  }, [input]);

  const handleSolve = async () => {
    if (!input.trim()) return;
    const activeLevel = autoDetected || level;
    const topic = detectTopic(input);

    setSolving(true);
    setResult(null);
    setAiExplanation(null);
    setRevealedSteps(0);

    await new Promise(r => setTimeout(r, 300));

    const solved = solveLocally(input, topic);

    if (!solved) {
      setResult({ error: true, message: "Yeh problem abhi engine mein support nahi hai. Try karo: quadratic equations (x^2 - 5x + 6 = 0), LCM/HCF (LCM of 12 and 18), ya arithmetic (4 + 3 * 2)." });
      setSolving(false);
      return;
    }

    setResult({ ...solved, level: activeLevel, topic });
    setSolving(false);

    // Reveal steps one by one
    for (let i = 1; i <= solved.steps.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setRevealedSteps(i);
    }

    // Get AI explanation
    setAiLoading(true);
    try {
      const explanation = await getAIExplanation(input, solved.steps, activeLevel, topic);
      setAiExplanation(explanation);
    } catch (e) {
      setAiExplanation("AI explanation load nahi ho saki. Network check karo.");
    }
    setAiLoading(false);
  };

  const activeLevel = autoDetected || level;
  const levelConfig = LEVELS.find(l => l.id === activeLevel) || LEVELS[0];
  const examples = EXAMPLE_PROBLEMS[level] || [];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'Georgia', serif" }}>
      {/* Animated background grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 10, borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,10,15,0.8)", backdropFilter: "blur(10px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `linear-gradient(135deg, ${levelConfig.color}, ${levelConfig.color}88)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: "bold", color: "#fff",
            boxShadow: `0 0 20px ${levelConfig.color}40`,
            transition: "all 0.3s ease",
          }}>∑</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.5px", color: "#f0f0f8" }}>
              GanitYantra
            </div>
            <div style={{ fontSize: 10, color: "#606080", letterSpacing: "2px", textTransform: "uppercase" }}>
              Math Computational Engine
            </div>
          </div>
        </div>
        <div style={{
          fontSize: 11, color: levelConfig.color, background: `${levelConfig.color}18`,
          border: `1px solid ${levelConfig.color}40`, borderRadius: 20,
          padding: "4px 12px", letterSpacing: "1px", textTransform: "uppercase",
        }}>
          {levelConfig.label} — {levelConfig.desc}
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 10, maxWidth: 780, margin: "0 auto", padding: "32px 20px" }}>

        {/* Level Selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {LEVELS.map(l => (
            <button key={l.id} onClick={() => { setLevel(l.id); setAutoDetected(null); }}
              style={{
                padding: "7px 14px", borderRadius: 8, border: `1px solid ${level === l.id ? l.color : "rgba(255,255,255,0.08)"}`,
                background: level === l.id ? `${l.color}20` : "transparent",
                color: level === l.id ? l.color : "#606080",
                fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'Georgia', serif",
              }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: `1px solid ${autoDetected ? levelConfig.color + "60" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 16, padding: "20px", marginBottom: 16,
          transition: "border-color 0.3s ease",
        }}>
          <div style={{ fontSize: 11, color: "#404060", marginBottom: 10, letterSpacing: "1px", textTransform: "uppercase" }}>
            Problem Enter Karo
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSolve(); }}
            placeholder="e.g.  x^2 - 5x + 6 = 0  |  LCM of 12 and 18  |  4 + 3 * 2 - 1"
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              color: "#e8e8f0", fontSize: 17, resize: "none", minHeight: 60,
              fontFamily: "'Courier New', monospace", lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />
          {autoDetected && autoDetected !== level && (
            <div style={{ fontSize: 11, color: levelConfig.color, marginTop: 8, opacity: 0.8 }}>
              ⚡ Auto-detected: {LEVELS.find(l => l.id === autoDetected)?.label}
            </div>
          )}
        </div>

        {/* Example Chips */}
        {examples.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {examples.map(ex => (
              <button key={ex} onClick={() => setInput(ex)} style={{
                fontSize: 11, padding: "5px 11px", borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
                color: "#505070", cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'Courier New', monospace",
              }}
                onMouseEnter={e => { e.target.style.color = levelConfig.color; e.target.style.borderColor = levelConfig.color + "60"; }}
                onMouseLeave={e => { e.target.style.color = "#505070"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >{ex}</button>
            ))}
          </div>
        )}

        {/* Solve Button */}
        <button onClick={handleSolve} disabled={solving || !input.trim() || !katexLoaded}
          style={{
            width: "100%", padding: "14px", borderRadius: 12,
            background: solving ? `${levelConfig.color}30` : `linear-gradient(135deg, ${levelConfig.color}, ${levelConfig.color}bb)`,
            border: "none", color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: solving ? "not-allowed" : "pointer", transition: "all 0.3s",
            fontFamily: "'Georgia', serif", letterSpacing: "0.5px",
            boxShadow: solving ? "none" : `0 4px 20px ${levelConfig.color}40`,
          }}>
          {!katexLoaded ? "Loading Math Engine..." : solving ? "Solving..." : "Solve Karo — Step by Step →"}
        </button>

        {/* Error */}
        {result?.error && (
          <div style={{
            marginTop: 24, padding: 20, borderRadius: 12,
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171", fontSize: 13, lineHeight: 1.7,
          }}>
            {result.message}
          </div>
        )}

        {/* Solution */}
        {result && !result.error && (
          <div style={{ marginTop: 28 }}>
            {/* Steps */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#404060", marginBottom: 16, letterSpacing: "1px", textTransform: "uppercase" }}>
                Step-by-Step Solution
              </div>
              {result.steps.map((step, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, marginBottom: 12,
                  opacity: i < revealedSteps ? 1 : 0,
                  transform: i < revealedSteps ? "translateY(0)" : "translateY(10px)",
                  transition: "all 0.4s ease",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: `${levelConfig.color}20`, border: `1px solid ${levelConfig.color}50`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: levelConfig.color, fontFamily: "'Courier New', monospace",
                  }}>{i + 1}</div>
                  <div style={{
                    flex: 1, background: "rgba(255,255,255,0.02)", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px",
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 6, color: "#f0f0f8" }}>
                      {katexLoaded ? <KaTeXRenderer latex={step.latex} display={false} /> : step.latex}
                    </div>
                    <div style={{ fontSize: 12, color: "#505070", lineHeight: 1.5 }}>{step.explanation}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Answer */}
            {revealedSteps >= result.steps.length && (
              <div style={{
                padding: "20px 24px", borderRadius: 14,
                background: `${levelConfig.color}12`, border: `1px solid ${levelConfig.color}40`,
                marginBottom: 24, animation: "fadeIn 0.5s ease",
              }}>
                <div style={{ fontSize: 10, color: levelConfig.color, letterSpacing: "2px", marginBottom: 10, textTransform: "uppercase" }}>
                  Final Answer
                </div>
                <div style={{ fontSize: 24, color: "#f8f8ff" }}>
                  {katexLoaded && result.answerLatex
                    ? <KaTeXRenderer latex={result.answerLatex} display={true} />
                    : result.answer}
                </div>
              </div>
            )}

            {/* AI Explanation */}
            <div style={{
              borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "14px 20px",
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6,
                  background: `linear-gradient(135deg, ${levelConfig.color}, #8b5cf6)`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                }}>✦</div>
                <div style={{ fontSize: 12, color: "#707090", letterSpacing: "0.5px" }}>
                  AI Teacher — Hinglish Explanation ({levelConfig.label})
                </div>
              </div>
              <div style={{ padding: "18px 20px", minHeight: 80 }}>
                {aiLoading ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: "50%", background: levelConfig.color,
                        animation: "pulse 1.2s ease infinite", animationDelay: `${i * 0.2}s`,
                      }} />
                    ))}
                    <span style={{ fontSize: 12, color: "#404060", marginLeft: 4 }}>Claude soch raha hai...</span>
                  </div>
                ) : aiExplanation ? (
                  <div style={{ fontSize: 14, color: "#b0b0c8", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                    {aiExplanation}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "#303050" }}>Steps solve hone ke baad explanation aayegi...</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Math Engine", val: "math.js (Client-side)" },
              { label: "Symbolic", val: "SymPy (Server)" },
              { label: "Rendering", val: "KaTeX" },
              { label: "AI Layer", val: "Claude API" },
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
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        textarea::placeholder { color: #303050; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}
