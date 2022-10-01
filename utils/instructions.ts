import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

export function createInitializeStakeAccountInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  programId: PublicKey
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  );

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: SystemProgram.programId,
        isWritable: false,
        isSigner: false,
      },
    ],
    data: Buffer.from([0]),
  });
}

export function createStakingInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  nftMint: PublicKey,
  nftEdition: PublicKey,
  tokenProgramId: PublicKey,
  metadataProgramId: PublicKey,
  programId: PublicKey
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  );
  const [programAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("authority")],
    programId
  );

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: nftMint,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: nftEdition,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: programAuthority,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgramId,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: metadataProgramId,
        isWritable: false,
        isSigner: false,
      },
    ],
    data: Buffer.from([1]),
  });
}

export function createRedeemInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  bldTokenMint: PublicKey,
  userAta: PublicKey,
  tokenProgramId: PublicKey,
  programId: PublicKey
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  );

  const [bldTokenMintAuth] = PublicKey.findProgramAddressSync(
    [Buffer.from("bld_token_mint_auth")],
    programId
  );

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: bldTokenMint,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: bldTokenMintAuth,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: userAta,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgramId,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: Buffer.from([2]),
  });
}

export function createUnstakeInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  nftMint: PublicKey,
  nftEdition: PublicKey,
  bldTokenMint: PublicKey,
  userAta: PublicKey,
  tokenProgramId: PublicKey,
  metadataProgramId: PublicKey,
  programId: PublicKey
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  );
  const [programAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("authority")],
    programId
  );
  const [bldTokenMintAuth] = PublicKey.findProgramAddressSync(
    [Buffer.from("bld_token_mint_auth")],
    programId
  );

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: nftMint,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: nftEdition,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: programAuthority,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: bldTokenMint,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: bldTokenMintAuth,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: userAta,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgramId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: metadataProgramId,
        isWritable: false,
        isSigner: false,
      },
    ],
    data: Buffer.from([3]),
  });
}
