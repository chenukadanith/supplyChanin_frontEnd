// src/components/MainContent.js
import React from "react";
import AdminView from "./AdminView";
import ManufacturerView from "./ManufacturerView";
import DistributorView from "./DistributorView";
import RetailerView from "./RetailerView";
import UserView from "./UserView";
import UnauthorizedView from "./UnauthorizedView";
import WalletInfo from "./Common/WalletInfo";

function MainContent({ 
  web3, 
  contract, 
  account, 
  isAdmin, 
  userRole, 
  isMetaMaskConnected 
}) {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Pharmaceutical Supply Chain</h1>

      <WalletInfo account={account} />

      {/* Render UnauthorizedView if MetaMask is not connected */}
      {!isMetaMaskConnected ? (
        <UnauthorizedView />
      ) : (
        <div>
          {/* Render Admin View if the user is admin */}
          {isAdmin ? (
            <AdminView web3={web3} contract={contract} account={account} />
          ) : (
            <div>
              {/* Conditionally render based on the user role */}
              {userRole === 1 && <ManufacturerView web3={web3} contract={contract} account={account} />}
              {userRole === 2 && <DistributorView web3={web3} contract={contract} account={account} />}
              {userRole === 3 && <RetailerView web3={web3} contract={contract} account={account} />}
              {/* If the role is not Manufacturer, Distributor, or Retailer, show UserView */}
              {userRole !== 1 && userRole !== 2 && userRole !== 3 && <UserView />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MainContent;