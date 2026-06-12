import { useEffect, useRef } from "react";

export default function KaTeXRenderer({ latex, display = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !window.katex) return;
    try {
      window.katex.render(latex, ref.current, {
        displayMode: display,
        throwOnError: false,
        output: "html",
      });
    } catch (_e) {
      if (ref.current) ref.current.textContent = latex;
    }
  }, [latex, display]);

  return <span ref={ref} />;
}
