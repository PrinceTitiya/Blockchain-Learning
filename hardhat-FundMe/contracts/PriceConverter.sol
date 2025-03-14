// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {

    function getVersion(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        return priceFeed.version();
    }

    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        (, int256 answer, , ,) = priceFeed.latestRoundData();
        // Answer comes in 8 decimals, so multiply it to convert to Wei (18 decimals)
        // Example: 3000 USD --> 3000 * 10**10 = 300000000000
        return uint256(answer * 1e10);
    }

    function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed) 
        internal 
        view 
        returns (uint256) 
    {
        uint256 ethPrice = getPrice(priceFeed); // Get ETH price in USD
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
