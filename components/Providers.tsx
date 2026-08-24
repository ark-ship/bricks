"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  WagmiProvider,
  createConfig,
  http,
} from "wagmi";

import { injected } from "wagmi/connectors";

import { robinhoodMainnet } from "@/lib/chain";

const config = createConfig({
  ssr: true,

  chains: [robinhoodMainnet],

  connectors: [injected()],

  transports: {
    [robinhoodMainnet.id]: http(
      "https://rpc.mainnet.chain.robinhood.com"
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
      <QueryClientProvider
        client={queryClient}
      >
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}