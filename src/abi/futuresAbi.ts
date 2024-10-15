export const futuresAbi = [
    {
      "type": "constructor",
      "inputs": [
        { "name": "_owner", "type": "address", "internalType": "address" },
        {
          "name": "_feeReceiver",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_timeInterval",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "_isNeededUpkeep", "type": "bool", "internalType": "bool" },
        {
          "name": "_collateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "_pricefeed",
          "type": "address[]",
          "internalType": "address[]"
        }
      ],
      "stateMutability": "nonpayable"
    },
    { "type": "receive", "stateMutability": "payable" },
    {
      "type": "function",
      "name": "MAX_EXPIRY_DIFFERENCE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "MAX_MARGIN_PERCENT",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "MIN_EXPIRY_DIFFERENCE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "MIN_MARGIN_PERCENT",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "PROTOCOL_FEE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "SELLER_FEE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "VOILATION_FEE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "addCollateral",
      "inputs": [
        {
          "name": "_collateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "_priceFeed",
          "type": "address[]",
          "internalType": "address[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "buyContract",
      "inputs": [
        { "name": "_contractId", "type": "uint256", "internalType": "uint256" },
        { "name": "_collateral", "type": "address", "internalType": "address" },
        {
          "name": "_maxAmountExpected",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "cancelContract",
      "inputs": [
        { "name": "_contractId", "type": "uint256", "internalType": "uint256" },
        { "name": "_receiver", "type": "address", "internalType": "address" },
        { "name": "_addToWallet", "type": "bool", "internalType": "bool" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "changeFeeReceiver",
      "inputs": [
        { "name": "_feeReceiver", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "checkUpkeep",
      "inputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "outputs": [
        { "name": "upkeepNeeded", "type": "bool", "internalType": "bool" },
        { "name": "", "type": "bytes", "internalType": "bytes" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "collateralBalance",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" },
        { "name": "collateral", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "balance", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "contractBoughtWith",
      "inputs": [
        { "name": "contractId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "collateral", "type": "address", "internalType": "address" },
        { "name": "amount", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "contractCollateral",
      "inputs": [
        { "name": "contractId", "type": "uint256", "internalType": "uint256" },
        { "name": "collateral", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "isAccepted", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "contracts",
      "inputs": [
        { "name": "contractId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "seller", "type": "address", "internalType": "address" },
        { "name": "buyer", "type": "address", "internalType": "address" },
        {
          "name": "initialPrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "strikePrice", "type": "uint256", "internalType": "uint256" },
        { "name": "createdDate", "type": "uint256", "internalType": "uint256" },
        {
          "name": "expirationDate",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "marginRequirement",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "status",
          "type": "uint8",
          "internalType": "enum FuturesTrading.ContractStatus"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "createContract",
      "inputs": [
        {
          "name": "_collateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        { "name": "_amount", "type": "uint256[]", "internalType": "uint256[]" },
        {
          "name": "_paymentCollateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "_strikePrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_expirationDate",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_marginPercent",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "deployer",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "dropContract",
      "inputs": [
        { "name": "_contractId", "type": "uint256", "internalType": "uint256" },
        { "name": "_receiver", "type": "address", "internalType": "address" },
        { "name": "_addToWallet", "type": "bool", "internalType": "bool" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "expireContract",
      "inputs": [
        { "name": "_contractId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getCollateralAmount",
      "inputs": [
        { "name": "_collateral", "type": "address", "internalType": "address" },
        { "name": "_usdAmount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCollateralPrice",
      "inputs": [
        { "name": "_collateral", "type": "address", "internalType": "address" },
        { "name": "_amount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getFee",
      "inputs": [
        { "name": "_collateral", "type": "address", "internalType": "address" },
        {
          "name": "_strikePrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "_feePercent", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "fee", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTotalPrice",
      "inputs": [
        {
          "name": "_collateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        { "name": "_amount", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "outputs": [
        {
          "name": "totalAmountInUsd",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "lastUpdated",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "multicall",
      "inputs": [
        { "name": "data", "type": "bytes[]", "internalType": "bytes[]" }
      ],
      "outputs": [
        { "name": "results", "type": "bytes[]", "internalType": "bytes[]" }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "nextContractId",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "performUpkeep",
      "inputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "permitCollateral",
      "inputs": [
        {
          "name": "_collateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        { "name": "_amount", "type": "uint256[]", "internalType": "uint256[]" },
        {
          "name": "_deadline",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        { "name": "_v", "type": "uint8[]", "internalType": "uint8[]" },
        { "name": "_r", "type": "bytes32[]", "internalType": "bytes32[]" },
        { "name": "_s", "type": "bytes32[]", "internalType": "bytes32[]" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "removeCollateral",
      "inputs": [
        {
          "name": "_collateral",
          "type": "address[]",
          "internalType": "address[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "settleContract",
      "inputs": [
        { "name": "_contractId", "type": "uint256", "internalType": "uint256" },
        { "name": "_receiver", "type": "address", "internalType": "address" },
        { "name": "_collateral", "type": "address", "internalType": "address" },
        {
          "name": "_maxAmountExpected",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "_addToWallet", "type": "bool", "internalType": "bool" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferDeployer",
      "inputs": [
        { "name": "_newDeployer", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        { "name": "newOwner", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateCollateral",
      "inputs": [
        { "name": "_contractId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_newStrikePrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_collateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        { "name": "_amount", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateContractCollateral",
      "inputs": [
        { "name": "_contractId", "type": "uint256", "internalType": "uint256" },
        { "name": "_collateral", "type": "address", "internalType": "address" },
        { "name": "_need", "type": "bool", "internalType": "bool" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateExpirationDate",
      "inputs": [
        { "name": "_contractId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_newExpirationDate",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_maxExpetedFee",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "updateExpiry",
      "inputs": [
        { "name": "_minExpiry", "type": "uint256", "internalType": "uint256" },
        { "name": "_maxExpiry", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateMargin",
      "inputs": [
        { "name": "_minMargin", "type": "uint256", "internalType": "uint256" },
        { "name": "_maxMargin", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateMarginRequirement",
      "inputs": [
        { "name": "_contractId", "type": "uint256", "internalType": "uint256" },
        { "name": "_newMargin", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateSellerFee",
      "inputs": [
        {
          "name": "_newSellerFee",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateTimeInterval",
      "inputs": [
        { "name": "_newInterval", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateUpkeepVariable",
      "inputs": [
        { "name": "_isNeeded", "type": "bool", "internalType": "bool" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateVoilationFee",
      "inputs": [
        {
          "name": "_newVoilationFee",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawFees",
      "inputs": [
        { "name": "_receiver", "type": "address", "internalType": "address" },
        { "name": "_amount", "type": "uint256", "internalType": "uint256" },
        { "name": "_callData", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawTokens",
      "inputs": [
        {
          "name": "_collateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        { "name": "_amount", "type": "uint256[]", "internalType": "uint256[]" },
        { "name": "_receiver", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "CollateralUpdated",
      "inputs": [
        {
          "name": "contractId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "newStrikePrice",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "collateral",
          "type": "address[]",
          "indexed": false,
          "internalType": "address[]"
        },
        {
          "name": "_amount",
          "type": "uint256[]",
          "indexed": false,
          "internalType": "uint256[]"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ContractBought",
      "inputs": [
        {
          "name": "contractId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "buyer",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "boughtTime",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "premimumFeeInUSD",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "collateralAmount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ContractCancelled",
      "inputs": [
        {
          "name": "contractId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "cancelledTime",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ContractCreated",
      "inputs": [
        {
          "name": "contractId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "seller",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "strikePrice",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "expirationDate",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "feesPaid",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ContractDropped",
      "inputs": [
        {
          "name": "contractId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "droppedTime",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "voilationFee",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "protocolFee",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ContractExpired",
      "inputs": [
        {
          "name": "contractId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ContractSettled",
      "inputs": [
        {
          "name": "contractId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "fundsReceivedBy",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "setteledTime",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ExpiryExtended",
      "inputs": [
        {
          "name": "contractId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "newExpirationDate",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "MarginUpdated",
      "inputs": [
        {
          "name": "contractId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "newMargin",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "previousOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
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
      "name": "OwnableInvalidOwner",
      "inputs": [
        { "name": "owner", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "SafeERC20FailedOperation",
      "inputs": [
        { "name": "token", "type": "address", "internalType": "address" }
      ]
    }
  ]