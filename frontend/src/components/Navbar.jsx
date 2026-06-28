import styles from "./Navbar.module.css";
import { Btn } from "./UI";
import { NETWORK_NAME } from "../constants";
import logo from "../assets/logo.png";

const short = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

export default function Navbar({ connected, address, role, onConnect, onDisconnect }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <img src={logo} alt="DeadSwitch logo" className={styles.logoImg} />
        <span className={styles.logoName}>DeadSwitch</span>
        <span className={styles.networkBadge}>{NETWORK_NAME}</span>
      </div>

      <div className={styles.walletArea}>
        {connected ? (
          <>
            {role && (
              <span className={`${styles.roleBadge} ${styles[`role_${role}`]}`}>
                {role}
              </span>
            )}
            <span className={styles.address}>{short(address)}</span>
            <span className={styles.dot} />
            <button onClick={onDisconnect} className={styles.disconnectBtn}>Disconnect</button>
          </>
        ) : (
          <Btn label="Connect wallet" onClick={onConnect} />
        )}
      </div>
    </nav>
  );
}
