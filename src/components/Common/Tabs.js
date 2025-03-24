import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{ display: "flex", marginBottom: "20px", borderBottom: "1px solid #dee2e6" }}>
      <button
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          border: "none",
          background: "none",
          fontSize: "16px",
          fontWeight: "500",
          outline: "none",
          borderBottom: activeTab === "create" ? "3px solid #007bff" : "none",
          color: activeTab === "create" ? "#007bff" : "#000",
        }}
        onClick={() => setActiveTab("create")}
      >
        Create New Drug
      </button>
      <button
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          border: "none",
          background: "none",
          fontSize: "16px",
          fontWeight: "500",
          outline: "none",
          borderBottom: activeTab === "fetch" ? "3px solid #007bff" : "none",
          color: activeTab === "fetch" ? "#007bff" : "#000",
        }}
        onClick={() => setActiveTab("fetch")}
      >
        Fetch Drug Details
      </button>
    </div>
  );
};

export default Tabs;