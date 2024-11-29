import "@testing-library/jest-dom";

import { expect, describe, it } from "@jest/globals";

import { render, screen, fireEvent } from "@testing-library/react";

import { TokenTransfer } from "./TokenTransfer";

import { useToken } from "../../hooks/useToken";

import { useGasEstimation } from "../../hooks/useGasEstimation";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { useForm } from "react-hook-form";

import { VIG_TOKEN_ADDRESS } from "../../utils/consts";

import { VigABI } from "../..//utils/VigABI";

import { Address } from "viem";

const myAddress = "0x64129410B4Ae43c13D79537f114E3B46F97Ac92a";

jest.mock("@reown/appkit/react", () => ({
  useAppKitAccount: jest?.fn(),
  useDisconnect: jest.fn(),
  useAppKit: jest.fn(),
}));

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

jest.mock("wagmi", () => ({
  useWaitForTransactionReceipt: jest.fn(),
  useWriteContract: jest.fn(),
}));

jest.mock("../../hooks/useGasEstimation", () => ({
  useGasEstimation: jest.fn(),
}));

jest.mock("../../hooks/useToken", () => ({
  useToken: jest.fn(),
}));

describe("Should render TokenTransfer component", () => {
  useWriteContract.mockReturnValue({
    writeContractAsync: jest.fn(),
    data: "OXmockHash",
  });

  useWaitForTransactionReceipt.mockReturnValue({
    isLoading: false,
    isSuccess: false,
  });

  useToken.mockReturnValue({
    balance: 1000000,
    isLoading: false,
  });

  useGasEstimation.mockReturnValue({
    gasCost: null,
    setGasCost: jest.fn(),
    gasEstimationPending: false,
    gasEstimationError: null,
    debouncedGasEstimation: jest.fn(),
  });

  useForm.mockReturnValue({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: { errors: {} },
    getValues: jest.fn(),
    reset: jest.fn(),
  });

  it("Should render the page title", () => {
    render(<TokenTransfer address={myAddress} />);

    const pageTitle = screen.getByText("Transfer $VIG");
    expect(pageTitle).toBeInTheDocument();
  });

  it("Should render the page elements", () => {
    render(<TokenTransfer address={myAddress} />);

    const firstInputTitle = screen.getByText("Recipient Address");
    const secondInputTitle = screen.getByText("Amount");

    const ethAddressInput = screen.getByLabelText("ethAddress");
    const amountInput = screen.getByLabelText("amount");

    const sendTokensButton = screen.getByRole("button");

    expect(firstInputTitle).toBeInTheDocument();
    expect(secondInputTitle).toBeInTheDocument();

    expect(ethAddressInput).toBeInTheDocument();
    expect(amountInput).toBeInTheDocument();

    expect(sendTokensButton).toBeInTheDocument();
  });

  describe("Should trigger error if button is pressed with empty inputs", () => {
    it("displays validation errors when inputs are empty", () => {
      const addressErrorMessage = "This is not an ethereum address.";
      const amountErrorMessage = "Please enter a valid amount";

      useForm.mockReturnValue({
        register: jest.fn(),
        handleSubmit: jest.fn((callback) => () => callback()),
        formState: {
          errors: {
            ethAddress: { message: addressErrorMessage },
            amount: { message: amountErrorMessage },
          },
        },
        getValues: jest.fn(),
        reset: jest.fn(),
      });

      render(<TokenTransfer address={myAddress} />);

      const sendTokensButton = screen.getByRole("button");
      fireEvent.click(sendTokensButton);

      const ethAddressError = screen.getByText(addressErrorMessage);
      const amountError = screen.getByText(amountErrorMessage);

      expect(ethAddressError).toBeInTheDocument();
      expect(amountError).toBeInTheDocument();
    });
  });

  describe("Should trigger a transaction", () => {
    it("triggers a contract write when valid inputs are provided", async () => {
      const writeContractMock = jest.fn().mockResolvedValue("Transaction Hash");
      const resetMock = jest.fn();
      const recipientAddress = "0x042Eb27B32235B6cd99f74ba00e05c7166964019";

      useWriteContract.mockReturnValue({
        writeContractAsync: writeContractMock,
        data: null,
      });

      useForm.mockReturnValue({
        register: jest.fn(),
        handleSubmit: jest.fn((callback) => callback),
        formState: { errors: {} },
        getValues: jest.fn(() => ({
          ethAddress: recipientAddress,
          amount: 10000,
        })),
        reset: resetMock,
      });

      render(<TokenTransfer address={myAddress} />);

      const ethAddressInput = screen.getByLabelText("ethAddress");
      const amountInput = screen.getByLabelText("amount");

      fireEvent.change(ethAddressInput, {
        target: { value: recipientAddress },
      });
      fireEvent.change(amountInput, { target: { value: 10000 } });

      const sendTokensButton = screen.getByRole("button");
      fireEvent.click(sendTokensButton);

      expect(writeContractMock).toHaveBeenCalledWith({
        address: VIG_TOKEN_ADDRESS as Address,
        abi: VigABI,
        functionName: "transfer",
        args: [recipientAddress, 10000 * 10 ** 18],
      });
    });
  });
});
