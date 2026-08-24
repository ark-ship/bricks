"use client";

import { useEffect, useState } from "react";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";

import { robinhoodMainnet } from "@/lib/chain";

export default function Header() {
  const [mounted, setMounted] =
    useState(false);

  const {
    address,
    isConnected,
    chainId,
  } = useAccount();

  const {
    connect,
    connectors,
  } = useConnect();

  const {
    disconnect,
  } = useDisconnect();

  const {
    switchChain,
  } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logo = (
    <div className="logo">
      <img
        src="/logo.png"
        alt="404 Bricks"
      />
    </div>
  );

  if (!mounted) {
    return (
      <header className="site-header">
        {logo}

        <div className="header-right">
          <button className="connect-button">
            CONNECT WALLET
          </button>
        </div>
      </header>
    );
  }

  const wrongNetwork =
  isConnected &&
  chainId !== robinhoodMainnet.id;

  return (
    <header className="site-header">
      {logo}

      <div className="header-right">
        {wrongNetwork && (
          <button
            className="network-button"
            onClick={() =>
            switchChain({
            chainId: robinhoodMainnet.id,
            })
        }
          >
            SWITCH NETWORK
          </button>
        )}

        {!isConnected ? (
          <button
            className="connect-button"
            onClick={() =>
              connect({
                connector: connectors[0],
              })
            }
          >
            CONNECT WALLET
          </button>
        ) : (
          <button
            className="wallet-button"
            onClick={() =>
              disconnect()
            }
          >
            {address?.slice(0, 6)}...
            {address?.slice(-4)}
          </button>
        )}
      </div>
    </header>
  );
}