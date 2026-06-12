import KaTeXRenderer from "./KaTeXRenderer.jsx";

export default function FinalAnswer({ answer, answerLatex, levelConfig, katexLoaded }) {
  if (!answer) return null;

  return (
    <div style={{
      padding: "20px 24px", borderRadius: 14,
      background: `${levelConfig.color}12`,
      border: `1px solid ${levelConfig.color}40`,
      marginBottom: 24,
      animation: "fadeIn 0.5s ease",
    }}>
      <div style={{
        fontSize: 10, color: levelConfig.color,
        letterSpacing: "2px", marginBottom: 10,
        textTransform: "uppercase",
      }}>
        Final Answer
      </div>
      <div style={{ fontSize: 24, color: "#f8f8ff" }}>
        {katexLoaded && answerLatex
          ? <KaTeXRenderer latex={answerLatex} display={true} />
          : answer}
      </div>
    </div>
  );
}
