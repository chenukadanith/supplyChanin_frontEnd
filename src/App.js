import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ContractABI from "./contracts/PharmaceuticalSupplyChain.json";
import ManufacturerView from "./components/ManufacturerView";
import AdminView from "./components/AdminView";
import DistributorView from "./components/DistributorView";
import WalletInfo from "./components/Common/WalletInfo";
import RetailerView from "./components/RetailerView"; // Assuming RetailerView is created
import UnauthorizedView from "./components/UnauthorizedView"; // Import UnauthorizedView
import UserView from "./components/UserView"; // Import UserView

const contractAddress = "0x9D816b190a2b10811d401CCeb32C3310f6c4abe4"; // Replace with your contract address
const adminAddress = "0xcEDBAaa935F4eBe945dfb10a2380aD4eE604137F"; // Admin address

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is admin
  const [userRole, setUserRole] = useState(null); // Track user role
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false); // Check MetaMask connection

  useEffect(() => {
    const initWeb3 = async () => {
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
          setIsMetaMaskConnected(true);  // MetaMask is connected

          // Check if the connected account is the admin
          if (accounts[0].toLowerCase() === adminAddress.toLowerCase()) {
            setIsAdmin(true);
          }

          // Fetch the user role and convert to a readable format
          const role = await contractInstance.methods.getUserRole(accounts[0]).call();
          const readableRole = parseInt(role, 10);  // Convert to number
          setUserRole(readableRole);
          console.log("User Role:", readableRole);

          // Listen for account changes
          window.ethereum.on("accountsChanged", async (accounts) => {
            setAccount(accounts[0]);
            setIsAdmin(accounts[0].toLowerCase() === adminAddress.toLowerCase());

            // Fetch and log the new user role, convert to readable format
            const newRole = await contractInstance.methods.getUserRole(accounts[0]).call();
            const readableNewRole = parseInt(newRole, 10); // Convert to number
            setUserRole(readableNewRole);
            console.log("User Role (after account change):", readableNewRole);
          });
        } catch (error) {
          console.error("Web3 Initialization Error:", error);
          alert("Failed to load Web3. Make sure MetaMask is installed.");
        }
      } else {
        setIsMetaMaskConnected(false);  // MetaMask is not installed
      }
    };

    initWeb3();

    // Cleanup the event listener when the component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Pharmaceutical Supply Chain</h1>

      <WalletInfo account={account} />

      {/* Render UnauthorizedView if MetaMask is not connected */}
      {!isMetaMaskConnected ? (
        <UnauthorizedView />
      ) : (
        <div>
          {/* Render Admin View if the user is admin */}
          {isAdmin ? (
            <AdminView web3={web3} contract={contract} account={account} />
          ) : (
            <div>
              {/* Conditionally render based on the user role */}
              {userRole === 1 && <ManufacturerView web3={web3} contract={contract} account={account} />}
              {userRole === 2 && <DistributorView web3={web3} contract={contract} account={account} />}
              {userRole === 3 && <RetailerView web3={web3} contract={contract} account={account} />}
              {/* If the role is not Manufacturer, Distributor, or Retailer, show UserView */}
              {userRole !== 1 && userRole !== 2 && userRole !== 3 && <UserView />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
