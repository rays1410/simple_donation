const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("SimpleDonation", async function () {
    let simpleDonation;
    let mockV3Aggregator;
    let deployer;
    let userSignerInstance;
    const sendValue = ethers.utils.parseEther("0.0001"); // 0.0001 ETH
    beforeEach(async function () {
        // hre (like in the deployment scripts) is almost the same
        // as "hardhat". So we can collect the accounts from it
        deployer = (await getNamedAccounts()).deployer;
        user = (await getNamedAccounts()).user;
        userSignerInstance = await ethers.getSigner(user);

        // Also we can use the following syntax. It provides the list of accounts
        // directly from the hardhat.config.js
        // const accounts = await ethers.getSigners();
        // const firstAccount = accounts[0];

        // Fixture runs all deployments before each test
        await deployments.fixture(["all"]);

        // Using ethers here, we obtain most recent deployment
        // of any specific contract
        simpleDonation = await ethers.getContract("SimpleDonation", deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
    });

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await simpleDonation.getPricefeedAddress();
            assert.equal(response, mockV3Aggregator.address);
        });
    });

    describe("donate", async function () {
        it("correct changes in (address => value) mapping after donation", async function () {
            await simpleDonation.donate({ value: sendValue });
            const contribution = await simpleDonation.getUserContribution();
            assert.equal(contribution.toString(), sendValue.toString());
        });
    });

    describe("withdraw", async function () {
        it("only owner of the contract can withdraw ETH", async function () {
            // To avoid VoidSigner, we should not use .connect(user) but
            // .connect(userSignerInstance)
            await expect(simpleDonation.connect(userSignerInstance).withdraw())
                .to.be.reverted;
        });

        it("withdrawing works correctly", async function () {
            await simpleDonation.donate({ value: sendValue });
            const startingContractBalance =
                await simpleDonation.provider.getBalance(
                    simpleDonation.address
                );
            const startingDeployerBalance =
                await simpleDonation.provider.getBalance(deployer);

            // Handle the transaction
            const transactionResponse = await simpleDonation.withdraw();
            const transactionReceipt = await transactionResponse.wait();

            // Calculate gas price
            const { gasUsed, effectiveGasPrice } = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);

            // The balances of deployer and contract after withdraw()
            const finalContractBalance =
                await simpleDonation.provider.getBalance(
                    simpleDonation.address
                );
            const finalDeployerBalance =
                await simpleDonation.provider.getBalance(deployer);

            // As we withdraw all money, the balance should be zero
            assert.equal(finalContractBalance, 0);

            // The balance of the user should be increased
            assert.equal(
                startingDeployerBalance.add(startingContractBalance).toString(),
                finalDeployerBalance.add(gasCost).toString()
            );
        });
    });
});
