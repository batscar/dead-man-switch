import { useState } from "react";
import "./index.css";
import { useWallet } from "./hooks/useWallet";
import Navbar from "./components/Navbar";
import TabBar from "./components/TabBar";
import StatusTab from "./components/StatusTab";
import OwnerTab from "./components/OwnerTab";
import BeneficiaryTab from "./components/BeneficiaryTab";
import { Toast, WrongNetworkBanner } from "./components/UI";

export default function App() {
  const { address, connected, wrongNetwork, role, connect, disconnect, switchNetwork } = useWallet();
  const [tab, setTab]     = useState("owner");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "ok") => {
    setToast({ message, type });
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>

      {/* Wrong network banner */}
      {wrongNetwork && <WrongNetworkBanner onSwitch={switchNetwork} />}

      {/* Navbar */}
      <Navbar
        connected={connected}
        address={address}
        role={role}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      {/* Tabs */}
      <TabBar active={tab} onChange={setTab} />

      {/* Tab content */}
      {tab === "status"      && <StatusTab />}
      {tab === "owner"       && (
        <OwnerTab
          connected={connected}
          isOwner={connected && role === "owner"}
          onToast={showToast}
        />
      )}
      {tab === "beneficiary" && <BeneficiaryTab onToast={showToast} />}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

    </div>
  );
}
