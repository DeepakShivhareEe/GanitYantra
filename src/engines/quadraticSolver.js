// ============================================================
// GANITYANTRA — COMPLETE QUADRATIC SOLVER ENGINE
// Supports 17+ equation types
// ============================================================

// ── Utilities ──────────────────────────────────────────────

function fmtCoef(a) {
  if (a === 1) return "";
  if (a === -1) return "-";
  return `${a}`;
}

function fmtSign(n) {
  if (n === 0) return "";
  return n > 0 ? `+${n}` : `${n}`;
}

function toFixed4(n) {
  return parseFloat(n.toFixed(4));
}

// Format complex number nicely
function _fmtComplex(real, imag) {
  if (imag === 0) return `${toFixed4(real)}`;
  if (real === 0) return `${toFixed4(imag)}i`;
  return `${toFixed4(real)} ${imag > 0 ? "+" : "-"} ${Math.abs(toFixed4(imag))}i`;
}

// Solve standard ax^2 + bx + c = 0 and return steps + roots
function solveStandard(a, b, c, extraStep = null) {
  const disc = b * b - 4 * a * c;
  const fA = fmtCoef(a);
  const bSign = b >= 0 ? `+${b}` : `${b}`;
  const cSign = c >= 0 ? `+${c}` : `${c}`;

  const steps = [];
  if (extraStep) steps.push(extraStep);

  steps.push({
    latex: `${fA}x^2 ${bSign}x ${cSign} = 0`,
    explanation: "Standard form: ax² + bx + c = 0",
  });
  steps.push({
    latex: `a = ${a},\\quad b = ${b},\\quad c = ${c}`,
    explanation: "Coefficients identify kiye",
  });
  steps.push({
    latex: `D = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${toFixed4(disc)}`,
    explanation: "Discriminant D = b² - 4ac calculate kiya",
  });

  let answer, answerLatex, x1, x2;

  if (Math.abs(disc) < 1e-10) {
    // Equal roots
    const x = toFixed4(-b / (2 * a));
    steps.push({
      latex: `D = 0 \\Rightarrow \\text{Equal (repeated) roots}`,
      explanation: "D = 0 hai, isliye dono roots equal hain",
    });
    steps.push({
      latex: `x = \\frac{-b}{2a} = \\frac{${-b}}{${2 * a}} = ${x}`,
      explanation: "Sirf ek root hai — repeated",
    });
    answer = `x = ${x} (repeated root)`;
    answerLatex = `x = ${x}`;
    x1 = x2 = x;
  } else if (disc < 0) {
    // Complex roots
    const realPart = toFixed4(-b / (2 * a));
    const imagPart = toFixed4(Math.sqrt(-disc) / (2 * a));
    steps.push({
      latex: `D < 0 \\Rightarrow \\text{Complex conjugate roots}`,
      explanation: "D < 0 hai, isliye roots real nahi hain — complex hain",
    });
    steps.push({
      latex: `x = \\frac{-b \\pm \\sqrt{D}}{2a} = ${realPart} \\pm ${imagPart}i`,
      explanation: "Complex roots calculate kiye",
    });
    answer = `x = ${realPart} ± ${imagPart}i`;
    answerLatex = `x = ${realPart} \\pm ${imagPart}i`;
    x1 = `${realPart}+${imagPart}i`;
    x2 = `${realPart}-${imagPart}i`;
  } else {
    // Real distinct roots
    x1 = toFixed4((-b + Math.sqrt(disc)) / (2 * a));
    x2 = toFixed4((-b - Math.sqrt(disc)) / (2 * a));
    steps.push({
      latex: `D > 0 \\Rightarrow \\text{Two real distinct roots}`,
      explanation: "D > 0 hai, isliye do alag real roots hain",
    });
    steps.push({
      latex: `x = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{${-b} \\pm \\sqrt{${toFixed4(disc)}}}{${2 * a}}`,
      explanation: "Quadratic formula apply kiya: x = (-b ± √D) / 2a",
    });
    steps.push({
      latex: `x_1 = ${x1},\\quad x_2 = ${x2}`,
      explanation: "Dono roots calculate kiye",
    });

    // Show factored form if integer roots
    if (Number.isInteger(x1) && Number.isInteger(x2) && a === 1) {
      steps.push({
        latex: `(x - ${x1})(x - ${x2}) = 0`,
        explanation: "Factored form — verify kar sakte ho",
      });
    }

    // Vieta's formulas
    steps.push({
      latex: `\\text{Sum of roots} = x_1 + x_2 = \\frac{-b}{a} = ${toFixed4(-b / a)}`,
      explanation: "Vieta's formula: roots ka sum = -b/a",
    });
    steps.push({
      latex: `\\text{Product of roots} = x_1 \\cdot x_2 = \\frac{c}{a} = ${toFixed4(c / a)}`,
      explanation: "Vieta's formula: roots ka product = c/a",
    });

    answer = `x₁ = ${x1}, x₂ = ${x2}`;
    answerLatex = `x_1 = ${x1},\\ x_2 = ${x2}`;
  }

  return { steps, answer, answerLatex, x1, x2, disc };
}

// ── TYPE DETECTORS ─────────────────────────────────────────

// 1. VERTEX FORM: a(x - h)^2 + k = 0 or a(x - h)^2 = k
function detectVertexForm(input) {
  // Matches: 3(x - 2)^2 - 12 = 0 or 3(x+2)^2 = 12
  return /[-+]?\s*\d*\.?\d*\s*\(\s*x\s*[+-]\s*\d+\.?\d*\s*\)\s*\^?\s*2/i.test(input);
}

function solveVertexForm(input) {
  const match = input.match(/([-+]?\d*\.?\d*)\s*\(\s*x\s*([+-])\s*(\d+\.?\d*)\s*\)\s*\^?2\s*([+-]\s*\d*\.?\d*)?\s*=\s*([-+]?\d*\.?\d*)/);
  if (!match) return null;

  let a = parseFloat(match[1]) || 1;
  const sign = match[2] === "+" ? 1 : -1;
  const h = sign * parseFloat(match[3]);
  let rhs = parseFloat(match[5]) || 0;
  let k = match[4] ? parseFloat(match[4].replace(/\s/g, "")) : 0;

  // a(x-h)^2 + k = rhs → a(x-h)^2 = rhs - k
  const val = (rhs - k) / a;

  const steps = [
    {
      latex: `${a}(x ${h >= 0 ? "-" : "+"} ${Math.abs(h)})^2 ${k >= 0 ? "+" : ""}${k} = ${rhs}`,
      explanation: "Vertex form identify kiya: a(x - h)² + k = 0",
    },
    {
      latex: `(x ${h >= 0 ? "-" : "+"} ${Math.abs(h)})^2 = \\frac{${rhs - k}}{${a}} = ${toFixed4(val)}`,
      explanation: "Dono sides ko 'a' se divide kiya",
    },
  ];

  if (val < 0) {
    steps.push({
      latex: `\\text{No real solution — square cannot be negative}`,
      explanation: "Right side negative hai, real roots nahi hain",
    });
    const imagPart = toFixed4(Math.sqrt(-val));
    steps.push({
      latex: `x = ${h} \\pm ${imagPart}i`,
      explanation: "Complex roots milte hain",
    });
    return {
      steps,
      answer: `x = ${h} ± ${imagPart}i (complex)`,
      answerLatex: `x = ${h} \\pm ${imagPart}i`,
    };
  }

  const sqrtVal = toFixed4(Math.sqrt(val));
  const x1 = toFixed4(h + sqrtVal);
  const x2 = toFixed4(h - sqrtVal);

  steps.push({
    latex: `x ${h >= 0 ? "-" : "+"} ${Math.abs(h)} = \\pm ${sqrtVal}`,
    explanation: "Square root dono sides le ± sign ke saath",
  });
  steps.push({
    latex: `x_1 = ${h} + ${sqrtVal} = ${x1},\\quad x_2 = ${h} - ${sqrtVal} = ${x2}`,
    explanation: "Dono roots calculate kiye",
  });

  // Expand to verify: a(x-h)^2 + k = ax^2 - 2ahx + ah^2 + k
  const bExp = toFixed4(-2 * a * h);
  const cExp = toFixed4(a * h * h + k - rhs);
  steps.push({
    latex: `\\text{Expanded: } ${fmtCoef(a)}x^2 ${fmtSign(bExp)}x ${fmtSign(cExp)} = 0`,
    explanation: "Expand karke standard form mein verify karo",
  });

  return {
    steps,
    answer: `x₁ = ${x1}, x₂ = ${x2}`,
    answerLatex: `x_1 = ${x1},\\ x_2 = ${x2}`,
  };
}

// 2. FACTORED FORM: a(x - r1)(x - r2) = 0
function detectFactoredForm(input) {
  return /\(x\s*[+-]\s*\d+\.?\d*\)\s*\(x\s*[+-]\s*\d+\.?\d*\)/i.test(input);
}

function solveFactoredForm(input) {
  const match = input.match(/([-+]?\d*\.?\d*)?\s*\(x\s*([+-])\s*(\d+\.?\d*)\)\s*\(x\s*([+-])\s*(\d+\.?\d*)\)/);
  if (!match) return null;

  const a = parseFloat(match[1]) || 1;
  const s1 = match[2] === "+" ? -1 : 1;
  const r1 = toFixed4(s1 * parseFloat(match[3]));
  const s2 = match[4] === "+" ? -1 : 1;
  const r2 = toFixed4(s2 * parseFloat(match[5]));

  const steps = [
    {
      latex: `${a === 1 ? "" : a}(x ${r1 >= 0 ? "-" : "+"} ${Math.abs(r1)})(x ${r2 >= 0 ? "-" : "+"} ${Math.abs(r2)}) = 0`,
      explanation: "Factored form identify kiya: a(x - r₁)(x - r₂) = 0",
    },
    {
      latex: `\\text{Zero Product Property: } A \\times B = 0 \\Rightarrow A=0 \\text{ ya } B=0`,
      explanation: "Agar do cheezein multiply karke zero ho, toh koi ek zero honi chahiye",
    },
    {
      latex: `x ${r1 >= 0 ? "-" : "+"} ${Math.abs(r1)} = 0 \\quad \\Rightarrow \\quad x_1 = ${r1}`,
      explanation: "Pehle factor se pehli root mili",
    },
    {
      latex: `x ${r2 >= 0 ? "-" : "+"} ${Math.abs(r2)} = 0 \\quad \\Rightarrow \\quad x_2 = ${r2}`,
      explanation: "Doosre factor se doosri root mili",
    },
  ];

  // Expand to standard form
  const b = toFixed4(-(r1 + r2) * a);
  const c = toFixed4(r1 * r2 * a);
  steps.push({
    latex: `\\text{Standard form: } ${fmtCoef(a)}x^2 ${fmtSign(b)}x ${fmtSign(c)} = 0`,
    explanation: "Expand karke standard form verify karo",
  });

  return {
    steps,
    answer: `x₁ = ${r1}, x₂ = ${r2}`,
    answerLatex: `x_1 = ${r1},\\ x_2 = ${r2}`,
  };
}

// 3. PURE FORM: ax^2 = c or ax^2 + c = 0
function detectPureForm(input) {
  const clean = input.replace(/\s+/g, "");
  return /^[-+]?\d*\.?\d*x\^?2\s*([+-]\s*\d+\.?\d*)?\s*=\s*[-+]?\d*\.?\d*$/.test(clean)
    && !/[+-]\d*x[^2]/.test(clean.replace("x2", "").replace("x^2", ""));
}

function solvePureForm(input) {
  // ax^2 + c1 = c2  →  ax^2 = c2 - c1
  const parts = input.split("=");
  if (parts.length !== 2) return null;

  let left = parts[0].replace(/\s+/g, "");
  let rhs = parseFloat(parts[1]) || 0;

  const aMatch = left.match(/^([-+]?\d*\.?\d*)x\^?2/);
  const cMatch = left.match(/x\^?2\s*([-+]\d+\.?\d*)/);

  const a = parseFloat(aMatch?.[1]) || 1;
  const c = parseFloat(cMatch?.[1]) || 0;
  const val = (rhs - c) / a;

  const steps = [
    {
      latex: `${fmtCoef(a)}x^2 = ${toFixed4(rhs - c)}`,
      explanation: "Pure quadratic — x ka koi linear term nahi hai",
    },
    {
      latex: `x^2 = \\frac{${toFixed4(rhs - c)}}{${a}} = ${toFixed4(val)}`,
      explanation: `Dono sides ko ${a} se divide kiya`,
    },
  ];

  if (val < 0) {
    steps.push({
      latex: `x = \\pm\\sqrt{${toFixed4(val)}} = \\pm ${toFixed4(Math.sqrt(-val))}i`,
      explanation: "Negative ka square root — complex roots milte hain",
    });
    const img = toFixed4(Math.sqrt(-val));
    return {
      steps,
      answer: `x = ±${img}i (complex)`,
      answerLatex: `x = \\pm ${img}i`,
    };
  }

  const sqrtVal = toFixed4(Math.sqrt(val));
  steps.push({
    latex: `x = \\pm\\sqrt{${toFixed4(val)}} = \\pm ${sqrtVal}`,
    explanation: "Square root dono sides le ± sign ke saath",
  });
  steps.push({
    latex: `x_1 = ${sqrtVal},\\quad x_2 = ${-sqrtVal}`,
    explanation: "Dono roots equal in magnitude, opposite in sign",
  });

  return {
    steps,
    answer: `x₁ = ${sqrtVal}, x₂ = ${-sqrtVal}`,
    answerLatex: `x_1 = ${sqrtVal},\\ x_2 = ${-sqrtVal}`,
  };
}

// 4. BI-QUADRATIC: x^4 + bx^2 + c = 0
function detectBiQuadratic(input) {
  return /x\^?4/i.test(input) && !/x\^?3/.test(input);
}

function solveBiQuadratic(input) {
  const match = input.match(/([-+]?\d*\.?\d*)x\^?4\s*([-+]\s*\d*\.?\d*)x\^?2\s*([-+]\s*\d*\.?\d*)?\s*=\s*0/);
  if (!match) return null;

  const a = parseFloat(match[1]) || 1;
  const b = parseFloat(match[2]?.replace(/\s/g, "")) || 0;
  const c = parseFloat(match[3]?.replace(/\s/g, "")) || 0;

  const steps = [
    {
      latex: `${fmtCoef(a)}x^4 ${fmtSign(b)}x^2 ${fmtSign(c)} = 0`,
      explanation: "Bi-quadratic equation — x ki sirf even powers hain",
    },
    {
      latex: `\\text{Let } y = x^2 \\Rightarrow ${fmtCoef(a)}y^2 ${fmtSign(b)}y ${fmtSign(c)} = 0`,
      explanation: "Substitution: y = x² rakh do — ab yeh simple quadratic ban gaya",
    },
  ];

  const disc = b * b - 4 * a * c;
  steps.push({
    latex: `D = (${b})^2 - 4(${a})(${c}) = ${toFixed4(disc)}`,
    explanation: "Discriminant calculate kiya",
  });

  if (disc < 0) {
    steps.push({
      latex: `D < 0 \\Rightarrow \\text{No real solutions}`,
      explanation: "Koi real roots nahi hain",
    });
    return { steps, answer: "No real roots", answerLatex: "\\text{No real roots}" };
  }

  const y1 = toFixed4((-b + Math.sqrt(disc)) / (2 * a));
  const y2 = toFixed4((-b - Math.sqrt(disc)) / (2 * a));

  steps.push({
    latex: `y_1 = ${y1},\\quad y_2 = ${y2}`,
    explanation: "y ki dono values nikali",
  });

  const roots = [];
  const rootsLatex = [];

  [y1, y2].forEach((y, i) => {
    if (y < 0) {
      steps.push({
        latex: `y_${i + 1} = ${y} < 0 \\Rightarrow x^2 = ${y} \\Rightarrow x = \\pm${toFixed4(Math.sqrt(-y))}i`,
        explanation: `y${i + 1} negative hai — complex roots milte hain`,
      });
      roots.push(`±${toFixed4(Math.sqrt(-y))}i`);
      rootsLatex.push(`\\pm ${toFixed4(Math.sqrt(-y))}i`);
    } else {
      const sqrtY = toFixed4(Math.sqrt(y));
      steps.push({
        latex: `y_${i + 1} = ${y} \\Rightarrow x^2 = ${y} \\Rightarrow x = \\pm${sqrtY}`,
        explanation: `x² = ${y} se x = ±${sqrtY} nikala`,
      });
      roots.push(`±${sqrtY}`);
      rootsLatex.push(`\\pm ${sqrtY}`);
    }
  });

  return {
    steps,
    answer: `x = ${roots.join(", ")}`,
    answerLatex: `x = ${rootsLatex.join(",\\ ")}`,
  };
}

// 5. EXPONENTIAL QUADRATIC: a^(2x) + b*a^x + c = 0
function detectExponentialQuadratic(input) {
  return /\d+\^[{(]?2x[})]?/.test(input) || /\d+\^[{(]?2x/.test(input);
}

function solveExponentialQuadratic(input) {
  // e.g. 2^(2x) - 6(2^x) + 8 = 0
  const baseMatch = input.match(/(\d+)\^\{?2x\}?/);
  if (!baseMatch) return null;
  const base = parseInt(baseMatch[1]);

  const simplified = input
    .replace(`${base}^{2x}`, "y^2")
    .replace(`${base}^{2x}`, "y^2")
    .replace(new RegExp(`\\(${base}\\^x\\)`, "g"), "y")
    .replace(new RegExp(`${base}\\^x`, "g"), "y");

  // Extract coefficients from simplified
  const coefMatch = simplified.match(/([-+]?\d*\.?\d*)y\^2\s*([-+]\s*\d*\.?\d*)y\s*([-+]\s*\d*\.?\d*)?\s*=\s*0/);
  if (!coefMatch) return null;

  const a = parseFloat(coefMatch[1]) || 1;
  const b = parseFloat(coefMatch[2]?.replace(/\s/g, "")) || 0;
  const c = parseFloat(coefMatch[3]?.replace(/\s/g, "")) || 0;

  const steps = [
    {
      latex: `${base}^{2x} ${fmtSign(b)}(${base}^x) ${fmtSign(c)} = 0`,
      explanation: "Exponential quadratic — base same hai",
    },
    {
      latex: `\\text{Let } y = ${base}^x \\Rightarrow ${fmtCoef(a)}y^2 ${fmtSign(b)}y ${fmtSign(c)} = 0`,
      explanation: `Substitution: y = ${base}^x rakh do`,
    },
  ];

  const disc = b * b - 4 * a * c;
  const y1 = toFixed4((-b + Math.sqrt(disc)) / (2 * a));
  const y2 = toFixed4((-b - Math.sqrt(disc)) / (2 * a));

  steps.push({ latex: `y_1 = ${y1},\\quad y_2 = ${y2}`, explanation: "y ki values nikali" });

  [y1, y2].forEach((y, _i) => {
    if (y > 0) {
      const x = toFixed4(Math.log(y) / Math.log(base));
      steps.push({
        latex: `${base}^x = ${y} \\Rightarrow x = \\log_{${base}}(${y}) = ${x}`,
        explanation: `${base}^x = ${y} se x nikala using logarithm`,
      });
    } else {
      steps.push({
        latex: `${base}^x = ${y} \\Rightarrow \\text{No real solution (exponential always > 0)}`,
        explanation: `Exponential function always positive hota hai — ${y} ke liye solution nahi`,
      });
    }
  });

  const validRoots = [y1, y2]
    .filter(y => y > 0)
    .map(y => toFixed4(Math.log(y) / Math.log(base)));

  return {
    steps,
    answer: validRoots.length > 0 ? `x = ${validRoots.join(", ")}` : "No real solution",
    answerLatex: validRoots.length > 0
      ? validRoots.map((x, i) => `x_${i + 1} = ${x}`).join(",\\ ")
      : "\\text{No real solution}",
  };
}

// 6. TRIGONOMETRIC QUADRATIC: 2sin^2(x) - 3sin(x) + 1 = 0
function detectTrigQuadratic(input) {
  return /sin\^?2|cos\^?2|tan\^?2/i.test(input);
}

function solveTrigQuadratic(input) {
  const fnMatch = input.match(/(sin|cos|tan)/i);
  if (!fnMatch) return null;
  const fn = fnMatch[1].toLowerCase();

  const coefMatch = input.match(/([-+]?\d*\.?\d*)\s*(?:sin|cos|tan)\^?2\(x\)\s*([-+]\s*\d*\.?\d*)\s*(?:sin|cos|tan)\(x\)\s*([-+]\s*\d*\.?\d*)?\s*=\s*0/i);
  if (!coefMatch) return null;

  const a = parseFloat(coefMatch[1]) || 1;
  const b = parseFloat(coefMatch[2]?.replace(/\s/g, "")) || 0;
  const c = parseFloat(coefMatch[3]?.replace(/\s/g, "")) || 0;

  const steps = [
    {
      latex: `${fmtCoef(a)}\\${fn}^2(x) ${fmtSign(b)}\\${fn}(x) ${fmtSign(c)} = 0`,
      explanation: `Trigonometric quadratic — ${fn}(x) ek variable ki tarah treat karo`,
    },
    {
      latex: `\\text{Let } t = \\${fn}(x) \\Rightarrow ${fmtCoef(a)}t^2 ${fmtSign(b)}t ${fmtSign(c)} = 0`,
      explanation: `Substitution: t = ${fn}(x)`,
    },
  ];

  const disc = b * b - 4 * a * c;
  const t1 = toFixed4((-b + Math.sqrt(disc)) / (2 * a));
  const t2 = toFixed4((-b - Math.sqrt(disc)) / (2 * a));

  steps.push({ latex: `t_1 = ${t1},\\quad t_2 = ${t2}`, explanation: "t ki values nikali" });

  const range = fn === "sin" || fn === "cos" ? [-1, 1] : [-Infinity, Infinity];
  const validTs = [t1, t2].filter(t => t >= range[0] && t <= range[1]);

  validTs.forEach((t, _i) => {
    const angle = toFixed4((Math.asin(Math.abs(t)) * 180) / Math.PI);
    steps.push({
      latex: `\\${fn}(x) = ${t} \\Rightarrow x = ${fn === "sin" ? `\\sin^{-1}(${t})` : fn === "cos" ? `\\cos^{-1}(${t})` : `\\tan^{-1}(${t})`} = ${angle}°`,
      explanation: `${fn}(x) = ${t} se x nikala — general solution bhi hoga`,
    });
  });

  if (validTs.length === 0) {
    steps.push({
      latex: `\\text{No valid solution — } |t| > 1 \\text{ for sin/cos}`,
      explanation: "sin aur cos ki range [-1, 1] hai — koi solution nahi",
    });
    return { steps, answer: "No real solution", answerLatex: "\\text{No real solution}" };
  }

  return {
    steps,
    answer: `${fn}(x) = ${validTs.join(" or ")}`,
    answerLatex: validTs.map((t, _i) => `\\${fn}(x) = ${t}`).join(",\\ "),
  };
}

// 7. LOGARITHMIC QUADRATIC: (log x)^2 - 4(log x) + 3 = 0
function detectLogQuadratic(input) {
  return /log/i.test(input) && /\^?2/.test(input);
}

function solveLogQuadratic(input) {
  const baseMatch = input.match(/log_?\{?(\d+)\}?/);
  const logBase = baseMatch ? parseInt(baseMatch[1]) : 10;

  const coefMatch = input.match(/([-+]?\d*\.?\d*)\s*\(?\s*log[_\d]*\s*x\s*\)?\s*\^?2\s*([-+]\s*\d*\.?\d*)\s*\(?\s*log[_\d]*\s*x\s*\)?\s*([-+]\s*\d*\.?\d*)?\s*=\s*0/i);
  if (!coefMatch) return null;

  const a = parseFloat(coefMatch[1]) || 1;
  const b = parseFloat(coefMatch[2]?.replace(/\s/g, "")) || 0;
  const c = parseFloat(coefMatch[3]?.replace(/\s/g, "")) || 0;

  const steps = [
    {
      latex: `(\\log_{${logBase}} x)^2 ${fmtSign(b)}(\\log_{${logBase}} x) ${fmtSign(c)} = 0`,
      explanation: "Logarithmic quadratic equation",
    },
    {
      latex: `\\text{Let } t = \\log_{${logBase}} x \\Rightarrow ${fmtCoef(a)}t^2 ${fmtSign(b)}t ${fmtSign(c)} = 0`,
      explanation: `Substitution: t = log_${logBase}(x) — ab standard quadratic ban gaya`,
    },
  ];

  const disc = b * b - 4 * a * c;
  const t1 = toFixed4((-b + Math.sqrt(disc)) / (2 * a));
  const t2 = toFixed4((-b - Math.sqrt(disc)) / (2 * a));

  steps.push({ latex: `t_1 = ${t1},\\quad t_2 = ${t2}`, explanation: "t ki values nikali" });

  [t1, t2].forEach((t, _i) => {
    const x = toFixed4(Math.pow(logBase, t));
    steps.push({
      latex: `\\log_{${logBase}} x = ${t} \\Rightarrow x = ${logBase}^{${t}} = ${x}`,
      explanation: `log definition use kiya: log_${logBase}(x) = ${t} → x = ${logBase}^${t}`,
    });
  });

  const x1 = toFixed4(Math.pow(logBase, t1));
  const x2 = toFixed4(Math.pow(logBase, t2));

  steps.push({
    latex: `x_1 = ${x1},\\quad x_2 = ${x2}`,
    explanation: "Final answers — x > 0 check karo (log domain condition)",
  });

  return {
    steps,
    answer: `x₁ = ${x1}, x₂ = ${x2}`,
    answerLatex: `x_1 = ${x1},\\ x_2 = ${x2}`,
  };
}

// 8. RADICAL QUADRATIC: x - 3√x + 2 = 0
function detectRadicalQuadratic(input) {
  return /sqrt|√/.test(input) && /x/.test(input);
}

function solveRadicalQuadratic(input) {
  // x - 3√x + 2 = 0 → let t = √x → t^2 - 3t + 2 = 0
  const coefMatch = input.match(/([-+]?\d*\.?\d*)\s*x\s*([-+]\s*\d*\.?\d*)\s*(?:sqrt\(x\)|√x)\s*([-+]\s*\d*\.?\d*)?\s*=\s*0/i);
  if (!coefMatch) return null;

  const a = parseFloat(coefMatch[1]) || 1;
  const b = parseFloat(coefMatch[2]?.replace(/\s/g, "")) || 0;
  const c = parseFloat(coefMatch[3]?.replace(/\s/g, "")) || 0;

  const steps = [
    {
      latex: `${fmtCoef(a)}x ${fmtSign(b)}\\sqrt{x} ${fmtSign(c)} = 0`,
      explanation: "Radical quadratic — √x wali equation",
    },
    {
      latex: `\\text{Let } t = \\sqrt{x} \\Rightarrow x = t^2`,
      explanation: "Substitution: t = √x rakho, toh x = t²",
    },
    {
      latex: `${fmtCoef(a)}t^2 ${fmtSign(b)}t ${fmtSign(c)} = 0`,
      explanation: "Ab standard quadratic ban gaya — solve karo",
    },
  ];

  const disc = b * b - 4 * a * c;
  const t1 = toFixed4((-b + Math.sqrt(disc)) / (2 * a));
  const t2 = toFixed4((-b - Math.sqrt(disc)) / (2 * a));

  steps.push({ latex: `t_1 = ${t1},\\quad t_2 = ${t2}`, explanation: "t ki values nikali" });

  const validTs = [t1, t2].filter(t => t >= 0);

  validTs.forEach((t, i) => {
    const x = toFixed4(t * t);
    steps.push({
      latex: `t_${i + 1} = ${t} \\Rightarrow \\sqrt{x} = ${t} \\Rightarrow x = ${t}^2 = ${x}`,
      explanation: `t ≥ 0 hai, isliye x = t² = ${x} valid hai`,
    });
  });

  [t1, t2].filter(t => t < 0).forEach(t => {
    steps.push({
      latex: `t = ${t} < 0 \\Rightarrow \\sqrt{x} = ${t} \\text{ — invalid}`,
      explanation: "√x negative nahi ho sakta — yeh root reject karo",
    });
  });

  const roots = validTs.map(t => toFixed4(t * t));

  return {
    steps,
    answer: roots.length > 0 ? `x = ${roots.join(", ")}` : "No valid solution",
    answerLatex: roots.length > 0
      ? roots.map((x, i) => `x_${i + 1} = ${x}`).join(",\\ ")
      : "\\text{No valid solution}",
  };
}

// ── MASTER DETECT + SOLVE ──────────────────────────────────

export function detectQuadraticType(input) {
  if (detectBiQuadratic(input)) return "biquadratic";
  if (detectExponentialQuadratic(input)) return "exponential";
  if (detectTrigQuadratic(input)) return "trigonometric";
  if (detectLogQuadratic(input)) return "logarithmic";
  if (detectRadicalQuadratic(input)) return "radical";
  if (detectFactoredForm(input)) return "factored";
  if (detectVertexForm(input)) return "vertex";
  if (detectPureForm(input)) return "pure";
  return "standard";
}

export function solveQuadratic(input) {

  // ── Clean input first ──
  const cleaned = input.replace(/\s+/g, "");

  // ── Expand grouped form: x(x-3) - 2(x-3) = 0 ──
  // After cleaning spaces: x(x-3)-2(x-3)=0
  const groupMatch = cleaned.match(/x\(x([+-]\d+\.?\d*)\)([+-]\d+\.?\d*)\(x([+-]\d+\.?\d*)\)=0/);
  if (groupMatch) {
    const r1   = parseFloat(groupMatch[1]);  // -3
    const coef = parseFloat(groupMatch[2]);  // -2
    const r2   = parseFloat(groupMatch[3]);  // -3
    const a = 1;
    const b = r1 + coef;                     // -3 + -2 = -5
    const c = coef * r2;                     // -2 * -3 = 6
    return solveStandard(a, b, c, {
      latex: `x(x ${r1 >= 0 ? "+" : ""}${r1}) ${coef >= 0 ? "+" : ""}${coef}(x ${r2 >= 0 ? "+" : ""}${r2}) = 0`,
      explanation: "Grouped form — common factor (x" + (r1 >= 0 ? "+" : "") + r1 + ") hai — expand karke standard form banaya",
    });
  }
  const type = detectQuadraticType(input);

  // Try special forms first
  if (type === "biquadratic") return solveBiQuadratic(input);
  if (type === "exponential") return solveExponentialQuadratic(input);
  if (type === "trigonometric") return solveTrigQuadratic(input);
  if (type === "logarithmic") return solveLogQuadratic(input);
  if (type === "radical") return solveRadicalQuadratic(input);
  if (type === "factored") return solveFactoredForm(input);
  if (type === "vertex") return solveVertexForm(input);
  if (type === "pure") return solvePureForm(input);

  // Standard form parser (handles all rearrangements)
  let left = input, right = "0";
  if (input.includes("=")) {
    const parts = input.split("=");
    left = parts[0].trim();
    right = parts[1].trim();
  }

  let expr = right === "0" ? left : `${left}-(${right})`;
  expr = expr.replace(/\s+/g, "").replace(/\^/g, "");
  if (!expr.startsWith("-")) expr = "+" + expr;

  const terms = expr.match(/[+-][^+-]*/g) || [];
  let a = 0, b = 0, c = 0;

  terms.forEach(term => {
    if (term.includes("x2")) {
      const coef = term.replace("x2", "");
      a += parseFloat(coef === "+" || coef === "" ? "1" : coef === "-" ? "-1" : coef);
    } else if (term.includes("x")) {
      const coef = term.replace("x", "");
      b += parseFloat(coef === "+" || coef === "" ? "1" : coef === "-" ? "-1" : coef);
    } else {
      const val = parseFloat(term);
      if (!isNaN(val)) c += val;
    }
  });

  if (a === 0) return null;

  const transpositionNote = right !== "0"
    ? { latex: `${left} = ${right} \\Rightarrow ${left} - (${right}) = 0`, explanation: `Daayein taraf ki ${right} ko baayein le aaye` }
    : null;

  return solveStandard(a, b, c, transpositionNote);
}
