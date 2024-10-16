// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IHookManager {
    // user call from IHookManager and he should have to verify that weather the call is from TradePool or not

    function beforeAddLiquidity(address _receiver, uint256 _amount, uint256 _liquidity) external returns (bool);
    function afterAddLiquidity() external returns (bool);
    function beforeRemoveLiquidity(address _receiver, uint256 _liquidity, uint256 _amount, uint256 _fee)
        external
        returns (bool);
    function afterRemoveLiquidity() external returns (bool);
    function beforeOpenPosition(
        address _owner,
        uint256 _collateral,
        uint256 _leverage,
        uint256 _priceA,
        uint256 _priceB,
        uint256 orderType,
        bool _isLong
    ) external returns (bool);
    function afterOpenPosition(uint256 _positionId) external returns (bool);
    function beforeClosePosition(uint256 _positionId, int256 _pnl) external returns (bool);
    function afterClosePosition(uint256 _positionId, uint256 _remainingCollateral) external returns (bool);

    function getFactory() external view returns (address);
    function getPools() external view returns (address[] memory);
}
