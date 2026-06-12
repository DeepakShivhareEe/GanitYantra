export default function Header({ levelConfig }) {
  return (
    <header style={{
      position: "relative", zIndex: 10,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "20px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "rgba(10,10,15,0.8)", backdropFilter: "blur(10px)",
    }}>
      {/* Logo */}
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

      {/* Level Badge */}
      <div style={{
        fontSize: 11, color: levelConfig.color,
        background: `${levelConfig.color}18`,
        border: `1px solid ${levelConfig.color}40`,
        borderRadius: 20, padding: "4px 12px",
        letterSpacing: "1px", textTransform: "uppercase",
      }}>
        {levelConfig.label} — {levelConfig.desc}
      </div>
    </header>
  );
}
