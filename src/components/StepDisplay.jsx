import KaTeXRenderer from "./KaTeXRenderer.jsx";

export default function StepDisplay({ steps, revealedSteps, levelConfig, katexLoaded }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 11, color: "#404060", marginBottom: 16,
        letterSpacing: "1px", textTransform: "uppercase",
      }}>
        Step-by-Step Solution
      </div>

      {steps.map((step, i) => (
        <div
          key={i}
          style={{
            display: "flex", gap: 16, marginBottom: 12,
            opacity: i < revealedSteps ? 1 : 0,
            transform: i < revealedSteps ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.4s ease",
          }}
        >
          {/* Step Number */}
          <div style={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            background: `${levelConfig.color}20`,
            border: `1px solid ${levelConfig.color}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, color: levelConfig.color,
            fontFamily: "'Courier New', monospace",
          }}>
            {i + 1}
          </div>

          {/* Step Content */}
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.02)", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px",
          }}>
            <div style={{ fontSize: 18, marginBottom: 6, color: "#f0f0f8" }}>
              {katexLoaded
                ? <KaTeXRenderer latex={step.latex} display={false} />
                : step.latex}
            </div>
            <div style={{ fontSize: 12, color: "#505070", lineHeight: 1.5 }}>
              {step.explanation}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
