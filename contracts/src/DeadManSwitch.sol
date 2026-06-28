// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title DeadManSwitch — core
/// @notice Owner deposits ETH and must check in periodically.
///         If the timeout passes, the beneficiary can claim the funds.
/// @dev This is the CORE only: single beneficiary, ETH only, no guardians,
///      no panic button yet. Those get layered on in separate contracts.
contract DeadManSwitch {

    // ─────────────────────────────────────────────────────────
    // 1. STATE — grouped by concern, read top to bottom like a story
    // ─────────────────────────────────────────────────────────

    enum Status { Active, Expired, Claimed }

    // -- Roles --
    address public immutable owner;
    address public immutable beneficiary;

    // -- Timing --
    uint256 public lastCheckIn;
    uint256 public immutable timeoutPeriod;

    // -- Lifecycle --
    Status public status;

    // ─────────────────────────────────────────────────────────
    // 2. EVENTS — one per state transition, no exceptions.
    //    If a function changes `status` or moves funds, it emits.
    // ─────────────────────────────────────────────────────────

    event Deposited(address indexed from, uint256 amount);
    event CheckedIn(uint256 timestamp);
    event Expired(uint256 timestamp);
    event Claimed(address indexed beneficiary, uint256 amount);

    // ─────────────────────────────────────────────────────────
    // 3. MODIFIERS — access control, one job each, no logic mixed in
    // ─────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary, "not beneficiary");
        _;
    }

    modifier inStatus(Status required) {
        require(status == required, "wrong status for this action");
        _;
    }

    // ─────────────────────────────────────────────────────────
    // 4. CONSTRUCTOR — sets the initial state explicitly
    // ─────────────────────────────────────────────────────────

    constructor(address _beneficiary, uint256 _timeoutPeriod) {
        require(_beneficiary != address(0), "beneficiary cannot be zero address");
        require(_timeoutPeriod > 0, "timeout must be > 0");

        owner = msg.sender;
        beneficiary = _beneficiary;
        timeoutPeriod = _timeoutPeriod;
        lastCheckIn = block.timestamp;
        status = Status.Active;
    }

    // ─────────────────────────────────────────────────────────
    // 5. OWNER ACTIONS — only valid while Active
    // ─────────────────────────────────────────────────────────

    /// @notice Proof of life. Resets the expiry clock.
    function checkIn() external onlyOwner inStatus(Status.Active) {
        lastCheckIn = block.timestamp;
        emit CheckedIn(block.timestamp);
    }

    /// @notice Add funds to the vault. Anyone can top it up, only owner is
    ///         required to actually fund it day-to-day.
    function deposit() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    // ─────────────────────────────────────────────────────────
    // 6. EXPIRY — permissionless, because it only asserts a fact about
    //    time, not a privileged action. This is what Chainlink Automation
    //    will call via performUpkeep() later.
    // ─────────────────────────────────────────────────────────

    function isExpired() public view returns (bool) {
        return status == Status.Active &&
               block.timestamp > lastCheckIn + timeoutPeriod;
    }

    function markExpired() external inStatus(Status.Active) {
        require(isExpired(), "timeout has not passed yet");
        status = Status.Expired;
        emit Expired(block.timestamp);
    }

    // ─────────────────────────────────────────────────────────
    // 7. BENEFICIARY ACTIONS — only valid after Expired
    // ─────────────────────────────────────────────────────────

    /// @notice Pull-payment withdrawal. Beneficiary claims the full
    ///         balance once the switch has expired.
    function claim() external onlyBeneficiary inStatus(Status.Expired) {
        uint256 amount = address(this).balance;
        status = Status.Claimed;

        emit Claimed(beneficiary, amount);

        (bool success, ) = beneficiary.call{value: amount}("");
        require(success, "transfer to beneficiary failed");
    }

    // ─────────────────────────────────────────────────────────
    // VIEW HELPERS — for the frontend to poll, no state change
    // ─────────────────────────────────────────────────────────

    function timeRemaining() external view returns (uint256) {
        uint256 deadline = lastCheckIn + timeoutPeriod;
        if (block.timestamp >= deadline) return 0;
        return deadline - block.timestamp;
    }
}
