export default function AIExplanation({ explanation, loading, levelConfig }) {
  return (
    <div style={{
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: 6,
          background: `linear-gradient(135deg, ${levelConfig.color}, #8b5cf6)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11,
        }}>✦</div>
        <div style={{ fontSize: 12, color: "#707090", letterSpacing: "0.5px" }}>
          AI Teacher — Hinglish Explanation ({levelConfig.label})
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px", minHeight: 80 }}>
        {loading ? (
          // Loading dots
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: levelConfig.color,
                animation: "pulse 1.2s ease infinite",
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
            <span style={{ fontSize: 12, color: "#404060", marginLeft: 4 }}>
              AI soch raha hai...
            </span>
          </div>
        ) : explanation ? (
          // Explanation text
          <div style={{
            fontSize: 14, color: "#b0b0c8",
            lineHeight: 1.8, whiteSpace: "pre-wrap",
          }}>
            {explanation}
          </div>
        ) : (
          // Placeholder
          <div style={{ fontSize: 12, color: "#303050" }}>
            Steps solve hone ke baad explanation aayegi...
          </div>
        )}
      </div>
    </div>
  );
}
