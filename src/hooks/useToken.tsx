"use client";

import { useReadContract } from "wagmi";

import * as ethers from "ethers";

import { useState, useEffect } from "react";

type useTokenProps = {
  tokenAddress: string;
  userAddress: string;
  abi: readonly unknown[];
};

export const useToken = ({ tokenAddress, userAddress, abi }: useTokenProps) => {
  const [decimals, setDecimals] = useState<number>(18);

  const {
    data: balanceData,
    isError: balanceError,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useReadContract({
    abi,
    address: tokenAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [userAddress],
  });

  const { data: decimalsData } = useReadContract({
    abi,
    address: tokenAddress as `0x${string}`,
    functionName: "decimals",
  });

  useEffect(() => {
    if (decimalsData) {
      setDecimals(Number(decimalsData));
    }
  }, [decimalsData]);

  const balance = balanceData
    ? ethers.formatUnits(balanceData as ethers.BigNumberish, decimals)
    : null;

  const refetch = () => {
    refetchBalance();
  };

  return {
    balance,
    decimals,
    isError: balanceError,
    isLoading: balanceLoading,
    refetch,
  };
};
