// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20, IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {AutomationCompatibleInterface} from "../interface/AutomationCompatibleInterface.sol";
import {AggregatorV3Interface} from "../interface/AggregatorV3Interface.sol";
import {Multicall} from "../utils/Multicall.sol";

contract FuturesTrading is AutomationCompatibleInterface, Multicall, Ownable {
    using SafeERC20 for IERC20;
 
    /* ------------------------- ENUMS ------------------------- */
    enum ContractStatus {
        None,
        Active,
        Bought,
        Settled,
        Cancelled,
        Experied
    }

    /* ------------------------- STRUCTS ------------------------- */
    struct TradingContract {
        address seller;
        address buyer;
        uint256 initialPrice; // price at which the contract is created(in USD)For all token with 8 decimals
        uint256 strikePrice; // Agreed price for the asset(future price) for all token with 8 decimals
        uint256 createdDate; // contract created date
        uint256 expirationDate; // Contract expiration date
        uint256 marginRequirement; // Margin deposit required by both parties(in percentage %)
        ContractStatus status;
        address[] collateral;
        uint256[] amount;
    }

    struct BoughtContract {
        address collateral;
        uint256 amount;
    }

    /* ------------------------- CONSTANT VARIABLES ------------------------- */
    uint256 public constant PROTOCOL_FEE = 500; // 0.005%
    // for 100 days - 0.1 eth as fee to create contract
    // for 10 days - 0.01 eth as fee to create contract
    uint256 public SELLER_FEE = 11574074075; // per one second fee(in WEI)
    uint256 public MIN_EXPIRY_DIFFERENCE = 10 days;
    uint256 public MAX_EXPIRY_DIFFERENCE = 100 days;
    uint256 public MIN_MARGIN_PERCENT = 5;
    uint256 public MAX_MARGIN_PERCENT = 50;
    uint256 public VOILATION_FEE = 3000; // if any seller or buyer violate the contract rules he lost 3% of his money and that voilation fee amount is sent to opposite party

    function updateSellerFee(uint256 _newSellerFee) external onlyOwner {
        SELLER_FEE = _newSellerFee;
    }

    function updateExpiry(uint256 _minExpiry, uint256 _maxExpiry) external onlyOwner {
        MIN_EXPIRY_DIFFERENCE = _minExpiry;
        MAX_EXPIRY_DIFFERENCE = _maxExpiry;
    }

    function updateMargin(uint256 _minMargin, uint256 _maxMargin) external onlyOwner {
        MIN_MARGIN_PERCENT = _minMargin;
        MAX_MARGIN_PERCENT = _maxMargin;
    }

    function updateVoilationFee(uint256 _newVoilationFee) external onlyOwner {
        VOILATION_FEE = _newVoilationFee;
    }

    /* ------------------------- STATE VARIABLES ------------------------- */
    uint256 public lastUpdated; // time at which the Automation is called from chainlink nodes
    uint256 public nextContractId = 1; // tracts the unique id for creating new contracts
    uint256 private timeInterval; // minimum time interval to execute consicutive performUpkeep()
    address private feeReceiver; // address which receives protocol fee
    address public deployer; // deployer of contract(its may also be a multisig wallet also)(better use gnosif wallet)
    bool private isNeededUpkeep;

    /* ------------------------- MAPPINGS ------------------------- */
    mapping(uint256 contractId => TradingContract) public contracts;
    mapping(address collateral => address priceFeed) private collateralPriceFeed;
    mapping(uint256 contractId => BoughtContract) public contractBoughtWith;
    mapping(address user => mapping(address collateral => uint256 balance)) public collateralBalance;
    mapping(uint256 contractId => mapping(address collateral => bool isAccepted)) public contractCollateral;
    // collateral which are accepted for payment, while trading that particual future contract

    /* ------------------------- EVENTS ------------------------- */
    event ContractCreated(
        uint256 indexed contractId,
        address indexed seller,
        uint256 strikePrice,
        uint256 indexed expirationDate,
        uint256 feesPaid
    );
    event ContractBought(
        uint256 indexed contractId,
        address indexed buyer,
        uint256 indexed boughtTime,
        uint256 premimumFeeInUSD,
        uint256 collateralAmount
    );
    event MarginUpdated(uint256 indexed contractId, uint256 newMargin);
    event ContractSettled(uint256 indexed contractId, address indexed fundsReceivedBy, uint256 indexed setteledTime);
    event ContractCancelled(uint256 indexed contractId, uint256 indexed cancelledTime);
    event ExpiryExtended(uint256 indexed contractId, uint256 newExpirationDate);
    event ContractExpired(uint256 indexed contractId);
    event ContractDropped(
        uint256 indexed contractId, uint256 indexed droppedTime, uint256 voilationFee, uint256 protocolFee
    );
    event CollateralUpdated(
        uint256 indexed contractId, uint256 newStrikePrice, address[] collateral, uint256[] _amount
    );

    /* ------------------------- CONSTRUCTOR ------------------------- */
    constructor(
        address _owner,
        address _feeReceiver,
        uint256 _timeInterval,
        bool _isNeededUpkeep,
        address[] memory _collateral,
        address[] memory _pricefeed
    ) Ownable(_owner) {
        require(_collateral.length == _pricefeed.length, "Invalid length");
        for (uint256 i = 0; i < _collateral.length; i++) {
            collateralPriceFeed[_collateral[i]] = _pricefeed[i];
        }

        feeReceiver = _feeReceiver;
        timeInterval = _timeInterval;
        lastUpdated = block.timestamp;
        isNeededUpkeep = _isNeededUpkeep;
    }

    /* ------------------------- CREATE CONTRACT ------------------------- */
    function createContract(
        address[] memory _collateral,
        uint256[] memory _amount,
        address[] memory _paymentCollateral,
        uint256 _strikePrice,
        uint256 _expirationDate,
        uint256 _marginPercent
    ) external payable returns (uint256) {
        _checkCollateral(_paymentCollateral);

        uint256 requiredSellerFee = _createContract(
            msg.sender, _strikePrice, _expirationDate, _marginPercent, _paymentCollateral, _collateral, _amount
        );

        emit ContractCreated(nextContractId, msg.sender, _strikePrice, _expirationDate, requiredSellerFee);
        return nextContractId++;
    }

    function _createContract(
        address _seller,
        uint256 _strikePrice,
        uint256 _expirationDate,
        uint256 _marginPercent,
        address[] memory _paymentCollateral,
        address[] memory _collateral,
        uint256[] memory _amount
    ) private returns (uint256) {
        require(_expirationDate > block.timestamp, "Expiry < current");

        uint256 timeDifference = _expirationDate - block.timestamp;
        require(
            timeDifference >= MIN_EXPIRY_DIFFERENCE && timeDifference <= MAX_EXPIRY_DIFFERENCE,
            "Expiry should be (10-100 days)"
        );
        require(
            _marginPercent >= MIN_MARGIN_PERCENT && _marginPercent <= MAX_MARGIN_PERCENT,
            "Margin should be in range(5-50)%"
        );

        uint256 currentContractId = nextContractId;
        uint256 requiredSellerFee = SELLER_FEE * timeDifference;
        require(msg.value >= requiredSellerFee, "Insufficient seller fee");

        (bool success,) = payable(_seller).call{value: msg.value - requiredSellerFee}("");
        require(success, "Failed to return balance fee");

        for (uint256 i = 0; i < _collateral.length; i++) {
            SafeERC20.safeTransferFrom(IERC20(_collateral[i]), _seller, address(this), _amount[i]);
        }

        contracts[currentContractId] = TradingContract({
            seller: _seller,
            buyer: address(0),
            collateral: _collateral,
            amount: _amount,
            initialPrice: getTotalPrice(_collateral, _amount), // 10^8
            strikePrice: _strikePrice, // in 10^8 for all tokens given.
            createdDate: block.timestamp,
            expirationDate: _expirationDate,
            marginRequirement: _marginPercent, // min percentage have to pay from _strikePrice to hold future
            status: ContractStatus.Active
        });

        for (uint256 i = 0; i < _paymentCollateral.length; i++) {
            contractCollateral[currentContractId][_paymentCollateral[i]] = true;
        }

        return requiredSellerFee;
    }

    /* ------------------------- BUY CONTRACT ------------------------- */
    function buyContract(uint256 _contractId, address _collateral, uint256 _maxAmountExpected)
        external
        returns (bool)
    {
        if (_checkContractExpiry(_contractId)) {
            return false;
        }

        require(collateralPriceFeed[_collateral] != address(0), "Collateral not accepted for payment");
        require(contractCollateral[_contractId][_collateral], "Collateral not accepted for payment");
        require(contracts[_contractId].buyer == address(0), "Contract already has a buyer"); // it may be never hits

        (uint256 premimumFee, uint256 collateralAmount) =
            _buyContract(_contractId, msg.sender, _collateral, _maxAmountExpected);

        emit ContractBought(_contractId, msg.sender, block.timestamp, premimumFee, collateralAmount);
        return true;
    }

    function _buyContract(uint256 _contractId, address buyer, address _collateral, uint256 _maxAmountExpected)
        private
        returns (uint256, uint256)
    {
        TradingContract memory future = contracts[_contractId];

        require(future.status == ContractStatus.Active, "Contract is not in Active status");

        uint256 premimumFee = (future.strikePrice * future.marginRequirement) / 100; // 10^8
        uint256 collateralAmount = getCollateralAmount(_collateral, premimumFee);

        require(collateralAmount <= _maxAmountExpected, "Expected max amount exceed");

        SafeERC20.safeTransferFrom(IERC20(_collateral), buyer, address(this), collateralAmount);

        // contrat seller's collateralBalance[] will increase only at setteling of contract
        contractBoughtWith[_contractId] = BoughtContract({collateral: _collateral, amount: collateralAmount});
        contracts[_contractId].buyer = buyer;
        contracts[_contractId].status = ContractStatus.Bought;

        return (premimumFee, collateralAmount);
    }

    /* ------------------------- SETTLE CONTRACT ------------------------- */
    function settleContract(
        uint256 _contractId,
        address _receiver,
        address _collateral,
        uint256 _maxAmountExpected,
        bool _addToWallet // if `true` tokens are sent to wallet or else we here increase the balance in contract
    ) external returns (bool) {
        if (_checkContractExpiry(_contractId)) {
            return false;
        }

        require(collateralPriceFeed[_collateral] != address(0), "Collateral not accepted for payment");
        require(contractCollateral[_contractId][_collateral], "Collateral not accepted for payment");

        TradingContract memory future = contracts[_contractId];

        require(
            future.status == ContractStatus.Active || future.status == ContractStatus.Bought,
            "Contract is not in active or bought state"
        );

        _settleContract(_contractId, future, _maxAmountExpected, _collateral, _addToWallet, _receiver);

        contracts[_contractId].status = ContractStatus.Settled;

        emit ContractSettled(_contractId, _receiver, block.timestamp);
        return true;
    }

    function _settleContract(
        uint256 _contractId,
        TradingContract memory future,
        uint256 _maxAmountExpected,
        address _collateral,
        bool _addToWallet,
        address _receiver
    ) private {
        uint256 fee = (future.strikePrice * PROTOCOL_FEE) / 100_000;
        // 0.005% fee is paid after setteling contract with strike price amount to the protocol

        if (future.status == ContractStatus.Bought) {
            // take with fee(did we have to take fee while holding future)
            require(msg.sender == future.buyer, "Not future buyer call");

            uint256 premimumFee = (future.strikePrice * future.marginRequirement) / 100; // paid amount(in usd)
            uint256 collateralPremiumPaid = contractBoughtWith[_contractId].amount;
            uint256 collateralAmount = getCollateralAmount(_collateral, future.strikePrice - premimumFee + 1);

            require(collateralAmount + fee <= _maxAmountExpected, "Expected max amount exceed");

            SafeERC20.safeTransferFrom(IERC20(_collateral), msg.sender, address(this), collateralAmount + fee);

            collateralBalance[future.seller][_collateral] += collateralAmount;
            collateralBalance[future.seller][contractBoughtWith[_contractId].collateral] += collateralPremiumPaid;
        } else {
            require(future.buyer == address(0), "Contract has already buyer");
            uint256 collateralAmount = getCollateralAmount(_collateral, future.strikePrice);

            require(collateralAmount + fee <= _maxAmountExpected, "Expected max amount exceed");

            SafeERC20.safeTransferFrom(IERC20(_collateral), msg.sender, address(this), collateralAmount + fee);

            collateralBalance[future.seller][_collateral] += collateralAmount;
            contracts[_contractId].buyer = msg.sender;
        }
        SafeERC20.safeTransfer(IERC20(_collateral), feeReceiver, fee);

        if (_addToWallet) {
            for (uint256 i = 0; i < future.collateral.length; i++) {
                SafeERC20.safeTransfer(IERC20(future.collateral[i]), _receiver, future.amount[i]);
            }
        } else {
            for (uint256 i = 0; i < future.collateral.length; i++) {
                collateralBalance[_receiver][future.collateral[i]] += future.amount[i];
            }
        }
    }

    /* ------------------------- CANCEL CONTRACT ------------------------- */
    function cancelContract(uint256 _contractId, address _receiver, bool _addToWallet) external returns (bool) {
        if (_checkContractExpiry(_contractId)) {
            return false;
        }

        TradingContract memory future = contracts[_contractId];

        require(future.seller == msg.sender, "Not seller call");
        require(future.status == ContractStatus.Active || future.status == ContractStatus.Bought, "Invalid state");

        _cancelContract(_contractId, future, _addToWallet, _receiver);

        emit ContractCancelled(_contractId, block.timestamp);
        return true;
    }

    function _cancelContract(uint256 _contractId, TradingContract memory future, bool _addToWallet, address _receiver)
        private
    {
        if (future.status == ContractStatus.Active) {
            if (_addToWallet) {
                for (uint256 i = 0; i < future.collateral.length; i++) {
                    SafeERC20.safeTransfer(IERC20(future.collateral[i]), _receiver, future.amount[i]);
                }
            } else {
                for (uint256 i = 0; i < future.collateral.length; i++) {
                    collateralBalance[_receiver][future.collateral[i]] += future.amount[i];
                }
            }
        } else {
            if (_addToWallet) {
                for (uint256 i = 0; i < future.collateral.length; i++) {
                    uint256 voilationFee = (future.amount[i] * VOILATION_FEE) / 100_000;
                    collateralBalance[future.buyer][future.collateral[i]] += voilationFee;

                    SafeERC20.safeTransfer(IERC20(future.collateral[i]), _receiver, future.amount[i] - voilationFee - 1);
                }
            } else {
                for (uint256 i = 0; i < future.collateral.length; i++) {
                    uint256 voilationFee = (future.amount[i] * VOILATION_FEE) / 100_000;
                    collateralBalance[future.buyer][future.collateral[i]] += voilationFee;

                    collateralBalance[_receiver][future.collateral[i]] += future.amount[i] - voilationFee - 1;
                }
            }
            // look carefully what is price change protocol will get loss or profit --------
            collateralBalance[future.buyer][contractBoughtWith[_contractId].collateral] +=
                contractBoughtWith[_contractId].amount;
        }

        contracts[_contractId].status = ContractStatus.Cancelled;
    }

    /* ------------------------- DROP CONTRACT ------------------------- */
    function dropContract(uint256 _contractId, address _receiver, bool _addToWallet) external returns (bool) {
        if (_checkContractExpiry(_contractId)) {
            return false;
        } 

        TradingContract memory future = contracts[_contractId];

        require(future.status == ContractStatus.Bought, "Contract is not bought");
        require(future.buyer == msg.sender, "Only buyer can call this");

        (uint256 voilationFee, uint256 protocolFee) = _dropContract(_contractId, future, _addToWallet, _receiver);

        emit ContractDropped(_contractId, block.timestamp, voilationFee, protocolFee);
        return true;
    }

    function _dropContract(uint256 _contractId, TradingContract memory future, bool _addToWallet, address _receiver)
        private
        returns (uint256, uint256)
    {
        uint256 premimumPaid = contractBoughtWith[_contractId].amount;
        address collateral = contractBoughtWith[_contractId].collateral;

        uint256 voilationFee = getFee(collateral, future.strikePrice, VOILATION_FEE);
        uint256 protocolFee = getFee(collateral, future.strikePrice, PROTOCOL_FEE);

        if (premimumPaid >= voilationFee + protocolFee) {
            if (_addToWallet) {
                SafeERC20.safeTransfer(IERC20(collateral), _receiver, premimumPaid - voilationFee - protocolFee);
            } else {
                collateralBalance[_receiver][collateral] += premimumPaid - voilationFee - protocolFee;
            }

            collateralBalance[future.seller][collateral] += voilationFee;
            SafeERC20.safeTransfer(IERC20(collateral), feeReceiver, protocolFee);
        } else {
            collateralBalance[future.seller][collateral] += premimumPaid - protocolFee;
            SafeERC20.safeTransfer(IERC20(collateral), feeReceiver, protocolFee);
        }

        contracts[_contractId].status = ContractStatus.Active;

        return (voilationFee, protocolFee);
    }

    /* ------------------------- EXPIRE CONTRACT ------------------------- */
    function expireContract(uint256 _contractId) external {
        require(
            contracts[_contractId].status == ContractStatus.Active
                || contracts[_contractId].status == ContractStatus.Bought,
            "Invalid contrat state"
        );
        require(block.timestamp > contracts[_contractId].expirationDate, "Contract has expiry time");

        _expireContract(_contractId);
    }

    function _expireContract(uint256 _contractId) private {
        // only active & bought contracts are entered here
        // called within chainlink automation
        TradingContract memory future = contracts[_contractId];
        address collateral = contractBoughtWith[_contractId].collateral;

        if (future.status == ContractStatus.Active) {
            for (uint256 i = 0; i < future.collateral.length; i++) {
                collateralBalance[future.seller][future.collateral[i]] += future.amount[i];
            }
        } else {
            uint256 premimumPaid = contractBoughtWith[_contractId].amount;

            uint256 voilationFee = (future.strikePrice * VOILATION_FEE) / 100_000;
            voilationFee = getCollateralAmount(collateral, voilationFee);

            uint256 protocolFee = (future.strikePrice * PROTOCOL_FEE) / 100_000;
            protocolFee = getCollateralAmount(collateral, protocolFee);

            if (premimumPaid >= voilationFee + protocolFee) {
                collateralBalance[future.buyer][collateral] += premimumPaid - voilationFee - protocolFee;
                collateralBalance[future.seller][collateral] += voilationFee;
                SafeERC20.safeTransfer(IERC20(collateral), feeReceiver, protocolFee);
            } else {
                collateralBalance[future.seller][collateral] += premimumPaid - protocolFee;
                SafeERC20.safeTransfer(IERC20(collateral), feeReceiver, protocolFee);
            }
        }

        contracts[_contractId].status = ContractStatus.Experied;

        emit ContractExpired(_contractId);
    }

    /* ------------------------- UPDATE CONTRACT DETAILS ------------------------- */
    function updateMarginRequirement(uint256 _contractId, uint256 _newMargin) external returns (bool) {
        if (_checkContractExpiry(_contractId)) {
            return false;
        } 

        require(contracts[_contractId].seller == msg.sender, "Only sender can call this");
        require(contracts[_contractId].status == ContractStatus.Active, "Not in active");
        require(_newMargin >= MIN_MARGIN_PERCENT && _newMargin <= MAX_MARGIN_PERCENT, "Invalid margin");

        contracts[_contractId].marginRequirement = _newMargin;

        emit MarginUpdated(_contractId, _newMargin);
        return true;
    }

    function updateCollateral(
        uint256 _contractId,
        uint256 _newStrikePrice,
        address[] memory _collateral,
        uint256[] memory _amount
    ) external returns (bool) {
        if (_checkContractExpiry(_contractId)) {
            return false;
        }

        require(contracts[_contractId].seller == msg.sender, "Only sender can call this");
        require(contracts[_contractId].status == ContractStatus.Active, "Not in active");

        _checkCollateral(_collateral);
        require(_collateral.length > 0 && _collateral.length == _amount.length, "Invalid length");

        _updateCollateral(_contractId, _newStrikePrice, _collateral, _amount);

        emit CollateralUpdated(_contractId, _newStrikePrice, _collateral, _amount);
        return true;
    }

    function _updateCollateral(
        uint256 _contractId,
        uint256 _newStrikePrice,
        address[] memory _collateral,
        uint256[] memory _amount
    ) private {
        TradingContract memory future = contracts[_contractId];

        for (uint256 i = 0; i < future.collateral.length; i++) {
            SafeERC20.safeTransfer(IERC20(future.collateral[i]), msg.sender, future.amount[i]);
        }
        for (uint256 i = 0; i < _collateral.length; i++) {
            SafeERC20.safeTransferFrom(IERC20(_collateral[i]), msg.sender, address(this), _amount[i]);
        }

        TradingContract storage s_future = contracts[_contractId];

        s_future.collateral = _collateral;
        s_future.amount = _amount;
        s_future.initialPrice = getTotalPrice(_collateral, _amount);
        s_future.strikePrice = _newStrikePrice;
    }

    // Extend the contract expiration date with buyer's consent
    function updateExpirationDate(uint256 _contractId, uint256 _newExpirationDate, uint256 _maxExpetedFee)
        external
        payable
        returns (bool)
    {
        if (_checkContractExpiry(_contractId)) {
            return false;
        }

        TradingContract memory future = contracts[_contractId];

        require(contracts[_contractId].seller == msg.sender, "Only sender can call this");
        require(future.status == ContractStatus.Active || future.status == ContractStatus.Bought, "Invalid state");

        // if new date is less tha current will automatically faile by new versions of solidity
        if (future.status == ContractStatus.Active) {
            uint256 timeDifference = _newExpirationDate - future.createdDate;
            require(timeDifference >= MIN_EXPIRY_DIFFERENCE && timeDifference <= MAX_EXPIRY_DIFFERENCE, "Invalid time");

            require(future.buyer == address(0), "Before buying contract only able to extend time"); // not mush useful i think

            if (_newExpirationDate > future.expirationDate) {
                uint256 extraTime = _newExpirationDate - future.expirationDate;
                uint256 requiredAmount = extraTime * SELLER_FEE;

                require(requiredAmount <= _maxExpetedFee, "Expected fee value is crossed");
                require(msg.value >= requiredAmount, "Invalid amount fee");

                (bool success,) = payable(msg.sender).call{value: msg.value - requiredAmount}("");
                require(success, "Failed to repay fee");
            }
        } else {
            // for above and before code using a common private function which reduce code
            require(_newExpirationDate > future.expirationDate, "Invlaid new expiry date");
            uint256 timeDifference = _newExpirationDate - future.createdDate;
            require(timeDifference <= MAX_EXPIRY_DIFFERENCE, "Invalid time");

            uint256 extraTime = _newExpirationDate - future.expirationDate;
            uint256 requiredAmount = extraTime * SELLER_FEE;

            require(requiredAmount <= _maxExpetedFee, "Expected fee value is crossed");
            require(msg.value >= requiredAmount, "Invalid amount fee");

            (bool success,) = payable(msg.sender).call{value: msg.value - requiredAmount}("");
            require(success, "Failed to pay fee");
        }

        contracts[_contractId].expirationDate = _newExpirationDate;

        emit ExpiryExtended(_contractId, _newExpirationDate);
        return true;
    }

    /* ------------------------- HELPER FUNCTIONS ------------------------- */
    function withdrawTokens(address[] memory _collateral, uint256[] memory _amount, address _receiver) external {
        require(_collateral.length > 0 && _collateral.length == _amount.length, "Invalid length of elements");
        for (uint256 i = 0; i < _collateral.length; i++) {
            collateralBalance[msg.sender][_collateral[i]] -= _amount[i]; // overflow is autochecked in new versions
            SafeERC20.safeTransfer(IERC20(_collateral[i]), _receiver, _amount[i]);
        }
    }

    function getFee(address _collateral, uint256 _strikePrice, uint256 _feePercent) public view returns (uint256 fee) {
        fee = (_strikePrice * _feePercent) / 100_000;
        fee = getCollateralAmount(_collateral, fee);
    }

    function permitCollateral(
        address[] memory _collateral,
        uint256[] memory _amount,
        uint256[] memory _deadline,
        uint8[] memory _v,
        bytes32[] memory _r,
        bytes32[] memory _s
    ) public {
        require(
            _collateral.length > 0 && _collateral.length == _amount.length && _amount.length == _deadline.length
                && _deadline.length == _v.length && _v.length == _r.length && _r.length == _s.length,
            "Invalid length of elements"
        );

        address owner = msg.sender;

        for (uint256 i = 0; i < _collateral.length; i++) {
            uint256 nonceBefore = IERC20Permit(_collateral[i]).nonces(owner);
            IERC20Permit(_collateral[i]).permit(owner, address(this), _amount[i], _deadline[i], _v[i], _r[i], _s[i]);
            uint256 nonceAfter = IERC20Permit(_collateral[i]).nonces(owner);
            require(nonceAfter == nonceBefore + 1, "Permit did not succeed");
        }
    }

    function getCollateralPrice(address _collateral, uint256 _amount) public view returns (uint256) {
        return _getPrice(_collateral, _amount);
    }

    function getTotalPrice(address[] memory _collateral, uint256[] memory _amount)
        public
        view
        returns (uint256 totalAmountInUsd)
    {
        require(_collateral.length > 0 && _collateral.length == _amount.length, "Invalid length");
        for (uint256 i = 0; i < _collateral.length; i++) {
            totalAmountInUsd += _getPrice(_collateral[i], _amount[i]);
        }
    }

    function getCollateralAmount(address _collateral, uint256 _usdAmount) public view returns (uint256) {
        require(collateralPriceFeed[_collateral] != address(0), "Collateral is not accepted");
        require(_usdAmount != 0, "Invalid zero amount");

        uint256 price = uint256(AggregatorV3Interface(collateralPriceFeed[_collateral]).latestAnswer());
        return (_usdAmount * (10 ** IERC20Metadata(_collateral).decimals())) / price;
    }

    // add or remove the collateral
    function updateContractCollateral(uint256 _contractId, address _collateral, bool _need) external returns (bool) {
        if (_checkContractExpiry(_contractId)) {
            return false;
        }

        require(contracts[_contractId].seller == msg.sender, "Not contract seller call");
        require(
            contracts[_contractId].status == ContractStatus.Active
                || contracts[_contractId].status == ContractStatus.Bought,
            "Contract not in required state"
        );

        if (_need) {
            require(collateralPriceFeed[_collateral] != address(0), "Collateral not accepted");
            contractCollateral[_contractId][_collateral] = true;
        } else {
            delete contractCollateral[_contractId][_collateral];
        }

        return true;
    }

    /* ------------------------- PRIVATE FUNCTIONS ------------------------- */
    function _checkCollateral(address[] memory _collateral) private view {
        for (uint256 i = 0; i < _collateral.length; i++) {
            require(collateralPriceFeed[_collateral[i]] != address(0), "Collateral not accepted");
        }
    }

    function _checkContractExpiry(uint256 _contractId) private returns (bool) {
        if (block.timestamp > contracts[_contractId].expirationDate) {
            _expireContract(_contractId);
            return true;
        }
        return false;
    }

    function _getPrice(address _collateral, uint256 _amount) private view returns (uint256) {
        require(_amount != 0, "Invalid zero amount");
        require(collateralPriceFeed[_collateral] != address(0), "Collateral is not accepted");
        uint256 price = uint256(AggregatorV3Interface(collateralPriceFeed[_collateral]).latestAnswer());
        return (price * _amount) / 10 ** (IERC20Metadata(_collateral).decimals()); // result in 10^8
    }

    /* ------------------------- Chainlink Automation ------------------------- */
    function checkUpkeep(bytes memory /* checkData */ )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */ )
    {
        upkeepNeeded = (block.timestamp >= lastUpdated + timeInterval) && isNeededUpkeep;
    }

    function performUpkeep(bytes calldata /* performData */ ) external override {
        (bool upkeepNeeded,) = checkUpkeep(""); // only 1000 contracts can hold this
        require(upkeepNeeded, "Conditions are not meet");

        uint256 recentContractId = nextContractId;
        for (uint256 i = 1; i < recentContractId; i++) {
            if (
                (contracts[i].status == ContractStatus.Active || contracts[i].status == ContractStatus.Bought)
                    && block.timestamp > contracts[i].expirationDate
            ) {
                _expireContract(i);
            }
        }
        lastUpdated = block.timestamp;
    }

    /* ------------------------- Owner functions ------------------------- */
    function updateTimeInterval(uint256 _newInterval) external onlyOwner {
        timeInterval = _newInterval;
    }

    function withdrawFees(address _receiver, uint256 _amount, bytes memory _callData) external {
        require(msg.sender == deployer, "Invalid deployer");
        (bool success,) = payable(_receiver).call{value: _amount}(_callData);
        require(success, "Withdraw failed");
    }

    function transferDeployer(address _newDeployer) external {
        require(msg.sender == deployer, "Invalid deployer");
        deployer = _newDeployer;
    }

    function updateUpkeepVariable(bool _isNeeded) external onlyOwner {
        isNeededUpkeep = _isNeeded;
    }

    function changeFeeReceiver(address _feeReceiver) external {
        require(msg.sender == deployer, "Invalid deployer");
        feeReceiver = _feeReceiver;
    }

    function addCollateral(address[] memory _collateral, address[] memory _priceFeed) external onlyOwner {
        require(_collateral.length > 0 && _collateral.length == _priceFeed.length, "Invlaid length of elements");
        for (uint256 i = 0; i < _collateral.length; i++) {
            collateralPriceFeed[_collateral[i]] = _priceFeed[i];
        }
    }

    function removeCollateral(address[] memory _collateral) external onlyOwner {
        for (uint256 i = 0; i < _collateral.length; i++) {
            delete collateralPriceFeed[_collateral[i]];
        }
    }

    receive() external payable {}
}
