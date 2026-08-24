"use client";

import {
  useAccount,
  usePublicClient,
  useWatchContractEvent,
} from "wagmi";

import {
  getAddress,
  type Address,
} from "viem";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import BrickCard from "./BrickCard";

import {
  BRICKS404_ABI,
  NFT_ABI,
} from "@/lib/abi";

import { CONTRACTS } from "@/lib/contracts";

export default function MyBricks() {
  const { address } = useAccount();

  const publicClient =
    usePublicClient();

  const [mounted, setMounted] =
    useState(false);

  const [ownedIds, setOwnedIds] =
    useState<bigint[]>([]);

  const [lockedIds, setLockedIds] =
    useState<bigint[]>([]);

  const [loading, setLoading] =
    useState(false);

  // ============================================================
  // MOUNT
  // ============================================================

  useEffect(() => {
    setMounted(true);
  }, []);

  // ============================================================
  // LOAD COLLECTION
  // ============================================================

  const loadBricks =
    useCallback(async () => {
      if (!mounted) {
        return;
      }

      if (
        !address ||
        !publicClient
      ) {
        setOwnedIds([]);
        setLockedIds([]);
        return;
      }

      setLoading(true);

      try {
        // ======================================================
        // MINTED SUPPLY
        // ======================================================

        const minted =
          await publicClient.readContract({
            address:
              CONTRACTS.bricks404 as Address,

            abi: BRICKS404_ABI,

            functionName:
              "mintedBricks",
          });

        // ======================================================
        // FIND OWNED NFTS
        // ======================================================

        const owned: bigint[] = [];

        for (
          let tokenId = 1n;
          tokenId <= minted;
          tokenId++
        ) {
          try {
            const owner =
              await publicClient.readContract({
                address:
                  CONTRACTS.bricksNFT as Address,

                abi: NFT_ABI,

                functionName:
                  "ownerOf",

                args: [tokenId],
              });

            if (
              getAddress(owner) ===
              getAddress(address)
            ) {
              owned.push(tokenId);
            }
          } catch {
            // Token unavailable / burned
          }
        }

        // ======================================================
        // FIND LOCKED NFTS
        // ======================================================

        const locked =
          await publicClient.readContract({
            address:
              CONTRACTS.bricks404 as Address,

            abi: BRICKS404_ABI,

            functionName:
              "lockedBricks",
          });

        const sortedLocked =
          [...locked].sort(
            (a, b) =>
              a < b
                ? -1
                : a > b
                ? 1
                : 0
          );

        // ======================================================
        // UPDATE STATE
        // ======================================================

        setOwnedIds(owned);

        setLockedIds(
          sortedLocked
        );
      } catch (error) {
        console.error(
          "Failed to load Bricks:",
          error
        );

        setOwnedIds([]);
        setLockedIds([]);
      } finally {
        setLoading(false);
      }
    }, [
      mounted,
      address,
      publicClient,
    ]);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadBricks();
  }, [loadBricks]);

  // ============================================================
  // WATCH NFT TRANSFERS
  // ============================================================

  useWatchContractEvent({
    address:
      CONTRACTS.bricksNFT as Address,

    abi: NFT_ABI,

    eventName: "Transfer",

    onLogs(logs) {
      if (!logs.length) {
        return;
      }

      /*
       * Something changed on the NFT contract.
       *
       * Examples:
       *
       * mint
       * transfer
       * fractionalize
       * redeem
       *
       * Reload our collection automatically.
       */

      loadBricks();
    },
  });

  // ============================================================
  // CUSTOM REFRESH EVENT
  // ============================================================

  useEffect(() => {
    const handleRefresh = () => {
      loadBricks();
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
  }, [loadBricks]);

  // ============================================================
  // SSR PLACEHOLDER
  // ============================================================

  if (!mounted) {
    return (
      <section className="collection-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              YOUR COLLECTION
            </div>

            <h2>MY BRICKS</h2>
          </div>

          <div className="collection-count">
            0
          </div>
        </div>

        <div className="empty-state">
          CONNECT WALLET TO VIEW YOUR BRICKS
        </div>
      </section>
    );
  }

  // ============================================================
  // WALLET DISCONNECTED
  // ============================================================

  if (!address) {
    return (
      <section className="collection-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              YOUR COLLECTION
            </div>

            <h2>MY BRICKS</h2>
          </div>

          <div className="collection-count">
            0
          </div>
        </div>

        <div className="empty-state">
          CONNECT WALLET TO VIEW YOUR BRICKS
        </div>
      </section>
    );
  }

  // ============================================================
  // COLLECTION UI
  // ============================================================

  return (
    <section className="collection-section">
      {/* ====================================================== */}
      {/* MY BRICKS */}
      {/* ====================================================== */}

      <div className="section-heading">
        <div>
          <div className="eyebrow">
            YOUR COLLECTION
          </div>

          <h2>MY BRICKS</h2>
        </div>

        <div className="collection-count">
          {ownedIds.length}
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          LOADING BRICKS...
        </div>
      ) : ownedIds.length === 0 ? (
        <div className="empty-state">
          NO OWNED BRICKS.
        </div>
      ) : (
        <div className="brick-grid">
          {ownedIds.map(
            (tokenId) => (
              <BrickCard
                key={`owned-${tokenId.toString()}`}
                tokenId={tokenId}
                mode="owned"
                onComplete={loadBricks}
              />
            )
          )}
        </div>
      )}

      {/* ====================================================== */}
      {/* LOCKED BRICKS */}
      {/* ====================================================== */}

      <div
        className="section-heading"
        style={{
          marginTop: 50,
        }}
      >
        <div>
          <div className="eyebrow">
            FRACTIONALIZED
          </div>

          <h2>LOCKED BRICKS</h2>
        </div>

        <div className="collection-count">
          {lockedIds.length}
        </div>
      </div>

      {lockedIds.length === 0 ? (
        <div className="empty-state">
          NO LOCKED BRICKS.
        </div>
      ) : (
        <div className="brick-grid">
          {lockedIds.map(
            (tokenId) => (
              <BrickCard
                key={`locked-${tokenId.toString()}`}
                tokenId={tokenId}
                mode="locked"
                onComplete={loadBricks}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}