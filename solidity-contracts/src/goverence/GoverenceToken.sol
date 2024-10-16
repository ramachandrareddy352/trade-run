// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GoverenceToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    // max tokens are 1 billion
    // presale = 35%
    // airdrops = 6%
    // staking for goverence = 20%
    // liquidate into dex = 13%
    // cex = 13%
    // employees = 10%
    // future uses = 3%
    uint256 public maxFutureUseTokens = 3_000_000 * 1e18; // 3 million
    uint256 public trackFutureTokens;

    constructor(
        address _initialOwner,
        address _presale,
        address _airdrops,
        address _staking,
        address _dex,
        address _cex,
        address _employees
    ) ERC20("TRADE-RUN", "T-RUN") ERC20Permit("TRADE-RUN") Ownable(_initialOwner) {
        _mint(_presale, 350_000_000 * 10 ** 18);
        _mint(_airdrops, 6_000_000 * 10 ** 18);
        _mint(_staking, 200_000_000 * 10 ** 18);
        _mint(_dex, 13_000_000 * 10 ** 18);
        _mint(_cex, 13_000_000 * 10 ** 18);
        _mint(_employees, 10_000_000 * 10 ** 18);
    }

    function mintTokens(address _to, uint256 _amount) external onlyOwner {
        require(trackFutureTokens + _amount <= maxFutureUseTokens, "Exceed limit");
 
        trackFutureTokens += _amount;
        _mint(_to, _amount); // tokens never burned
    }

    // The following functions are overrides required by Solidity.
    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
