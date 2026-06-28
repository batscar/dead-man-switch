import { useEffect, useState } from "react";
import { TIMEOUT_DAYS, LAST_CHECKIN_MS } from "../constants";
import styles from "./StatusCard.module.css";

const elapsedDays  = () => (Date.now() - LAST_CHECKIN_MS) / 86400000;
const remainingDays = () => Math.max(0, TIMEOUT_DAYS - elapsedDays());

/**
 * StatusCard — redesigned hero panel for the Status tab.
 *
 * Props (all optional — defaults fall back to live contract constants):
 *   daysLeft      {number}
 *   timeout       {number}
 *   lastCheckedIn {number}
 *   lockedEth     {string}
 *   window        {string}
 *   upkeepId      {string}
 */
export default function StatusCard({
  daysLeft:      daysLeftProp,
  timeout:       timeoutProp,
  lastCheckedIn: lastCheckedInProp,
  lockedEth      = "2.847 ETH",
  window:        windowProp = `${TIMEOUT_DAYS}d`,
  upkeepId       = "#23847",
}) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const r    = daysLeftProp      ?? remainingDays();
  const tout = timeoutProp       ?? TIMEOUT_DAYS;
  const lci  = lastCheckedInProp ?? Math.floor(elapsedDays());

  const triggered = r <= 0;
  const pct       = r / tout;
  const color     = triggered ? "#e03131" : pct > 0.2 ? "#e03131" : "#e65100";

  return (
    <div className={styles.card}>
      {/* Bookmark ribbon */}
      <div className={styles.bookmark} />

      {/* Left panel */}
      <div className={styles.left}>
        <div className={styles.iconCircle} style={{ background: color }}>
          <CheckIcon />
        </div>
        <span className={styles.daysNum} style={{ color }}>
          {triggered ? "0.0" : r.toFixed(1)}
        </span>
        <span className={styles.daysLbl}>days left</span>
      </div>

      {/* Right panel */}
      <div className={styles.right}>
        <div className={styles.statusWord} style={{ color }}>
          {triggered ? "TRIGGERED" : "ACTIVE"}
        </div>

        {triggered ? (
          <div className={styles.sub}>Beneficiary may withdraw funds</div>
        ) : (
          <div className={styles.sub}>
            Owner last checked in{" "}
            <span className={styles.subHighlight}>{lci}</span>{" "}
            days ago
          </div>
        )}

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>locked</span>
            <span className={`${styles.statValue} mono`}>{lockedEth}</span>
          </div>
          <div className={`${styles.stat} ${styles.statDivider}`}>
            <span className={styles.statLabel}>window</span>
            <span className={`${styles.statValue} mono`}>{windowProp}</span>
          </div>
          <div className={`${styles.stat} ${styles.statDivider}`}>
            <span className={styles.statLabel}>upkeep</span>
            <span className={`${styles.statValue} mono`}>{upkeepId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
