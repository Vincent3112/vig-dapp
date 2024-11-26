import type { Metadata } from "next";

import { Inter } from "next/font/google";

import { headers } from "next/headers";

import ContextProvider from "../context/provider";

import "react-toastify/dist/ReactToastify.css";

import "./globals.css";

import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VIG transfer dApp",
  description: "Token transfer dApp for VIG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            newestOnTop={false}
            draggable
            style={{ zIndex: 999999 }}
          />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
