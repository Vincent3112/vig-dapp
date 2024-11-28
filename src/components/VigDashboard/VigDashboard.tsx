"use client";

import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";

import { VIG_TOKEN_ADDRESS } from "@/utils/consts";

import { TokenTransfer } from "../TokenTransfer/TokenTransfer";

import { bigNumber } from "../../utils/format";

import { useToken } from "../../hooks/useToken";

import { Address } from "viem";

import { VigABI } from "@/utils/VigABI";

export const VigDashboard = () => {
  const { disconnect } = useDisconnect();

  const { open } = useAppKit();

  const { address } = useAppKitAccount();

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
            <button
              onClick={() => open({ view: "Account" })}
              className="uppercase font-bold mb-3 rounded-xl cursor-pointer text-black hover:bg-white/30 bg-white px-4 py-2 text-sm"
            >
              {address?.substring(0, 6)}...{address?.substring(38, 42)}
            </button>
            {balance && <>Balance : {bigNumber(balance)} $VIG </>}
            {!balance && !isLoading && <>Balance : 0 $VIG </>}
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
