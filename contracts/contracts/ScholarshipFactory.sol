// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ScholarshipVault.sol";

contract ScholarshipFactory is Ownable {
    IERC20 public immutable stableToken;
    address public verifier; // global verifier (can also be DAO later)

    struct VaultInfo {
        address vault;
        address student;
        address institution;
        bool active;
    }

    VaultInfo[] public allVaults;
    mapping(address => uint256[]) public studentVaultIds;

    mapping(address => bool) public isVerifiedStudent;
    mapping(address => bool) public isVerifiedInstitution;

    event StudentVerified(address indexed student, bool status);
    event InstitutionVerified(address indexed institution, bool status);
    event VerifierUpdated(address indexed verifier);
    event VaultCreated(
        address indexed vault,
        address indexed student,
        address indexed institution,
        uint256 vaultId
    );

    constructor(address _stableToken, address _verifier) Ownable(msg.sender) {
        require(_stableToken != address(0), "Zero token");
        require(_verifier != address(0), "Zero verifier");
        stableToken = IERC20(_stableToken);
        verifier = _verifier;
    }

    modifier onlyVerifier() {
        require(msg.sender == verifier || msg.sender == owner(), "Not verifier");
        _;
    }

    function setVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "Zero verifier");
        verifier = _verifier;
        emit VerifierUpdated(_verifier);
    }

    // ===== VERIFICATION =====

    function setStudentVerified(address student, bool status)
        external
        onlyVerifier
    {
        isVerifiedStudent[student] = status;
        emit StudentVerified(student, status);
    }

    function setInstitutionVerified(address institution, bool status)
        external
        onlyVerifier
    {
        isVerifiedInstitution[institution] = status;
        emit InstitutionVerified(institution, status);
    }

    // ===== VAULT CREATION =====

    function createScholarshipVault(address student, address institution)
        external
        onlyVerifier
        returns (address vaultAddr)
    {
        require(isVerifiedStudent[student], "Student not verified");
        require(isVerifiedInstitution[institution], "Inst not verified");

        ScholarshipVault vault = new ScholarshipVault(
            address(stableToken),
            student,
            institution,
            verifier,
            owner() // factory owner as vault owner
        );

        vaultAddr = address(vault);

        allVaults.push(
            VaultInfo({
                vault: vaultAddr,
                student: student,
                institution: institution,
                active: true
            })
        );

        uint256 id = allVaults.length - 1;
        studentVaultIds[student].push(id);

        emit VaultCreated(vaultAddr, student, institution, id);
    }

    // ===== VIEW HELPERS =====

    function allVaultsCount() external view returns (uint256) {
        return allVaults.length;
    }

    function getStudentVaultIds(address student)
        external
        view
        returns (uint256[] memory)
    {
        return studentVaultIds[student];
    }
}

