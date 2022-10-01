import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, MouseEventHandler, useCallback, useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import {
  createInitializeStakeAccountInstruction,
  createRedeemInstruction,
  createStakingInstruction,
  createUnstakeInstruction,
} from "../utils/instructions";
import { BLD_TOKEN_MINT, PROGRAM_ID } from "../utils/constants";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

interface StakeOptionsDisplayProps {
  stake: () => void;
  unstake: () => void;
  nftData: any;
  isStaked: boolean;
  daysStaked: number;
  totalEarned: number;
  claimable: number;
}

const StakeOptionsDisplay: FC<StakeOptionsDisplayProps> = ({
  stake,
  unstake,
  nftData,
  isStaked,
  daysStaked,
  totalEarned,
  claimable,
}) => {
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

  const handleStake: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      event.preventDefault();
      if (!walletAdapter.publicKey) {
        alert("Please connect your wallet");
        return;
      } else if (!nftTokenAccount) {
        return;
      }
      console.log("mmmh, stake");

      const transaction = new web3.Transaction();

      console.log("Checking if staking account exists ...");
      const [stakingAccountPublicKey] = web3.PublicKey.findProgramAddressSync(
        [walletAdapter.publicKey.toBuffer(), nftTokenAccount.toBuffer()],
        PROGRAM_ID
      );
      const stakingAccountInfo = await connection.getAccountInfo(
        stakingAccountPublicKey
      );
      console.log(`Got staking account: ${stakingAccountInfo}`);

      if (!stakingAccountInfo) {
        console.log("Creating initializeStakeAccount instruciton ...");
        const createStakeAccount = createInitializeStakeAccountInstruction(
          walletAdapter.publicKey,
          nftTokenAccount,
          PROGRAM_ID
        );
        transaction.add(createStakeAccount);
      }

      console.log("Creating staking instruction ...");
      const stakingInstruction = createStakingInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        nftData.mint.address,
        nftData.edition.address,
        TOKEN_PROGRAM_ID,
        METADATA_PROGRAM_ID,
        PROGRAM_ID
      );
      transaction.add(stakingInstruction);

      try {
        await sendAndConfirmTransaction(transaction);
        stake();
      } catch (error) {
        console.log(error);
      }
    },
    [walletAdapter, connection, nftData, isStaked]
  );
  const handleUnstake: MouseEventHandler<HTMLButtonElement> = useCallback(
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
        unstake();
      } catch (error) {
        console.log(error);
      }
    },
    [connection, walletAdapter.publicKey, nftData, nftTokenAccount, isStaked]
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
    [connection, walletAdapter.publicKey, nftTokenAccount]
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
    <VStack
      bgColor="containerBg"
      borderRadius="20px"
      padding="20px 40px"
      spacing={5}
    >
      <Text
        bgColor="containerBgSecondary"
        padding="4px 8px"
        borderRadius="20px"
        color="bodyText"
        as="b"
        fontSize="sm"
      >
        {isStaked
          ? `STAKING ${daysStaked} DAY${daysStaked === 1 ? "" : "S"}`
          : "READY TO STAKE"}
      </Text>
      <VStack spacing={-1}>
        <Text color="white" as="b" fontSize="4xl">
          {isStaked ? `${totalEarned} $BLD` : "0 $BLD"}
        </Text>
        <Text color="bodyText">
          {isStaked ? `${claimable} $BLD earned` : "earn $BLD by staking"}
        </Text>
      </VStack>
      <Button
        onClick={isStaked ? handleRedeem : handleStake}
        bgColor="buttonGreen"
        width="200px"
      >
        <Text as="b">{isStaked ? "claim $BLD" : "stake buildoor"}</Text>
      </Button>
      {isStaked ? <Button onClick={handleUnstake}>unstake</Button> : null}
    </VStack>
  );
};

export default StakeOptionsDisplay;
