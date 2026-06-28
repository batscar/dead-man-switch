import StatusCard from "./StatusCard";
import { Card, SectionLabel, CopyButton, Divider } from "./UI";
import styles from "./StatusTab.module.css";
import {
  OWNER, BENEFICIARY, CONTRACT,
  TIMEOUT_DAYS, BALANCE_ETH,
  LAST_CHECKIN_MS, CHAINLINK_UPKEEP_ID, ACTIVITY,
} from "../constants";

const elapsed   = () => (Date.now() - LAST_CHECKIN_MS) / 86400000;
const remaining = () => Math.max(0, TIMEOUT_DAYS - elapsed());
const isTrig    = () => remaining() <= 0;
const short     = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—";

const DOT_COLOR = { ci: "#2e7d32", dep: "#e03131", deploy: "#ccc" };

export default function StatusTab() {
  const r    = remaining();
  const trig = isTrig();
  const pct  = r / TIMEOUT_DAYS;
  const ringColor = trig ? "#e03131" : pct > 0.4 ? "#e03131" : pct > 0.2 ? "#e65100" : "#e03131";

  return (
    <div className={styles.layout}>

      {/* ── Left column ─────────────────────────────────────────────────── */}
      <div className={styles.left}>

        {/* Status Card */}
        <StatusCard
          daysLeft={r}
          timeout={TIMEOUT_DAYS}
          lastCheckedIn={Math.floor(elapsed())}
          lockedEth={`${BALANCE_ETH} ETH`}
          window={`${TIMEOUT_DAYS}d`}
          upkeepId={`#${CHAINLINK_UPKEEP_ID}`}
        />

        <Divider />

        {/* Addresses */}
        <div className={styles.section}>
          <SectionLabel>addresses</SectionLabel>
          {[["Owner", OWNER], ["Beneficiary", BENEFICIARY], ["Contract", CONTRACT]].map(([lbl, addr]) => (
            <div key={lbl} className={styles.addrRow}>
              <span className={styles.addrLabel}>{lbl}</span>
              <span className={`${styles.addrValue} mono`}>{short(addr)}</span>
              <CopyButton text={addr} />
            </div>
          ))}
        </div>

        <Divider />

        {/* Activity */}
        <div className={styles.section}>
          <SectionLabel>on-chain activity</SectionLabel>
          {ACTIVITY.map((e, i) => (
            <div key={i} className={styles.actRow} style={{ borderBottom: i < ACTIVITY.length - 1 ? "1px solid #f8f8f8" : "none" }}>
              <span className={styles.actDot} style={{ background: DOT_COLOR[e.type] }} />
              <div>
                <div className={styles.actEvent}>{e.event}</div>
                <div className={`${styles.actMeta} mono`}>{e.time} · {e.tx}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right sidebar ────────────────────────────────────────────────── */}
      <div className={styles.right}>

        <Card>
          <SectionLabel>contract health</SectionLabel>
          {[
            ["Status",       trig ? <span style={{ color: "#e03131", fontWeight: 500 }}>Triggered</span> : <span style={{ color: "#2e7d32", fontWeight: 500 }}>Active</span>],
            ["Balance",      <span className="mono">{BALANCE_ETH} ETH</span>],
            ["Last check-in",<span className="mono">{elapsed().toFixed(0)}d ago</span>],
            ["Timeout",      <span className="mono">{TIMEOUT_DAYS} days</span>],
            ["Days left",    <span className="mono" style={{ color: ringColor, fontWeight: 500 }}>{r.toFixed(1)}d</span>],
          ].map(([k, v]) => (
            <div key={k} className={styles.healthRow}>
              <span className={styles.healthKey}>{k}</span>
              <span style={{ fontSize: 13 }}>{v}</span>
            </div>
          ))}
        </Card>

        <Card accent="var(--red)">
          <div className={styles.clTitle}>Chainlink automation</div>
          <div className={styles.clBody}>
            Upkeep <span className="mono" style={{ color: "#111" }}>#{CHAINLINK_UPKEEP_ID}</span> monitors
            the deadline every block and auto-triggers if the owner misses the window.
          </div>
          <div className={styles.clStatus}>
            <span className={styles.greenDot} />
            <span style={{ fontSize: 11, color: "#2e7d32" }}>Upkeep active</span>
          </div>
        </Card>

        <Card>
          <SectionLabel>how it works</SectionLabel>
          {[
            "Owner checks in every 30d to stay active.",
            "If deadline passes, Chainlink triggers release.",
            "Beneficiary withdraws all locked ETH.",
          ].map((s, i) => (
            <div key={i} className={styles.howRow} style={{ borderBottom: i < 2 ? "1px solid #f5f5f5" : "none" }}>
              <span className={styles.howNum}>{i + 1}.</span>
              {s}
            </div>
          ))}
        </Card>

      </div>
    </div>
  );
}
