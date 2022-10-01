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
