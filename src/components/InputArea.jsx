export default function InputArea({
  input, setInput, onSolve, examples,
  autoDetected, levelConfig, levels, katexLoaded, solving,
}) {
  return (
    <>
      {/* Input Box */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${autoDetected ? levelConfig.color + "60" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16, padding: "20px", marginBottom: 16,
        transition: "border-color 0.3s ease",
      }}>
        <div style={{
          fontSize: 11, color: "#404060", marginBottom: 10,
          letterSpacing: "1px", textTransform: "uppercase",
        }}>
          Problem Enter Karo
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onSolve(); }}
          placeholder="e.g.  x^2 - 5x + 6 = 0  |  LCM of 12 and 18  |  3/4 + 1/2  |  15% of 240"
          style={{
            width: "100%", background: "transparent",
            border: "none", outline: "none",
            color: "#e8e8f0", fontSize: 17, resize: "none", minHeight: 60,
            fontFamily: "'Courier New', monospace", lineHeight: 1.6,
            boxSizing: "border-box",
          }}
        />
        {/* Auto-detect indicator */}
        {autoDetected && levels && (
          <div style={{ fontSize: 11, color: levelConfig.color, marginTop: 8, opacity: 0.8 }}>
            ⚡ Auto-detected: {levels.find(l => l.id === autoDetected)?.label}
          </div>
        )}
      </div>

      {/* Example Chips */}
      {examples.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {examples.map(ex => (
            <button
              key={ex}
              onClick={() => setInput(ex)}
              style={{
                fontSize: 11, padding: "5px 11px", borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent", color: "#505070",
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'Courier New', monospace",
              }}
              onMouseEnter={e => {
                e.target.style.color = levelConfig.color;
                e.target.style.borderColor = levelConfig.color + "60";
              }}
              onMouseLeave={e => {
                e.target.style.color = "#505070";
                e.target.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >{ex}</button>
          ))}
        </div>
      )}

      {/* Solve Button */}
      <button
        onClick={onSolve}
        disabled={solving || !input.trim() || !katexLoaded}
        style={{
          width: "100%", padding: "14px", borderRadius: 12,
          background: solving
            ? `${levelConfig.color}30`
            : `linear-gradient(135deg, ${levelConfig.color}, ${levelConfig.color}bb)`,
          border: "none", color: "#fff", fontSize: 15, fontWeight: 600,
          cursor: solving ? "not-allowed" : "pointer", transition: "all 0.3s",
          fontFamily: "'Georgia', serif", letterSpacing: "0.5px",
          boxShadow: solving ? "none" : `0 4px 20px ${levelConfig.color}40`,
        }}
      >
        {!katexLoaded ? "Loading Math Engine..." : solving ? "Solving..." : "Solve Karo — Step by Step →"}
      </button>
    </>
  );
}
