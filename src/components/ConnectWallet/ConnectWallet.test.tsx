import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import { expect, describe, it } from "@jest/globals";

import { ConnectWallet } from "./ConnectWallet";

import { useAppKit } from "@reown/appkit/react";

jest.mock("@reown/appkit/react", () => ({
  useAppKit: jest.fn(),
}));

describe("Testing connect wallet component", () => {
  const mockOpen = jest.fn();

  useAppKit.mockReturnValue({
    open: mockOpen,
  });

  render(<ConnectWallet />);

  it("should render the connect wallet component", () => {
    const title = screen.getByText("Welcome to $VIG Token dApp");

    const subtitle = screen.getByText(
      "Connect your wallet to start interacting with the $VIG token"
    );

    const button = screen.getByRole("button");

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  describe("When the user clicks `connect wallet`", () => {
    it("Should call open from  useAppKit hook", () => {
      const mockOpen = jest.fn();

      useAppKit.mockReturnValue({
        open: mockOpen,
      });

      render(<ConnectWallet />);

      const button = screen.getByRole("button");
      button.click();
      expect(mockOpen).toHaveBeenCalled();
    });
  });
});
