import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateDrugLot = ({ web3, contract, account, assignedDrugs }) => {
  const [distributors, setDistributors] = useState([]);

  useEffect(() => {
    let isActive = true;

    const fetchManufacturers = async () => {
      if (!contract?.methods?.getUsersByRole) return;

      try {
        const result = await contract.methods.getUsersByRole(2).call();
        console.log(result);
        if (isActive) setDistributors(result);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchManufacturers();

    return () => {
      isActive = false;
    }; // Cleanup on unmount
  }, [contract?.methods?.getUsersByRole]);

  const [formData, setFormData] = useState({
    drugId: "",
    batchNumber: "",
    quantity: "",
    manufactureDate: "",
    expirationDate: "",
    storageCondition: "Ambient",
    recipientAddress: "",
    recipientType: "Distributor",
  });
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreview = () => {
    const selectedDrug = assignedDrugs.find(
      (drug) => drug.id === formData.drugId
    );
    if (!selectedDrug) return;

    setPreviewData({
      drugName: selectedDrug.name,
      ...formData,
      manufactureDate: new Date(formData.manufactureDate).toLocaleDateString(),
      expirationDate: new Date(formData.expirationDate).toLocaleDateString(),
    });
  };

  const handleSubmit = async () => {
    if (!previewData) return;
    setLoading(true);

    try {
      const tx = await contract.methods
        .createDrugLot(
          formData.drugId,
          formData.batchNumber,
          formData.quantity,
          Math.floor(new Date(formData.manufactureDate).getTime() / 1000),
          Math.floor(new Date(formData.expirationDate).getTime() / 1000),
          formData.storageCondition,
          formData.recipientAddress,
          formData.recipientType === "Distributor" ? 2 : 3 // Role enum value
        )
        .send({ from: account });

      alert(`Drug lot created successfully! TX Hash: ${tx.transactionHash}`);
      navigate("/manufacturer");
    } catch (error) {
      console.error("Error creating drug lot:", error);
      alert(`Error: ${error.message.split("(")[0]}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>Create New Drug Lot</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label>Select Drug</label>
          <select
            name="drugId"
            value={formData.drugId}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">-- Select Drug --</option>
            {assignedDrugs.map((drug) => (
              <option key={drug.id} value={drug.id}>
                {drug.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Batch Number</label>
          <input
            type="text"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            placeholder="LOT-2023-001"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Storage Condition</label>
          <select
            name="storageCondition"
            value={formData.storageCondition}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="Ambient">Ambient (15-25°C)</option>
            <option value="Refrigerated">Refrigerated (2-8°C)</option>
            <option value="Frozen">Frozen (-20°C)</option>
          </select>
        </div>

        <div>
          <label>Manufacture Date</label>
          <input
            type="date"
            name="manufactureDate"
            value={formData.manufactureDate}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Expiration Date</label>
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            min={formData.manufactureDate}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Recipient Type</label>
          <select
            name="recipientType"
            value={formData.recipientType}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="Distributor">Distributor</option>
            <option value="Retailer">Retailer</option>
          </select>
        </div>

        <div>
          <label>Recipient Address</label>
          <select
            name="recipientAddress"
            value={formData.recipientAddress}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          >
            <option value="">-- Select a Manufacturer --</option>
            {distributors.map((distributor) => (
              <option key={distributor} value={distributor}>
                {distributor}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={handlePreview}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Preview Lot
        </button>
        <button
          onClick={() => navigate("/manufacturer")}
          style={{
            padding: "10px 15px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>

      {previewData && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3>Lot Preview</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <p>
                <strong>Drug Name:</strong> {previewData.drugName}
              </p>
              <p>
                <strong>Batch Number:</strong> {previewData.batchNumber}
              </p>
              <p>
                <strong>Quantity:</strong> {previewData.quantity}
              </p>
            </div>
            <div>
              <p>
                <strong>Manufacture Date:</strong> {previewData.manufactureDate}
              </p>
              <p>
                <strong>Expiration Date:</strong> {previewData.expirationDate}
              </p>
              <p>
                <strong>Storage:</strong> {previewData.storageCondition}
              </p>
            </div>
            <div>
              <p>
                <strong>Recipient Type:</strong> {previewData.recipientType}
              </p>
              <p>
                <strong>Recipient Address:</strong>{" "}
                {previewData.recipientAddress}
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: "15px",
              padding: "10px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating..." : "Confirm & Create Lot"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateDrugLot;
