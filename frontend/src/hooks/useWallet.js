import { useState, useEffect, useCallback } from "react";
import { OWNER, BENEFICIARY, CHAIN_ID, NETWORK_NAME } from "../constants";

export function useWallet() {
  const [address, setAddress]     = useState("");
  const [connected, setConnected] = useState(false);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    const chainHex = await window.ethereum.request({ method: "eth_chainId" });
    setWrongNetwork(parseInt(chainHex, 16) !== CHAIN_ID);
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask not found. Please install it.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
      setConnected(true);
      await checkNetwork();
    } catch (err) {
      console.error("Wallet connect error:", err);
    }
  }, [checkNetwork]);

  const disconnect = useCallback(() => {
    setAddress("");
    setConnected(false);
    setWrongNetwork(false);
  }, []);

  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
      setWrongNetwork(false);
    } catch (err) {
      console.error("Network switch error:", err);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccounts = (accounts) => {
      if (accounts.length === 0) disconnect();
      else setAddress(accounts[0]);
    };
    const handleChain = () => checkNetwork();
    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", handleChain);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccounts);
      window.ethereum.removeListener("chainChanged", handleChain);
    };
  }, [checkNetwork, disconnect]);

  const role = !connected ? null
    : address.toLowerCase() === OWNER.toLowerCase()       ? "owner"
    : address.toLowerCase() === BENEFICIARY.toLowerCase() ? "beneficiary"
    : "other";

  return { address, connected, wrongNetwork, role, connect, disconnect, switchNetwork };
}
