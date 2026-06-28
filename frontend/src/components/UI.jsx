import { useState, useEffect } from "react";
import styles from "./UI.module.css";

// ─── Button ───────────────────────────────────────────────────────────────────
export function Btn({ label, onClick, variant = "primary", disabled, loading, fullWidth }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${fullWidth ? styles.fullWidth : ""}`}
    >
      {loading ? "Confirming…" : label}
    </button>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
export function Field({ label, hint, style, ...props }) {
  return (
    <div className={styles.field} style={style}>
      {label && <label className={styles.fieldLabel}>{label}</label>}
      <input className={styles.fieldInput} {...props} />
      {hint && <span className={styles.fieldHint}>{hint}</span>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, accent, style }) {
  return (
    <div
      className={styles.card}
      style={{ borderLeft: accent ? `3px solid ${accent}` : undefined, borderRadius: accent ? "0 10px 10px 0" : undefined, ...style }}
    >
      {children}
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider() {
  return <div className={styles.divider} />;
}

// ─── Section label ────────────────────────────────────────────────────────────
export function SectionLabel({ children }) {
  return <div className={styles.sectionLabel}>{children}</div>;
}

// ─── Copy button ──────────────────────────────────────────────────────────────
export function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <button onClick={copy} className={styles.copyBtn} style={{ color: done ? "var(--green)" : undefined }}>
      {done ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ message, type = "ok", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  const dotColor = type === "ok" ? "var(--green)" : "var(--red)";
  const bg       = type === "ok" ? "#f0fff4"      : "var(--red-light)";
  const border   = type === "ok" ? "#c3e6cb"      : "var(--red-border)";

  return (
    <div className={styles.toast} style={{ background: bg, border: `1px solid ${border}` }}>
      <span className={styles.toastDot} style={{ background: dotColor }} />
      {message}
    </div>
  );
}

// ─── Wrong network banner ─────────────────────────────────────────────────────
export function WrongNetworkBanner({ onSwitch }) {
  return (
    <div className={styles.wrongNetwork}>
      Wrong network — please switch to Sepolia.
      <button onClick={onSwitch} className={styles.switchBtn}>Switch</button>
    </div>
  );
}
