require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-deploy");
require("@nomicfoundation/hardhat-toolbox");

GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;
COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
REPORT_GAS = process.env.REPORT_GAS;

module.exports = {
    solidity: {
        compilers: [
            { version: "0.8.8" },
            { version: "0.6.6" },
            { version: "0.6.0" },
        ],
    },

    defaultNetwork: "goerli",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
    },

    gasReporter: {
        enabled: REPORT_GAS != undefined,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "ETH",
    },

    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY,
        },
    },

    // The "deployer" uses the 0th account, the "user" uses the 1st one
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
};
