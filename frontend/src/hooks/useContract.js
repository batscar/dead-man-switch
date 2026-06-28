import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT, ABI } from "../constants";

function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT, ABI, signerOrProvider);
}

async function getSigner() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.getSigner();
}

export function useContract() {
  const [loading, setLoading] = useState("");
  const [error, setError]     = useState("");

  const wrap = useCallback(async (key, fn) => {
    setLoading(key);
    setError("");
    try {
      const signer = await getSigner();
      const contract = getContract(signer);
      const tx = await fn(contract);
      await tx.wait();
      setLoading("");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const msg = err?.reason || err?.message || "Transaction failed.";
      setError(msg);
      setLoading("");
      return { ok: false, msg };
    }
  }, []);

  // ─── Write functions ────────────────────────────────────────────────────────

  const checkIn = useCallback(() =>
    wrap("checkin", (c) => c.checkIn()), [wrap]);

  const deposit = useCallback((amountEth) =>
    wrap("deposit", (c) => c.deposit({ value: ethers.parseEther(amountEth) })), [wrap]);

  const withdraw = useCallback(() =>
    wrap("claim", (c) => c.withdraw()), [wrap]);

  const setBeneficiary = useCallback((addr) =>
    wrap("beneficiary", (c) => c.setBeneficiary(addr)), [wrap]);

  const setTimeoutPeriod = useCallback((days) =>
    wrap("timeout", (c) => c.setTimeoutPeriod(BigInt(days) * 86400n)), [wrap]);

  // ─── Read functions (call these on mount / polling) ─────────────────────────

  const fetchState = useCallback(async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getContract(provider);
      const [lastCI, bene, owner, triggered] = await Promise.all([
        contract.lastCheckIn(),
        contract.beneficiary(),
        contract.owner(),
        contract.isTriggered(),
      ]);
      return {
        lastCheckIn: Number(lastCI) * 1000,
        beneficiary: bene,
        owner,
        isTriggered: triggered,
      };
    } catch (err) {
      console.error("fetchState error:", err);
      return null;
    }
  }, []);

  return { loading, error, checkIn, deposit, withdraw, setBeneficiary, setTimeoutPeriod, fetchState };
}
