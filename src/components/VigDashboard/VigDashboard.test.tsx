import "@testing-library/jest-dom";

import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";

import { VigDashboard } from "./VigDashboard";

import { useToken } from "../../hooks/useToken";

import { expect, describe, it, beforeEach } from "@jest/globals";

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

jest.mock("../../hooks/useToken", () => ({
  useToken: jest.fn(),
}));

describe("If a wallet is connected", () => {
  const mockUseWriteContract = jest.fn();

  useWriteContract.mockReturnValue({
    writeContractAsync: mockUseWriteContract,
    data: "OXmockHash",
  });

  useWaitForTransactionReceipt.mockReturnValue({
    isLoading: false,
    isSuccess: false,
  });

  useAppKitAccount.mockReturnValue({
    address: "0x64129410B4Ae43c13D79537f114E3B46F97Ac92a",
  });

  const mockDisconnect = jest.fn();

  useDisconnect.mockReturnValue({
    disconnect: mockDisconnect,
  });

  const mockOpen = jest.fn();

  useAppKit.mockReturnValue({
    open: mockOpen,
  });

  useToken.mockReturnValue({
    balance: 1000000,
    isLoading: false,
  });

  beforeEach(() => {
    render(<VigDashboard />);
  });

  it("should display the address button in the top left", () => {
    const addressButton = screen.getByText("0x6412...c92a");
    expect(addressButton).toBeInTheDocument();
  });

  it("should display the disconnect wallet button in the top right", () => {
    const button = screen.getByText("Disconnect wallet");

    expect(button).toBeInTheDocument();
  });

  it("should display the balance", () => {
    const balance = screen.getByText("Balance : 1,000,000 $VIG");

    expect(balance).toBeInTheDocument();
  });

  it("should display the TransferToken component", () => {
    const transferTokenTitle = screen.getByText("Transfer $VIG");

    expect(transferTokenTitle).toBeInTheDocument();
  });

  it("When the user clicks on his wallet address, should open the accont view", () => {
    const addressButton = screen.getByText("0x6412...c92a");

    addressButton.click()
    ;
    expect(mockOpen).toHaveBeenCalledWith({ view: "Account" });
  });

  it("When the user clicks on disconnect wallet, should call disconnect", () => {
    const button = screen.getByText("Disconnect wallet");

    button.click();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
