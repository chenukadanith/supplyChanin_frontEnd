// src/App.js
import React, { useState, useEffect } from "react";
import { initWeb3, removeAccountChangeListener } from "./services/authService";
import MainContent from "./components/MainContent";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);

  useEffect(() => {
    initWeb3(
      setWeb3,
      setContract,
      setAccount,
      setIsAdmin,
      setUserRole,
      setIsMetaMaskConnected
    );

    // Cleanup the event listener when the component unmounts
    return () => {
      removeAccountChangeListener();
    };
  }, []);

  return (
    <MainContent
      web3={web3}
      contract={contract}
      account={account}
      isAdmin={isAdmin}
      userRole={userRole}
      isMetaMaskConnected={isMetaMaskConnected}
    />
  );
}

export default App;