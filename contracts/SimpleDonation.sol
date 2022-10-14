// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./CurrencyConverter.sol";

/* Errors */
error SimpleDonation__NotOwner();

/**@title Simple donation contract
 * @author rays1410
 * @notice This contract allows to create donation contract
 * @dev One needs to expand it to the contract factory.
 *      It means that any user can deploy its own donation contract
 *      based on this one.
 */
contract SimpleDonation {
    /* Libraries */
    using CurrencyConverter for uint256;

    // Donators array
    address[] private s_donators;

    // The owner is set once (also immutable consumes less gas)
    address private immutable i_owner;

    // Current contribution of users
    mapping(address => uint256) private s_addressToAmount;

    // Goerli, Chainlink: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    // For the current USD/ETH price
    AggregatorV3Interface private s_priceFeed;

    /* Events */
    event Donation__Alert(address indexed _donator, uint256 _amount); // Emit this when the new donation received
    event Donation__FundsWithdrawed(uint256 _amount); // Emit when all balance is withdrawed by owner

    // OnlyOwner modifier, can be replaced for the OpenZeppelin one
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

    // Users use this function for donation
    function donate() public payable {
        s_donators.push(msg.sender);
        s_addressToAmount[msg.sender] += msg.value;
        emit Donation__Alert(msg.sender, msg.value);
    }

    // The owner withdraws balance when he wants
    function withdraw() public payable onlyOwner {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        if (sent == true) {
            emit Donation__FundsWithdrawed(address(this).balance);
        }
    }

    // Check how much particular user has donated (in ETH)
    function getUserContribution() public view returns (uint256) {
        // uint256 userEthBalance = s_addressToAmount[msg.sender];
        // return userEthBalance.convert_ETH_USD(s_priceFeed);
        return s_addressToAmount[msg.sender];
    }

    // Check current contract balance (in USD)
    function getContractBalance() public view returns (uint256) {
        uint256 ethBalance = address(this).balance;
        return ethBalance.convert_ETH_USD(s_priceFeed);
    }

    function getPricefeedAddress() public view returns (address) {
        return address(s_priceFeed);
    }

    // Just call donate() if msg.data is empty
    receive() external payable {
        donate();
    }

    // Just call donate() if msg.data is not empty
    fallback() external payable {
        donate();
    }
}
