import React from "react";

const DrugDetails = ({ drugDetails }) => {
  return (
    <div style={{ marginTop: "20px", border: "1px solid #dee2e6", padding: "20px", borderRadius: "8px", backgroundColor: "#f9f9f9", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "15px" }}>Drug Details</h2>
      <p style={{ margin: "10px 0", fontSize: "15px" }}><strong>Name:</strong> {drugDetails.name}</p>
      <p style={{ margin: "10px 0", fontSize: "15px" }}><strong>Manufacturer:</strong> {drugDetails.manufacturer}</p>
      <p style={{ margin: "10px 0", fontSize: "15px" }}><strong>Manufacture Date:</strong> {drugDetails.manufactureTimestamp}</p>
      <p style={{ margin: "10px 0", fontSize: "15px" }}><strong>Batch Number:</strong> {drugDetails.batchNumber}</p>
      <p style={{ margin: "10px 0", fontSize: "15px" }}><strong>Serial Number:</strong> {drugDetails.serialNumber}</p>
      <p style={{ margin: "10px 0", fontSize: "15px" }}><strong>Status:</strong> {drugDetails.status}</p>
    </div>
  );
};

export default DrugDetails;