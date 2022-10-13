const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

// console.log(networkConfig[network.config.chainId]["ethUsdPricefeed"]);

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPricefeed"]

    // Deploying
    const SimpleDonation = await deploy("SimpleDonation", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
    });
};
