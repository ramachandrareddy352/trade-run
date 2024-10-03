"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { HomePage } from "./components/HomePage";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div>
      <HomePage />
    </div>
  );
}

export default App;
