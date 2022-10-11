import { Button, Text, VStack } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, MouseEventHandler, useCallback, useEffect, useState } from "react";
import { Transaction, PublicKey } from "@solana/web3.js";
import { BLD_TOKEN_MINT } from "../utils/constants";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useWorkspace } from "./WorkspaceProvider";

interface StakeOptionsDisplayProps {
  stake: () => void;
  unstake: () => void;
  nftData: any;
  isStaked: boolean;
  totalEarned: number;
}

const StakeOptionsDisplay: FC<StakeOptionsDisplayProps> = ({
  stake,
  unstake,
  nftData,
  isStaked,
  totalEarned,
}) => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const workspace = useWorkspace();
  const [nftTokenAccount, setNftTokenAccount] = useState<PublicKey>();
  const [isSendingTransaction, setIsSendingTransaction] =
    useState<boolean>(false);

  useEffect(() => {
    if (nftData) {
      connection
        .getTokenLargestAccounts(nftData.mint.address)
        .then((accounts) => setNftTokenAccount(accounts.value[0].address));
    }
    //TODO need walletAdapter?
  }, [nftData, walletAdapter, connection]);

  const handleStake: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      event.preventDefault();
      if (!walletAdapter.publicKey) {
        alert("Please connect your wallet");
        return;
      } else if (!nftTokenAccount || !workspace.stakingProgram) return;
      setIsSendingTransaction(true);
      console.log("mmmh, stake");

      const transaction = new Transaction();

      try {
        const instruction = await workspace.stakingProgram.methods
          .stake()
          .accounts({
            nftPublickey: nftTokenAccount,
            nftMintPublickey: nftData.mint.address,
            nftEditionPublickey: nftData.edition.address,
            metadataProgram: METADATA_PROGRAM_ID,
          })
          .instruction();
        transaction.add(instruction);
        await sendAndConfirmTransaction(transaction);
        stake();
      } catch (error) {
        console.log(error);
      } finally {
        setIsSendingTransaction(false);
      }
    },
    [
      walletAdapter.publicKey,
      nftTokenAccount,
      workspace.stakingProgram,
      nftData,
      stake,
    ]
  );
  const handleUnstake: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      event.preventDefault();
      if (!walletAdapter.publicKey) {
        alert("Please connect your wallet");
        return;
      } else if (!nftTokenAccount || !workspace.stakingProgram) {
        return;
      }
      setIsSendingTransaction(true);
      console.log("unstake");

      const transaction = new Transaction();

      console.log("Checking if ATA exists ...");
      const userAtaPublicKey = await getAssociatedTokenAddress(
        BLD_TOKEN_MINT,
        walletAdapter.publicKey
      );

      try {
        const instruction = await workspace.stakingProgram.methods
          .unstake()
          .accounts({
            nftPublickey: nftTokenAccount,
            nftEditionPublickey: nftData.edition.address,
            nftMintPublickey: nftData.mint.address,
            tokenMint: BLD_TOKEN_MINT,
            userAta: userAtaPublicKey,
            metadataProgram: METADATA_PROGRAM_ID,
          })
          .instruction();
        transaction.add(instruction);
        await sendAndConfirmTransaction(transaction);
        unstake();
      } catch (error) {
        console.log(error);
      } finally {
        setIsSendingTransaction(false);
      }
    },
    [
      walletAdapter.publicKey,
      nftTokenAccount,
      workspace.stakingProgram,
      nftData,
      unstake,
    ]
  );

  const handleRedeem: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      event.preventDefault();
      if (!walletAdapter.publicKey) {
        alert("Please connect your wallet");
        return;
      } else if (!nftTokenAccount || !workspace.stakingProgram) {
        return;
      }
      setIsSendingTransaction(true);
      console.log("redeem");

      const transaction = new Transaction();

      console.log("Checking if ATA exists ...");
      const userAtaPublicKey = await getAssociatedTokenAddress(
        BLD_TOKEN_MINT,
        walletAdapter.publicKey
      );

      try {
        const instruction = await workspace.stakingProgram.methods
          .redeem()
          .accounts({
            nftPublickey: nftTokenAccount,
            tokenMint: BLD_TOKEN_MINT,
            userAta: userAtaPublicKey,
          })
          .instruction();
        transaction.add(instruction);
        await sendAndConfirmTransaction(transaction);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSendingTransaction(false);
      }
    },
    [walletAdapter.publicKey, nftTokenAccount, workspace.stakingProgram]
  );

  const sendAndConfirmTransaction = useCallback(
    async (transaction: Transaction) => {
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
        {isStaked ? `STAKING` : "READY TO STAKE"}
      </Text>
      <VStack spacing={-1}>
        <Text color="white" as="b" fontSize="4xl">
          {`${totalEarned} $BLD`}
        </Text>
        <Text color="bodyText">
          {isStaked ? "earning $BLD ..." : "earn $BLD by staking"}
        </Text>
      </VStack>
      <Button
        onClick={isStaked ? handleRedeem : handleStake}
        bgColor="buttonGreen"
        width="200px"
        isLoading={isSendingTransaction}
      >
        <Text as="b">{isStaked ? "claim $BLD" : "stake buildoor"}</Text>
      </Button>
      {isStaked ? (
        <Button onClick={handleUnstake} isLoading={isSendingTransaction}>
          unstake
        </Button>
      ) : null}
    </VStack>
  );
};

export default StakeOptionsDisplay;
