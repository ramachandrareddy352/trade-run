export const stakingAbi =  [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_rewardToken",
          "type": "address",
          "internalType": "address"
        },
        { "name": "_factory", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "addStakingToken",
      "inputs": [
        { "name": "_lpToken", "type": "address", "internalType": "address" },
        { "name": "_pricefeed", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "balance",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" },
        { "name": "lpToken", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "claimRewards",
      "inputs": [
        { "name": "_lpToken", "type": "address", "internalType": "address" },
        { "name": "_receiver", "type": "address", "internalType": "address" },
        { "name": "_amount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "claimedRewards",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "balance", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "fixedStake",
      "inputs": [
        { "name": "_lpToken", "type": "address", "internalType": "address" },
        { "name": "_receiver", "type": "address", "internalType": "address" },
        { "name": "_amount", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_period",
          "type": "uint8",
          "internalType": "enum StakingPool.StakePeriod"
        },
        { "name": "_deadline", "type": "uint256", "internalType": "uint256" },
        { "name": "_v", "type": "uint8", "internalType": "uint8" },
        { "name": "_r", "type": "bytes32", "internalType": "bytes32" },
        { "name": "_s", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "lastUpdated",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" },
        { "name": "lpToken", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "pendingRewards",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "balance", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "pricefeeds",
      "inputs": [
        { "name": "lpToken", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "pricefeed", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "stake",
      "inputs": [
        { "name": "_lpToken", "type": "address", "internalType": "address" },
        { "name": "_amount", "type": "uint256", "internalType": "uint256" },
        { "name": "_deadline", "type": "uint256", "internalType": "uint256" },
        { "name": "_v", "type": "uint8", "internalType": "uint8" },
        { "name": "_r", "type": "bytes32", "internalType": "bytes32" },
        { "name": "_s", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "staking",
      "inputs": [
        { "name": "stakingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "user", "type": "address", "internalType": "address" },
        { "name": "amount", "type": "uint256", "internalType": "uint256" },
        { "name": "lpToken", "type": "address", "internalType": "address" },
        { "name": "startTime", "type": "uint256", "internalType": "uint256" },
        { "name": "endTime", "type": "uint256", "internalType": "uint256" },
        {
          "name": "period",
          "type": "uint8",
          "internalType": "enum StakingPool.StakePeriod"
        },
        { "name": "price", "type": "uint256", "internalType": "uint256" },
        { "name": "isRedeemed", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "stakingId",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalEarned",
      "inputs": [
        { "name": "_user", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalRewarded",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "unStake",
      "inputs": [
        { "name": "_lpToken", "type": "address", "internalType": "address" },
        { "name": "_receiver", "type": "address", "internalType": "address" },
        { "name": "_amount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "unStakeFixed",
      "inputs": [
        { "name": "_stakingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "userStakings",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "AddStakingToken",
      "inputs": [
        {
          "name": "lpToken",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "pricefeed",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RewardsClaimed",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "lpToken",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "StakeLP",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "lpToken",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "UnStakeLP",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "lpToken",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "AddressEmptyCode",
      "inputs": [
        { "name": "target", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "AddressInsufficientBalance",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "FailedInnerCall", "inputs": [] },
    {
      "type": "error",
      "name": "SafeERC20FailedOperation",
      "inputs": [
        { "name": "token", "type": "address", "internalType": "address" }
      ]
    }
  ] as const