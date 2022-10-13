import { Button, Center, Text } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useState } from "react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { BLD_TOKEN_MINT, LOOT_BOX_PROGRAM_ID } from "../utils/constants";
import { useWorkspace } from "./WorkspaceProvider";
import { BN } from "@project-serum/anchor";

export const LootBox = ({
  addGear,
  bgColor,
  price,
  bldBalance,
}: {
  addGear: (newGearMint: PublicKey) => void;
  bgColor?: string;
  price: number;
  bldBalance: number;
}) => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const workspace = useWorkspace();
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [isSendingTransaction, setIsSendingTransaction] =
    useState<boolean>(false);

  const handleLootBoxClick = async () => {
    if (!walletAdapter.publicKey) {
      alert("Please connect your wallet");
      return;
    } else if (!workspace.lootBoxProgram) {
      return;
    }
    console.log("Loot!");
    setIsSendingTransaction(true);
    // get userBldAta
    const userBldAta = await getAssociatedTokenAddress(
      BLD_TOKEN_MINT,
      walletAdapter.publicKey
    );
    console.log(`userBldAta=${userBldAta}`);
    // open loot box
    const openLootBoxInstruction = await workspace.lootBoxProgram.methods
      .openLootBox(new BN(price))
      .accounts({
        bldTokenMint: BLD_TOKEN_MINT,
        userBldAta: userBldAta,
      })
      .instruction();
    const transaction = new Transaction().add(openLootBoxInstruction);

    await sendAndConfirmTransaction(transaction);
    // get lootBoxPda
    const [lootBoxPda] = PublicKey.findProgramAddressSync(
      [walletAdapter.publicKey.toBuffer(), Buffer.from("openv5")],
      LOOT_BOX_PROGRAM_ID
    );
    const lootBox = await workspace.lootBoxProgram.account.lootBox.fetch(
      lootBoxPda
    );
    console.log(`lootBox=${lootBox}`);
    // get gearMint from lootBoxPda
    // get userGearAta
    const userGearAta = await getAssociatedTokenAddress(
      lootBox.gearMint,
      walletAdapter.publicKey
    );
    console.log(`userGearAta=${userGearAta}`);
    // get loot
    const getLootInstruction = await workspace.lootBoxProgram.methods
      .getLoot()
      .accounts({
        userAta: userGearAta,
        tokenMint: lootBox.gearMint,
      })
      .instruction();
    const getLootTransaction = new Transaction().add(getLootInstruction);

    await sendAndConfirmTransaction(getLootTransaction);
    // setGear(gearMint)
    addGear(lootBox.gearMint);
    setIsClaimed(true);
    setIsSendingTransaction(false);
    console.log("Successfully collected gear");
  };

  const sendAndConfirmTransaction = async (transaction: Transaction) => {
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
  };

  const claimed = (
    <Center
      height="120px"
      width="120px"
      bgColor={bgColor || "containerBg"}
      borderRadius="10px"
    >
      Claimed
    </Center>
  );
  const unclaimed = (
    <Button
      height="120px"
      width="120px"
      bgColor="#3cb371"
      borderRadius="10px"
      onClick={handleLootBoxClick}
      isLoading={isSendingTransaction}
    >
      {price} $BLD
    </Button>
  );

  const unavailable = (
    <Center
      height="120px"
      width="120px"
      bgColor={bgColor || "containerBg"}
      borderRadius="10px"
    >
      <Text textAlign="center">Insufficient $BLD. Keep staking!</Text>
    </Center>
  );

  return (
    <div>
      {isClaimed ? claimed : bldBalance >= price ? unclaimed : unavailable}
    </div>
  );
};
