import React from "react";
import WalletProvider from "./WalletProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
