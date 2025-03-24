import React, { useState } from "react";

const DrugForm = ({ web3, contract, account, loading, setLoading }) => {
  const [newDrug, setNewDrug] = useState({
    name: "",
    manufacturer: "",
    batchNumber: "",
    serialNumber: "",
  });

  const handleChange = (e) => {
    setNewDrug({ ...newDrug, [e.target.name]: e.target.value });
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
      alert(`Drug created successfully! Drug ID: ${createdDrugId}`);
      setNewDrug({ name: "", manufacturer: "", batchNumber: "", serialNumber: "" });
    } catch (error) {
      console.error("Error creating drug:", error);
      alert("Error creating drug. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid #dee2e6", padding: "25px", borderRadius: "10px", backgroundColor: "#ffffff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>Create New Drug</h3>
      <input
        type="text"
        name="name"
        placeholder="Drug Name"
        value={newDrug.name}
        onChange={handleChange}
        style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
      />
      <input
        type="text"
        name="manufacturer"
        placeholder="Manufacturer"
        value={newDrug.manufacturer}
        onChange={handleChange}
        style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
      />
      <input
        type="text"
        name="batchNumber"
        placeholder="Batch Number"
        value={newDrug.batchNumber}
        onChange={handleChange}
        style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
      />
      <input
        type="text"
        name="serialNumber"
        placeholder="Serial Number"
        value={newDrug.serialNumber}
        onChange={handleChange}
        style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
      />
      <button
        onClick={createDrug}
        disabled={loading}
        style={{ padding: "12px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%", fontSize: "16px", transition: "background-color 0.3s" }}
      >
        {loading ? "Creating..." : "Create Drug"}
      </button>
    </div>
  );
};

export default DrugForm;