// ─── Contract addresses ───────────────────────────────────────────────────────
export const OWNER      = "0x4f3C2aB1dE8F7c9012345678901234567890ABCD";
export const BENEFICIARY= "0x9aBCdef01234567890ABCDEF1234567890bcDEF0";
export const CONTRACT   = "0xDeAd5W1tCh00000000000000000000000000001";

// ─── Contract parameters (replace with on-chain reads) ────────────────────────
export const TIMEOUT_DAYS    = 30;
export const BALANCE_ETH     = "2.847";
export const LAST_CHECKIN_MS = Date.now() - 12 * 86400000; // 12 days ago
export const CHAINLINK_UPKEEP_ID = "23847";
export const NETWORK_NAME    = "Sepolia";
export const CHAIN_ID        = 11155111;

// ─── ABI (minimal — add full ABI from your Foundry artifacts) ─────────────────
export const ABI = [
  "function checkIn() external",
  "function withdraw() external",
  "function deposit() external payable",
  "function setBeneficiary(address) external",
  "function setTimeoutPeriod(uint256) external",
  "function lastCheckIn() external view returns (uint256)",
  "function beneficiary() external view returns (address)",
  "function owner() external view returns (address)",
  "function isTriggered() external view returns (bool)",
];

// ─── On-chain activity log (replace with event log reads) ────────────────────
export const ACTIVITY = [
  { event: "Check-in recorded",  time: "12 days ago", tx: "0xabc…f21", type: "ci"     },
  { event: "Deposited 1.5 ETH",  time: "18 days ago", tx: "0xdef…8b3", type: "dep"    },
  { event: "Check-in recorded",  time: "40 days ago", tx: "0x123…4a7", type: "ci"     },
  { event: "Deposited 1.347 ETH",time: "55 days ago", tx: "0x789…cc1", type: "dep"    },
  { event: "Contract deployed",  time: "60 days ago", tx: "0xfee…001", type: "deploy" },
];
