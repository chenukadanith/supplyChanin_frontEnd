import React from "react";

const WalletInfo = ({ account }) => {
  return (
    <div style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px", marginBottom: "20px", textAlign: "center" }}>
      <p>Connected Wallet: <strong>{account ? account : "Not connected"}</strong></p>
    </div>
  );
};

export default WalletInfo;