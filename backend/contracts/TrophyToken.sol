// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TrophyToken is ERC20 {

    address public owner;

    constructor() ERC20("TrophyToken", "TROPHY") {}

    // modifier onlyOwner() {
    //     require(msg.sender == owner, "Only owner can call this function.");
    //     _;
    // }

    // Mint more tokens to distribute as trophies
    function mintTrophies(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
