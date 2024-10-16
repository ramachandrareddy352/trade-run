// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../interface/AggregatorV3Interface.sol";

contract Presale is Ownable, Pausable {
    using SafeERC20 for IERC20; 
    // Governance token to be sold
 
    IERC20 public presaleToken;

    // Token information
    uint256 public constant MAX_TOKENS_FOR_SALE = 350_000_000 * 10 ** 18; // 350 million tokens
    uint256 public tokensSold;

    // Price parameters
    uint256 public constant START_PRICE = 1 * 10 ** 8; // 1 dollar (8 decimals)
    uint256 public constant END_PRICE = 25 * 10 ** 8; // 25 dollars (8 decimals)

    // Collateral tokens and their price feeds
    mapping(address collateral => address pricefeed) public priceFeeds; // Mapping to track the Chainlink price feed for each collateral token
    mapping(address user => mapping(address collateral => uint256 amount)) public userBalance;
 
    // Events
    event TokensPurchased(address indexed buyer, uint256 indexed amount, uint256 cost, address indexed collateralToken);
    event CollateralAdded(address indexed collateralToken, address indexed priceFeed);
    event CollateralRemoved(address indexed collateralToken);

    constructor(address _presaleToken, address _owner) Ownable(_owner) {
        presaleToken = IERC20(_presaleToken);
    }

    // Get current price per token based on the number of tokens sold
    function getCurrentPrice(uint256 _amount) public view returns (uint256) {
        uint256 updatedTokens = tokensSold + _amount;
        require(updatedTokens <= MAX_TOKENS_FOR_SALE, "Max tokens exceed");
        uint256 price = START_PRICE + (((END_PRICE - START_PRICE) * updatedTokens) / MAX_TOKENS_FOR_SALE);
        return price;
    }
 
    // Buy tokens with one of the accepted tokens
    function buyToken(address _collateralToken, address _receiver, uint256 _amount, uint256 _deadline, uint8 _v, bytes32 _r, bytes32 _s) external whenNotPaused {
        require(priceFeeds[_collateralToken] != address(0), "Collateral token not accepted");
        require(_amount >= 1 * 1e18, "Mimimum 1 token to buy");
 
        uint256 tokenPrice = getCurrentPrice(_amount); // 1e8
        uint256 collateralRequiredInUSD = (tokenPrice * _amount) / 1e18; // 1e8
        uint256 collateralValue = getCollateralAmount(_collateralToken, collateralRequiredInUSD); // in terms of its decimals

        // Transfer collateral tokens from user to contract
        if(_deadline != 0) {
            IERC20Permit(_collateralToken).permit(msg.sender, address(this), type(uint256).max, _deadline, _v, _r, _s);
        }
        IERC20(_collateralToken).safeTransferFrom(msg.sender, address(this), collateralValue);

        // Update tokens sold
        tokensSold += _amount;
        userBalance[msg.sender][_collateralToken] += collateralValue;

        // Transfer presale tokens to buyer
        presaleToken.safeTransfer(_receiver, _amount);

        emit TokensPurchased(msg.sender, _amount, collateralValue, _collateralToken);
    }

    // Get the collateral value in USD (18 decimals) using Chainlink price feeds
    function getCollateralAmount(address _collateralToken, uint256 _amountInUSD) public view returns (uint256) {
        require(address(priceFeeds[_collateralToken]) != address(0), "Price feed not set for token");

        uint256 priceInUSD = uint256(AggregatorV3Interface(priceFeeds[_collateralToken]).latestAnswer());
        uint8 decimals = IERC20Metadata(priceFeeds[_collateralToken]).decimals();

        // Convert collateral token amount to USD value with 18 decimals
        return (_amountInUSD * 10 ** decimals) / priceInUSD;
    }

    function addCollateral(address _collateralToken, address _pricefeed) external onlyOwner {
        require(_collateralToken != address(0), "Invalid collateral token");
        require(_pricefeed != address(0), "Invalid price feed");

        priceFeeds[_collateralToken] = _pricefeed;
        emit CollateralAdded(_collateralToken, _pricefeed);
    }

    function removeCollateral(address _collateralToken) external onlyOwner() {
        delete priceFeeds[_collateralToken];
        emit CollateralRemoved(_collateralToken);
    }

    // Pause the presale
    function pausePresale() external onlyOwner {
        _pause();
    }

    // Unpause the presale
    function unpausePresale() external onlyOwner {
        _unpause();
    }

    // Owner can withdraw collateral tokens collected in the presale
    function withdrawCollateral(address collateralToken, address _receiver, uint256 _amount) external onlyOwner {
        IERC20(collateralToken).safeTransfer(_receiver, _amount);
    }

}
