// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AggregatorV3Interface} from "../interface/AggregatorV3Interface.sol";

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

contract StakingPool {
    using SafeERC20 for IERC20;
 
    uint256 private constant REWARDS_PER_SECOND = 2895161291; // 9% APY
    uint256 private constant MAX_REWARD_TOKENS = 200_000_000 * 1e18; // 200 million tokens
    uint256 private constant MONTH = 30 days;
    address private immutable i_rewardToken;
    address private immutable i_factory;

    uint256 public totalRewarded;
    uint256 public stakingId;

    // given priceed for token-B collateral
    mapping(address lpToken => address pricefeed) public pricefeeds;
    mapping(address user => uint256 balance) public claimedRewards;
    mapping(address user => uint256 balance) public pendingRewards;
    mapping(address user => mapping(address lpToken => uint256)) public balance;
    mapping(address user => mapping(address lpToken => uint256)) public lastUpdated;
    mapping(StakePeriod => uint256 rewardRate) private rewardsPerSecond;
    mapping(uint256 stakingId => FixedStaked) public staking;
    mapping(address user => uint256[]) public userStakings;

    event StakeLP(address indexed user, address indexed lpToken, uint256 indexed amount);
    event UnStakeLP(address indexed user, address indexed lpToken, uint256 indexed amount);
    event RewardsClaimed(address indexed user, address indexed lpToken, uint256 indexed amount);
    event AddStakingToken(address indexed lpToken, address indexed pricefeed);

    enum StakePeriod {
        days30, // 11% APY
        days60, // 12% APY
        days90, // 13% APY
        days120, // 14% APY
    }

    struct FixedStaked {
        address user;
        uint256 amount;
        address lpToken;
        uint256 startTime;
        uint256 endTime;
        StakePeriod period;
        uint256 price; // price at which they staked
        bool isRedeemed;
    }

    constructor(address _rewardToken, address _factory) {
        i_rewardToken = _rewardToken;
        i_factory = _factory;
        rewardsPerSecond[StakePeriod.days30] = 3536805556;
        rewardsPerSecond[StakePeriod.days60] = 3858024691;
        rewardsPerSecond[StakePeriod.days90] = 4178645833;
        rewardsPerSecond[StakePeriod.days120] = 4500000000;
        rewardsPerSecond[StakePeriod.days150] = 4826388889;
    }

    function addStakingToken(address _lpToken, address _pricefeed) external {
        require(msg.sender == i_factory, "Not Factory");
        require(pricefeeds[_lpToken] == address(0), "Token is already added");

        pricefeeds[_lpToken] = _pricefeed;
        emit AddStakingToken(_lpToken, _pricefeed);
    }

    function fixedStake(
        address _lpToken,
        address _receiver,
        uint256 _amount,
        StakePeriod _period,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external returns (uint256) {
        require(pricefeeds[_lpToken] != address(0), "Invalid staking token");
        require(_amount > 0, "Amount must be greater than zero");

        if (_deadline != 0) {
            IERC20Permit(_lpToken).permit(msg.sender, address(this), _amount, _deadline, _v, _r, _s);
        }
        SafeERC20.safeTransferFrom(IERC20(_lpToken), msg.sender, address(this), _amount);

        stakingId++;

        staking[stakingId] = FixedStaked({
            user: _receiver,
            amount: _amount,
            lpToken: _lpToken,
            startTime: block.timestamp,
            endTime: block.timestamp + (MONTH * (uint256(_period) + 1)),
            period: _period,
            price: uint256(AggregatorV3Interface(pricefeeds[_lpToken]).latestAnswer()), // price at which they staked
            isRedeemed: false
        });
        userStakings[msg.sender].push(stakingId);

        emit StakeLP(msg.sender, _lpToken, _amount);
        return stakingId;
    }

    function stake(address _lpToken, uint256 _amount, uint256 _deadline, uint8 _v, bytes32 _r, bytes32 _s)
        external
    {
        require(pricefeeds[_lpToken] != address(0), "Invalid staking token");
        require(_amount > 0, "Amount must be greater than zero");

        _updateRewards(msg.sender, _lpToken);

        // Transfer LP tokens from the user to the contract
        if (_deadline != 0) {
            IERC20Permit(_lpToken).permit(msg.sender, address(this), _amount, _deadline, _v, _r, _s);
        }
        SafeERC20.safeTransferFrom(IERC20(_lpToken), msg.sender, address(this), _amount);

        balance[msg.sender][_lpToken] += _amount;
        emit StakeLP(msg.sender, _lpToken, _amount); 
    }

    function unStakeFixed(uint256 _stakingId) external {
        FixedStaked memory data = staking[_stakingId];

        require(!data.isRedeemed, "Already redeemed");
        require(data.user == msg.sender, "Invalid claimer");
        require(block.timestamp > data.endTime, "Funds are locked");

        uint256 newRewards =
            (data.amount * (data.endTime - data.startTime) * rewardsPerSecond[data.period] * data.price) / (1e18 * 1e8);

        staking[_stakingId].isRedeemed = true;

        if (totalRewarded + newRewards <= MAX_REWARD_TOKENS) {
            claimedRewards[data.user] += newRewards;
            totalRewarded += newRewards;
            SafeERC20.safeTransfer(IERC20(i_rewardToken), data.user, newRewards);
        }
        SafeERC20.safeTransfer(IERC20(data.lpToken), data.user, data.amount);

        emit UnStakeLP(msg.sender, data.lpToken, data.amount);
    }

    function unStake(address _lpToken, address _receiver, uint256 _amount) external {
        require(balance[msg.sender][_lpToken] >= _amount, "Insufficient balance");

        _updateRewards(msg.sender, _lpToken);

        balance[msg.sender][_lpToken] -= _amount;

        // Transfer LP tokens back to the user
        SafeERC20.safeTransfer(IERC20(_lpToken), _receiver, _amount);
        emit UnStakeLP(msg.sender, _lpToken, _amount);
    }

    // Claim pending rewards, user select the particualt lptoken rewards only , if we want all tokens to withdraw we use multicall
    function claimRewards(address _lpToken, address _receiver, uint256 _amount) public {
        _updateRewards(msg.sender, _lpToken);

        require(_amount > 0 && _amount <= pendingRewards[msg.sender], "Insufficient rewards");
        pendingRewards[msg.sender] -= _amount;
        claimedRewards[msg.sender] += _amount;

        // Transfer reward tokens to the user
        SafeERC20.safeTransfer(IERC20(i_rewardToken), _receiver, _amount);
        emit RewardsClaimed(msg.sender, _lpToken, _amount);
    }

    // View function for total earned rewards (claimed + pending)
    function totalEarned(address _user) external view returns (uint256) {
        return claimedRewards[_user] + pendingRewards[_user];
    }

    // Private function to update rewards for a user
    function _updateRewards(address _user, address _lpToken) private {
        uint256 lastUpdatedTime = lastUpdated[_user][_lpToken];
        if (lastUpdatedTime == 0) {
            lastUpdated[_user][_lpToken] = block.timestamp;
            return;
        }

        if (block.timestamp > lastUpdatedTime) {
            uint256 timeDifference = block.timestamp - lastUpdatedTime;
            uint256 rewardRate = _getRewardRate(_lpToken, REWARDS_PER_SECOND);
            uint256 newRewards = (balance[_user][_lpToken] * timeDifference * rewardRate) / (1e8 * 1e18);

            if (totalRewarded + newRewards <= MAX_REWARD_TOKENS) {
                pendingRewards[_user] += newRewards;
                totalRewarded += newRewards;
            }
            lastUpdated[_user][_lpToken] = block.timestamp;
        }
    }

    // Helper function to get the reward rate based on collateral price
    function _getRewardRate(address _lpToken, uint256 _rewardRate) private view returns (uint256) {
        int256 price = AggregatorV3Interface(pricefeeds[_lpToken]).latestAnswer();
        require(price > 0, "Invalid price");

        // Multiply rewards per second by the collateral price
        return _rewardRate * uint256(price);
    }
}
