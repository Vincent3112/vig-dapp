"use client";

import { isAddress } from "ethers";

import { useEffect, useState } from "react";

import z from "zod";

import { Address } from "viem";

import { useForm } from "react-hook-form";

import { Id, toast } from "react-toastify";

import { VigABI } from "../../utils/VigABI";

import { useToken } from "../../hooks/useToken";

import { useGasEstimation } from "../../hooks/useGasEstimation";

import { zodResolver } from "@hookform/resolvers/zod";

import { VIG_TOKEN_ADDRESS } from "../../utils/consts";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

type TokenTransferProps = {
  address: string;
};

export const TokenTransfer = ({ address }: TokenTransferProps) => {
  let toastPlaceholder: Id;

  const [pending, setPending] = useState<boolean>(false);

  const { balance, refetch } = useToken({
    tokenAddress: VIG_TOKEN_ADDRESS,
    userAddress: address as Address,
    abi: VigABI,
  });

  const { gasCost, setGasCost, gasEstimationPending, debouncedGasEstimation } =
    useGasEstimation(VigABI);

  const { writeContractAsync, data: hash } = useWriteContract();

  const { isLoading: transactionLoading, isSuccess: transactionSuccessful } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (transactionLoading) {
      toastPlaceholder = toast.loading("Transaction is being processed");
    } else if (transactionSuccessful) {
      toast.dismiss(toastPlaceholder);
      toast.success("Transfer confirmed");
      refetch();
      reset();
      setPending(false);
      setGasCost(null);
    }
  }, [transactionLoading, transactionSuccessful]);

  const schema = z
    .object({
      ethAddress: z.string().refine((value) => isAddress(value), {
        message: "This is not an ethereum address.",
      }),
      amount: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => val > 0, {
          message: "Please enter a valid amount",
        })
        .refine((val) => val <= Number(balance), {
          message: `Your $VIG balance is too low`,
        }),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    setPending(true);

    const validationToast = toast.loading(
      "Please validate the transaction in your wallet provider."
    );

    try {
      await writeContractAsync({
        address: VIG_TOKEN_ADDRESS as Address,
        abi: VigABI,
        functionName: "transfer",
        args: [
          getValues().ethAddress as Address,
          getValues().amount * 10 ** 18,
        ],
      });

      toast.dismiss(validationToast);
    } catch (e) {
      toast.dismiss(validationToast);
      console.error(e);
      toast.error("Transfer failed");
      setPending(false);
    }
  };

  const handleInputChange = (field: "ethAddress" | "amount", value: string) => {
    const recipientAddress =
      field === "ethAddress" ? value : getValues("ethAddress");
    const amount = field === "amount" ? value : getValues("amount");

    if (recipientAddress && amount) {
      debouncedGasEstimation(recipientAddress, amount, address);
    }
  };

  return (
    <section className="w-full h-full flex justify-center items-center px-6">
      <div className="rounded-xl w-full sm:w-fit px-6 sm:px-24 py-6 border boder-white/10 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-8">Transfer $VIG</h1>

        <form
          className={pending ? "cursor-not-allowed opacity-30" : ""}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full flex flex-col justify-start gap-2 items-start mt-6">
            <div>Recipient Address</div>
            <input
              disabled={pending}
              {...register("ethAddress")}
              onChange={(e) => handleInputChange("ethAddress", e.target.value)}
              type="text"
              className="w-full sm:w-80 text-black rounded-lg p-2 border border-white/20"
              placeholder="0x"
            />

            <div className="h-2 text-red-600">
              {errors.ethAddress ? String(errors.ethAddress?.message) : null}
            </div>
          </div>

          <div className="w-full flex flex-col justify-start gap-2 items-start mt-6">
            <div>Amount</div>
            <input
              disabled={pending}
              {...register("amount")}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              type="number"
              className="w-full sm:w-80 text-black rounded-lg p-2 border border-white/20"
            />
            <div className="h-2 text-red-600">
              {errors.amount ? String(errors.amount?.message) : null}
            </div>
          </div>

          <div
            className={
              gasEstimationPending
                ? "h-2 mt-6 font-bold text-blue-800"
                : "h-2 mt-6 font-bold text-blue-500"
            }
          >
            {!gasEstimationPending && Number(gasCost) > 0 && (
              <>Fees estimated : {Number(gasCost).toFixed(8)} ETH</>
            )}

            {gasEstimationPending && <>Fees estimation loading...</>}
          </div>

          <button
            disabled={pending}
            className="w-full rounded-xl font-bold my-8 px-6 py-2 uppercase cursor-pointer text-black hover:bg-white/30 bg-white"
          >
            send tokens
          </button>
        </form>
      </div>
    </section>
  );
};
