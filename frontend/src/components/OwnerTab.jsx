import { useState } from "react";
import { Card, Btn, Field, Divider } from "./UI";
import { useContract } from "../hooks/useContract";
import styles from "./OwnerTab.module.css";

export default function OwnerTab({ isOwner, connected, onToast }) {
  const { loading, checkIn, deposit, setBeneficiary, setTimeoutPeriod } = useContract();

  const [depVal,  setDepVal]  = useState("");
  const [beneVal, setBeneVal] = useState("");
  const [toutVal, setToutVal] = useState("");

  const handle = async (fn, successMsg, reset) => {
    const result = await fn();
    if (result.ok) {
      onToast(successMsg, "ok");
      reset?.();
    } else {
      onToast(result.msg || "Transaction failed.", "error");
    }
  };

  if (!connected) return <p className={styles.notice}>Connect your wallet to access owner controls.</p>;
  if (!isOwner)   return <p className={styles.notice}>Connected wallet is not the owner address.</p>;

  return (
    <div className={styles.layout}>

      {/* Check in */}
      <Card>
        <div className={styles.cardTitle}>Check in</div>
        <div className={styles.cardDesc}>Resets the 30-day countdown. Must be called from the owner address.</div>
        <Btn
          label="Submit check-in"
          onClick={() => handle(checkIn, "Check-in confirmed on-chain.")}
          loading={loading === "checkin"}
        />
      </Card>

      {/* Deposit */}
      <Card>
        <div className={styles.cardTitle}>Deposit ETH</div>
        <Field
          label="Amount"
          type="number"
          placeholder="0.0"
          value={depVal}
          onChange={(e) => setDepVal(e.target.value)}
          hint="Funds release to the beneficiary if the switch triggers."
        />
        <Btn
          label="Deposit"
          onClick={() => handle(() => deposit(depVal), `Deposited ${depVal} ETH.`, () => setDepVal(""))}
          loading={loading === "deposit"}
          disabled={!depVal || isNaN(+depVal) || +depVal <= 0}
        />
      </Card>

      <Divider />

      {/* Beneficiary */}
      <Card>
        <div className={styles.cardTitle}>Update beneficiary</div>
        <div className={styles.cardDesc}>Timelocked — takes effect after 48 hours.</div>
        <Field
          label="New address"
          type="text"
          placeholder="0x…"
          value={beneVal}
          onChange={(e) => setBeneVal(e.target.value)}
        />
        <Btn
          label="Queue change"
          variant="ghost"
          onClick={() => handle(() => setBeneficiary(beneVal), "Beneficiary change queued (48h timelock).", () => setBeneVal(""))}
          loading={loading === "beneficiary"}
          disabled={!beneVal.startsWith("0x") || beneVal.length < 42}
        />
      </Card>

      {/* Timeout */}
      <Card>
        <div className={styles.cardTitle}>Timeout period</div>
        <div className={styles.cardDesc}>Minimum 7 days. Change is timelocked.</div>
        <Field
          label="Days"
          type="number"
          placeholder="30"
          value={toutVal}
          onChange={(e) => setToutVal(e.target.value)}
          style={{ maxWidth: 140 }}
        />
        <Btn
          label="Update"
          variant="ghost"
          onClick={() => handle(() => setTimeoutPeriod(parseInt(toutVal)), `Timeout updated to ${toutVal} days.`, () => setToutVal(""))}
          loading={loading === "timeout"}
          disabled={!toutVal || parseInt(toutVal) < 7}
        />
      </Card>

    </div>
  );
}
