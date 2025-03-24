import React from "react";

const UserView = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Welcome User</h1>

      <p style={{ fontSize: "16px", color: "#2c3e50" }}>
        It looks like your account has not been assigned a specific role in the pharmaceutical supply chain. 
        As a regular user, you can explore the platform and learn more about the supply chain processes, but you do not have permission to interact with specific supply chain functions such as creating or distributing drugs.
      </p>

      <p style={{ fontSize: "16px", color: "#2c3e50" }}>
        If you believe you should have a role, please contact the platform administrator to request access.
      </p>

      <button
        onClick={() => window.location.href = "mailto:support@pharmaceuticalsupplychain.com"} // Example email link
        style={{ padding: "12px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", transition: "background-color 0.3s" }}
      >
        Contact Support
      </button>
    </div>
  );
};

export default UserView;
