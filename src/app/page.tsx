"use client";

import Image from "next/image";

import ethLogo from "../assets/ethLogo.png";

import { useAppKitAccount } from "@reown/appkit/react";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    if (isConnected) {
      router.push("/transfer");
    }
  }, [isConnected]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-1/2 flex justify-center h-screen items-center border-r border-white/20">
        <Image className="w-16" src={ethLogo} alt="ethereum blockchain logo" />
      </div>

      <div className="w-1/2 flex justify-center h-screen items-center">
        <appkit-button />
      </div>
    </div>
  );
}
