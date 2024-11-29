import "@testing-library/jest-dom";

import Home from "./page";

import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";

import { useToken } from "../hooks/useToken";

import { expect, describe, it } from "@jest/globals";

import { render, screen } from "@testing-library/react";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

jest.mock("@reown/appkit/react", () => ({
  useAppKitAccount: jest?.fn(),
  useDisconnect: jest.fn(),
  useAppKit: jest.fn(),
}));

jest.mock("wagmi", () => ({
  useWaitForTransactionReceipt: jest.fn(),
  useWriteContract: jest.fn(),
}));

jest.mock("../hooks/useToken", () => ({
  useToken: jest.fn(),
}));

describe("Should render home page", () => {
  useWriteContract.mockReturnValue({
    writeContractAsync: jest.fn(),
    data: "OXmockHash",
  });

  useWaitForTransactionReceipt.mockReturnValue({
    isLoading: false,
    isSuccess: false,
  });

  useDisconnect.mockReturnValue({
    disconnect: jest.fn(),
  });

  useAppKit.mockReturnValue({
    open: jest.fn(),
  });

  useToken.mockReturnValue({
    balance: 1000000,
    isLoading: false,
  });

  it("When a user is connected, should display VigDashboard", () => {
    useAppKitAccount.mockReturnValue({
      isConnected: true,
      address: "0x64129410B4Ae43c13D79537f114E3B46F97Ac92a",
    });

    render(<Home />);

    const transferTokenTitle = screen.getByText("Transfer $VIG");

    expect(transferTokenTitle).toBeInTheDocument();
  });

  it("When a user is not connected, should display connect wallet", () => {
    useAppKitAccount.mockReturnValue({
      isConnected: false,
      address: undefined,
    });

    render(<Home />);

    const connectWalletTitle = screen.getByText("Welcome to $VIG Token dApp");

    expect(connectWalletTitle).toBeInTheDocument();
  });
});
