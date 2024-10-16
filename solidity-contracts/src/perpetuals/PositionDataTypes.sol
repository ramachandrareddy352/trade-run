// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PositionDataTypes {
    enum OrderType {
        MarketOrder,
        PriceLimitOrder,
        StopLossOrder,
        TakeProfitOrder,
        TimeLimitOrder
    }

    enum PositionStatus {
        None,
        Active,
        Queued,
        Closed
    }

    // 10 * 32 + 20 + 20 +3
    struct Position {
        address owner;
        address receiver; // the hook manager will maintan the orders ouside the trade pool, if trigger price met or having sufficient liquidity the hook manager will execute that orders and give the receiver address
        PositionStatus status; // whether the position is in active or not, for price limit the route is different
        OrderType orderType;
        bool isLong;
        Numbers numbers;
        uint256 entryPrice; // price A
        uint256 liquidationPrice; // price A  184,467,440,737 | 09551615
        uint256 specialPrice; // for pricelimt, stoploss, take profit the price is not zero
        uint256 entryTime; // time at which the position is opened
        uint256 exitTime; // only for timelimit orders
        uint256 leverage;
    }

    struct Numbers {
        uint256 size;
        uint256 collateral;
        uint256 balance;
        uint256 maintenanceMargin; // 340_282_366_920_938_463_463|374_607_431_768_211_455
    }

    // 16 + 16 | 16 + 16 | 16 + 8
    struct OrderValues {
        uint256 size;
        uint256 tokenASize;
        uint256 fundingFee;
        uint256 protocolFee;
        uint256 maintenanceMargin;
        uint256 liquidationPrice;
    }

    struct PositionSummary {
        uint256 size; // token-B size (collateral * leverage)
        uint256 collateral; // token-B given by trader
    }

    // data types
    uint256 public positionId; // for a single pool we can create a total of 4,294,967,295
    mapping(uint256 id => Position) public positions;

    PositionSummary public long;
    PositionSummary public short;

    // events
    event OpenPosition(
        uint256 indexed positionId,
        address indexed owner,
        uint256 size,
        uint256 collateral,
        uint256 leverage,
        uint256 orderType,
        bool isLong
    );
    event OpenPriceLimitPosition(
        uint256 indexed positionId, address indexed owner, uint256 indexed entryPrice, uint256 priceLimit, bool isLong
    );
    event UpdatePriceLimit(uint256 indexed positionId, address indexed owner, uint256 newPriceLimit);
    event UpdateStopLoss(uint256 indexed positionId, address indexed owner, uint256 newStopLossPrice);
    event UpdateTakePrice(uint256 indexed positionId, address indexed owner, uint256 newTakeProfitPrice);
    event UpdateTimeLoss(uint256 indexed positionId, address indexed owner, uint256 newExitTime);
    event UpdateSize(
        uint256 indexed positionId,
        address indexed owner,
        uint256 newLeverage,
        uint256 size,
        uint256 collateral,
        int256 pnl,
        uint256 oredrType,
        bool isLong
    );
    event ClosePosition(uint256 indexed positionId, address indexed owner, uint256 orderType, int256 pnl, bool isLong);
    event PositionLiquidated(
        uint256 indexed positionId, address indexed owner, int256 pnl, uint256 orderType, bool isLong
    );
    event AddLiquidity(address indexed owner, address receiver, uint256 indexed amount, uint256 indexed liquidity);
    event RemoveLiquidity(
        address indexed owner, address receiver, uint256 indexed liquidity, uint256 indexed amount, uint256 fee
    );
}
