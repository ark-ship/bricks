"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWatchContractEvent } from "wagmi";
import type { Address } from "viem";

import { NFT_ABI } from "@/lib/abi";
import { CONTRACTS } from "@/lib/contracts";

export default function ContractSync() {
  const queryClient = useQueryClient();

  useWatchContractEvent({
    address: CONTRACTS.bricksNFT as Address,
    abi: NFT_ABI,
    eventName: "Transfer",

    onLogs(logs) {
      if (!logs.length) return;

      // Refresh every wagmi/readContract query
      queryClient.invalidateQueries();

      // Tell manual-read components to refresh
      window.dispatchEvent(
        new CustomEvent("bricks:refresh")
      );
    },
  });

  useEffect(() => {
    const handleRefresh = () => {
      queryClient.invalidateQueries();
    };

    window.addEventListener(
      "bricks:refresh",
      handleRefresh
    );

    return () => {
      window.removeEventListener(
        "bricks:refresh",
        handleRefresh
      );
    };
  }, [queryClient]);

  return null;
}