import React, { useState, useEffect } from "react";

const RetailerView = ({ web3, contract, account }) => {
  const [drugs, setDrugs] = useState([]);  // To store list of drugs available
  const [drugId, setDrugId] = useState("");  // Drug ID for dispensing
  const [loading, setLoading] = useState(false);

  // Fetch list of drugs available for the retailer
  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        // Fetching all drugs - assuming a getDrugs function in the contract that returns a list of drug IDs
        const drugCount = await contract.methods.drugCount().call();
        const drugList = [];
        
        for (let i = 0; i < drugCount; i++) {
          const drug = await contract.methods.getDrugBasicInfo(i).call(); // Assuming getDrugBasicInfo is available in the contract
          drugList.push(drug);
        }

        setDrugs(drugList);
      } catch (error) {
        console.error("Error fetching drugs:", error);
        alert("Error fetching drugs. Please try again.");
      }
    };

    fetchDrugs();
  }, [contract]);

  const handleDispenseDrug = async () => {
    if (!drugId) {
      alert("Please enter a valid drug ID to dispense.");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.methods
        .updateStatus(drugId, 3)  // Assuming status 3 means Dispensed
        .send({ from: account });

      const dispensedDrugId = tx.events.StatusChanged.returnValues.id;
      alert(`Drug with ID ${dispensedDrugId} has been dispensed successfully!`);
    } catch (error) {
      console.error("Error dispensing drug:", error);
      alert("Error dispensing drug. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid #dee2e6", padding: "25px", borderRadius: "10px", backgroundColor: "#ffffff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      <h1 style={{ color: "#2c3e50", marginBottom: "15px", textAlign: "center" }}>Pharmacy Retailer</h1>

      <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>Drugs Available for Dispensing</h3>
      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        {drugs.map((drug, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <strong>{drug[0]}</strong> (Batch: {drug[3]}) - {drug[5]}
          </li>
        ))}
      </ul>

      <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>Dispense Drug</h3>
      <input
        type="text"
        placeholder="Enter Drug ID"
        value={drugId}
        onChange={(e) => setDrugId(e.target.value)}
        style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
      />
      <button
        onClick={handleDispenseDrug}
        disabled={loading}
        style={{ padding: "12px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%", fontSize: "16px", transition: "background-color 0.3s" }}
      >
        {loading ? "Dispensing..." : "Dispense Drug"}
      </button>
    </div>
  );
};

export default RetailerView;
