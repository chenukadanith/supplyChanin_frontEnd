import React, { useState, useEffect } from "react";

const AdminView = ({ web3, contract, account }) => {
  // Existing state for role management
  const [userAddress, setUserAddress] = useState("");
  const [role, setRole] = useState("Manufacturer"); // Default role
  const [loading, setLoading] = useState(false);

  // New state for drug management
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [drugName, setDrugName] = useState("");
  const [drugId, setDrugId] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [drugLoading, setDrugLoading] = useState(false);

  // Fetch manufacturers when contract is available
 useEffect(() => {
  let isActive = true;

  const fetchManufacturers = async () => {
    if (!contract?.methods?.getUsersByRole) return;
    
    try {
      const result = await contract.methods.getUsersByRole(1).call();
      if (isActive) setManufacturers(result);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  fetchManufacturers();
  
  return () => { isActive = false; }; // Cleanup on unmount
}, [contract?.methods?.getUsersByRole]); // Deep dependency

  // Existing role assignment function
  const assignRole = async () => {
    if (!userAddress) {
      alert("Please enter a valid Ethereum address.");
      return;
    }

    setLoading(true);
    try {
      // Convert role to enum value
      const roleValue = role === "Manufacturer" ? 1 : role === "Distributor" ? 2 : 3;
      console.log(roleValue); // Role starts from 0

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

  // New function to assign drug to manufacturer
  const assignDrugToManufacturer = async () => {
    if (!selectedManufacturer) {
        alert("Please select a manufacturer");
        return;
    }
    if (!drugName || !drugId) {
        alert("Please enter drug name and ID");
        return;
    }

    setDrugLoading(true);
    try {
        const tx = await contract.methods
            .addDrugToManufacturer(
                selectedManufacturer,
                drugName,
                drugId,       // Using as batchNumber
                expirationDate // Using as serialNumber
            )
            .send({
                from: account,
                gas: 3000000
            });

        console.log("Transaction hash:", tx.transactionHash);
        alert("Drug assigned successfully!");
        // Reset form
        setDrugName("");
        setDrugId("");
        setExpirationDate("");
    } catch (error) {
        console.error("Error assigning drug:", error);
        alert(`Error: ${error.message.split("(")[0]}`); // Cleaner error display
    } finally {
        setDrugLoading(false);
    }
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

      <hr></hr>

      {/* New Drug Assignment Section */}
      <div style={{ marginTop: "30px" }}>
        <h3>Assign Drugs to Manufacturers</h3>
        
        {/* Manufacturer Selection */}
        <div style={{ marginBottom: "20px" }}>
          <label>Select Manufacturer: </label>
          <select 
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            style={{ padding: "12px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
          >
            <option value="">-- Select a Manufacturer --</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
        </div>

        {/* Drug Information Form */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Drug Name"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            style={{ padding: "12px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px", marginBottom: "10px" }}
          />
          <input
            type="text"
            placeholder="Drug ID"
            value={drugId}
            onChange={(e) => setDrugId(e.target.value)}
            style={{ padding: "12px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px", marginBottom: "10px" }}
          />
          <input
            type="text"
            placeholder="Expiration Date (YYYY-MM-DD)"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            style={{ padding: "12px", width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        <button
          onClick={assignDrugToManufacturer}
          disabled={drugLoading}
          style={{ padding: "12px 15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%", fontSize: "16px", transition: "background-color 0.3s" }}
        >
          {drugLoading ? "Assigning Drug..." : "Assign Drug"}
        </button>
      </div>
    </div>
  );
};

export default AdminView;