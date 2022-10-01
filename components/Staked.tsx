import { Button, HStack, Text } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, MouseEventHandler, useCallback, useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import {
  createRedeemInstruction,
  createUnstakeInstruction,
} from "../utils/instructions";
import { BLD_TOKEN_MINT, PROGRAM_ID } from "../utils/constants";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

interface StakedProps {
  onClick: () => void;
  nftData: any;
}

const Staked: FC<StakedProps> = ({ onClick, nftData }) => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const [nftTokenAccount, setNftTokenAccount] = useState<web3.PublicKey>();

  useEffect(() => {
    if (nftData) {
      connection
        .getTokenLargestAccounts(nftData.mint.address)
        .then((accounts) => setNftTokenAccount(accounts.value[0].address));
    }
  }, [nftData, walletAdapter, connection]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      event.preventDefault();
      if (!walletAdapter.publicKey) {
        alert("Please connect your wallet");
        return;
      } else if (!nftTokenAccount) {
        return;
      }
      console.log("unstake");

      const transaction = new web3.Transaction();

      console.log("Checking if ATA exists ...");
      const userAtaPublicKey = await getAssociatedTokenAddress(
        BLD_TOKEN_MINT,
        walletAdapter.publicKey
      );

      const userAta = await connection.getAccountInfo(userAtaPublicKey);

      if (!userAta) {
        console.log("Creating createATAInstruction ...");
        const createAtaInstruction = createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,
          userAtaPublicKey,
          walletAdapter.publicKey,
          BLD_TOKEN_MINT
        );
        transaction.add(createAtaInstruction);
      }

      const unstakeInstruction = createUnstakeInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        nftData.mint.address,
        nftData.edition.address,
        BLD_TOKEN_MINT,
        userAtaPublicKey,
        TOKEN_PROGRAM_ID,
        METADATA_PROGRAM_ID,
        PROGRAM_ID
      );

      transaction.add(unstakeInstruction);
      try {
        await sendAndConfirmTransaction(transaction);
        onClick();
      } catch (error) {
        console.log(error);
      }
    },
    [connection, walletAdapter.publicKey, nftData, onClick, nftTokenAccount]
  );

  const handleRedeem: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      event.preventDefault();
      if (!walletAdapter.publicKey) {
        alert("Please connect your wallet");
        return;
      } else if (!nftTokenAccount) {
        return;
      }
      console.log("redeem");

      const transaction = new web3.Transaction();

      console.log("Checking if ATA exists ...");
      const userAtaPublicKey = await getAssociatedTokenAddress(
        BLD_TOKEN_MINT,
        walletAdapter.publicKey
      );

      const userAta = await connection.getAccountInfo(userAtaPublicKey);

      if (!userAta) {
        console.log("Creating createATAInstruction ...");
        const createAtaInstruction = createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,
          userAtaPublicKey,
          walletAdapter.publicKey,
          BLD_TOKEN_MINT
        );
        transaction.add(createAtaInstruction);
      }

      const redeemInstruction = createRedeemInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        BLD_TOKEN_MINT,
        userAtaPublicKey,
        TOKEN_PROGRAM_ID,
        PROGRAM_ID
      );

      transaction.add(redeemInstruction);
      try {
        await sendAndConfirmTransaction(transaction);
      } catch (error) {
        console.log(error);
      }
    },
    [connection, walletAdapter.publicKey, nftTokenAccount, onClick]
  );

  const sendAndConfirmTransaction = useCallback(
    async (transaction: web3.Transaction) => {
      console.log("Sending transaction ...");
      const signature = await walletAdapter.sendTransaction(
        transaction,
        connection
      );
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          signature: signature,
        },
        "finalized"
      );
      console.log(
        `Transaction submitted successfully: https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    },
    [walletAdapter, connection]
  );

  return (
    <HStack>
      <Button
        bgColor="accent"
        color="white"
        maxW="380px"
        onClick={handleRedeem}
      >
        <HStack>
          <Text>redeem</Text>
        </HStack>
      </Button>
      <Button bgColor="accent" color="white" maxW="380px" onClick={handleClick}>
        <HStack>
          <Text>unstake buildoor</Text>
        </HStack>
      </Button>
    </HStack>
  );
};

export default Staked;
