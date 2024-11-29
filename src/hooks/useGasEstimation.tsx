"use client";

import { useState, useCallback, useMemo } from "react";

import { debounce } from "lodash";

import {
  JsonRpcProvider,
  Interface,
  parseUnits,
  formatEther,
  InterfaceAbi,
} from "ethers";

export const useGasEstimation = (VigABI: InterfaceAbi) => {
  const [gasCost, setGasCost] = useState<string | null>(null);

  const [gasEstimationPending, setGasEstimationPending] = useState(false);

  const [gasEstimationError, setGasEstimationError] = useState<string | null>(
    null
  );

  const provider = useMemo(
    () => new JsonRpcProvider("https://rpc.sepolia.org"),
    []
  );

  const estimateGas = useCallback(
    async (recipientAddress: string, amount: number, senderAddress: string) => {
      if (!recipientAddress || !amount) {
        setGasEstimationError("Recipient address or amount is missing.");
        return;
      }

      setGasEstimationPending(true);
      setGasEstimationError(null);
      try {
        const gasEstimate = await provider.estimateGas({
          to: recipientAddress,
          from: senderAddress,
          data: new Interface(VigABI).encodeFunctionData("transfer", [
            recipientAddress,
            parseUnits(amount.toString(), 18),
          ]),
        });

        const { gasPrice } = await provider.getFeeData();

        if (gasPrice) {
          const gasCostInEth = formatEther(
            BigInt(gasEstimate) * BigInt(gasPrice)
          );

          setGasCost(gasCostInEth);
        } else {
          setGasEstimationError("Failed to retrieve gas price.");
        }
      } catch (error) {
        console.error("Gas estimation failed:", error);
        setGasCost(null);
        setGasEstimationError("Gas estimation failed.");
      } finally {
        setGasEstimationPending(false);
      }
    },
    [VigABI]
  );

  const debouncedGasEstimation = debounce(estimateGas, 500);

  return {
    gasCost,
    setGasCost,
    gasEstimationPending,
    gasEstimationError,
    debouncedGasEstimation,
  };
};
