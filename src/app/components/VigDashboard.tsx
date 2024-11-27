"use client";

import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";

import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { useBalance } from "wagmi";

import { VIG_TOKEN_ADDRESS } from "@/utils/consts";

import { Address } from "viem";

import { TokenTransfer } from "../components/TokenTransfer";

import { bigNumber } from "@/utils/format";

export const VigDashboard = () => {
  const { disconnect } = useDisconnect();

  const router = useRouter();

  const { open } = useAppKit();

  const { isConnected, address } = useAppKitAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected]);

  const { data: balance } = useBalance({
    address: address as Address,
    token: VIG_TOKEN_ADDRESS,
  });

  return (
    <div className="w-full h-screen flex flex-col justify-start items-start">
      <div className="w-full p-6 flex justify-between items-start">
        <div className="flex flex-col justify-start items-start">
          <div
            onClick={() => open({ view: "Account" })}
            className="uppercase font-bold mb-3 rounded-xl cursor-pointer text-black bg-white px-4 py-2 text-sm"
          >
            {address?.substring(0, 6)}...{address?.substring(38, 42)}
          </div>
          {balance && <div>$VIG Balance : {bigNumber(balance?.formatted)}</div>}
        </div>

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
};
