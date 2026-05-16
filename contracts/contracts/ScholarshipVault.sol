// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ScholarshipVault is Ownable, Pausable, ReentrancyGuard {
    IERC20 public immutable stableToken;
    address public immutable student;
    address public immutable institution;
    address public verifier; // platform verifier for milestones

    enum MilestoneStatus {
        Pending,
        Approved,
        Paid,
        Revoked
    }

    struct Milestone {
        string description;
        uint256 tuitionAmount;
        uint256 stipendAmount;
        uint256 dueDate;
        MilestoneStatus status;
    }

    Milestone[] public milestones;

    uint256 public totalCommitted;
    uint256 public totalDisbursed;
    bool public revoked;

    mapping(address => uint256) public donorContributions;

    event Funded(address indexed donor, uint256 amount);
    event MilestoneAdded(
        uint256 indexed id,
        string description,
        uint256 tuitionAmount,
        uint256 stipendAmount,
        uint256 dueDate
    );
    event MilestoneApproved(uint256 indexed id);
    event MilestonePaid(
        uint256 indexed id,
        uint256 tuitionAmount,
        uint256 stipendAmount
    );
    event VaultRevoked();
    event VerifierUpdated(address indexed newVerifier);
    event UnspentWithdrawn(address indexed donor, uint256 amount);

    modifier onlyVerifier() {
        require(msg.sender == verifier || msg.sender == owner(), "Not verifier");
        _;
    }

    constructor(
        address _stableToken,
        address _student,
        address _institution,
        address _verifier,
        address _owner
    ) Ownable(_owner) {
        require(
            _stableToken != address(0) &&
                _student != address(0) &&
                _institution != address(0) &&
                _owner != address(0),
            "Zero address"
        );
        stableToken = IERC20(_stableToken);
        student = _student;
        institution = _institution;
        verifier = _verifier;
    }

    // ===== ADMIN / VERIFIER =====

    function setVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "Zero address");
        verifier = _verifier;
        emit VerifierUpdated(_verifier);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function revokeVault() external onlyVerifier {
        revoked = true;
        emit VaultRevoked();
    }

    // ===== FUNDING =====

    function fund(uint256 amount) external nonReentrant whenNotPaused {
        require(!revoked, "Vault revoked");
        require(amount > 0, "Amount = 0");

        bool ok = stableToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(ok, "Transfer failed");

        donorContributions[msg.sender] += amount;
        totalCommitted += amount;

        emit Funded(msg.sender, amount);
    }

    // ===== MILESTONES =====

    function addMilestone(
        string memory description,
        uint256 tuitionAmount,
        uint256 stipendAmount,
        uint256 dueDate
    ) external onlyVerifier {
        require(!revoked, "Vault revoked");
        require(bytes(description).length > 0, "Empty desc");
        require(tuitionAmount + stipendAmount > 0, "Zero amount");

        milestones.push(
            Milestone({
                description: description,
                tuitionAmount: tuitionAmount,
                stipendAmount: stipendAmount,
                dueDate: dueDate,
                status: MilestoneStatus.Pending
            })
        );

        emit MilestoneAdded(
            milestones.length - 1,
            description,
            tuitionAmount,
            stipendAmount,
            dueDate
        );
    }

    function approveMilestone(uint256 id) external onlyVerifier {
        require(id < milestones.length, "Invalid id");
        Milestone storage m = milestones[id];
        require(m.status == MilestoneStatus.Pending, "Not pending");
        m.status = MilestoneStatus.Approved;
        emit MilestoneApproved(id);
    }

    function payMilestone(uint256 id)
        external
        onlyVerifier
        nonReentrant
        whenNotPaused
    {
        require(!revoked, "Vault revoked");
        require(id < milestones.length, "Invalid id");
        Milestone storage m = milestones[id];
        require(m.status == MilestoneStatus.Approved, "Not approved");

        uint256 total = m.tuitionAmount + m.stipendAmount;
        require(
            stableToken.balanceOf(address(this)) >= total,
            "Insufficient balance"
        );

        if (m.tuitionAmount > 0) {
            require(
                stableToken.transfer(institution, m.tuitionAmount),
                "Tuition transfer failed"
            );
        }

        if (m.stipendAmount > 0) {
            require(
                stableToken.transfer(student, m.stipendAmount),
                "Stipend transfer failed"
            );
        }

        totalDisbursed += total;
        m.status = MilestoneStatus.Paid;

        emit MilestonePaid(id, m.tuitionAmount, m.stipendAmount);
    }

    // ===== DONOR WITHDRAWALS (ON REVOKE) =====

    function withdrawUnspent() external nonReentrant {
        require(revoked, "Not revoked");
        uint256 remaining = stableToken.balanceOf(address(this));
        require(remaining > 0, "No remaining");

        uint256 contribution = donorContributions[msg.sender];
        require(contribution > 0, "No contribution");

        uint256 share = (contribution * remaining) / totalCommitted;
        donorContributions[msg.sender] = 0;

        require(
            stableToken.transfer(msg.sender, share),
            "Withdraw transfer failed"
        );

        emit UnspentWithdrawn(msg.sender, share);
    }

    // ===== VIEW HELPERS =====

    function milestonesCount() external view returns (uint256) {
        return milestones.length;
    }
}

