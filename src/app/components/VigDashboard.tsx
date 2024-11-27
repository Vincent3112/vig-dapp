"use client";

import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";

import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { VIG_TOKEN_ADDRESS } from "@/utils/consts";

import { Address } from "viem";

import { TokenTransfer } from "../components/TokenTransfer";

import { bigNumber } from "@/utils/format";

import { VigABI } from "@/utils/VigABI";

import { useToken } from "@/hooks/useToken";

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

  const { balance, isLoading } = useToken({
    tokenAddress: VIG_TOKEN_ADDRESS,
    userAddress: address as Address,
    abi: VigABI,
  });

  return (
    <section className="w-full h-screen flex flex-col justify-start items-start">
      <div className="w-full h-screen flex flex-col justify-start items-start">
        <div className="w-full flex-col-reverse justify-start items-start sm:flex-row p-6 flex sm:justify-between">
          <div className="flex flex-col justify-start items-start">
            <div
              onClick={() => open({ view: "Account" })}
              className="uppercase font-bold mb-3 rounded-xl cursor-pointer text-black hover:bg-white/30 bg-white px-4 py-2 text-sm"
            >
              {address?.substring(0, 6)}...{address?.substring(38, 42)}
            </div>
            {balance && <>Balance : {bigNumber(balance)} $VIG </>}
            {isLoading && <>Balance loading... </>}
          </div>

          <button
            className="uppercase font-bold mb-4 rounded-xl cursor-pointer text-black hover:bg-red-800 bg-red-500 px-4 py-2 text-sm"
            onClick={() => disconnect()}
          >
            Disconnect wallet
          </button>
        </div>

        {address && <TokenTransfer address={address} />}
      </div>
    </section>
  );
};
