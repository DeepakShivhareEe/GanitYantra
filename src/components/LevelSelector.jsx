export default function LevelSelector({ levels, level, setLevel, setAutoDetected }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
      {levels.map(l => (
        <button
          key={l.id}
          onClick={() => { setLevel(l.id); setAutoDetected(null); }}
          style={{
            padding: "7px 14px", borderRadius: 8,
            border: `1px solid ${level === l.id ? l.color : "rgba(255,255,255,0.08)"}`,
            background: level === l.id ? `${l.color}20` : "transparent",
            color: level === l.id ? l.color : "#606080",
            fontSize: 12, cursor: "pointer", transition: "all 0.2s",
            fontFamily: "'Georgia', serif",
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
