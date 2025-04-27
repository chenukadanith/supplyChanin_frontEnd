// src/services/authService.js
import Web3 from "web3";
import ContractABI from "../contracts/PharmaceuticalSupplyChain.json";

const contractAddress = "0x69dAF8c5F2235D9313a0C0b989401aD9A1b464Fe";
const adminAddress = "0xcEDBAaa935F4eBe945dfb10a2380aD4eE604137F";

export const initWeb3 = async (setWeb3, setContract, setAccount, setIsAdmin, setUserRole, setIsMetaMaskConnected) => {
  if (window.ethereum) {
    try {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3Instance.eth.getAccounts();
      const contractInstance = new web3Instance.eth.Contract(
        ContractABI.abi,
        contractAddress
      );

      setWeb3(web3Instance);
      setContract(contractInstance);
      setAccount(accounts[0]);
      setIsMetaMaskConnected(true);

      // Check if the connected account is the admin
      if (accounts[0].toLowerCase() === adminAddress.toLowerCase()) {
        setIsAdmin(true);
      }

      // Fetch the user role and convert to a readable format
      const role = await contractInstance.methods.getUserRole(accounts[0]).call();
      const readableRole = parseInt(role, 10);
      setUserRole(readableRole);
      console.log("User Role:", readableRole);

      // Setup account change listener
      setupAccountChangeListener(contractInstance, setAccount, setIsAdmin, setUserRole);
      
      return true;
    } catch (error) {
      console.error("Web3 Initialization Error:", error);
      alert("Failed to load Web3. Make sure MetaMask is installed.");
      return false;
    }
  } else {
    setIsMetaMaskConnected(false);
    return false;
  }
};

export const setupAccountChangeListener = (contract, setAccount, setIsAdmin, setUserRole) => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async (accounts) => {
      setAccount(accounts[0]);
      setIsAdmin(accounts[0].toLowerCase() === adminAddress.toLowerCase());

      // Fetch and log the new user role, convert to readable format
      const newRole = await contract.methods.getUserRole(accounts[0]).call();
      const readableNewRole = parseInt(newRole, 10);
      setUserRole(readableNewRole);
      console.log("User Role (after account change):", readableNewRole);
    });
  }
};

export const removeAccountChangeListener = () => {
  if (window.ethereum) {
    window.ethereum.removeListener("accountsChanged", () => {});
  }
};

export const isAdminAccount = (account) => {
  return account.toLowerCase() === adminAddress.toLowerCase();
};