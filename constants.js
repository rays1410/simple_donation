export const contractAddress = "0xdeD31AF754C28c01CcCa54C5B0fe8d3faC194c39";
export const abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_priceFeed",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "SimpleDonation__NotOwner",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_donator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Donation__Alert",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Donation__FundsWithdrawed",
        type: "event",
    },
    {
        stateMutability: "payable",
        type: "fallback",
    },
    {
        inputs: [],
        name: "donate",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "getContractBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPricefeedAddress",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getUserContribution",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "withdraw",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
];
