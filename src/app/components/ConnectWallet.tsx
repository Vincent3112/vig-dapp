"use client";

import Image from "next/image";

import ethLogo from "../../assets/ethLogo.png";

import { useAppKit } from "@reown/appkit/react";

export const ConnectWallet = () => {
  const { open } = useAppKit();

  return (
    <section className="w-full min-h-screen px-6 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full">
        <div className="flex flex-col items-center">
          <Image
            className="w-16"
            src={ethLogo}
            alt="ethereum blockchain logo"
          />
          <h1 className="text-2xl text-center font-bold text-gray-800 my-4">
            Welcome to $VIG Token dApp
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Connect your wallet to start interacting with the $VIG token
          </p>

          <button
            className="uppercase font-bold mb-4 rounded-xl cursor-pointer text-white hover:bg-blue-800 bg-blue-500 px-4 py-2 text-sm"
            onClick={() => open()}
          >
            connect wallet
          </button>
        </div>
      </div>
    </section>
  );
};
