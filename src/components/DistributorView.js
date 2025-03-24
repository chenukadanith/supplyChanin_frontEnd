import React, { useState } from "react";

const DistributorForm = ({ web3, contract, account, loading, setLoading }) => {
  const [drugDetails, setDrugDetails] = useState({
    drugId: "",  // Added drug ID for updating the status
    distributor: "",  // Distributor address or name
    distributionDate: "",  // Distribution date
    recipient: "",  // Who receives the drug
    status: "Distributed",  // Default status for Distributor
  });

  const handleChange = (e) => {
    setDrugDetails({ ...drugDetails, [e.target.name]: e.target.value });
  };

  const updateDrugStatus = async () => {
    if (!drugDetails.drugId || !drugDetails.distributor || !drugDetails.distributionDate || !drugDetails.recipient) {
      alert("Please fill in all distribution details.");
      return;
    }

    setLoading(true);
    try {
      // Calling contract method to update the drug status to 'Distributed' (or any status)
      const tx = await contract.methods
        .updateStatus(drugDetails.drugId, 2)  // 2 corresponds to "Distributed" in the Status enum (make sure to adjust the value as needed)
        .send({ from: account });

      const updatedDrugId = tx.events.StatusChanged.returnValues.id;
      alert(`Drug distribution updated successfully! Drug ID: ${updatedDrugId}`);

      // Reset form after submission
      setDrugDetails({
        drugId: "",
        distributor: "",
        distributionDate: "",
        recipient: "",
        status: "Distributed",
      });
    } catch (error) {
      console.error("Error updating drug distribution:", error);
      alert("Error updating distribution. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid #dee2e6", padding: "25px", borderRadius: "10px", backgroundColor: "#ffffff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>Update Drug Distribution</h3>

      <input
        type="text"
        name="drugId"
        placeholder="Drug ID"
        value={drugDetails.drugId}
        onChange={handleChange}
        style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
      />
      <input
        type="text"
        name="distributor"
        placeholder="Distributor"
        value={drugDetails.distributor}
        onChange={handleChange}
        style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
      />
      <input
        type="date"
        name="distributionDate"
        value={drugDetails.distributionDate}
        onChange={handleChange}
        style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
      />
      <input
        type="text"
        name="recipient"
        placeholder="Recipient Name"
        value={drugDetails.recipient}
        onChange={handleChange}
        style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
      />
      <button
        onClick={updateDrugStatus}
        disabled={loading}
        style={{ padding: "12px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%", fontSize: "16px", transition: "background-color 0.3s" }}
      >
        {loading ? "Updating..." : "Update Drug Distribution"}
      </button>
    </div>
  );
};

export default DistributorForm;
