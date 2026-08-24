export const BRICKS404_ABI = [
  // ============================================================
  // MINT CONFIG
  // ============================================================

  {
    type: "function",
    name: "mintPrice",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },

  {
    type: "function",
    name: "maxSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },

  {
    type: "function",
    name: "mintedBricks",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },

  {
    type: "function",
    name: "maxMintPerWallet",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },

  {
    type: "function",
    name: "mintedByWallet",
    stateMutability: "view",
    inputs: [
      {
        name: "wallet",
        type: "address",
      },
    ],
    outputs: [{ type: "uint256" }],
  },

  // ============================================================
  // PUBLIC MINT
  // mint(uint256 quantity)
  // ============================================================

  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [
      {
        name: "quantity",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "firstTokenId",
        type: "uint256",
      },
    ],
  },

  // ============================================================
  // FRACTIONALIZE
  // ============================================================

  {
    type: "function",
    name: "fractionalize",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [],
  },

  // ============================================================
  // REDEEM
  // ============================================================

  {
    type: "function",
    name: "redeem",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [],
  },

  // ============================================================
  // LOCKED BRICKS
  // ============================================================

  {
    type: "function",
    name: "lockedBricks",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "uint256[]",
      },
    ],
  },

  {
    type: "function",
    name: "fractionalized",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "bool",
      },
    ],
  },

  // ============================================================
  // BRICK UNIT
  // ============================================================

  {
    type: "function",
    name: "BRICK_UNIT",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },

  // ============================================================
  // TOKEN URI
  // ============================================================

  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "string",
      },
    ],
  },
] as const;

// ================================================================
// ERC721
// ================================================================

export const NFT_ABI = [
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "address",
      },
    ],
  },

  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [],
  },

  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "string",
      },
    ],
  },

  // ============================================================
  // ERC721 Transfer event
  // ============================================================

  {
    type: "event",
    name: "Transfer",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        name: "tokenId",
        type: "uint256",
      },
    ],
  },
] as const;

// ================================================================
// $BRICK TOKEN
// ================================================================

export const BRICK_TOKEN_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },

  {
    type: "event",
    name: "Transfer",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
  },
] as const;