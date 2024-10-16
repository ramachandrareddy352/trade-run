// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop is Ownable {
    // Governance token for the airdrop
    IERC20 public immutable governanceToken;
    uint256 public constant MAX_AIRDROP_SUPPLY = 6_000_000 * 10 ** 18; // 6 million tokens
 
    // Struct to store airdrop round details
    struct AirdropRound {
        bytes32 merkleRoot; // Merkle root for verifying users
        uint256 totalTokens; // Total tokens allocated for the round
        uint256 claimedTokens;
        uint256 startTime; // Time when claiming starts
        uint256 endTime; // Deadline to claim tokens
        bool paused; // Is the airdrop round paused?
    }

    // Mapping from round ID to AirdropRound
    mapping(uint256 => AirdropRound) public airdropRounds;
    mapping(uint256 => mapping(address => bool)) public claimed; // Tracks if the user has claimed for the round

    // Current airdrop round ID
    uint256 public roundId;

    // Total airdrop supply remaining
    uint256 public airdropSupplyRemaining;

    constructor(address _governanceToken, address _owner) Ownable(_owner) {
        governanceToken = IERC20(_governanceToken);
        airdropSupplyRemaining = MAX_AIRDROP_SUPPLY;
    }

    // Owner can create a new airdrop round
    function createRound(bytes32 _merkleRoot, uint256 _totalTokens, uint256 _startTime, uint256 _endTime)
        external
        onlyOwner
        returns (uint256)
    {
        require(airdropSupplyRemaining >= _totalTokens, "Insufficient airdrop supply");
        require(_startTime < _endTime && _startTime >= block.timestamp, "Invalid time range");

        roundId++; // round id starts from `1`

        AirdropRound memory newRound = AirdropRound({
            merkleRoot: _merkleRoot,
            totalTokens: _totalTokens,
            claimedTokens: 0,
            startTime: _startTime,
            endTime: _endTime,
            paused: false
        });

        airdropRounds[roundId] = newRound;
        airdropSupplyRemaining -= _totalTokens;

        return roundId;
    }

    // Owner can update Merkle root before the start time of the round
    function updateMerkleRoot(uint256 _roundId, bytes32 _newMerkleRoot, uint256 _totalTokens) external onlyOwner {
        AirdropRound memory round = airdropRounds[_roundId];
        require(block.timestamp < round.startTime, "Cannot update Merkle root after start time");

        uint256 totalTokens = round.totalTokens;

        if (_totalTokens > totalTokens) {
            airdropSupplyRemaining -= _totalTokens - totalTokens;
        } else {
            airdropSupplyRemaining += totalTokens - _totalTokens;
        }

        airdropRounds[_roundId].merkleRoot = _newMerkleRoot;
        airdropRounds[_roundId].totalTokens = _totalTokens;
    }

    function updateRoundTime(uint256 _roundId, uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(block.timestamp < airdropRounds[_roundId].startTime, "Cannot update Merkle root after start time");
        require(_startTime >= block.timestamp && _endTime > _startTime, "Invalid time range");

        airdropRounds[_roundId].startTime = _startTime;
        airdropRounds[_roundId].endTime = _endTime;
    }

    // Owner can pause or unpause a specific airdrop round
    function setPause(uint256 _roundId, bool _paused) external onlyOwner {
        airdropRounds[_roundId].paused = _paused;
    }

    // Claim airdrop tokens using Merkle proof
    function claimAirdrop(uint256 _roundId, address _account, uint256 _amount, bytes32[] calldata _merkleProof)
        external
    {
        AirdropRound memory round = airdropRounds[_roundId];

        require(block.timestamp >= round.startTime && block.timestamp <= round.endTime, "Claim period is not active");
        require(!round.paused, "Airdrop round is paused");
        require(!claimed[_roundId][_account], "Already claimed");

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encodePacked(_account, _amount))));
        require(MerkleProof.verify(_merkleProof, round.merkleRoot, leaf), "Invalid Merkle proof");

        claimed[_roundId][_account] = true;
        airdropRounds[_roundId].claimedTokens += _amount;
        SafeERC20.safeTransfer(governanceToken, _account, _amount);
    }

    // Owner can remove unclaimed tokens after the claim period ends
    function removeUnclaimedTokens(uint256 _roundId) external onlyOwner {
        AirdropRound memory round = airdropRounds[_roundId];
        require(block.timestamp > round.endTime, "Claim period not yet ended");

        uint256 unclaimedTokens = round.totalTokens - round.claimedTokens;
        airdropSupplyRemaining += unclaimedTokens;
    }
}

// 0xdd4c8c2aDb5C72723FD01D5fB63380D217114DC9

/*
(0xFe8F8517d7BCFB7449b4C0f5f2d31B42cDbED96e, 100)
(0xd0509B83468409A75De2771C1Ae7bE1026A69927, 200)
(0xaa7875E18282D7b0F2396b35c688Eccbe9B3AeA6, 300)
(0x4DE23f3f0Fb3318287378AdbdE030cf61714b2f3, 400)

leaf-0 => 0x102b6bec16834f7a509e3e1cb14f084c39ff0c62d7fcca0a65eea56c62942b8d
leaf-1 => 0x8f98a39cffad2f92d3973d34c7ca991e7624649dbc4341884781de82ea6a93a9
leaf-2 => 0xc09b4eba51e138b8a158b03cbefa234b187e4b6d19b6b4cf5ea0c309124b94fe
leaf-3 => 0x1fd7f82e78dcf6b083861407105ae443527893faab74d14478dda38d94fd56f3

node-1 => 0x3db53705bd1234a20c24013f9adf99f86b997f11007bbb645e6dc0cb54aaf32c
node-2 => 0x23459854daff0340d2b252587180012b006d89537c356824d4c19cd7254702ec

root => 0x4ab4e587380e0ae2011ee12dbbaef5225c8c74e14f8a103f8233e95ca5f64127
*/