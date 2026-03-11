import { useEffect, useState } from "react";

export default function Intro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 2500);
    const t3 = setTimeout(() => onDone(), 3300);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#000000",
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      opacity: phase === "exit" ? 0 : 1,
      transition: phase === "exit" ? "opacity 0.8s ease" : "none",
      pointerEvents: phase === "exit" ? "none" : "auto",
    }}>
      <style>{`
        @keyframes introFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes introSub {
          from { opacity: 0; }
          to   { opacity: 0.45; }
        }
        @keyframes introLine {
          from { width: 0; }
          to   { width: 120px; }
        }
      `}</style>

      <h1 style={{
        margin: 0,
        fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
        fontWeight: 900,
        color: "#ffffff",
        letterSpacing: "0.25em",
        fontFamily: "'Orbitron', monospace",
        animation: "introFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        amiqbal
      </h1>

      <div style={{
        height: "1px",
        background: "rgba(255,255,255,0.4)",
        animation: "introLine 0.7s ease 0.4s both",
        width: 0,
      }} />

      <p style={{
        margin: 0,
        fontSize: "0.90rem",
        color: "rgba(255,255,255,0.45)",
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        fontFamily: "monospace",
        animation: "introSub 0.6s ease 0.6s both",
      }}>
        Portfolio
      </p>
    </div>
  );
}