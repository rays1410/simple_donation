// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**@title ETH/USD converter library for unit256
 * @author rays1410
 * @notice Using this library we can convert ETH to USD
 */

library CurrencyConverter {
    function convert_ETH_USD(
        uint256 ethAmount,
        AggregatorV3Interface _priceFeed
    ) internal view returns (uint256) {
        (, int256 answer, , , ) = _priceFeed.latestRoundData();
        uint256 ethPrice = (uint256(answer) * 10e10);
        return (ethPrice * ethAmount) / 10e18;
    }
}
