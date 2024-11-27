"use client";

import { useAppKitAccount } from "@reown/appkit/react";

import { ConnectWallet } from "./components/ConnectWallet";

import { VigDashboard } from "./components/VigDashboard";

export default function Home() {
  const { isConnected, address } = useAppKitAccount();

  return <>{isConnected && address ? <VigDashboard /> : <ConnectWallet />}</>;
}
