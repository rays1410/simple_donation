// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error SimpleDonation__NotOwner();

contract SimpleDonation {
    // Clients array
    address[] private s_donators;

    // The owner is set once and immutable type consumes less gas
    address private immutable i_owner;

    // Current amount of ETH for each donator
    mapping(address => uint256) private s_addressToAmount;

    // For the current USD/ETH price
    AggregatorV3Interface private s_priceFeed;

    event Donation__Alert(address indexed _donator, uint256 _amount);

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert SimpleDonation__NotOwner();
        }
        _;
    }

    constructor(address _priceFeed) {
        s_priceFeed = AggregatorV3Interface(_priceFeed);
        i_owner = msg.sender;
    }

    // The external function is a bit gas efficient than the public one
    function donate() public payable {
        s_donators.push(msg.sender);
        s_addressToAmount[msg.sender] += msg.value;
        emit Donation__Alert(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner {
        (bool sent, bytes memory data) = msg.sender.call{value: msg.value}("");
    }

    function getUserBalance() public view returns (uint256) {
        return address(msg.sender).balance;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to receive Ether. msg.data must be empty
    // We just call donate() for both receive() and fallback() functions
    receive() external payable {
        donate();
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        donate();
    }
}
