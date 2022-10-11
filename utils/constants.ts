import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_STAKE_PROGRAM_ID ?? ""
);

export const BLD_TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_STAKE_MINT_ADDRESS ?? ""
);

export const CANDY_MACHINE_ID = new PublicKey(
  process.env.NEXT_PUBLIC_CANDY_MACHINE_ADDRESS ?? ""
);

export const LOOT_BOX_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_LOOT_BOX_PROGRAM_ID ?? ""
);

const GEAR_HAT_TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_GEAR_HAT_MINT_ADDRESS ?? ""
);

const GEAR_HEADPHONES_TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_GEAR_HEADPHONES_MINT_ADDRESS ?? ""
);
export const GEAR_TOKEN_MINTS = [
  GEAR_HAT_TOKEN_MINT,
  GEAR_HEADPHONES_TOKEN_MINT,
];
