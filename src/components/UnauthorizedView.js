import React from "react";

const UnauthorizedView = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Welcome to the Pharmaceutical Supply Chain</h1>

      <p style={{ fontSize: "16px", color: "#2c3e50" }}>
        Our platform provides a transparent, secure, and efficient supply chain management system for pharmaceutical products. 
        We connect manufacturers, distributors, and retailers in a decentralized way, leveraging blockchain technology to ensure the integrity of each transaction.
      </p>

      <p style={{ fontSize: "16px", color: "#2c3e50" }}>
        As a partner in this supply chain, you can help improve the pharmaceutical industry’s trust, traceability, and safety by ensuring that each step in the supply chain is tracked on the blockchain.
      </p>

      <h3 style={{ color: "#2c3e50" }}>You Are Not Authorized</h3>
      <p style={{ fontSize: "16px", color: "#e74c3c" }}>
        It seems that your account is not authorized to interact with this platform. In order to gain access, you must register as an authorized partner (Manufacturer, Distributor, or Retailer). 
        Please contact the platform's administrator to discuss how you can join the pharmaceutical supply chain as a trusted partner.
      </p>

      <p style={{ fontSize: "16px", color: "#2c3e50" }}>
        The authorized entities can create drugs, update statuses, and manage their supply chain roles. Unauthorized users, like yourself, currently cannot perform these actions.
      </p>

      <h3 style={{ color: "#2c3e50" }}>Contact the Administrator</h3>
      <p style={{ fontSize: "16px", color: "#2c3e50" }}>
        If you believe you should be authorized, please reach out to the administrator or the relevant authorities within the platform to get access.
      </p>

      <button
        onClick={() => window.location.href = "mailto:support@pharmaceuticalsupplychain.com"}  // Example email link
        style={{ padding: "12px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", transition: "background-color 0.3s" }}
      >
        Contact Support
      </button>
    </div>
  );
};

export default UnauthorizedView;
