// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library PoolLibrary {
    function getLiquidityAmount(uint256 _amount, uint256 _reserves, uint256 _totalSupply)
        internal
        pure
        returns (uint256 liquidity)
    {
        uint256 minLiquidityLock = 1000;

        if (_totalSupply == 0) {
            require(_amount > minLiquidityLock, "Min Liquidity");
            liquidity = _amount - minLiquidityLock;
            // mimimum liquidity is locked perminently
        } else {
            liquidity = (_amount * _totalSupply) / _reserves;
        }
        require(liquidity > 0, "POOL : Invalid mint liquidity");
    }

    function getRemoveLiquidity(uint256 _liquidity, uint256 _reserves, uint256 _totalSupply)
        internal
        pure
        returns (uint256 amount)
    {
        require(_totalSupply != 0, "Invalid total supply");
        amount = (_liquidity * _reserves) / _totalSupply;
    }

    function getProtocolFee(uint256 _amountIn, uint256 _fee) internal pure returns (uint256 amountIn) {
        amountIn = (_amountIn * _fee) / 10000;
    }

    function getFundingFee(
        uint256 _collateral, // token-B
        uint256 _leverage,
        bool _isLong,
        uint256 _longSize,
        uint256 _shortSize,
        uint256 _longCollateral,
        uint256 _shortCollateral,
        uint256 _decimals // decimals-B
    ) internal pure returns (uint256 fundingFee) {
        fundingFee = 0;

        if (_longCollateral > _shortCollateral) {
            if (_isLong) {
                uint256 collateralDifference = _longCollateral - _shortCollateral + _collateral;
                uint256 longRatio = (_longSize * 100) / _longCollateral;
                return (collateralDifference * _leverage * longRatio * _collateral) / 10 ** (_decimals + 10);
            }
        } else if (_longCollateral < _shortCollateral) {
            if (!_isLong) {
                uint256 collateralDifference = _shortCollateral - _longCollateral + _collateral;
                uint256 shortRatio = (_shortSize * 100) / _shortCollateral;
                return (collateralDifference * _leverage * shortRatio * _collateral) / 10 ** (_decimals + 10);
            }
        }
        // for remaining all cases return funding fee = 0
    }

    function getMaintenanceMargin(
        uint256 _collateral,
        uint256 _leverage,
        uint256 _size,
        uint256 _sizeIntokens,
        uint256 _minMargin
    ) internal pure returns (uint256 margin) {
        margin = (_collateral * _minMargin) / 10000;
        uint256 updatedSize = (_size + ((_collateral * _leverage) / 100));
        uint256 ratio = (updatedSize * 10000) / (_sizeIntokens + _collateral);
        uint256 multiplier = (_leverage * 10000) / ratio;
        margin += (_collateral * multiplier) / 100000000;
    }

    function getSize(uint256 _collateral, uint256 _leverage, uint256 _fundingFee, uint256 _protocolFee)
        internal
        pure
        returns (uint256)
    {
        // return in terms of token-B decimals
        uint256 remainingCollateral = _collateral - _fundingFee - _protocolFee;
        return (remainingCollateral * _leverage) / 100;
    }
    /**
     * check leverage at 1x because at that position collateral > size
     */

    function getliquidationPrice(
        uint256 _collateral,
        uint256 _sizeInTokenA,
        uint256 _margin,
        uint256 _priceA,
        uint256 _priceB,
        uint256 _decimalA,
        uint256 _decimalB,
        bool _isLong
    ) internal pure returns (uint256) {
        // liquidation price of token-A
        uint256 remainingCollateral;
        if (_isLong) {
            remainingCollateral = _collateral - _margin;
            uint256 amount = gettokenAAmount(remainingCollateral, _priceA, _priceB, _decimalA, _decimalB);
            amount = (10 ** 8 - (amount * 10 ** 8 / _sizeInTokenA));
            return (_priceA * amount) / 10 ** 8;
        } else {
            remainingCollateral = _collateral + _margin;
            uint256 amount = gettokenAAmount(remainingCollateral, _priceA, _priceB, _decimalA, _decimalB);
            amount = (10 ** 8 + (amount * 10 ** 8 / _sizeInTokenA)); // by 10**8
            return (_priceA * amount) / 10 ** 8; // uisng 10**8 cost more gas for every time function have to find the value of 10**8
        }
    }

    function gettokenAAmount(uint256 _amountB, uint256 _priceA, uint256 _priceB, uint256 _decimalA, uint256 _decimalB)
        internal
        pure
        returns (uint256 amountA)
    {
        amountA = (_amountB * _priceB * 10 ** 8) / _priceA;
        if (_decimalA < _decimalB) {
            amountA = (amountA / 10 ** (_decimalB - _decimalA + 8));
        } else if (_decimalA > _decimalB) {
            amountA = (amountA * 10 ** (_decimalA - _decimalB + 8));
        }
    }

    function getTokeninUSD(uint256 _amount, uint256 _price) internal pure returns (uint256) {
        return (_amount * _price) / 10 ** 8; // returns in usd amount(10**8)
    }

    function getPositionMaintainFee(uint256 _entryTime, uint256 _exitTime, uint256 _feePerSecond)
        internal
        pure
        returns (uint256)
    {
        return (_exitTime - _entryTime) * _feePerSecond; // returns in USD(10**8)
    }

    function getTokenAmountFromUSD(uint256 _amountInUSD, uint256 _price, uint256 _decimals)
        internal
        pure
        returns (uint256)
    {
        return (_amountInUSD * 10 ** _decimals) / _price;
    }
}
