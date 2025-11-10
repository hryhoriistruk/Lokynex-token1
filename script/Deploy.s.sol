// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyToken.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        MyToken token = new MyToken(1000000);

        console.log("Token deployed at:", address(token));
        console.log("Token name:", token.name());
        console.log("Token symbol:", token.symbol());
        console.log("Total supply:", token.totalSupply());

        vm.stopBroadcast();
    }
}