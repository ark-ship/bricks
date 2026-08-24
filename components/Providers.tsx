"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  WagmiProvider,
  createConfig,
  http,
} from "wagmi";
import { injected } from "wagmi/connectors";

import { robinhoodTestnet } from "@/lib/chain";

const config = createConfig({
  chains: [robinhoodTestnet],
  connectors: [injected()],
  transports: {
    [robinhoodTestnet.id]: http(
      "https://rpc.testnet.chain.robinhood.com"
    ),
  },
});

const queryClient = new QueryClient();

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}