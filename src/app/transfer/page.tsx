"use client";

import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";

import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { useBalance } from "wagmi";

import { VIG_TOKEN_ADDRESS } from "@/utils/consts";

import { Address } from "viem";

import { TokenTransfer } from "./components/TokenTransfer";

export default function Page() {
  const { disconnect } = useDisconnect();

  const router = useRouter();

  const { isConnected, address } = useAppKitAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected]);

  const { data } = useBalance({
    address: address as Address,
    token: VIG_TOKEN_ADDRESS,
  });

  return (
    <div className="w-full h-screen flex flex-col justify-start items-start">
      <div className="w-full p-6 flex justify-between items-center">
        <div>$VIG Balance : {data?.formatted}</div>
        <div
          className="uppercase font-bold rounded-xl cursor-pointer text-black bg-white px-4 py-2 text-sm"
          onClick={() => disconnect()}
        >
          Disconnect wallet
        </div>
      </div>

      <TokenTransfer />
    </div>
  );
}
