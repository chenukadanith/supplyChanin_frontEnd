import React, { useState } from "react";

const AdminView = ({ web3, contract, account }) => {
  const [userAddress, setUserAddress] = useState("");
  const [role, setRole] = useState("Manufacturer"); // Default role
  const [loading, setLoading] = useState(false);

  const assignRole = async () => {
  if (!userAddress) {
    alert("Please enter a valid Ethereum address.");
    return;
  }

  setLoading(true);
  try {
    // Convert role to enum value
    const roleValue = role === "Manufacturer" ? 0 : role === "Distributor" ? 1 : 2; // Role starts from 0

    // Ensure contract is loaded
    if (!contract) {
      alert("Contract not loaded");
      return;
    }

    // Call the smart contract function to assign role
    const tx = await contract.methods
      .assignRole(userAddress, roleValue)
      .send({
        from: account,
        gas: 3000000,  // Set a higher gas limit
      });

    console.log("Transaction hash:", tx.transactionHash);
    alert(`Role assigned successfully!`);
    setUserAddress(""); // Reset form
  } catch (error) {
    console.error("Error assigning role:", error);
    alert(`Error assigning role: ${error.message || error}`);
  }
  setLoading(false);
};

  

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Welcome, Admin! You can assign roles to users below.</p>

      <div style={{ marginBottom: "20px" }}>
        <label>Select Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Manufacturer">Manufacturer</option>
          <option value="Distributor">Distributor</option>
          <option value="Retailer">Pharmacy Retailer</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Ethereum Address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          style={{ padding: "12px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      <button
        onClick={assignRole}
        disabled={loading}
        style={{ padding: "12px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%", fontSize: "16px", transition: "background-color 0.3s" }}
      >
        {loading ? "Assigning..." : "Assign Role"}
      </button>
    </div>
  );
};

export default AdminView;