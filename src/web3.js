import Web3 from "web3";
import ContractABI from "./contracts/PharmaceuticalSupplyChain.json";

const contractAddress = "0xbD9e9FA4Aff37f1ecA459CB7adB599EDf2cEd727"; // Your deployed contract address

let web3;
let contract;
let userAccount;

const initWeb3 = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];

        contract = new web3.eth.Contract(ContractABI.abi, contractAddress);
    } else {
        console.error("Please install MetaMask!");
    }
};

export { initWeb3, web3, contract, userAccount };
