import { Button, HStack, Text } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, MouseEventHandler, useCallback, useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import { PROGRAM_ID } from "../utils/constants";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  createInitializeStakeAccountInstruction,
  createStakingInstruction,
} from "../utils/instructions";

interface UnstakedProps {
  onClick: () => void;
  nftData: any;
}

const Unstaked: FC<UnstakedProps> = ({ onClick, nftData }) => {
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
        onClick();
      } catch (error) {
        console.log(error);
      }
    },
    [walletAdapter, connection, nftData, onClick]
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
    <Button bgColor="accent" color="white" maxW="380px" onClick={handleClick}>
      <HStack>
        <Text>stake buildoor</Text>
      </HStack>
    </Button>
  );
};

export default Unstaked;
