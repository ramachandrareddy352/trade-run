// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20, IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {PoolLibrary} from "../library/PoolLibrary.sol";
import {Multicall} from "../utils/Multicall.sol";
import {PositionDataTypes} from "./PositionDataTypes.sol";
import {AggregatorV3Interface} from "../interface/AggregatorV3Interface.sol";
import {IHookManager} from "../interface/IHookManager.sol";
import {ILPToken} from "../interface/ILPToken.sol";
import {AutomationCompatibleInterface} from "../interface/AutomationCompatibleInterface.sol";
 
contract TradePool is AutomationCompatibleInterface, PositionDataTypes, Multicall, Ownable {
    uint256 public constant MIN_COLLATERAL = 100000000; // 10**8  1$ USD
    uint256 public constant MAX_LEVERAGE = 1000; // 10X leverage
    uint256 public constant MIN_LEVERAGE = 100; // 1x leverage
    uint256 public constant MIN_MARGIN_MAINTAIN = 500; // 5% of mimimum
    uint256 public constant MAX_LIQUIDITY = 9500; // 95%
    uint256 public constant FEE_PER_SECOND = 115; // per one day we take 0.1$ (stored as 8 decimals)
    uint256 public constant POSITION_FEE = 30; // if trader open or close the position we collect 0.3% fee of  current price of trade token, it is fixed  // 86400
    uint256 public constant FACTORY_FEE = 5; // collect fee from LP's while withdrawing their funds 0.05%

    address public immutable i_factory;
    address public immutable i_tokenA; // trade token always should be a voilatile token
    address public immutable i_tokenB; // collatral token
    address public immutable i_hookManager; // can we update the hook manager?
    address public immutable i_tokenAPricefeed;
    address public immutable i_tokenBPricefeed;
    address public immutable i_LPtoken; // for this lp token owner is this pool contract
    uint256 public immutable i_decimalA;
    uint256 public immutable i_decimalB;

    uint256 private lastUpkeepUpdated;
    uint256 private upkeepInterval;
    bool private upkeepNeed;

    function updateUpkeep(bool _keep, uint256 _interval) external onlyOwner {
        upkeepNeed = _keep;
        upkeepInterval = _interval;
    }

    constructor(
        address _hookManager,
        address _factory,
        address _tokenA,
        address _tokenB,
        uint256 _decimalA,
        uint256 _decimalB,
        address _tokenAPricefeed,
        address _tokenBPricefeed,
        address _lpToken
    ) Ownable(msg.sender) {
        i_hookManager = _hookManager;
        i_factory = _factory;
        i_tokenA = _tokenA;
        i_tokenB = _tokenB;
        i_decimalA = _decimalA;
        i_decimalB = _decimalB;
        i_tokenAPricefeed = _tokenAPricefeed;
        i_tokenBPricefeed = _tokenBPricefeed;
        i_LPtoken = _lpToken;
    }

    function _checkLiquidityAvailable(uint256 _size, bool _isLong) private view returns (bool) {
        uint256 availableLiquidity = (IERC20(i_tokenB).balanceOf(address(this)) * MAX_LIQUIDITY) / 10000;
        if (_isLong) {
            uint256 initialLiquidity = long.size + _size - short.collateral;
            return availableLiquidity >= initialLiquidity;
        } else {
            uint256 initialLiquidity = short.size + _size - long.collateral;
            return availableLiquidity >= initialLiquidity;
        }
    }

    function _getPositionData(uint256 _collateral, uint256 _leverage, bool _isLong, uint256 _priceA, uint256 _priceB)
        public
        view
        returns (OrderValues memory)
    {
        uint256 fundingFee = PoolLibrary.getFundingFee(
            _collateral, _leverage, _isLong, long.size, short.size, long.collateral, short.collateral, i_decimalB
        );
        uint256 protocolFee = PoolLibrary.getProtocolFee(_collateral, POSITION_FEE);
        uint256 maintenanceMargin =
            PoolLibrary.getMaintenanceMargin(_collateral, _leverage, long.size, long.collateral, MIN_MARGIN_MAINTAIN);
        uint256 size = PoolLibrary.getSize(_collateral, _leverage, fundingFee, protocolFee);
        uint256 tokenASize = PoolLibrary.gettokenAAmount(size, _priceA, _priceB, i_decimalA, i_decimalB);
        uint256 liquidationPrice = PoolLibrary.getliquidationPrice(
            _collateral - fundingFee - protocolFee,
            tokenASize,
            maintenanceMargin,
            _priceA,
            _priceB,
            i_decimalA,
            i_decimalB,
            long.collateral > short.collateral ? fundingFee > 0 ? true : false : fundingFee > 0 ? false : true
        );

        return OrderValues({
            size: size,
            tokenASize: tokenASize,
            fundingFee: fundingFee,
            protocolFee: protocolFee,
            maintenanceMargin: maintenanceMargin,
            // token A in terms of size of tokenB we adding(removes fees from size)
            liquidationPrice: liquidationPrice
        });
    }

    function openLongPosition(
        address _receiver,
        uint256 _collateral,
        uint256 _leverage,
        uint256 _specialNum,
        OrderType orderType,
        uint256 _deadline
    ) external {
        // for timelimit orders convert specialNum to uint()
        // for special orders check special num values
        require(block.timestamp <= _deadline, "Exceed deadline");
        require(msg.sender != address(this) && msg.sender != address(0), "No delegate call");
        require(_leverage >= MIN_LEVERAGE && _leverage <= MAX_LEVERAGE, "Invalid leverage");

        uint256 price_A = uint256(AggregatorV3Interface(i_tokenAPricefeed).latestAnswer());
        uint256 price_B = uint256(AggregatorV3Interface(i_tokenBPricefeed).latestAnswer());

        require(PoolLibrary.getTokeninUSD(_collateral, price_B) >= MIN_COLLATERAL, "Minimum collateral");

        require(
            IHookManager(i_hookManager).beforeOpenPosition(
                msg.sender, _collateral, _leverage, price_A, price_B, uint256(orderType), true
            ),
            "PoolManger Failed"
        ); 

        SafeERC20.safeTransferFrom(IERC20(i_tokenB), msg.sender, address(this), _collateral);

        OrderValues memory values = _getPositionData(_collateral, _leverage, true, price_A, price_B);

        require(price_A > values.liquidationPrice, "Invalid liquidation prixe");

        Numbers memory numbers = Numbers({
            size: values.size,
            collateral: _collateral - values.fundingFee - values.protocolFee,
            balance: values.tokenASize,
            maintenanceMargin: values.maintenanceMargin
        });

        Position memory position = Position({
            numbers: numbers,
            entryPrice: uint256(price_A),
            liquidationPrice: values.liquidationPrice,
            specialPrice: 0,
            owner: msg.sender,
            receiver: _receiver,
            entryTime: uint256(block.timestamp),
            exitTime: 0,
            leverage: _leverage,
            status: PositionStatus.Active,
            orderType: OrderType.MarketOrder,
            isLong: true
        });

        positions[positionId] = position;

        if (orderType == OrderType.PriceLimitOrder) {
            positions[positionId].specialPrice = _specialNum; // price limit price
            positions[positionId].status = PositionStatus.Queued;
            positions[positionId].orderType = OrderType.PriceLimitOrder;
        } else {
            // here only we update the data
            // check the liquidity here
            _checkLiquidityAvailable(values.size, true);
            if (orderType == OrderType.TimeLimitOrder) {
                require(_specialNum > block.timestamp, "Invalid exit time");

                uint256 fee = PoolLibrary.getPositionMaintainFee(block.timestamp, _specialNum, FEE_PER_SECOND);
                fee = PoolLibrary.getTokenAmountFromUSD(fee, price_B, i_decimalB);

                require(
                    _collateral > values.fundingFee + values.protocolFee + values.maintenanceMargin + fee,
                    "Insufficient collateral"
                );

                positions[positionId].exitTime = uint256(_specialNum);
                positions[positionId].orderType = OrderType.TimeLimitOrder;
            } else if (orderType == OrderType.StopLossOrder) {
                // for short values inqualities are different
                require(price_A > _specialNum && _specialNum > values.liquidationPrice, "Invalid stop loss price");
                positions[positionId].specialPrice = _specialNum;
                positions[positionId].orderType = OrderType.StopLossOrder;
            } else if (orderType == OrderType.TakeProfitOrder) {
                require(_specialNum > price_A, "Invalid Take Profit price");
                positions[positionId].specialPrice = _specialNum;
                positions[positionId].orderType = OrderType.TakeProfitOrder;
            } //  no need to do for market orders

            long.size += values.size;
            long.collateral += _collateral - values.fundingFee - values.protocolFee;
        }

        require(IHookManager(i_hookManager).afterOpenPosition(positionId), "PoolManger Failed");

        positionId++;

        emit OpenPosition(positionId - 1, msg.sender, values.size, _collateral, _leverage, uint256(orderType), true);
    }

    function openShortPosition(
        address _receiver,
        uint256 _collateral,
        uint256 _leverage,
        uint256 _specialNum,
        OrderType orderType,
        uint256 _deadline
    ) external {
        // for timelimit orders convert specialNum to uint()
        // for special orders check special num values
        require(block.timestamp <= _deadline, "Exceed deadline");
        require(msg.sender != address(this) && msg.sender != address(0), "No delegate call");
        require(_leverage >= MIN_LEVERAGE && _leverage <= MAX_LEVERAGE, "Invalid leverage");

        uint256 price_A = uint256(AggregatorV3Interface(i_tokenAPricefeed).latestAnswer());
        uint256 price_B = uint256(AggregatorV3Interface(i_tokenBPricefeed).latestAnswer());

        require(PoolLibrary.getTokeninUSD(_collateral, price_B) >= MIN_COLLATERAL, "Minimum collateral");

        require(
            IHookManager(i_hookManager).beforeOpenPosition(
                msg.sender, _collateral, _leverage, price_A, price_B, uint256(orderType), false
            ),
            "PoolManger Failed"
        );

        SafeERC20.safeTransferFrom(IERC20(i_tokenB), msg.sender, address(this), _collateral);

        OrderValues memory values = _getPositionData(_collateral, _leverage, false, price_A, price_B);

        require(price_A < values.liquidationPrice, "Invalid liquidation prixe");

        Numbers memory numbers = Numbers({
            size: values.size,
            collateral: _collateral - values.fundingFee - values.protocolFee,
            balance: values.tokenASize,
            maintenanceMargin: values.maintenanceMargin
        });

        Position memory position = Position({
            numbers: numbers,
            entryPrice: uint256(price_A),
            liquidationPrice: values.liquidationPrice,
            specialPrice: 0,
            owner: msg.sender,
            receiver: _receiver,
            entryTime: uint256(block.timestamp),
            exitTime: 0,
            leverage: _leverage,
            status: PositionStatus.Active,
            orderType: OrderType.MarketOrder,
            isLong: false
        });

        positions[positionId] = position;

        if (orderType == OrderType.PriceLimitOrder) {
            positions[positionId].specialPrice = _specialNum; // price limit price
            positions[positionId].status = PositionStatus.Queued;
            positions[positionId].orderType = OrderType.PriceLimitOrder;
        } else {
            // here only we update the data
            // check the liquidity here
            _checkLiquidityAvailable(values.size, false);
            if (orderType == OrderType.TimeLimitOrder) {
                require(_specialNum > block.timestamp, "Invalid exit time");

                uint256 fee = PoolLibrary.getPositionMaintainFee(block.timestamp, _specialNum, FEE_PER_SECOND);
                fee = PoolLibrary.getTokenAmountFromUSD(fee, price_B, i_decimalB);

                require(
                    _collateral > values.fundingFee + values.protocolFee + values.maintenanceMargin + fee,
                    "Insufficient collateral"
                );

                positions[positionId].exitTime = uint256(_specialNum);
                positions[positionId].orderType = OrderType.TimeLimitOrder;
            } else if (orderType == OrderType.StopLossOrder) {
                // for short values inqualities are different
                require(price_A < _specialNum && _specialNum < values.liquidationPrice, "Invalid stop loss price");
                positions[positionId].specialPrice = _specialNum;
                positions[positionId].orderType = OrderType.StopLossOrder;
            } else if (orderType == OrderType.TakeProfitOrder) {
                require(_specialNum < price_A, "Invalid Take Profit price");
                positions[positionId].specialPrice = _specialNum;
                positions[positionId].orderType = OrderType.TakeProfitOrder;
            } //  no need to do for market orders

            short.size += values.size;
            short.collateral += _collateral - values.fundingFee - values.protocolFee;
        }

        require(IHookManager(i_hookManager).afterOpenPosition(positionId), "PoolManger Failed");

        positionId++;
        emit OpenPosition(positionId - 1, msg.sender, values.size, _collateral, _leverage, uint256(orderType), false);
    }

    // returning `false` means position is liquidated(not opened)
    function openPriceLimitPosition(uint256 _positionId, uint256 _deadline) external returns (bool) {
        require(block.timestamp <= _deadline, "Exceed deadline");

        Position memory position = positions[_positionId];
        require(position.orderType == OrderType.PriceLimitOrder, "Invalid order type");
        require(position.status == PositionStatus.Queued, "Position is not queued");

        uint256 price_A = uint256(AggregatorV3Interface(i_tokenAPricefeed).latestAnswer());
        uint256 price_B = uint256(AggregatorV3Interface(i_tokenBPricefeed).latestAnswer());

        if (position.entryPrice > position.specialPrice) {
            require(position.specialPrice > price_A, "price is not reached");
        } else {
            require(position.specialPrice < price_A, "price is not reached");
        }

        if (_openPriceLimitPosition(_positionId, price_A, price_B)) {
            return true;
        } else {
            _liquidatePosition(_positionId);
            return false;
        }
    }

    // this function is also called from external function by any one it cannot cause any problem
    function _openPriceLimitPosition(uint256 _positionId, uint256 _priceA, uint256 _priceB) private returns (bool) {
        // if the total fees are more than the collateral we close the position
        // if any liquidation error we return false  // check at automation function
        Position memory position = positions[_positionId];
        uint256 priceLimitFee = PoolLibrary.getPositionMaintainFee(position.entryTime, block.timestamp, FEE_PER_SECOND);
        // here pricelimit fee in usd but we have to convert into desired tokens
        priceLimitFee = PoolLibrary.getTokenAmountFromUSD(priceLimitFee, _priceB, i_decimalB);

        if (position.numbers.collateral <= priceLimitFee) {
            return false;
        }

        OrderValues memory values =
            _getPositionData(position.numbers.collateral - priceLimitFee, position.leverage, true, _priceA, _priceB);

        if (position.isLong) {
            require(values.liquidationPrice < _priceA, "Invalid liquidation Price");
        } else {
            require(values.liquidationPrice > _priceA, "Invalid liquidation Price");
        }

        if (!_checkLiquidityAvailable(values.size, position.isLong)) {
            return false;
        }

        Numbers memory numbers = Numbers({
            size: values.size,
            collateral: position.numbers.collateral - values.fundingFee - values.protocolFee,
            balance: values.tokenASize,
            maintenanceMargin: values.maintenanceMargin
        });

        Position memory updatedPosition = Position({
            numbers: numbers,
            entryPrice: uint256(_priceA),
            liquidationPrice: values.liquidationPrice,
            specialPrice: position.specialPrice,
            owner: position.owner,
            receiver: position.receiver,
            entryTime: uint256(block.timestamp),
            exitTime: 0,
            leverage: position.leverage,
            status: PositionStatus.Active,
            orderType: OrderType.PriceLimitOrder,
            isLong: position.isLong
        });

        positions[positionId] = position;

        if (position.isLong) {
            long.size += values.size;
            long.collateral += position.numbers.collateral - values.fundingFee - values.protocolFee - priceLimitFee;
        } else {
            short.size += values.size;
            short.collateral += position.numbers.collateral - values.fundingFee - values.protocolFee - priceLimitFee;
        }

        emit OpenPriceLimitPosition(
            _positionId, position.owner, updatedPosition.entryPrice, updatedPosition.specialPrice, position.isLong
        );
        return true;
    }

    function closePosition(uint256 _positionId, uint256 _deadline) external {
        require(block.timestamp >= _deadline, "Exceed deadline");

        Position memory position = positions[_positionId];
        require(position.owner == msg.sender, "Not owner");
        require(position.status == PositionStatus.Active, "Currently not active state");

        uint256 price_A = uint256(AggregatorV3Interface(i_tokenAPricefeed).latestAnswer());
        uint256 price_B = uint256(AggregatorV3Interface(i_tokenBPricefeed).latestAnswer());

        uint256 maintenanceFee = PoolLibrary.getPositionMaintainFee(position.entryTime, block.timestamp, FEE_PER_SECOND);
        // fee in terms of tokenB(it is subrated from the collateral)
        maintenanceFee = PoolLibrary.getTokenAmountFromUSD(maintenanceFee, price_B, i_decimalB);

        // pnl returns in terms of tokenA, so we have to convert this profit or loss into tokenB the we send or takke the profit or loss respectively
        int256 pnl = _calculatePNL(position.isLong, position.entryPrice, price_A, position.numbers.balance);

        require(IHookManager(i_hookManager).beforeClosePosition(positionId, pnl), "PoolManger Failed");

        uint256 remainingCollateral;
        if (pnl > 0) {
            // profit
            uint256 profitAmountB = PoolLibrary.gettokenAAmount(uint256(pnl), price_B, price_A, i_decimalB, i_decimalA);
            if (position.numbers.collateral + profitAmountB > maintenanceFee) {
                SafeERC20.safeTransfer(
                    IERC20(i_tokenB), position.receiver, position.numbers.collateral + profitAmountB - maintenanceFee
                );
                remainingCollateral = position.numbers.collateral + profitAmountB - maintenanceFee;
            }
        } else {
            // loss
            uint256 lossAmountB = PoolLibrary.gettokenAAmount(uint256(-pnl), price_B, price_A, i_decimalB, i_decimalA);
            // subtract from balance
            if (position.numbers.collateral > lossAmountB + maintenanceFee) {
                SafeERC20.safeTransfer(
                    IERC20(i_tokenB), position.receiver, position.numbers.collateral - lossAmountB - maintenanceFee
                );
                remainingCollateral = position.numbers.collateral - lossAmountB - maintenanceFee;
            }
        }

        if (position.isLong) {
            long.size -= position.numbers.size;
            long.collateral -= position.numbers.collateral;
        } else {
            short.size -= position.numbers.size;
            short.collateral -= position.numbers.collateral;
        }
        positions[_positionId].status = PositionStatus.Closed;

        require(IHookManager(i_hookManager).afterClosePosition(positionId, remainingCollateral), "PoolManger Failed");

        emit ClosePosition(_positionId, position.owner, uint256(position.orderType), pnl, position.isLong);
    }

    function _calculatePNL(bool _isLong, uint256 _entryPrice, uint256 _exitPrice, uint256 _tokenASize)
        private
        pure
        returns (int256 pnl)
    {
        if (_isLong) {
            pnl = ((((int256(_exitPrice) - int256(_entryPrice)) * 10 ** 8) / int256(_entryPrice)) * int256(_tokenASize))
                / 10 ** 8;
        } else {
            pnl = ((((int256(_entryPrice) - int256(_exitPrice)) * 10 ** 8) / int256(_entryPrice)) * int256(_tokenASize))
                / 10 ** 8;
        }
    }

    function changeReceiver(uint256 _positionId, address _newReceiver) external {
        require(positions[_positionId].status != PositionStatus.Closed);
        require(positions[_positionId].owner == msg.sender);
        positions[_positionId].receiver = _newReceiver;
    }

    function updatePriceLimitPosition(uint256 _positionId, uint256 _newPriceLimit, uint256 _deadline) external {
        require(block.timestamp >= _deadline, "Exceed deadline");
        require(positions[_positionId].owner == msg.sender, "Not owner");
        require(positions[_positionId].status != PositionStatus.Closed, "Position is closed");

        positions[_positionId].specialPrice = _newPriceLimit;
        emit UpdatePriceLimit(_positionId, msg.sender, _newPriceLimit);
    }

    function updateStopLossPosition(uint256 _positionId, uint256 _newStopLossPrice, uint256 _deadline) external {
        require(block.timestamp >= _deadline, "Exceed deadline");

        Position memory position = positions[_positionId];
        require(position.owner == msg.sender, "Not owner");
        require(position.status == PositionStatus.Active, "Position is not Active");

        if (position.isLong) {
            require(_newStopLossPrice < position.entryPrice, "Invalid stop loss price");
        } else {
            require(_newStopLossPrice > position.entryPrice, "Invalid stop loss price");
        }

        positions[_positionId].specialPrice = _newStopLossPrice;
        emit UpdateStopLoss(_positionId, msg.sender, _newStopLossPrice);
    }

    function updateTakeProfitPosition(uint256 _positionId, uint256 _newTakeProfitPrice, uint256 _deadline) external {
        require(block.timestamp >= _deadline, "Exceed deadline");

        Position memory position = positions[_positionId];
        require(position.owner == msg.sender, "Not owner");
        require(position.status == PositionStatus.Active, "Position is not Active");

        if (position.isLong) {
            require(_newTakeProfitPrice > position.entryPrice, "Invalid stop loss price");
        } else {
            require(_newTakeProfitPrice < position.entryPrice, "Invalid stop loss price");
        }

        positions[_positionId].specialPrice = _newTakeProfitPrice;
        emit UpdateTakePrice(_positionId, msg.sender, _newTakeProfitPrice);
    }

    function updateTimeLimitPosition(uint256 _positionId, uint256 _newExitTime, uint256 _deadline) external {
        require(block.timestamp >= _deadline, "Exceed deadline");
        require(_newExitTime > block.timestamp, "Invalid exit time");

        Position memory position = positions[_positionId];
        require(position.owner == msg.sender, "Not owner");
        require(position.status == PositionStatus.Active, "Position is not Active");

        positions[_positionId].exitTime = _newExitTime;
        emit UpdateTimeLoss(_positionId, msg.sender, _newExitTime);
    }

    function updateSize(uint256 _positionId, uint256 _newLeverage) external returns (bool) {
        Position memory position = positions[_positionId];
        require(position.owner == msg.sender, "Not owner");
        require(position.status == PositionStatus.Active, "Position is not Active");
        require(_newLeverage >= MIN_LEVERAGE && _newLeverage <= MAX_LEVERAGE, "iInvalid leverage");

        uint256 price_A = uint256(AggregatorV3Interface(i_tokenAPricefeed).latestAnswer());
        uint256 price_B = uint256(AggregatorV3Interface(i_tokenBPricefeed).latestAnswer());

        uint256 maintenanceFee = PoolLibrary.getPositionMaintainFee(position.entryTime, block.timestamp, FEE_PER_SECOND);
        // fee in terms of tokenB(it is subrated from the collateral)
        maintenanceFee = PoolLibrary.getTokenAmountFromUSD(maintenanceFee, price_B, i_decimalB);

        // pnl returns in terms of tokenA, so we have to convert this profit or loss into tokenB the we send or takke the profit or loss respectively
        int256 pnl = _calculatePNL(position.isLong, position.entryPrice, price_A, position.numbers.balance);
        uint256 remainingCollateral;

        if (pnl > 0) {
            // profit
            uint256 profitAmountB = PoolLibrary.gettokenAAmount(uint256(pnl), price_B, price_A, i_decimalB, i_decimalA);
            if (position.numbers.collateral + profitAmountB > maintenanceFee) {
                remainingCollateral = position.numbers.collateral + profitAmountB - maintenanceFee;
            } else {
                _liquidatePosition(_positionId);
                return false;
            }
        } else {
            // loss
            uint256 lossAmountB = PoolLibrary.gettokenAAmount(uint256(-pnl), price_B, price_A, i_decimalB, i_decimalA);
            // subtract from balance
            if (position.numbers.collateral > lossAmountB + maintenanceFee) {
                remainingCollateral = position.numbers.collateral - lossAmountB - maintenanceFee;
            } else {
                _liquidatePosition(_positionId);
                return false;
            }
        }

        OrderValues memory newValues =
            _getPositionData(remainingCollateral, _newLeverage, position.isLong, price_A, price_B);

        Position storage updatedPosition = positions[_positionId];

        remainingCollateral = remainingCollateral - newValues.fundingFee - newValues.protocolFee;
        // always true becuse we take fee in that amount percentage

        updatedPosition.numbers.size = newValues.size;
        updatedPosition.numbers.collateral = remainingCollateral;
        updatedPosition.numbers.balance = newValues.tokenASize;
        updatedPosition.numbers.maintenanceMargin = newValues.maintenanceMargin;
        updatedPosition.entryPrice = uint256(price_A);
        updatedPosition.liquidationPrice = newValues.liquidationPrice;
        updatedPosition.entryTime = uint256(block.timestamp);
        updatedPosition.leverage = _newLeverage;

        if (position.isLong) {
            if (newValues.size > position.numbers.size) {
                long.size += newValues.size - position.numbers.size;
            } else {
                long.size -= position.numbers.size - newValues.size;
            }

            if (remainingCollateral > position.numbers.collateral) {
                long.collateral += remainingCollateral - position.numbers.collateral;
            } else {
                long.collateral += position.numbers.collateral - remainingCollateral;
            }
        } else {
            if (newValues.size > position.numbers.size) {
                short.size += newValues.size - position.numbers.size;
            } else {
                short.size -= position.numbers.size - newValues.size;
            }

            if (remainingCollateral > position.numbers.collateral) {
                short.collateral += remainingCollateral - position.numbers.collateral;
            } else {
                short.collateral += position.numbers.collateral - remainingCollateral;
            }
        }

        emit UpdateSize(
            _positionId,
            position.owner,
            _newLeverage,
            newValues.size,
            remainingCollateral,
            pnl,
            uint256(position.orderType),
            position.isLong
        );
        return true;
    }

    function _liquidatePosition(uint256 _positionId) private {
        Position memory position = positions[_positionId];

        uint256 price_A = uint256(AggregatorV3Interface(i_tokenAPricefeed).latestAnswer());
        uint256 price_B = uint256(AggregatorV3Interface(i_tokenBPricefeed).latestAnswer());

        uint256 maintenanceFee = PoolLibrary.getPositionMaintainFee(position.entryTime, block.timestamp, FEE_PER_SECOND);
        // fee in terms of tokenB(it is subrated from the collateral)
        maintenanceFee = PoolLibrary.getTokenAmountFromUSD(maintenanceFee, price_B, i_decimalB);

        int256 pnl = _calculatePNL(position.isLong, position.entryPrice, price_A, position.numbers.balance);
        if (pnl > 0) {
            // profit
            uint256 profitAmountB = PoolLibrary.gettokenAAmount(uint256(pnl), price_B, price_A, i_decimalB, i_decimalA);
            if (position.numbers.collateral + profitAmountB > maintenanceFee) {
                SafeERC20.safeTransfer(
                    IERC20(i_tokenB), position.owner, position.numbers.collateral + profitAmountB - maintenanceFee
                );
            }
        } else {
            // loss
            uint256 lossAmountB = PoolLibrary.gettokenAAmount(uint256(-pnl), price_B, price_A, i_decimalB, i_decimalA);
            // subtract from balance
            if (position.numbers.collateral > lossAmountB + maintenanceFee) {
                SafeERC20.safeTransfer(
                    IERC20(i_tokenB), position.owner, position.numbers.collateral - lossAmountB - maintenanceFee
                );
            }
        }

        if (position.isLong) {
            long.size -= position.numbers.size;
            long.collateral -= position.numbers.collateral;
        } else {
            short.size -= position.numbers.size;
            short.collateral -= position.numbers.collateral;
        }
        positions[_positionId].status = PositionStatus.Closed;

        emit PositionLiquidated(_positionId, position.owner, pnl, uint256(position.orderType), position.isLong);
    }

    function checkUpkeep(bytes memory /**/ ) public returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = upkeepNeed && (block.timestamp >= upkeepInterval + lastUpkeepUpdated);
        performData = "";
    }

    function performUpkeep(bytes calldata performData) external {
        (bool upkeepNeeded,) = checkUpkeep(performData);
        // only 1000 contracts can hold this
        require(upkeepNeeded, "Conditions are not meet");

        uint256 price_A = uint256(AggregatorV3Interface(i_tokenAPricefeed).latestAnswer());
        uint256 price_B = uint256(AggregatorV3Interface(i_tokenBPricefeed).latestAnswer());

        for (uint256 i = 0; i < positionId; i++) {
            OrderType orderType = positions[i].orderType;
            if (orderType == OrderType.PriceLimitOrder) {
                if (positions[i].status == PositionStatus.Queued) {
                    if (positions[i].entryPrice > positions[i].specialPrice && positions[i].specialPrice >= price_A) {
                        if (!_openPriceLimitPosition(i, price_A, price_B)) {
                            _liquidatePosition(i);
                        }
                    } else if (
                        positions[i].entryPrice < positions[i].specialPrice && positions[i].specialPrice <= price_A
                    ) {
                        if (!_openPriceLimitPosition(i, price_A, price_B)) {
                            _liquidatePosition(i);
                        }
                    }
                } else if (positions[i].status == PositionStatus.Active) {
                    if (positions[i].isLong && positions[i].liquidationPrice >= price_A) {
                        _liquidatePosition(i);
                    } else if (!positions[i].isLong && positions[i].liquidationPrice <= price_A) {
                        _liquidatePosition(i);
                    }
                }
            } else if (orderType == OrderType.StopLossOrder) {
                if (positions[i].status == PositionStatus.Active) {
                    if (positions[i].isLong) {
                        // for stop loss liquidation price is always less than the stop loss price
                        if (positions[i].specialPrice >= price_A) {
                            _liquidatePosition(i);
                        }
                    } else {
                        if (positions[i].specialPrice <= price_A) {
                            _liquidatePosition(i);
                        }
                    }
                }
            } else if (orderType == OrderType.TakeProfitOrder) {
                if (positions[i].status == PositionStatus.Active) {
                    if (positions[i].isLong) {
                        if (positions[i].specialPrice <= price_A || positions[i].liquidationPrice >= price_A) {
                            _liquidatePosition(i);
                        }
                    } else {
                        if (positions[i].specialPrice >= price_A || positions[i].liquidationPrice <= price_A) {
                            _liquidatePosition(i);
                        }
                    }
                }
            } else if (orderType == OrderType.TimeLimitOrder) {
                if (positions[i].status == PositionStatus.Active) {
                    if (
                        block.timestamp >= positions[i].exitTime
                            || (positions[i].isLong && positions[i].liquidationPrice >= price_A)
                    ) {
                        _liquidatePosition(i);
                    } else if (
                        block.timestamp >= positions[i].exitTime
                            || (!positions[i].isLong && positions[i].liquidationPrice <= price_A)
                    ) {
                        _liquidatePosition(i);
                    }
                }
            } else {
                if (positions[i].status == PositionStatus.Active) {
                    if (positions[i].isLong && positions[i].liquidationPrice >= price_A) {
                        _liquidatePosition(i);
                    } else if (!positions[i].isLong && positions[i].liquidationPrice <= price_A) {
                        _liquidatePosition(i);
                    }
                }
            }
        }
        lastUpkeepUpdated = block.timestamp;
    }

    function addLiquidity(address _receiver, uint256 _amount, uint256 _minLiquidity, uint256 _deadline)
        external
        returns (uint256 liquidity)
    {
        require(block.timestamp <= _deadline, "Exceed deadline");
        require(_amount > 0, "Invalid amount");

        liquidity = PoolLibrary.getLiquidityAmount(
            _amount, IERC20(i_tokenB).balanceOf(address(this)), IERC20(i_LPtoken).totalSupply()
        );
        require(liquidity >= _minLiquidity, "Min liquidity not met");

        require(IHookManager(i_hookManager).beforeAddLiquidity(_receiver, _amount, liquidity), "Hookmanager Failed");

        SafeERC20.safeTransferFrom(IERC20(i_tokenB), msg.sender, address(this), _amount);
        ILPToken(i_LPtoken).mint(_receiver, liquidity);

        require(IHookManager(i_hookManager).afterAddLiquidity(), "Hookmanager Failed");

        emit AddLiquidity(msg.sender, _receiver, _amount, liquidity);
    }

    function removeLiquidity(address _receiver, uint256 _liquidity, uint256 _amountMin, uint256 _deadline)
        external
        returns (uint256 amount)
    {
        require(block.timestamp <= _deadline, "Exceed deadline");
        require(_liquidity > 0, "Zero amount");

        (amount) = PoolLibrary.getRemoveLiquidity(
            _liquidity, IERC20(i_tokenB).balanceOf(address(this)), IERC20(i_LPtoken).totalSupply()
        );
        uint256 fee = PoolLibrary.getProtocolFee(amount, FACTORY_FEE);

        require(
            IHookManager(i_hookManager).beforeRemoveLiquidity(_receiver, _liquidity, amount, fee), "Hookmanager Failed"
        );

        require(amount - fee >= _amountMin, "Amount exceed");

        ILPToken(i_LPtoken).burn(msg.sender, _liquidity);
        SafeERC20.safeTransfer(IERC20(i_tokenB), _receiver, amount - fee);
        SafeERC20.safeTransfer(IERC20(i_tokenB), i_factory, fee);

        require(IHookManager(i_hookManager).afterRemoveLiquidity(), "Hookmanager Failed");

        emit RemoveLiquidity(msg.sender, _receiver, _liquidity, amount, fee);
    }
}
