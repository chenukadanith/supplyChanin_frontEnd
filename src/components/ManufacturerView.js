import React, { useState } from "react";
import DrugForm from "./Common/DrugForm";
import DrugDetails from "./Common/DrugDetails";

import Tabs from "./Common/Tabs";

const ManufacturerView = ({ web3, contract, account }) => {
  const [drugId, setDrugId] = useState("");
  const [drugDetails, setDrugDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

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

  return (
    <div>



      <h1 > manufacturer</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "create" && (
        <DrugForm
          web3={web3}
          contract={contract}
          account={account}
          loading={loading}
          setLoading={setLoading}
        />
      )}

      {activeTab === "fetch" && (
        <div>
          <input
            type="number"
            placeholder="Enter Drug ID (e.g., 0)"
            value={drugId}
            onChange={(e) => setDrugId(e.target.value)}
            style={{ padding: "12px", marginBottom: "15px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
          />
          <button
            onClick={getDrugDetails}
            disabled={loading}
            style={{ padding: "12px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%", fontSize: "16px", transition: "background-color 0.3s" }}
          >
            {loading ? "Fetching..." : "Get Drug Details"}
          </button>

          {drugDetails && <DrugDetails drugDetails={drugDetails} />}
        </div>
      )}
    </div>
  );
};

export default ManufacturerView;