import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ContractABI from "./contracts/PharmaceuticalSupplyChain.json";

const contractAddress = "0xe0699E3c6e84be0908879dAbEc058bC64acbe961"; // Replace with your contract address

function App() {
  const [drugId, setDrugId] = useState("");
  const [drugDetails, setDrugDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum)  {
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
        } catch (error) {
          console.error("Web3 Initialization Error:", error);
          alert("Failed to load Web3. Make sure MetaMask is installed.");
        }
      } else {
        alert("Please install MetaMask to use this app.");
      }
    };

    initWeb3();
  }, []);

  const getDrugDetails = async () => {
    if (!drugId) {
      alert("Please enter a valid Drug ID!");
      return;
    }

    setLoading(true);
    try {
      const drug = await contract.methods.getDrugBasicInfo(drugId).call();

      setDrugDetails({
        name: drug[0],
        manufacturer: drug[1],
        manufactureTimestamp: new Date(Number(drug[2]) * 1000).toLocaleString(), // Convert BigInt
        batchNumber: drug[3],
        serialNumber: drug[4],
        status:
            parseInt(drug[5]) === 0
                ? "Created"
                : parseInt(drug[5]) === 1
                    ? "Manufactured"
                    : parseInt(drug[5]) === 2
                        ? "Distributed"
                        : "Dispensed",
      });
    } catch (error) {
      console.error("Error fetching drug details:", error);
      alert("Error fetching drug details. Make sure the Drug ID is correct and the blockchain is running.");
    }
    setLoading(false);
  };

  return (
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h1>Pharmaceutical Supply Chain</h1>
        <p>Connected Wallet: <strong>{account ? account : "Not connected"}</strong></p>

        <div style={{ marginTop: "20px" }}>
          <input
              type="number"
              placeholder="Enter Drug ID (e.g., 0)"
              value={drugId}
              onChange={(e) => setDrugId(e.target.value)}
              style={{ padding: "8px", marginRight: "10px" }}
          />
          <button
              onClick={getDrugDetails}
              disabled={loading}
              style={{
                padding: "8px 15px",
                backgroundColor: loading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
          >
            {loading ? "Fetching..." : "Get Drug Details"}
          </button>
        </div>

        {drugDetails && (
            <div
                style={{
                  marginTop: "20px",
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "5px",
                  maxWidth: "400px",
                  margin: "20px auto",
                  textAlign: "left",
                  backgroundColor: "#f9f9f9",
                }}
            >
              <h2>Drug Details</h2>
              <p><strong>Name:</strong> {drugDetails.name}</p>
              <p><strong>Manufacturer:</strong> {drugDetails.manufacturer}</p>
              <p><strong>Manufacture Date:</strong> {drugDetails.manufactureTimestamp}</p>
              <p><strong>Batch Number:</strong> {drugDetails.batchNumber}</p>
              <p><strong>Serial Number:</strong> {drugDetails.serialNumber}</p>
              <p><strong>Status:</strong> {drugDetails.status}</p>
            </div>
        )}
      </div>
  );
}

export default App;
