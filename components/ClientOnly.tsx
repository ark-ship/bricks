"use client";

import dynamic from "next/dynamic";

export const ClientHeader = dynamic(
  () => import("./Header"),
  {
    ssr: false,
  }
);

export const ClientMintCard = dynamic(
  () => import("./MintCard"),
  {
    ssr: false,
  }
);

export const ClientMyBricks = dynamic(
  () => import("./MyBricks"),
  {
    ssr: false,
  }
);