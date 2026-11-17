//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {MyToken} from "./MyToken.sol";

contract WrappedMyToken is MyToken {
    constructor(
        string memory tokenName,
        string memory takenSymbol
    ) MyToken(tokenName, takenSymbol) {}
    function mintTokenWithSpecificTokenId(
        uint256 tokenId,
        address to
    ) public onlyOwner {
        _safeMint(to, tokenId);
    }
}
