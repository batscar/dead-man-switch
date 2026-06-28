import { Card, Btn, SectionLabel } from "./UI";
import { useContract } from "../hooks/useContract";
import styles from "./BeneficiaryTab.module.css";
import { TIMEOUT_DAYS, BALANCE_ETH, LAST_CHECKIN_MS } from "../constants";

const remaining = () => Math.max(0, TIMEOUT_DAYS - (Date.now() - LAST_CHECKIN_MS) / 86400000);
const isTrig = () => remaining() <= 0;

export default function BeneficiaryTab({ onToast }) {
  const { loading, withdraw } = useContract();
  const trig = isTrig();

  const handleClaim = async () => {
    const result = await withdraw();
    if (result.ok) onToast(`Withdrawal complete. ${BALANCE_ETH} ETH sent to your wallet.`, "ok");
    else onToast(result.msg || "Withdrawal failed.", "error");
  };

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        {trig ? (
          <>
            <div className={styles.alertBox}>
              <div className={styles.alertTitle}>Switch triggered</div>
              <div className={styles.alertDesc}>{BALANCE_ETH} ETH is available for withdrawal.</div>
            </div>
            <Btn
              label={`Withdraw ${BALANCE_ETH} ETH`}
              variant="danger"
              onClick={handleClaim}
              loading={loading === "claim"}
            />
          </>
        ) : (
          <>
            <div className={styles.waitingTitle}>Waiting</div>
            <div className={styles.waitingDesc}>
              The switch has not triggered yet. Check back when the owner misses a check-in.
            </div>
            <div className={styles.statGrid}>
              <Card style={{ textAlign: "center" }}>
                <div className={styles.statLabel}>days remaining</div>
                <div className={`${styles.statValue} mono`} style={{ color: "#e03131" }}>
                  {remaining().toFixed(1)}
                </div>
              </Card>
              <Card style={{ textAlign: "center" }}>
                <div className={styles.statLabel}>locked ETH</div>
                <div className={`${styles.statValue} mono`}>{BALANCE_ETH}</div>
              </Card>
            </div>
          </>
        )}
      </div>

      <div className={styles.sidebar}>
        <Card>
          <SectionLabel>pull payment</SectionLabel>
          {[
            "Switch must trigger first.",
            "You initiate the withdrawal yourself.",
            "All ETH goes directly to your wallet.",
            "No intermediary holds funds.",
          ].map((s, i) => (
            <div key={i} className={styles.pullRow} style={{ borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
              <span className={styles.pullNum}>{i + 1}.</span>
              {s}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
