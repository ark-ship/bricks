"use client";

import { useEffect, useState } from "react";

import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import {
  formatEther,
} from "viem";

import {
  BRICKS404_ABI,
  BRICK_TOKEN_ABI,
  NFT_ABI,
} from "@/lib/abi";

import { CONTRACTS } from "@/lib/contracts";

interface BrickCardProps {
  tokenId: bigint;
  mode: "owned" | "locked";
  onComplete?: () => void;
}

export default function BrickCard({
  tokenId,
  mode,
  onComplete,
}: BrickCardProps) {
  const { address } = useAccount();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");

  const [status, setStatus] = useState<
    | "idle"
    | "approving"
    | "fractionalizing"
    | "redeeming"
    | "done"
    | "error"
  >("idle");

  // ============================================================
  // METADATA
  // ============================================================

  const { data: tokenUri } =
    useReadContract({
      address: CONTRACTS.bricks404,
      abi: BRICKS404_ABI,
      functionName: "tokenURI",
      args: [tokenId],
    });

  // ============================================================
  // BRICK BALANCE
  // ============================================================

  const { data: brickBalance } =
    useReadContract({
      address: CONTRACTS.brickToken,
      abi: BRICK_TOKEN_ABI,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
      query: {
        enabled:
          mode === "locked" &&
          !!address,
      },
    });

  const { data: brickUnit } =
    useReadContract({
      address: CONTRACTS.bricks404,
      abi: BRICKS404_ABI,
      functionName: "BRICK_UNIT",
    });

  // ============================================================
  // APPROVE
  // ============================================================

  const {
    writeContract: approveNFT,
    data: approveHash,
    isPending: approvePending,
  } = useWriteContract();

  const {
    isLoading: approveConfirming,
    isSuccess: approveSuccess,
    isError: approveError,
  } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  // ============================================================
  // FRACTIONALIZE
  // ============================================================

  const {
    writeContract: fractionalizeNFT,
    data: fractionalizeHash,
    isPending: fractionalizePending,
  } = useWriteContract();

  const {
    isLoading: fractionalizeConfirming,
    isSuccess: fractionalizeSuccess,
    isError: fractionalizeError,
  } =
    useWaitForTransactionReceipt({
      hash: fractionalizeHash,
    });

  // ============================================================
  // REDEEM
  // ============================================================

  const {
    writeContract: redeemNFT,
    data: redeemHash,
    isPending: redeemPending,
  } = useWriteContract();

  const {
    isLoading: redeemConfirming,
    isSuccess: redeemSuccess,
    isError: redeemError,
  } =
    useWaitForTransactionReceipt({
      hash: redeemHash,
    });

  // ============================================================
  // METADATA DECODE
  // ============================================================

  useEffect(() => {
    if (!tokenUri) return;

    try {
      const decoded = atob(
        tokenUri.split(",")[1]
      );

      const metadata = JSON.parse(
        decoded
      );

      setName(
        metadata.name ??
          `404 Brick #${tokenId}`
      );

      setImage(
        metadata.image ?? ""
      );
    } catch {
      setName(
        `404 Brick #${tokenId}`
      );
    }
  }, [tokenUri, tokenId]);

  // ============================================================
  // APPROVAL → AUTOMATIC FRACTIONALIZE
  // ============================================================

  useEffect(() => {
    if (!approveSuccess) return;
    if (mode !== "owned") return;
    if (status !== "approving") return;

    setStatus("fractionalizing");

    fractionalizeNFT({
      address: CONTRACTS.bricks404,
      abi: BRICKS404_ABI,
      functionName: "fractionalize",
      args: [tokenId],
    });
  }, [
    approveSuccess,
    mode,
    status,
    tokenId,
    fractionalizeNFT,
  ]);

  // ============================================================
  // FRACTIONALIZE SUCCESS
  // ============================================================

  useEffect(() => {
    if (!fractionalizeSuccess) return;

    setStatus("done");

    onComplete?.();
  }, [
    fractionalizeSuccess,
    onComplete,
  ]);

  // ============================================================
  // REDEEM SUCCESS
  // ============================================================

  useEffect(() => {
    if (!redeemSuccess) return;

    setStatus("done");

    onComplete?.();
  }, [
    redeemSuccess,
    onComplete,
  ]);

  // ============================================================
  // ERROR
  // ============================================================

  useEffect(() => {
    if (
      approveError ||
      fractionalizeError ||
      redeemError
    ) {
      setStatus("error");
    }
  }, [
    approveError,
    fractionalizeError,
    redeemError,
  ]);

  // ============================================================
  // ACTIONS
  // ============================================================

  const handleFractionalize = () => {
    setStatus("approving");

    approveNFT({
      address: CONTRACTS.bricksNFT,
      abi: NFT_ABI,
      functionName: "approve",
      args: [
        CONTRACTS.bricks404,
        tokenId,
      ],
    });
  };

  const handleRedeem = () => {
    if (!brickUnit) return;

    if (
      !brickBalance ||
      brickBalance < brickUnit
    ) {
      return;
    }

    setStatus("redeeming");

    redeemNFT({
      address: CONTRACTS.bricks404,
      abi: BRICKS404_ABI,
      functionName: "redeem",
      args: [tokenId],
    });
  };

  const hasEnoughBrick =
    !!brickUnit &&
    !!brickBalance &&
    brickBalance >= brickUnit;

  // ============================================================
  // UI
  // ============================================================

  return (
    <article className="brick-card">

      <div className="brick-image">
        {image ? (
          <img
            src={image}
            alt={name}
          />
        ) : (
          <div className="image-loading">
            LOADING...
          </div>
        )}
      </div>

      <div className="brick-content">

        <div className="brick-title">
          {name ||
            `404 Brick #${tokenId}`}
        </div>

        <div className="brick-id">
          TOKEN #{tokenId.toString()}
        </div>

        {/* ================================================== */}
        {/* OWNED */}
        {/* ================================================== */}

        {mode === "owned" && (
          <>
            {status === "approving" ? (
              <button
                className="action-button"
                disabled
              >
                {approvePending
                  ? "APPROVING..."
                  : approveConfirming
                  ? "CONFIRMING..."
                  : "APPROVED"}
              </button>
            ) : status ===
              "fractionalizing" ? (
              <button
                className="action-button"
                disabled
              >
                {fractionalizePending
                  ? "LOCKING..."
                  : fractionalizeConfirming
                  ? "CONFIRMING..."
                  : "LOCKING..."}
              </button>
            ) : status === "error" ? (
              <button
                className="action-button"
                onClick={() =>
                  setStatus("idle")
                }
              >
                TRY AGAIN
              </button>
            ) : (
              <button
                className="action-button"
                onClick={
                  handleFractionalize
                }
              >
                FRACTIONALIZE
              </button>
            )}
          </>
        )}

        {/* ================================================== */}
        {/* LOCKED */}
        {/* ================================================== */}

        {mode === "locked" && (
          <>
            <div className="locked-label">
              LOCKED
            </div>

            <div className="brick-required">
              6,666 $BRICKS
            </div>

            <div className="brick-your-balance">
              YOUR BALANCE:{" "}
              {brickBalance
                ? Number(
                    formatEther(
                      brickBalance
                    )
                  ).toLocaleString()
                : "0"}{" "}
              $BRICKS
            </div>

            {status === "redeeming" ? (
              <button
                className="action-button"
                disabled
              >
                {redeemPending
                  ? "CONFIRM IN WALLET..."
                  : redeemConfirming
                  ? "REDEEMING..."
                  : "REDEEMING..."}
              </button>
            ) : status === "done" ? (
              <div className="locked-label">
                REDEEMED
              </div>
            ) : (
              <button
                className="action-button"
                disabled={!hasEnoughBrick}
                onClick={handleRedeem}
              >
                {hasEnoughBrick
                  ? "REDEEM BRICK"
                  : "NEED 6,666 BRICK"}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}