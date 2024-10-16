// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20, ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TradeRunERC20 is ERC20Permit, Ownable {
    constructor(string memory _tradeTokenSymbol, string memory _collateralTokenSymbol, address _owner)
        ERC20("Trade Run", string(abi.encodePacked(_tradeTokenSymbol, "-X-", _collateralTokenSymbol)))
        ERC20Permit("Trade Run")
        Ownable(_owner)
    {}

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) public onlyOwner {
        _burn(_from, _amount);
    }
}
