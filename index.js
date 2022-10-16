import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const donateButton = document.getElementById("donateButton");
const getMyDonationsButton = document.getElementById("getMyDonationsButton");
const getContractBalanceButton = document.getElementById(
    "getContractBalanceButton"
);
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
donateButton.onclick = donate;
getMyDonationsButton.onclick = getUserContribution;
getContractBalanceButton.onclick = getContractBalance;
withdrawButton.onclick = withdraw;

async function connect() {
    if ((typeof window, ethereum !== "undefined")) {
        console.log("connecting...");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        connectButton.innerHTML = "Connected!";
    } else {
        console.log("error...");
        fundButton.innerHTML = "Please install Metamask!";
    }
}

async function getUserContribution() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const userBalance = await contract.getUserContribution();
        console.log(ethers.utils.formatEther(userBalance));
    }
}

async function getContractBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMine(transactionResponse, provider);
            console.log(
                `Done! You've obtained ${ethers.utils.formatEther(
                    balance
                )} ETH!`
            );
        } catch (error) {
            console.log(error);
        }
    }
}

async function donate() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding ${ethAmount}...`);
    if (typeof window.ethereum !== "undefined") {
        // Our provider is metamask now
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Take the account from metamask
        const signer = provider.getSigner();

        // Export contractAddress, abi and signer from the constants.js and run
        // the blockchain node in the neighboring terminal using hardhat
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const transactionResponse = await contract.donate({
                value: ethers.utils.parseEther(ethAmount),
            });
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done!");
        } catch (error) {
            console.log(error);
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    // we create a listener for the blockchain

    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transctionReceipt) => {
            console.log(
                `Completed with ${transctionReceipt.confirmations} confirmations`
            );
            resolve();
        });
    });
}
