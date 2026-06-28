import styles from "./TabBar.module.css";

const TABS = [
  { id: "owner",       label: "Owner"       },
  { id: "beneficiary", label: "Beneficiary" },
  { id: "status",      label: "Status"      },
];

export default function TabBar({ active, onChange }) {
  return (
    <div className={styles.tabBar}>
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`${styles.tab} ${active === t.id ? styles.active : ""}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
