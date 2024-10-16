// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20, IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {TradeRunERC20} from "./TradeRunERC20.sol";
import {TradePool} from "./TradePool.sol";

contract Factory is Ownable {
    using SafeERC20 for IERC20;

    /* ------------------------------ Events ------------------------------ */
    event PoolCreated(
        bytes32 indexed poolId,
        address indexed tradePool,
        address hookManager,
        address tokenA,
        address tokenB,
        address lpToken
    );

    /* ------------------------------ Structs ------------------------------ */
    struct TradePoolData {
        address pool;
        address hookManager;
        address lpToken;
        address tokenA;
        address tokenB;
    }

    /* ------------------------------ State Variables ------------------------------ */
    uint256 public constant CREATE_POOL_FEE = 1 ether; // to create a pool they have to pay 1 ether to protocol
    address public deployer;

    /* ------------------------------ Mappings ------------------------------ */
    mapping(bytes32 poolId => TradePoolData) public tradePool;
    mapping(address token => bool) public longTokens;
    mapping(address token => bool) public shortTokens;
    mapping(address token => address pricefeed) public pricefeeds;

    // allow long tokens as non stable tokens
    constructor(
        address[] memory _longTokens,
        address[] memory _shortTokens,
        address[] memory _allTokens,
        address[] memory _priceFeeds,
        address _owner,
        address _deployer
    ) Ownable(_owner) {
        for (uint256 i = 0; i < _longTokens.length; i++) {
            longTokens[_longTokens[i]] = true;
        }
        for (uint256 i = 0; i < _shortTokens.length; i++) {
            shortTokens[_shortTokens[i]] = true;
        }
        for (uint256 i = 0; i < _allTokens.length; i++) {
            pricefeeds[_allTokens[i]] = _priceFeeds[i];
        }
        deployer = _deployer;
    }

    /* ------------------------------ Create Trade Pool ------------------------------ */
    function createTradePool(address _hookManager, address _tokenA, address _tokenB)
        external
        payable
        returns (address)
    {
        require(msg.value == CREATE_POOL_FEE, "MarketFactory : Insufficient fees to create pool");
        // same tokens are also possible
        require(longTokens[_tokenA], "Invalid token-A");
        require(shortTokens[_tokenB], "Invalid token-B");

        bytes32 poolId = keccak256(abi.encodePacked(_tokenA, _tokenB));

        TradeRunERC20 lpToken =
            new TradeRunERC20(IERC20Metadata(_tokenA).symbol(), IERC20Metadata(_tokenA).symbol(), address(this));

        require(tradePool[poolId].pool == address(0), "Pool already exist");

        address pool;
        bytes memory bytecode = _getBytecode(
            _hookManager,
            address(this),
            _tokenA,
            _tokenB,
            IERC20Metadata(_tokenA).decimals(),
            IERC20Metadata(_tokenB).decimals(),
            pricefeeds[_tokenA],
            pricefeeds[_tokenB],
            address(lpToken)
        );
        uint256 salt = uint256(keccak256(abi.encodePacked(_hookManager, _tokenA, _tokenB, address(lpToken))));

        // Using CREATE2 to deploy the contract
        assembly {
            pool := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(pool != address(0), "Failed to create pool");

        lpToken.transferOwnership(pool);

        tradePool[poolId] = TradePoolData({
            pool: pool,
            hookManager: _hookManager,
            tokenA: _tokenA,
            tokenB: _tokenB,
            lpToken: address(lpToken)
        });

        emit PoolCreated(poolId, pool, _hookManager, _tokenA, _tokenB, address(lpToken));
        return pool;
    }

    function getPoolData(address _tokenA, address _tokenB) external view returns (TradePoolData memory) {
        bytes32 poolId = keccak256(abi.encodePacked(_tokenA, _tokenB));
        return tradePool[poolId];
    }

    function computeTradePoolAddress(
        address _hookManager,
        address _marketFactory,
        address _tokenA,
        address _tokenB,
        uint256 _decimalA,
        uint256 _decimalB,
        address _tokenApricefeed,
        address _tokenBpricefeed,
        address _lpToken
    ) external view returns (address) {
        bytes32 bytecodeHash = keccak256(
            _getBytecode(
                _hookManager,
                _marketFactory,
                _tokenA,
                _tokenB,
                _decimalA,
                _decimalB,
                _tokenApricefeed,
                _tokenBpricefeed,
                _lpToken
            )
        );
        uint256 salt = uint256(keccak256(abi.encodePacked(_hookManager, _tokenA, _tokenB, _lpToken)));

        return address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, bytecodeHash)))));
    }

    /* ------------------------------ Private functions ------------------------------ */
    function _getBytecode(
        address _hookManager,
        address _marketFactory,
        address _tokenA,
        address _tokenB,
        uint256 _decimalA,
        uint256 _decimalB,
        address _tokenApricefeed,
        address _tokenBpricefeed,
        address _lpToken
    ) private pure returns (bytes memory) {
        bytes memory bytecode = type(TradePool).creationCode;
        return abi.encodePacked(
            bytecode,
            abi.encode(
                _hookManager,
                _marketFactory,
                _tokenA,
                _tokenB,
                _decimalA,
                _decimalB,
                _tokenApricefeed,
                _tokenBpricefeed,
                _lpToken
            )
        );
    }

    /* ------------------------------ Owner Only functions ------------------------------ */
    function updateLongToken(address _token, bool _add) external onlyOwner {
        longTokens[_token] = _add;
    }

    function updateShortToken(address _token, bool _add) external onlyOwner {
        shortTokens[_token] = _add;
    }

    function updatePriceFeed(address _token, address _priceFeed) external onlyOwner {
        pricefeeds[_token] = _priceFeed;
    }

    /* ------------------------------ Receive & Withdraw funds ------------------------------ */
    receive() external payable {}

    // for insufficient amount to withdraw fails the function.
    function withdrawNative(address payable _receiver, uint256 _amount) external {
        require(msg.sender == deployer, "Invalid deployer");
        // (address target).call{value: amount}(abi.encodeWithSignature("functionName(argType1,argType2)", arg1, arg2));
        (bool success,) = _receiver.call{value: _amount}("");
        require(success, "Failed to withdraw ETH");
    }

    function withdrawERC20(address _token, address _receiver, uint256 _amount) external {
        require(msg.sender == deployer, "Invalid deployer");
        SafeERC20.safeTransfer(IERC20(_token), _receiver, _amount);
    }

    function changeDeployer(address _newDeployer) external {
        require(msg.sender == deployer, "Invalid deployer");
        deployer = _newDeployer;
    }
}
