import Link from "next/link";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { compactAddress } from "../lib/format";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<string[]>;
      on?: (event: string, handler: (accounts: string[]) => void) => void;
      removeListener?: (event: string, handler: (accounts: string[]) => void) => void;
    };
  }
}

type WalletContextValue = {
  address: string | null;
  connect: () => Promise<void>;
  error: string | null;
  hasWallet: boolean;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }
  return context;
}

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/donor/explore", label: "Donor desk" },
  { href: "/student/apply", label: "Apply" },
  { href: "/student/dashboard", label: "My vaults" },
];

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState(false);

  async function connect() {
    setError(null);
    if (typeof window === "undefined" || !window.ethereum) {
      setError("No injected wallet was found.");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(accounts[0] ?? null);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasWallet(Boolean(window.ethereum));
    if (!window.ethereum) return;

    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => setAddress(accounts[0] ?? null))
      .catch(() => setAddress(null));

    const handleAccountsChanged = (accounts: string[]) => {
      setAddress(accounts[0] ?? null);
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const value = useMemo(
    () => ({ address, connect, error, hasWallet }),
    [address, error, hasWallet]
  );

  return (
    <WalletContext.Provider value={value}>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-[color:var(--accent)] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-[color:var(--accent-ink)]"
      >
        Skip to content
      </a>
      <div className="min-h-screen text-[color:var(--text)]">
        <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[rgba(12,11,8,0.86)] backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[auto_1fr_auto] md:items-center md:px-6 lg:px-8">
            <Link href="/" className="group inline-flex w-fit items-baseline gap-2">
              <span className="text-xl font-semibold tracking-[-0.02em]">
                Sc<span className="text-[color:var(--accent)]">O</span>lar
              </span>
              
            </Link>

            <nav
              aria-label="Primary navigation"
              className="flex gap-1 overflow-x-auto rounded-full border border-[color:var(--line)] p-1 md:mx-auto"
            >
              {navigation.map((item) => {
                const active =
                  item.href === "/"
                    ? router.pathname === "/"
                    : router.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                      active
                        ? "bg-[color:var(--text)] text-[color:var(--background)]"
                        : "text-[color:var(--text-muted)] hover:bg-white/5 hover:text-[color:var(--text)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button onClick={connect} className="btn-secondary justify-self-start md:justify-self-end">
              {address ? compactAddress(address) : hasWallet ? "Connect wallet" : "Wallet unavailable"}
            </button>
          </div>
          {error && (
            <div className="border-t border-[color:var(--line)] px-4 py-2 text-center text-sm text-[color:var(--warning)]">
              {error}
            </div>
          )}
        </header>
        <main id="content" className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
          {children}
        </main>
      </div>
    </WalletContext.Provider>
  );
}
