const { id } = require("ethers/lib/utils");
const { network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");

// Using { getNamedAccounts, deployments } we import these objects
// from hre object. This expression is equal to 
// { getNamedAccounts, deployments } = require("hre")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;

    // The function getNamedAccounts() takes them from hardhat.config.js
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // The variable, which will be defined below depending on the chain
    let ethUsdPriceFeedAddress;

    // If we are in the local chain, we deploy Mocks
    // or if we are not, use the address from the helper-hardhat-config.js
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else { 
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPricefeed"];
    }

    // Deploying
    const SimpleDonation = await deploy("SimpleDonation", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
    });
    log("SimpleDonation deployed!");
    log("-----------------------");
};

module.exports.tags = ["all", "simpledonation"];