import React, { useState, useEffect, useCallback } from "react";
import DrugDetails from "./Common/DrugDetails";
import { useNavigate } from "react-router-dom";
import CreateDrugLot from "./CreateDrugLot"; // Import the CreateDrugLot component

const ManufacturerView = ({ web3, contract, account }) => {
  const [assignedDrugs, setAssignedDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const navigate = useNavigate(); // Moved inside the component

  // Fetch assigned drugs when component mounts
  const fetchAssignedDrugs = useCallback(async () => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      // Get count of drugs assigned to this manufacturer
      const drugCount = await contract.methods.getManufacturerDrugCount(account).call();

      // Create an array of promises to fetch all drug details
      const promises = [];
      for (let i = 0; i < drugCount; i++) {
        const drugIdPromise = contract.methods.getManufacturerDrugAtIndex(account, i).call();
        promises.push(drugIdPromise);
      }

      // Wait for all drugIds to be fetched
      const drugIds = await Promise.all(promises);

      // Now fetch basic details for each drug ID
      const drugDetailsPromises = drugIds.map(async (id) => {
        const drug = await contract.methods.getDrugBasicInfo(id).call();
        return {
          id: id,
          name: drug[0],
          manufacturer: drug[1],
          manufactureTimestamp: drug[2] > 0 ? new Date(Number(drug[2]) * 1000).toLocaleString() : "Not manufactured yet",
          batchNumber: drug[3],
          serialNumber: drug[4],
          status: parseInt(drug[5]) === 0
            ? "Created"
            : parseInt(drug[5]) === 1
              ? "Manufactured"
              : parseInt(drug[5]) === 2
                ? "Distributed"
                : "Dispensed",
        };
      });

      const drugsData = await Promise.all(drugDetailsPromises);
      setAssignedDrugs(drugsData);
    } catch (error) {
      console.error("Error fetching assigned drugs:", error);
      alert("Error fetching your assigned drugs. Please check the console for details.");
    }
    setLoading(false);
  }, [contract, account]); // Dependencies for useCallback

  useEffect(() => {
    fetchAssignedDrugs();
  }, [fetchAssignedDrugs]); // Now only depends on fetchAssignedDrugs

  const handleUpdateStatus = async (drugId) => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      // Update the drug status to Manufactured (1)
      await contract.methods.updateStatus(drugId, 1).send({ from: account });
      alert("Drug status successfully updated to Manufactured!");

      // Refresh the drug list
      fetchAssignedDrugs();
    } catch (error) {
      console.error("Error updating drug status:", error);
      alert("Error updating drug status. Please check the console for details.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Manufacturer Dashboard</h1>
      <div className="assigned-drugs">
        <h3>Drugs Assigned by Admin</h3>
        {loading ? (
          <div className="loading">Loading your assigned drugs...</div>
        ) : assignedDrugs.length === 0 ? (
          <div className="no-drugs">No drugs have been assigned to you yet.</div>
        ) : (
          <div className="drug-list">
            {assignedDrugs.map((drug) => (
              <div
                key={drug.id}
                className="drug-card"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "15px",
                  backgroundColor: selectedDrug === drug.id ? "#f0f7ff" : "#fff"
                }}
              >
                <h4>{drug.name}</h4>
                <p><strong>Drug ID:</strong> {drug.id}</p>
                <p><strong>Batch Number:</strong> {drug.batchNumber}</p>
                <p><strong>Serial Number:</strong> {drug.serialNumber}</p>
                <p><strong>Status:</strong> <span style={{
                  color: drug.status === "Created" ? "#ff9800" :
                    drug.status === "Manufactured" ? "#4caf50" :
                      drug.status === "Distributed" ? "#2196f3" : "#9c27b0"
                }}>{drug.status}</span></p>

                {drug.status === "Created" && (
                  <button
                    onClick={() => handleUpdateStatus(drug.id)}
                    disabled={loading}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#4caf50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginTop: "10px"
                    }}
                  >
                    Mark as Manufactured
                  </button>
                )}

                <button
                  onClick={() => setSelectedDrug(drug.id === selectedDrug ? null : drug.id)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "10px",
                    marginLeft: drug.status === "Created" ? "10px" : "0"
                  }}
                >
                  {selectedDrug === drug.id ? "Hide Details" : "View Details"}
                </button>

                {selectedDrug === drug.id && (
                  <div className="drug-details" style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f7f7f7", borderRadius: "4px" }}>
                    <DrugDetails drugDetails={drug} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <button
        onClick={() => navigate("/manufacturer/create-lots")}
        style={{
          padding: "10px 15px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        Create New Drug Lot
      </button> */}

<CreateDrugLot 
        web3={web3}
        contract={contract}
        account={account}
        assignedDrugs={assignedDrugs}
        
      />
    </div>
  );
};

export default ManufacturerView;