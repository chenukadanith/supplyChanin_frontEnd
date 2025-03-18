import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ContractABI from "./contracts/PharmaceuticalSupplyChain.json";

const contractAddress = "0xbD9e9FA4Aff37f1ecA459CB7adB599EDf2cEd727"; // Replace with your contract address

function App() {
  const [drugId, setDrugId] = useState("");
  const [drugDetails, setDrugDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [activeTab, setActiveTab] = useState("create"); // Track active tab: 'create' or 'fetch'
  const [newDrug, setNewDrug] = useState({
    name: "",
    manufacturer: "",
    batchNumber: "",
    serialNumber: "",
  });

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

  const handleChange = (e) => {
    setNewDrug({ ...newDrug, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setNewDrug({
      name: "",
      manufacturer: "",
      batchNumber: "",
      serialNumber: "",
    });
  };

  const createDrug = async () => {
    if (!newDrug.name || !newDrug.manufacturer || !newDrug.batchNumber || !newDrug.serialNumber) {
      alert("Please fill in all drug details.");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.methods
          .createDrug(newDrug.name, newDrug.manufacturer, newDrug.batchNumber, newDrug.serialNumber)
          .send({ from: account });

      const createdDrugId = tx.events.DrugCreated.returnValues.id;
      // Alert with drug ID instead of showing in a box
      alert(`Drug created successfully! Drug ID: ${createdDrugId}`);

      console.log("Transaction hash:", tx.transactionHash);
      resetForm(); // Reset form after successful creation
    } catch (error) {
      console.error("Error creating drug:", error);
      alert("Error creating drug. Please try again.");
    }
    setLoading(false);
  };

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
        manufactureTimestamp: new Date(Number(drug[2]) * 1000).toLocaleString(),
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
      setDrugDetails(null);
    }
    setLoading(false);
  };

  // Common styles
  const styles = {
    container: {
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    },
    header: {
      textAlign: "center",
      color: "#2c3e50"
    },
    walletInfo: {
      padding: "10px",
      backgroundColor: "#f8f9fa",
      borderRadius: "5px",
      marginBottom: "20px",
      textAlign: "center"
    },
    tabs: {
      display: "flex",
      marginBottom: "20px",
      borderBottom: "1px solid #dee2e6"
    },
    tab: {
      padding: "10px 20px",
      cursor: "pointer",
      border: "none",
      background: "none",
      fontSize: "16px",
      fontWeight: "500",
      outline: "none"
    },
    activeTab: {
      borderBottom: "3px solid #007bff",
      color: "#007bff"
    },
    form: {
      border: "1px solid #dee2e6",
      padding: "25px",
      borderRadius: "10px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    },
    input: {
      padding: "12px",
      marginBottom: "15px",
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid #ced4da",
      borderRadius: "4px",
      fontSize: "14px"
    },
    button: {
      padding: "12px 15px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      width: "100%",
      fontSize: "16px",
      transition: "background-color 0.3s"
    },
    disabledButton: {
      backgroundColor: "#cccccc",
      cursor: "not-allowed"
    },
    detailsCard: {
      marginTop: "20px",
      border: "1px solid #dee2e6",
      padding: "20px",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
    },
    detailsItem: {
      margin: "10px 0",
      fontSize: "15px"
    },
    detailsTitle: {
      color: "#2c3e50",
      marginBottom: "15px"
    }
  };

  return (
      <div style={styles.container}>
        <h1 style={styles.header}>Pharmaceutical Supply Chain</h1>

        <div style={styles.walletInfo}>
          <p>Connected Wallet: <strong>{account ? account : "Not connected"}</strong></p>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabs}>
          <button
              style={{
                ...styles.tab,
                ...(activeTab === "create" ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab("create")}
          >
            Create New Drug
          </button>
          <button
              style={{
                ...styles.tab,
                ...(activeTab === "fetch" ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab("fetch")}
          >
            Fetch Drug Details
          </button>
        </div>

        {/* Create Drug Form */}
        {activeTab === "create" && (
            <div style={styles.form}>
              <h3 style={styles.detailsTitle}>Create New Drug</h3>
              <input
                  type="text"
                  name="name"
                  placeholder="Drug Name"
                  value={newDrug.name}
                  onChange={handleChange}
                  style={styles.input}
              />
              <input
                  type="text"
                  name="manufacturer"
                  placeholder="Manufacturer"
                  value={newDrug.manufacturer}
                  onChange={handleChange}
                  style={styles.input}
              />
              <input
                  type="text"
                  name="batchNumber"
                  placeholder="Batch Number"
                  value={newDrug.batchNumber}
                  onChange={handleChange}
                  style={styles.input}
              />
              <input
                  type="text"
                  name="serialNumber"
                  placeholder="Serial Number"
                  value={newDrug.serialNumber}
                  onChange={handleChange}
                  style={styles.input}
              />
              <button
                  onClick={createDrug}
                  disabled={loading}
                  style={{
                    ...styles.button,
                    ...(loading ? styles.disabledButton : {})
                  }}
              >
                {loading ? "Creating..." : "Create Drug"}
              </button>
            </div>
        )}

        {/* Fetch Drug Details Form */}
        {activeTab === "fetch" && (
            <div>
              <div style={styles.form}>
                <h3 style={styles.detailsTitle}>Fetch Drug Details</h3>
                <input
                    type="number"
                    placeholder="Enter Drug ID (e.g., 0)"
                    value={drugId}
                    onChange={(e) => setDrugId(e.target.value)}
                    style={styles.input}
                />
                <button
                    onClick={getDrugDetails}
                    disabled={loading}
                    style={{
                      ...styles.button,
                      ...(loading ? styles.disabledButton : {})
                    }}
                >
                  {loading ? "Fetching..." : "Get Drug Details"}
                </button>
              </div>

              {/* Display drug details */}
              {drugDetails && (
                  <div style={styles.detailsCard}>
                    <h2 style={styles.detailsTitle}>Drug Details</h2>
                    <p style={styles.detailsItem}><strong>Name:</strong> {drugDetails.name}</p>
                    <p style={styles.detailsItem}><strong>Manufacturer:</strong> {drugDetails.manufacturer}</p>
                    <p style={styles.detailsItem}><strong>Manufacture Date:</strong> {drugDetails.manufactureTimestamp}</p>
                    <p style={styles.detailsItem}><strong>Batch Number:</strong> {drugDetails.batchNumber}</p>
                    <p style={styles.detailsItem}><strong>Serial Number:</strong> {drugDetails.serialNumber}</p>
                    <p style={styles.detailsItem}><strong>Status:</strong> {drugDetails.status}</p>
                  </div>
              )}
            </div>
        )}
      </div>
  );
}

export default App;